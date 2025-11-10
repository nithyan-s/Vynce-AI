"""
Test script for VynceAI dual-model routing
Tests both Gemini (site-specific) and Llama (general) endpoints
"""

import asyncio
import sys
import os

# Add the server directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.llm_client import llm_client
from app.core.logger import get_logger

logger = get_logger(__name__)

async def test_general_query():
    """Test general query - should use Llama"""
    print("\n" + "="*60)
    print("TEST 1: General Query (should use Llama)")
    print("="*60)
    
    prompt = "Hello! How are you?"
    print(f"Prompt: {prompt}")
    print("Expected: Llama via Groq")
    print("-" * 60)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response: {response}")
    print("="*60)

async def test_site_specific_query():
    """Test site-specific query - should use Gemini"""
    print("\n" + "="*60)
    print("TEST 2: Site-Specific Query (should use Gemini)")
    print("="*60)
    
    prompt = "Summarize this page for me"
    context = {
        "url": "https://example.com",
        "title": "Example Website",
        "page_content": "This is a sample page with some content about web development and AI."
    }
    print(f"Prompt: {prompt}")
    print(f"Context: {context['url']}")
    print("Expected: Gemini")
    print("-" * 60)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response: {response[:200]}...")
    print("="*60)

async def test_greeting():
    """Test greeting - should use Llama"""
    print("\n" + "="*60)
    print("TEST 3: Greeting (should use Llama)")
    print("="*60)
    
    prompt = "Hi there!"
    print(f"Prompt: {prompt}")
    print("Expected: Llama via Groq")
    print("-" * 60)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response: {response}")
    print("="*60)

async def test_page_analysis():
    """Test page analysis - should use Gemini"""
    print("\n" + "="*60)
    print("TEST 4: Page Analysis (should use Gemini)")
    print("="*60)
    
    prompt = "What is this page about?"
    context = {
        "url": "https://github.com/nithyan-s/VynceAI",
        "title": "VynceAI - AI Browser Assistant",
        "page_content": "VynceAI is an intelligent AI-powered browser assistant that helps with web tasks and automation."
    }
    print(f"Prompt: {prompt}")
    print(f"Context: {context['url']}")
    print("Expected: Gemini")
    print("-" * 60)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response: {response[:200]}...")
    print("="*60)

async def test_available_models():
    """Test available models listing"""
    print("\n" + "="*60)
    print("TEST 5: Available Models")
    print("="*60)
    
    models = await llm_client.get_available_models()
    print(f"Found {len(models)} models:")
    for model in models:
        print(f"  - {model['name']} ({model['provider']}) - Type: {model.get('type', 'unknown')}")
    print("="*60)

async def main():
    """Run all tests"""
    print("\n🚀 VynceAI Dual-Model Testing")
    print("Testing intelligent routing between Gemini and Llama")
    
    try:
        # Test general queries (Llama)
        await test_general_query()
        await asyncio.sleep(1)
        
        await test_greeting()
        await asyncio.sleep(1)
        
        # Test site-specific queries (Gemini)
        await test_site_specific_query()
        await asyncio.sleep(1)
        
        await test_page_analysis()
        await asyncio.sleep(1)
        
        # Test model listing
        await test_available_models()
        
        print("\n✅ All tests completed!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
