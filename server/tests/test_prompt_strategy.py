"""
Test script for VynceAI prompt strategy
Tests the new strict prompting rules for both models
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
print("🧪 VynceAI Prompt Strategy Testing")
print("Testing strict rules: No emojis, No hallucinations, Product-focused")
print("="*70)

async def test_gemini_site_specific():
    """Test Gemini with site-specific query"""
    print("\n" + "="*70)
    print("TEST 1: Gemini - Site-Specific Query")
    print("="*70)
    
    prompt = "What is this page about?"
    context = {
        "url": "https://docs.python.org/3/tutorial/",
        "title": "Python Tutorial",
        "page_content": """
        The Python Tutorial
        
        Python is an easy to learn, powerful programming language. It has efficient 
        high-level data structures and a simple but effective approach to 
        object-oriented programming. Python's elegant syntax and dynamic typing, 
        together with its interpreted nature, make it an ideal language for 
        scripting and rapid application development in many areas.
        
        This tutorial introduces the reader informally to the basic concepts and 
        features of the Python language and system.
        """
    }
    
    print(f"Prompt: {prompt}")
    print(f"Context URL: {context['url']}")
    print(f"Expected: Site-specific analysis, no emojis, factual only")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response:\n{response}")
    print("\n✓ Check: No emojis, factual, page-focused")
    print("="*70)

async def test_gemini_without_context():
    """Test Gemini routing when no context (should not get external info)"""
    print("\n" + "="*70)
    print("TEST 2: Query without Context (Should route to Llama)")
    print("="*70)
    
    prompt = "What is Python programming?"
    
    print(f"Prompt: {prompt}")
    print(f"Context: None")
    print(f"Expected: Route to Llama for general query")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response:\n{response}")
    print("\n✓ Check: Should use Llama, friendly but professional")
    print("="*70)

async def test_llama_greeting():
    """Test Llama with greeting"""
    print("\n" + "="*70)
    print("TEST 3: Llama - Greeting")
    print("="*70)
    
    prompt = "Hello! What can you help me with?"
    
    print(f"Prompt: {prompt}")
    print(f"Expected: Friendly, professional, no emojis")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response:\n{response}")
    print("\n✓ Check: Friendly, no emojis, mentions VynceAI capabilities")
    print("="*70)

async def test_llama_product_query():
    """Test Llama with product question"""
    print("\n" + "="*70)
    print("TEST 4: Llama - Product Query")
    print("="*70)
    
    prompt = "What is VynceAI and what can it do?"
    
    print(f"Prompt: {prompt}")
    print(f"Expected: Product info, clear, no emojis")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response:\n{response}")
    print("\n✓ Check: Accurate product info, professional, clear")
    print("="*70)

async def test_gemini_strict_content():
    """Test Gemini stays within page content"""
    print("\n" + "="*70)
    print("TEST 5: Gemini - Strict Content Boundary")
    print("="*70)
    
    prompt = "What programming languages are discussed on this page?"
    context = {
        "url": "https://example.com/tech-article",
        "title": "Web Development Guide",
        "page_content": """
        Getting Started with Web Development
        
        This guide covers the basics of HTML and CSS for building websites.
        HTML is used for structure, and CSS is used for styling.
        
        We'll explore how to create responsive layouts and modern designs.
        """
    }
    
    print(f"Prompt: {prompt}")
    print(f"Context: HTML/CSS article")
    print(f"Expected: Should only mention HTML/CSS, not add other languages")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt, context=context)
    print(f"Response:\n{response}")
    print("\n✓ Check: Should only mention HTML/CSS from page content")
    print("="*70)

async def test_llama_developer_query():
    """Test Llama with developer question"""
    print("\n" + "="*70)
    print("TEST 6: Llama - Developer Query")
    print("="*70)
    
    prompt = "How do I integrate VynceAI into my workflow?"
    
    print(f"Prompt: {prompt}")
    print(f"Expected: Technical but clear, helpful, product-focused")
    print("-" * 70)
    
    response = await llm_client.generate(prompt=prompt)
    print(f"Response:\n{response}")
    print("\n✓ Check: Technical accuracy, clear instructions")
    print("="*70)

async def main():
    """Run all prompt strategy tests"""
    try:
        print("\nStarting prompt strategy validation...")
        print("Testing: No emojis, No hallucinations, Product-focused\n")
        
        # Test Gemini (site-specific)
        await test_gemini_site_specific()
        await asyncio.sleep(1)
        
        await test_gemini_strict_content()
        await asyncio.sleep(1)
        
        # Test routing
        await test_gemini_without_context()
        await asyncio.sleep(1)
        
        # Test Llama (general)
        await test_llama_greeting()
        await asyncio.sleep(1)
        
        await test_llama_product_query()
        await asyncio.sleep(1)
        
        await test_llama_developer_query()
        
        print("\n" + "="*70)
        print("✅ All prompt strategy tests completed!")
        print("="*70)
        print("\nManual Review Checklist:")
        print("[ ] No emojis in any responses")
        print("[ ] Gemini stays within page content")
        print("[ ] Llama provides accurate product info")
        print("[ ] All responses are professional and clear")
        print("[ ] No hallucinated information")
        print("="*70)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
