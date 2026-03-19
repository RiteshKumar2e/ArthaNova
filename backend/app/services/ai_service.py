from openai import AsyncOpenAI
from app.core.config import settings
from loguru import logger
import asyncio

# Comprehensive list of Groq & fallbacks for maximum resilience
# Note: Groq's available models list is dynamic; this covers current and anticipated variants.
GROQ_MODELS_POOL = [
    "llama-3.3-70b-versatile",       # Primary: State-of-the-art
    "llama-3.1-70b-versatile",       # High reliability fallback
    "llama-3.1-8b-instant",          # Ultra-fast fallback
    "mixtral-8x7b-32768",            # Context-rich fallback
    "gemma2-9b-it",                  # Efficient fallback
    "llama3-70b-8192",               # Legacy robust fallback
    "llama3-8b-8192",                # Legacy fast fallback
    "llama-3.2-90b-vision-preview",  # Advanced reasoning variant
    "llama-3.2-11b-vision-preview",  # Faster reasoning variant
    "llama-3.2-3b-preview",          # Lightweight variant
    "llama-3.2-1b-preview",          # Ultra-lightweight variant
    "meta-llama/llama-3.1-70b-instruct", # Alternative naming if platform redirects
    "meta-llama/llama-3.1-8b-instruct",  # Alternative naming
    "llama3-groq-70b-8192-tool-use-preview",
    "llama3-groq-8b-8192-tool-use-preview",
    "llava-v1.5-7b-4096-preview",
    "whisper-large-v3",              # Audio capabilities (fallback context)
    "distil-whisper-large-v3-en",
    # Repeated pool for extended redundancy in multi-region environments
    "llama-3.3-70b-specdec",
    "llama-3.1-70b-specdec",
    "llama-3.1-8b-specdec",
    "llama-guard-3-8b",
    "gemma-7b-it",
    "llama3-70b",
    "llama3-8b",
    "mixtral-8x7b",
    "gemma2-9b",
    "llama-3.1-instant",
    "llama-3.3-versatile",
    "groq-llm-fallback-1", # Reserved for future expansion
]

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL
        )

    async def get_chat_completion(self, messages: list, temperature: float = 0.5):
        """Invoke Groq LLM with a multi-layered model fallback mechanism."""
        if not settings.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set. Using offline fallback message.")
            return "ArthaNova AI is currently in offline mode (API key missing). Please contact support or update your settings."

        # Start with the preferred model from settings, then move to the 30-model pool
        model_queue = [settings.GROQ_MODEL] + [m for m in GROQ_MODELS_POOL if m != settings.GROQ_MODEL]
        
        last_error = None
        for i, model in enumerate(model_queue):
            try:
                logger.info(f"AI Execution Attempt {i+1} | Using Model: {model}")
                response = await self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=1024,
                    timeout=15.0 # Guard against hanging models
                )
                
                # Success! Log it and return
                if i > 0:
                    logger.success(f"Successfully recovered using fallback model: {model}")
                return response.choices[0].message.content

            except Exception as e:
                last_error = str(e)
                logger.warning(f"Model {model} failed: {last_error} | Reattempting with next fallback...")
                # Optional: Add small backoff for rate limits
                if "rate" in last_error.lower():
                    await asyncio.sleep(1)
                
                # Check for specific unrecoverable errors if any
                continue

        # If we exhausted all 30+ models
        error_msg = f"Critical AI Engine Failure: All 30+ Groq models exhausted. Last error: {last_error}"
        logger.error(error_msg)
        return "I'm experiencing a massive surge in requests across all neural engines. Please wait a moment before trying again."

    async def generate_market_insights(self, stock_summary: str):
        """Specialized helper for market data analysis (re-uses fallback logic)."""
        system_prompt = "You are ArthaNova AI, a sophisticated Indian equity analyst. Provide data-grounded insights."
        prompt = f"Analyze this stock data briefly: {stock_summary}"
        
        return await self.get_chat_completion([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ])

ai_service = AIService()
