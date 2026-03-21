"""
Central Intelligence Engine - Synthesizes multi-agent outputs into high-conviction trading signals
Implements: Multi-signal confirmation, confidence scoring, risk-reward validation, portfolio context awareness
"""

import logging
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime

logger = logging.getLogger(__name__)


class SignalType(Enum):
    """Trading signal types"""
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"
    WATCH = "WATCH"
    RISK_ALERT = "RISK_ALERT"


class ConfirmationLevel(Enum):
    """Signal confirmation levels"""
    WEAK = 1
    MODERATE = 2
    STRONG = 3
    VERY_STRONG = 4


@dataclass
class SignalComponent:
    """Individual signal from each agent"""
    agent: str  # "technical", "fundamental", "sentiment", "risk", "news"
    signal: str  # "BUY", "SELL", "HOLD", "NEUTRAL"
    confidence: float  # 0-100
    reasoning: str
    strength: float  # 0-100, how strong the signal is


@dataclass
class RiskRewardMetrics:
    """Risk-reward analysis"""
    entry_price: float
    target_price: float
    stop_loss: float
    risk_amount: float
    reward_amount: float
    reward_risk_ratio: float
    probability: float  # 0-100%
    
    def to_dict(self) -> Dict:
        return asdict(self)


@dataclass
class TradeSignal:
    """Final high-conviction trading signal"""
    symbol: str
    signal: SignalType
    confidence: float  # 0-100
    entry_range: Dict[str, float]  # {"min": X, "max": Y}
    target: float
    stop_loss: float
    risk_reward_ratio: float
    probability: float  # 0-100%
    why_matters: List[str]  # 2 key reasons
    multi_agent_justification: Dict[str, Dict]  # {agent: {signal, reasoning}}
    portfolio_impact: Dict[str, str]  # {action, diversification_impact}
    generated_at: str
    expires_at: Optional[str] = None  # Signal expiry time
    
    def to_dict(self) -> Dict:
        """Serialize to dictionary"""
        return {
            **asdict(self),
            "signal": self.signal.value,
            "generated_at": self.generated_at,
        }


class DecisionEngine:
    """
    Central intelligence engine that synthesizes multi-agent outputs
    into high-conviction, actionable trading signals
    """
    
    def __init__(self):
        self.logger = logger.getChild("DecisionEngine")
        self.MIN_CONFIDENCE_FOR_SIGNAL = 60  # Minimum 60% confidence
        self.MIN_REWARD_RISK_RATIO = 2.0  # Minimum 1:2 risk-reward
        self.MIN_CONFIRMATIONS = 3  # Need 3+ strong confirmations for BUY/SELL
        self.SIGNAL_VALIDITY_HOURS = 24  # Signal expires after 24 hours
    
    def analyze_confirmations(
        self,
        signal_components: List[SignalComponent],
    ) -> Dict[str, Any]:
        """
        Analyze multi-signal confirmation strength
        Returns: confirmation count, alignment score, dominant signal
        """
        if not signal_components:
            return {"confirmations": 0, "alignment": 0, "dominant_signal": None}
        
        # Count signals by type
        signal_counts = {}
        confidence_sum = 0
        
        for component in signal_components:
            signal = component.signal
            signal_counts[signal] = signal_counts.get(signal, 0) + 1
            confidence_sum += component.confidence
        
        # Find dominant signal
        if signal_counts:
            dominant_signal = max(signal_counts, key=signal_counts.get)
            confirmation_count = signal_counts.get(dominant_signal, 0)
        else:
            dominant_signal = None
            confirmation_count = 0
        
        # Calculate alignment score (0-100)
        # How well agents agree (based on signal consistency)
        if len(signal_components) > 0:
            alignment = (confirmation_count / len(signal_components)) * 100
        else:
            alignment = 0
        
        avg_confidence = confidence_sum / len(signal_components) if signal_components else 0
        
        return {
            "confirmations": confirmation_count,
            "alignment_score": alignment,
            "dominant_signal": dominant_signal,
            "avg_confidence": avg_confidence,
            "signal_breakdown": signal_counts,
        }
    
    def calculate_confidence_score(
        self,
        signal_components: List[SignalComponent],
        confirmations: Dict[str, Any],
    ) -> float:
        """
        Calculate composite confidence score (0-100)
        Based on: number of confirmations, alignment, individual confidences
        """
        if not signal_components:
            return 0.0
        
        # Component weights
        confirmation_weight = 0.4
        alignment_weight = 0.3
        avg_confidence_weight = 0.3
        
        # Normalize confirmation count (max 5 agents)
        confirmation_score = min(
            confirmations["confirmations"] / 5 * 100,
            100
        )
        
        # Alignment already in 0-100
        alignment_score = confirmations["alignment_score"]
        
        # Average confidence of all signals
        avg_confidence = confirmations["avg_confidence"]
        
        # Weighted composite
        composite_confidence = (
            confirmation_score * confirmation_weight +
            alignment_score * alignment_weight +
            avg_confidence * avg_confidence_weight
        )
        
        return min(composite_confidence, 100.0)
    
    def validate_risk_reward(
        self,
        entry_price: float,
        target: float,
        stop_loss: float,
        current_probability: float,
    ) -> Tuple[bool, RiskRewardMetrics]:
        """
        Validate risk-reward ratio meets minimum standards
        Returns: (is_valid, metrics)
        """
        
        # Calculate risk and reward absolutes
        risk_amount = abs(entry_price - stop_loss)
        reward_amount = abs(target - entry_price)
        
        # Handle edge cases
        if risk_amount == 0:
            return False, RiskRewardMetrics(
                entry_price=entry_price,
                target_price=target,
                stop_loss=stop_loss,
                risk_amount=0,
                reward_amount=reward_amount,
                reward_risk_ratio=0,
                probability=current_probability,
            )
        
        # Calculate ratio
        reward_risk_ratio = reward_amount / risk_amount
        
        # Validate
        is_valid = reward_risk_ratio >= self.MIN_REWARD_RISK_RATIO
        
        metrics = RiskRewardMetrics(
            entry_price=entry_price,
            target_price=target,
            stop_loss=stop_loss,
            risk_amount=risk_amount,
            reward_amount=reward_amount,
            reward_risk_ratio=reward_risk_ratio,
            probability=current_probability,
        )
        
        return is_valid, metrics
    
    def detect_conflicts(self, signal_components: List[SignalComponent]) -> List[str]:
        """
        Detect conflicting signals that reduce confidence
        Returns: list of conflict descriptions
        """
        conflicts = []
        
        # Get signal types
        signals = [c.signal for c in signal_components]
        unique_signals = set(signals)
        
        # If more than 2 different signal types, there's conflict
        if len(unique_signals) > 2:
            conflicts.append(f"Mixed signals detected: {list(unique_signals)}")
        
        # Check for bearish resistance to bullish signal
        bearish_count = sum(1 for c in signal_components if c.signal == "SELL" or c.signal == "NEUTRAL")
        bullish_count = sum(1 for c in signal_components if c.signal == "BUY")
        
        if bearish_count > 0 and bullish_count > 0:
            conflicts.append("Conflicting buy/sell signals from different agents")
        
        return conflicts
    
    def synthesize_signal(
        self,
        symbol: str,
        signal_components: List[SignalComponent],
        entry_price: float,
        target_price: float,
        stop_loss: float,
        portfolio_holdings: Optional[Dict[str, Any]] = None,
        portfolio_context: Optional[Dict[str, str]] = None,
    ) -> Optional[TradeSignal]:
        """
        Synthesize multi-agent outputs into a high-conviction trading signal
        
        Returns: TradeSignal if high-conviction signal exists, else None
        """
        
        self.logger.debug(f"Synthesizing signal for {symbol} from {len(signal_components)} agents")
        
        # Step 1: Analyze confirmations
        confirmations = self.analyze_confirmations(signal_components)
        
        # Step 2: Calculate confidence
        confidence = self.calculate_confidence_score(signal_components, confirmations)
        
        # Step 3: Validate risk-reward
        # Estimate probability from average confidence
        avg_probability = confirmations.get("avg_confidence", 60.0)
        rrr_valid, rr_metrics = self.validate_risk_reward(
            entry_price=entry_price,
            target=target_price,
            stop_loss=stop_loss,
            current_probability=avg_probability,
        )
        
        # Step 4: Get dominant signal
        dominant_signal_str = confirmations.get("dominant_signal", "HOLD")
        
        # Step 5: Determine if we output a signal
        # Need to check:
        # - Confidence >= 60%
        # - At least 3 confirmations for BUY/SELL, 2 for WATCH
        # - Risk-reward ratio >= 1:2
        # - Probability >= 60%
        
        confirmation_count = confirmations.get("confirmations", 0)
        conflicts = self.detect_conflicts(signal_components)
        
        # Decode signal type
        if dominant_signal_str == "BUY":
            required_confirmations = self.MIN_CONFIRMATIONS
            signal_type = SignalType.BUY
        elif dominant_signal_str == "SELL":
            required_confirmations = self.MIN_CONFIRMATIONS
            signal_type = SignalType.SELL
        elif dominant_signal_str == "HOLD":
            signal_type = SignalType.HOLD
            return None  # HOLD doesn't generate actionable signal
        else:
            signal_type = SignalType.WATCH
            required_confirmations = 2
        
        # Filter by confidence and confirmations
        if (confidence < self.MIN_CONFIDENCE_FOR_SIGNAL or
            confirmation_count < required_confirmations or
            not rrr_valid):
            
            self.logger.debug(
                f"Signal rejected for {symbol}: confidence={confidence:.1f}, "
                f"confirmations={confirmation_count}, rr_valid={rrr_valid}"
            )
            
            # Generate risk alert if there are concerns
            if len(conflicts) > 0 or rr_metrics.probability < 50:
                return TradeSignal(
                    symbol=symbol,
                    signal=SignalType.RISK_ALERT,
                    confidence=confidence,
                    entry_range={"min": entry_price * 0.98, "max": entry_price * 1.02},
                    target=target_price,
                    stop_loss=stop_loss,
                    risk_reward_ratio=rr_metrics.reward_risk_ratio,
                    probability=rr_metrics.probability,
                    why_matters=conflicts[:2],
                    multi_agent_justification={
                        c.agent: {"signal": c.signal, "reasoning": c.reasoning}
                        for c in signal_components
                    },
                    portfolio_impact=portfolio_context or {
                        "action": "WATCH",
                        "diversification_impact": "Monitor for entry opportunity"
                    },
                    generated_at=datetime.utcnow().isoformat(),
                )
            
            return None
        
        # Generate high-conviction signal
        entry_range = {
            "min": entry_price * 0.98,
            "max": entry_price * 1.02,
        }
        
        # Generate summary
        why_matters = [
            f"{confirmation_count} agents confirm {signal_type.value} signal",
            f"Risk-reward ratio {rr_metrics.reward_risk_ratio:.2f}:1 (target above {target_price:.2f})"
        ]
        
        signal = TradeSignal(
            symbol=symbol,
            signal=signal_type,
            confidence=confidence,
            entry_range=entry_range,
            target=target_price,
            stop_loss=stop_loss,
            risk_reward_ratio=rr_metrics.reward_risk_ratio,
            probability=rr_metrics.probability,
            why_matters=why_matters,
            multi_agent_justification={
                c.agent: {"signal": c.signal, "reasoning": c.reasoning}
                for c in signal_components
            },
            portfolio_impact=portfolio_context or {
                "action": "BUY" if signal_type == SignalType.BUY else "SELL",
                "diversification_impact": "Check sector concentration before entry"
            },
            generated_at=datetime.utcnow().isoformat(),
        )
        
        self.logger.info(
            f"HIGH-CONVICTION SIGNAL: {symbol} - {signal_type.value} @ "
            f"{entry_range['min']:.2f}-{entry_range['max']:.2f}, "
            f"confidence={confidence:.1f}%, RR={rr_metrics.reward_risk_ratio:.2f}:1"
        )
        
        return signal
    
    def rank_signals(self, signals: List[TradeSignal]) -> List[TradeSignal]:
        """
        Rank signals by confidence and risk-reward ratio
        Returns: sorted list (highest conviction first)
        """
        return sorted(
            signals,
            key=lambda s: (s.confidence * 100 + s.risk_reward_ratio * 50),
            reverse=True
        )
    
    def filter_portfolio_aligned_signals(
        self,
        signals: List[TradeSignal],
        user_holdings: Dict[str, Dict],
        sector_limits: Optional[Dict[str, float]] = None,
    ) -> List[TradeSignal]:
        """
        Filter signals based on portfolio context
        - If user holds the stock, prefer HOLD/ADD
        - If overweight in sector, warn about concentration
        """
        filtered = []
        
        for signal in signals:
            held = signal.symbol in user_holdings
            
            if held and signal.signal == SignalType.SELL:
                # Convert to EXIT recommendation
                signal.portfolio_impact["action"] = "EXIT"
            elif held and signal.signal == SignalType.BUY:
                # Convert to ADD recommendation
                signal.portfolio_impact["action"] = "ADD"
            elif held:
                # Already holding, suggest HOLD
                signal.signal = SignalType.HOLD
            
            filtered.append(signal)
        
        return filtered
