"""
Test script for mode separation behavior
Tests that Gemini redirects general questions to General Mode
"""

import asyncio
import sys
import os

# Add the server directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.llm_client import llm_client
from app.core.logger import get_logger

logger = get_logger(__name__)

print("\n" + "="*70)
print("🧪 VynceAI Mode Separation Testing")
print("Testing that Site-Specific Mode redirects general questions")
print("="*70)

async def test_site_mode_with_page_query():
    """Test Site-Specific Mode with page-related query (should work)"""
    print("\n" + "="*70)
    print("TEST 1: Site-Specific Mode - Page Query (SHOULD WORK)")
    print("="*70)
    
    prompt = "What is this page about?"
    context = {
        "url": "https://example.com",
        "title": "Example Page",
        "page_content": "This is a sample page about web development and programming."
    }
    
    print(f"Prompt: {prompt}")
    print(f"Context: {context['url']}")
    print(f"Expected: Analyze the page content")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response:\n{response}")
    print("\n✓ Should analyze page content")
    print("="*70)

async def test_site_mode_with_math_query():
    """Test Site-Specific Mode with math query (should redirect)"""
    print("\n" + "="*70)
    print("TEST 2: Site-Specific Mode - Math Query (SHOULD REDIRECT)")
    print("="*70)
    
    prompt = "What is 2+2?"
    context = {
        "url": "https://example.com",
        "title": "Example Page",
        "page_content": "This is a sample page about web development."
    }
    
    print(f"Prompt: {prompt}")
    print(f"Context: {context['url']}")
    print(f"Expected: Redirect to General Mode")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response:\n{response}")
    print("\n✓ Should say: 'Please switch to General Mode'")
    print("="*70)

async def test_site_mode_with_general_knowledge():
    """Test Site-Specific Mode with general knowledge query (should redirect)"""
    print("\n" + "="*70)
    print("TEST 3: Site-Specific Mode - General Knowledge (SHOULD REDIRECT)")
    print("="*70)
    
    prompt = "Who is the president of the United States?"
    context = {
        "url": "https://example.com",
        "title": "Example Page",
        "page_content": "This page talks about web design principles."
    }
    
    print(f"Prompt: {prompt}")
    print(f"Context: {context['url']}")
    print(f"Expected: Redirect to General Mode")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response:\n{response}")
    print("\n✓ Should say: 'Please switch to General Mode'")
    print("="*70)

async def test_general_mode_with_math_query():
    """Test General Mode with math query (should answer)"""
    print("\n" + "="*70)
    print("TEST 4: General Mode - Math Query (SHOULD ANSWER)")
    print("="*70)
    
    prompt = "What is 2+2?"
    
    print(f"Prompt: {prompt}")
    print(f"Context: None (General Mode)")
    print(f"Expected: Answer '4'")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response:\n{response}")
    print("\n✓ Should answer the math question")
    print("="*70)

async def test_general_mode_with_product_query():
    """Test General Mode with product query (should answer)"""
    print("\n" + "="*70)
    print("TEST 5: General Mode - Product Query (SHOULD ANSWER)")
    print("="*70)
    
    prompt = "What is VynceAI?"
    
    print(f"Prompt: {prompt}")
    print(f"Context: None (General Mode)")
    print(f"Expected: Provide product information")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response:\n{response}")
    print("\n✓ Should provide VynceAI product info")
    print("="*70)

async def test_site_mode_with_greeting():
    """Test Site-Specific Mode with greeting (should redirect)"""
    print("\n" + "="*70)
    print("TEST 6: Site-Specific Mode - Greeting (SHOULD REDIRECT)")
    print("="*70)
    
    prompt = "Hello, how are you?"
    context = {
        "url": "https://example.com",
        "title": "Example Page",
        "page_content": "This is content about technology."
    }
    
    print(f"Prompt: {prompt}")
    print(f"Context: {context['url']}")
    print(f"Expected: Redirect to General Mode")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response:\n{response}")
    print("\n✓ Should say: 'Please switch to General Mode'")
    print("="*70)

async def main():
    """Run all mode separation tests"""
    try:
        print("\nTesting mode separation behavior...")
        print("Verifying that Site-Specific Mode redirects general questions\n")
        
        # Test Site-Specific Mode
        await test_site_mode_with_page_query()
        await asyncio.sleep(1)
        
        await test_site_mode_with_math_query()
        await asyncio.sleep(1)
        
        await test_site_mode_with_general_knowledge()
        await asyncio.sleep(1)
        
        await test_site_mode_with_greeting()
        await asyncio.sleep(1)
        
        # Test General Mode
        await test_general_mode_with_math_query()
        await asyncio.sleep(1)
        
        await test_general_mode_with_product_query()
        
        print("\n" + "="*70)
        print("✅ All mode separation tests completed!")
        print("="*70)
        print("\nManual Verification Checklist:")
        print("[ ] Site-Specific Mode answers page-related questions")
        print("[ ] Site-Specific Mode redirects math questions")
        print("[ ] Site-Specific Mode redirects general knowledge")
        print("[ ] Site-Specific Mode redirects greetings")
        print("[ ] General Mode answers all general questions")
        print("[ ] No emojis in any responses")
        print("="*70)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
