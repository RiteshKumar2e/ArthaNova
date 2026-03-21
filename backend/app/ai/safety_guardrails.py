"""
Rate Limiting, Input Validation, and Prompt Injection Prevention
Implements: Enterprise Readiness, Input Safety, Resource Management
"""

import asyncio
from typing import Dict, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, field
import logging
import re

logger = logging.getLogger(__name__)


@dataclass
class RateLimitConfig:
    """Rate limit configuration per user"""
    requests_per_minute: int = 30
    requests_per_hour: int = 500
    tokens_per_month: int = 1_000_000


@dataclass
class UserRateLimitState:
    """Track rate limit state for a user"""
    user_id: int
    minute_window_start: datetime = field(default_factory=datetime.utcnow)
    hour_window_start: datetime = field(default_factory=datetime.utcnow)
    requests_this_minute: int = 0
    requests_this_hour: int = 0
    tokens_this_month: int = 0
    month_start: datetime = field(default_factory=datetime.utcnow)


class RateLimiter:
    """Token bucket rate limiter for API protection"""
    
    def __init__(self, config: Optional[RateLimitConfig] = None):
        self.config = config or RateLimitConfig()
        self.user_states: Dict[int, UserRateLimitState] = {}
        self.logger = logger.getChild("RateLimiter")
    
    async def check_rate_limit(self, user_id: int) -> tuple[bool, Optional[str]]:
        """Check if user can make a request"""
        now = datetime.utcnow()
        
        # Get or create state
        if user_id not in self.user_states:
            self.user_states[user_id] = UserRateLimitState(user_id=user_id)
        
        state = self.user_states[user_id]
        
        # Reset windows if needed
        if (now - state.minute_window_start).total_seconds() >= 60:
            state.requests_this_minute = 0
            state.minute_window_start = now
        
        if (now - state.hour_window_start).total_seconds() >= 3600:
            state.requests_this_hour = 0
            state.hour_window_start = now
        
        if (now - state.month_start).days >= 30:
            state.tokens_this_month = 0
            state.month_start = now
        
        # Check limits
        if state.requests_this_minute >= self.config.requests_per_minute:
            error_msg = f"Rate limit exceeded: {self.config.requests_per_minute} requests per minute"
            self.logger.warning(f"Rate limit (minute) exceeded for user {user_id}")
            return False, error_msg
        
        if state.requests_this_hour >= self.config.requests_per_hour:
            error_msg = f"Rate limit exceeded: {self.config.requests_per_hour} requests per hour"
            self.logger.warning(f"Rate limit (hour) exceeded for user {user_id}")
            return False, error_msg
        
        # All checks passed
        state.requests_this_minute += 1
        state.requests_this_hour += 1
        
        return True, None
    
    async def check_token_quota(self, user_id: int, tokens: int) -> tuple[bool, Optional[str]]:
        """Check if user has monthly token quota available"""
        if user_id not in self.user_states:
            self.user_states[user_id] = UserRateLimitState(user_id=user_id)
        
        state = self.user_states[user_id]
        
        if state.tokens_this_month + tokens > self.config.tokens_per_month:
            remaining = self.config.tokens_per_month - state.tokens_this_month
            error_msg = f"Monthly token quota exceeded. Remaining: {remaining} tokens"
            self.logger.warning(f"Token quota exceeded for user {user_id}")
            return False, error_msg
        
        state.tokens_this_month += tokens
        return True, None
    
    async def record_token_usage(self, user_id: int, tokens: int) -> None:
        """Record token usage for quota tracking"""
        # Actually record is done in check_token_quota
        pass


class InputValidator:
    """Validate and sanitize user input"""
    
    # Patterns for prompt injection detection
    INJECTION_PATTERNS = [
        r"(?i)(ignore|disregard|override|bypass).*instruction",
        r"(?i)(execute|run|eval).*code",
        r"(?i)sql.*injection",
        r"(?i)script.*injection",
        r"(?i)jailbreak",
        r"{{\s*.*?\s*}}",  # Template injection
        r"<script[^>]*>.*?</script>",  # Script tags
    ]
    
    # Max input lengths
    MAX_QUERY_LENGTH = 2000
    MAX_SESSION_TITLE_LENGTH = 100
    
    # Dangerous keywords
    DANGEROUS_KEYWORDS = [
        "drop table", "delete from", "truncate", "alter table",
        "exec", "execute", "system", "os.system",
        "eval", "exec", "__import__",
    ]
    
    def __init__(self):
        self.logger = logger.getChild("InputValidator")
        self.compiled_patterns = [re.compile(p, re.IGNORECASE) for p in self.INJECTION_PATTERNS]
    
    def validate_query(self, user_input: str) -> tuple[bool, Optional[str], str]:
        """Validate user query for safety"""
        if not user_input or not isinstance(user_input, str):
            return False, "Invalid input", ""
        
        # Check length
        if len(user_input) > self.MAX_QUERY_LENGTH:
            error = f"Query exceeds maximum length of {self.MAX_QUERY_LENGTH} characters"
            self.logger.warning(f"Query length validation failed: {len(user_input)}")
            return False, error, ""
        
        # Check for injection patterns
        for pattern in self.compiled_patterns:
            if pattern.search(user_input):
                error = "Input contains potentially malicious patterns"
                self.logger.warning(f"Injection pattern detected: {user_input[:100]}")
                return False, error, ""
        
        # Check for dangerous keywords
        user_lower = user_input.lower()
        for keyword in self.DANGEROUS_KEYWORDS:
            if keyword in user_lower:
                error = f"Input contains forbidden keyword: {keyword}"
                self.logger.warning(f"Dangerous keyword detected: {keyword}")
                return False, error, ""
        
        # Sanitize input
        sanitized = self._sanitize(user_input)
        
        return True, None, sanitized
    
    def validate_symbol(self, symbol: str) -> tuple[bool, Optional[str]]:
        """Validate stock symbol"""
        if not symbol or not isinstance(symbol, str):
            return False, "Invalid symbol"
        
        # Check format (alphanumeric, 1-10 chars)
        if not re.match(r"^[A-Z0-9]{1,10}$", symbol.upper()):
            error = "Symbol must be 1-10 alphanumeric characters"
            self.logger.warning(f"Symbol validation failed: {symbol}")
            return False, error
        
        return True, None
    
    def validate_session_title(self, title: str) -> tuple[bool, Optional[str]]:
        """Validate chat session title"""
        if not title or not isinstance(title, str):
            return False, "Invalid title"
        
        if len(title) > self.MAX_SESSION_TITLE_LENGTH:
            error = f"Title exceeds {self.MAX_SESSION_TITLE_LENGTH} characters"
            return False, error
        
        return True, None
    
    def _sanitize(self, user_input: str) -> str:
        """Remove potentially harmful content"""
        # Remove control characters
        sanitized = "".join(ch for ch in user_input if ord(ch) >= 32 or ch in "\n\t")
        
        # Trim whitespace
        sanitized = sanitized.strip()
        
        return sanitized


class OutputGuardrails:
    """Validate and filter LLM outputs for safety"""
    
    # Patterns for potentially harmful outputs
    HARMFUL_PATTERNS = [
        r"(?i)(buy now|invest all|guaranteed|sure profit)",  # Overconfident claims
        r"(?i)(inside information|confidential|not public)",  # Compliance issues
        r"(?i)(medical|legal|tax).*advice",  # Unauthorized advice
    ]
    
    # Disclaimer required for financial advice
    DISCLAIMER = "\n\n⚠️ **Disclaimer**: This analysis is for informational purposes only and does not constitute investment advice. Always verify information independently and consult a financial advisor before making investment decisions."
    
    def __init__(self):
        self.logger = logger.getChild("OutputGuardrails")
        self.compiled_patterns = [re.compile(p, re.IGNORECASE) for p in self.HARMFUL_PATTERNS]
    
    def validate_response(self, response: str) -> tuple[bool, str]:
        """Check LLM response for harmful content"""
        if not response:
            return False, "Empty response"
        
        # Add disclaimer
        response_with_disclaimer = f"{response}{self.DISCLAIMER}"
        
        # Check for harmful patterns
        for pattern in self.compiled_patterns:
            if pattern.search(response):
                self.logger.warning(f"Potentially harmful output detected in response")
                # Still allow but note the concern
        
        return True, response_with_disclaimer
    
    def filter_financial_advice(self, response: str) -> str:
        """Add compliance warnings to financial recommendations"""
        if any(keyword in response.lower() for keyword in ["buy", "sell", "invest", "portfolio"]):
            return response + self.DISCLAIMER
        
        return response


# Global instances
rate_limiter = RateLimiter()
input_validator = InputValidator()
output_guardrails = OutputGuardrails()
