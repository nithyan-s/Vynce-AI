"""
VynceAI Backend - Configuration
Centralized configuration management using environment variables
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    
    All settings can be configured via .env file or environment variables
    """
    
    # ============================================================================
    # Application Settings
    # ============================================================================
    APP_NAME: str = "VynceAI Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # ============================================================================
    # Server Settings
    # ============================================================================
    HOST: str = "0.0.0.0"  # Listen on all interfaces for production
    PORT: int = 8000
    
    # ============================================================================
    # CORS Settings
    # ============================================================================
    CORS_ORIGINS: List[str] = [
        "*",
        "chrome-extension://*",
        "http://localhost:*",
        "http://127.0.0.1:*",
        "https://vynceai.onrender.com"
    ]
    
    # ============================================================================
    # LLM Provider Settings
    # ============================================================================
    LLM_PROVIDER: str = "dual"  # dual = Gemini + Llama intelligent routing
    
    # ============================================================================
    # Gemini Settings (for site-specific queries)
    # ============================================================================
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # ============================================================================
    # Groq/Llama Settings (for general queries)
    # ============================================================================
    LLM_API_KEY: Optional[str] = os.getenv("LLM_API_KEY")
    LLM_API_URL: str = os.getenv("LLM_API_URL", "https://api.groq.com/openai/v1/chat/completions")
    LLAMA_MODEL: str = "llama-3.3-70b-versatile"
    
    # ============================================================================
    # AI Generation Settings
    # ============================================================================
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.7
    
    class Config:
        """Pydantic configuration"""
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env file

    def validate_api_keys(self) -> dict:
        """
        Check which API keys are configured
        
        Returns:
            Dictionary with API key status for each provider
        """
        return {
            "gemini": bool(self.GEMINI_API_KEY),
            "groq": bool(self.LLM_API_KEY)
        }
    
    def get_available_models(self) -> list:
        """
        Get list of available AI models based on configured API keys
        
        Returns:
            List of model dictionaries with id, name, provider, and type
        """
        models = []
        
        # Add Gemini models if API key is configured
        if self.GEMINI_API_KEY:
            models.extend([
                {
                    "id": "gemini-2.5-flash",
                    "name": "Gemini 2.5 Flash",
                    "provider": "gemini",
                    "type": "site-specific",
                    "description": "Fast model for page analysis and summarization"
                },
                {
                    "id": "gemini-1.5-flash",
                    "name": "Gemini 1.5 Flash",
                    "provider": "gemini",
                    "type": "site-specific",
                    "description": "Previous generation model, still very capable"
                },
            ])
        
        # Add Groq/Llama models if API key is configured
        if self.LLM_API_KEY:
            models.extend([
                {
                    "id": "llama-3.3-70b-versatile",
                    "name": "Llama 3.3 70B",
                    "provider": "groq",
                    "type": "general",
                    "description": "Versatile model for general conversations"
                },
            ])
        
        return models

# Global settings instance
settings = Settings()
