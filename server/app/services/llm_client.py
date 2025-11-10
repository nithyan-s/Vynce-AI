"""
VynceAI Backend - LLM Client
Dual-model implementation: Gemini (site-specific) + Llama (general)
"""

import asyncio
import aiohttp
from typing import Optional, Dict, Any

from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

# Import Gemini SDK
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("Gemini SDK not installed. Run: pip install google-generativeai")


class LLMClient:
    """
    VynceAI LLM client - Dual-model routing
    - Gemini for site-specific queries (page analysis, summarization, etc.)
    - Llama for general queries (greetings, generic questions, etc.)
    """
    
    def __init__(self):
        """Initialize both Gemini and Llama clients"""
        logger.info(f"Initializing VynceAI Dual-Model LLM Client")
        self._init_gemini()
        self._init_llama()
    
    def _init_gemini(self):
        """Initialize Gemini client"""
        if GEMINI_AVAILABLE and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            logger.info("✓ Gemini client initialized (site-specific queries)")
        else:
            if not GEMINI_AVAILABLE:
                logger.error("✗ Gemini SDK not installed")
            elif not settings.GEMINI_API_KEY:
                logger.error("✗ Gemini API key not configured")
    
    def _init_llama(self):
        """Initialize Llama/Groq client"""
        if settings.LLM_API_KEY and settings.LLM_API_URL:
            logger.info("✓ Llama/Groq client initialized (general queries)")
        else:
            if not settings.LLM_API_KEY:
                logger.warning("✗ Llama API key not configured")
            if not settings.LLM_API_URL:
                logger.warning("✗ Llama API URL not configured")
    
    def _is_site_specific_query(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> bool:
        """
        Determine if query is site-specific or general
        
        Site-specific queries include:
        - Questions about current page
        - Page summarization
        - Content analysis
        - Queries with page context
        
        General queries include:
        - Greetings (hi, hello, etc.)
        - Generic questions
        - General conversation
        - No page context
        
        Args:
            prompt: User's query
            context: Optional page context
            
        Returns:
            True if site-specific, False if general
        """
        prompt_lower = prompt.lower().strip()
        
        # FIRST: Check for general patterns (these override context presence)
        general_patterns = [
            "hello", "hi", "hey", "greetings", "good morning", "good afternoon",
            "how are you", "who are you", "what are you", "what can you do",
            "help me", "can you help", "i need help",
            "what is", "define", "explain",
            "calculate", "solve", "math"
        ]
        
        # Check if it starts with or matches general patterns
        for pattern in general_patterns:
            if prompt_lower.startswith(pattern) or prompt_lower == pattern:
                logger.info(f"💬 General query detected (pattern: '{pattern}')")
                return False
        
        # SECOND: Check if query is very short and conversational (likely general)
        if len(prompt.split()) <= 3:
            logger.info("💬 General query detected (short conversational query)")
            return False
        
        # THIRD: Check for site-specific keywords
        site_keywords = [
            "page", "website", "this site", "current page", "article", "content",
            "summarize", "summary", "analyze", "what does",
            "tell me about this", "what is this", "read this", "extract",
            "on this page", "from the page", "in this article", "this page",
            "the page", "selected text", "highlighted"
        ]
        
        for keyword in site_keywords:
            if keyword in prompt_lower:
                logger.info(f"🎯 Site-specific query detected (keyword: '{keyword}')")
                return True
        
        # FOURTH: Only if query references page content AND context exists
        if context and (context.get("pageContent") or context.get("snippet") or context.get("selectedText")):
            # Query must explicitly reference the page content
            if any(word in prompt_lower for word in ["this", "here", "page", "content", "article"]):
                logger.info("🎯 Site-specific query detected (has context + references page)")
                return True
        
        # Default to general for everything else
        logger.info("💬 Defaulting to general query")
        return False
    
    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate AI response using intelligent model routing
        
        Automatically routes to:
        - Gemini: for site-specific queries
        - Llama: for general queries
        
        Args:
            prompt: User's prompt/question
            model: Optional specific model override
            context: Optional page context
            temperature: Optional temperature override
            max_tokens: Optional max tokens override
            
        Returns:
            Generated text response
        """
        # Determine which model to use
        is_site_specific = self._is_site_specific_query(prompt, context)
        
        if is_site_specific:
            # Use Gemini for site-specific queries
            logger.info("🎯 Routing to Gemini (site-specific)")
            return await self._generate_with_gemini(prompt, model, context, temperature, max_tokens)
        else:
            # Use Llama for general queries
            logger.info("💬 Routing to Llama (general)")
            return await self._generate_with_llama(prompt, model, context, temperature, max_tokens)
    
    async def _generate_with_gemini(
        self,
        prompt: str,
        model: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """Generate response using Gemini"""
        temp = temperature or settings.TEMPERATURE
        tokens = max_tokens or settings.MAX_TOKENS
        
        # Ensure we use a Gemini model (not Llama)
        if model and "llama" in model.lower():
            logger.warning(f"⚠️ Llama model requested for site-specific query, using default Gemini model")
            model = None
        
        # Use default Gemini model if not specified
        if not model:
            model = settings.GEMINI_MODEL
        
        # Build enhanced prompt with context
        enhanced_prompt = self._build_prompt(prompt, context)
        
        try:
            return await self._gemini_generate(enhanced_prompt, model, temp, tokens)
        except Exception as e:
            error_msg = f"Gemini error: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    async def _generate_with_llama(
        self,
        prompt: str,
        model: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """Generate response using Llama via Groq"""
        temp = temperature or 0.7
        tokens = max_tokens or 512
        
        # Ensure we use a Llama model (not Gemini)
        if model and "gemini" in model.lower():
            logger.warning(f"⚠️ Gemini model requested for general query, using default Llama model")
            model = None
        
        # Use default Llama model if not specified
        if not model:
            model = settings.LLAMA_MODEL
        
        # Build system prompt for Llama (general queries)
        system_prompt = """You are VynceAI, a friendly and knowledgeable AI assistant integrated into a Chrome browser extension.

STRICT RULES:
- DO NOT use emojis in responses
- Be friendly but professional
- Provide accurate, helpful information
- Keep responses concise and clear
- Do not hallucinate or make up information

ABOUT VYNCEAI:
VynceAI is a Chrome browser extension that provides:
- AI-powered web page analysis
- Intelligent chat assistance while browsing
- Context-aware responses based on page content
- Dual AI system (Gemini for page analysis, Llama for general chat)

YOUR ROLE:
- Answer general questions conversationally
- Help with product-related queries about VynceAI
- Assist developers with technical questions
- Provide friendly, accurate responses
- Redirect site-specific questions to page content

When users ask about you, identify as VynceAI, a Chrome extension assistant."""
        
        try:
            return await self._llama_generate(prompt, system_prompt, model, temp, tokens)
        except Exception as e:
            error_msg = f"Llama error: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    def _build_prompt(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Build enhanced prompt for Gemini with strict site-specific focus"""
        if not context:
            return prompt
        
        context_parts = []
        
        # Add strict system instructions for Gemini (site-specific)
        context_parts.append("""You are VynceAI, a precise AI assistant specialized in analyzing web pages.

STRICT RULES - CRITICAL:
- ONLY analyze and respond based on the provided page content below
- DO NOT answer general questions, greetings, math problems, or non-page-related queries
- DO NOT provide external information or general knowledge
- DO NOT use emojis in responses
- Be precise, clear, and factual
- Focus strictly on the page content provided

IMPORTANT - DETECT NON-PAGE QUERIES:
If the user's question is:
- A greeting (hi, hello, hey, how are you)
- Math (what is 2+2, calculate, solve)
- General knowledge (who is, what is [not in page], define)
- Personal questions (how are you, who are you)
- Any topic NOT in the page content below

YOU MUST respond EXACTLY with this message:
"I specialize in analyzing page content. Please switch to General Mode for general questions and conversations."

DO NOT try to answer these questions. ONLY redirect to General Mode.

ONLY answer if the question is directly about the page content below.""")
        
        # Add page context
        if context.get("url"):
            context_parts.append(f"\n--- PAGE TO ANALYZE ---")
            context_parts.append(f"URL: {context['url']}")
        if context.get("title"):
            context_parts.append(f"Title: {context['title']}")
        if context.get("selected_text"):
            context_parts.append(f"\nSelected Text: {context['selected_text']}")
        if context.get("page_content"):
            content = context['page_content'][:2000]
            context_parts.append(f"\nPage Content:\n{content}")
            context_parts.append("\n--- END OF PAGE ---")
        
        # Add user question
        context_parts.append(f"\nUser Question: {prompt}")
        context_parts.append("\nYour Response (remember to redirect if not about the page):")
        
        return "\n".join(context_parts)
    
    async def _gemini_generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Generate response using Google Gemini API"""
        if not GEMINI_AVAILABLE:
            return "Error: Gemini SDK not installed. Run: pip install google-generativeai"
        if not settings.GEMINI_API_KEY:
            return "Error: Gemini API key not configured"
        
        try:
            model_name = model or settings.GEMINI_MODEL
            # Remove 'models/' prefix if present
            if model_name.startswith('models/'):
                model_name = model_name.replace('models/', '')
            
            logger.info(f"Calling Gemini API with model: {model_name}")
            
            gemini_model = genai.GenerativeModel(model_name)
            response = await asyncio.to_thread(
                gemini_model.generate_content,
                prompt
            )
            
            result = response.text.strip()
            logger.info(f"Gemini response received: {len(result)} characters")
            return result
        
        except Exception as e:
            error_msg = f"Gemini API error: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    async def _llama_generate(
        self,
        prompt: str,
        system_prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 512
    ) -> str:
        """Generate response using Llama via Groq API"""
        if not settings.LLM_API_KEY:
            return "Error: Llama API key not configured"
        if not settings.LLM_API_URL:
            return "Error: Llama API URL not configured"
        
        try:
            model_name = model or settings.LLAMA_MODEL
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.LLM_API_KEY}"
            }
            
            data = {
                "model": model_name,
                "messages": [
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": 0.95,
                "frequency_penalty": 0.0,
                "presence_penalty": 0.0,
            }
            
            logger.info(f"Calling Llama API via Groq: {model_name}")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(settings.LLM_API_URL, headers=headers, json=data) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        error_msg = f"Llama API error {response.status}: {error_text}"
                        logger.error(error_msg)
                        return error_msg
                    
                    result = await response.json()
                    
                    # Extract response from Groq/OpenAI format
                    if "choices" in result and len(result["choices"]) > 0:
                        content = result["choices"][0]["message"]["content"]
                        logger.info(f"Llama response received: {len(content)} characters")
                        return content.strip()
                    else:
                        error_msg = "Llama API returned unexpected format"
                        logger.error(error_msg)
                        return error_msg
        
        except Exception as e:
            error_msg = f"Llama API error: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    async def get_available_models(self) -> list:
        """Get list of available models"""
        models = []
        
        if settings.GEMINI_API_KEY:
            models.extend([
                {"id": "gemini-2.5-flash", "name": "Gemini 2.5 Flash", "provider": "gemini", "type": "site-specific"},
                {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "provider": "gemini", "type": "site-specific"},
            ])
        
        if settings.LLM_API_KEY:
            models.extend([
                {"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B", "provider": "groq", "type": "general"},
            ])
        
        return models


# Singleton instance
llm_client = LLMClient()
