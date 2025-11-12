"""
VynceAI Backend - Main FastAPI Application
Backend for the VynceAI Chrome Extension - Local AI Web Assistant
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import routes_ai, routes_utils, routes_command
from app.core.config import settings
from app.core.logger import get_logger

# Initialize logger
logger = get_logger(__name__)

# Create FastAPI application
app = FastAPI(
    title="VynceAI Backend",
    description="Backend for the VynceAI Chrome Extension - Local AI Web Assistant",
    version="1.0.0"
)

# CORS setup for extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Allow all during development
        "chrome-extension://*",  # Allow Chrome extensions
        "http://localhost:*",  # Allow localhost
        "http://127.0.0.1:*",  # Allow 127.0.0.1
        "https://vynceai.onrender.com"  # Production backend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes_ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(routes_utils.router, prefix="/api/v1/utils", tags=["Utils"])
app.include_router(routes_command.router, prefix="/api/v1/command", tags=["Command"])

@app.on_event("startup")
async def startup_event():
    """Application startup handler"""
    logger.info("=" * 70)
    logger.info("🚀 VynceAI Backend Starting...")
    logger.info(f"📦 Version: {settings.APP_VERSION}")
    logger.info("=" * 70)
    
    # Validate API keys
    api_keys = settings.validate_api_keys()
    logger.info("🔑 API Keys Configuration:")
    logger.info(f"  Gemini (site-specific): {'✓ Configured' if api_keys['gemini'] else '✗ Not configured'}")
    logger.info(f"  Groq/Llama (general): {'✓ Configured' if api_keys['groq'] else '✗ Not configured'}")
    
    # Check if at least one API key is configured
    if not any(api_keys.values()):
        logger.warning("⚠️  WARNING: No API keys configured!")
        logger.warning("   Please configure API keys in .env file")
    
    # List available models
    models = settings.get_available_models()
    logger.info(f"\n🤖 Available AI Models: {len(models)}")
    for model in models:
        logger.info(f"  • {model['name']} ({model['id']}) - {model['provider']}")
    
    # Show provider mode
    logger.info(f"\n🔀 LLM Provider Mode: {settings.LLM_PROVIDER}")
    if settings.LLM_PROVIDER == "dual":
        logger.info("   Intelligent routing between Gemini (site) and Llama (general)")
    
    logger.info("\n" + "=" * 70)
    logger.info("✅ Server ready!")
    logger.info(f"📖 API Documentation: http://127.0.0.1:{settings.PORT}/docs")
    logger.info(f"🏥 Health Check: http://127.0.0.1:{settings.PORT}/api/v1/utils/health")
    logger.info("=" * 70)

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown handler"""
    logger.info("=" * 70)
    logger.info("🛑 VynceAI Backend Shutting Down...")
    logger.info("=" * 70)

@app.get("/")
def home():
    """Root endpoint - Welcome message"""
    return {
        "message": "Welcome to VynceAI Backend 🚀",
        "status": "running",
        "version": settings.APP_VERSION,
        "endpoints": {
            "docs": "/docs",
            "health": "/api/v1/utils/health",
            "status": "/api/v1/utils/status",
            "ai_chat": "/api/v1/ai/chat",
            "commands": "/api/v1/command/commands"
        }
    }

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
