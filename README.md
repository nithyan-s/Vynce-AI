# VynceAI

**Intelligent AI-powered browser assistant with dual-model architecture for context-aware web interactions**

---

## Overview

VynceAI is a production-ready Chrome extension that integrates advanced AI capabilities directly into your browser workflow. The system employs a sophisticated dual-model routing architecture powered by Google Gemini 2.5 Flash for site-specific operations and Meta Llama 3.3 70B for general queries, delivering contextually appropriate responses with optimal performance.

## Architecture

The project comprises three primary components:

### 1. Backend API Server
FastAPI-based service providing intelligent model routing and AI generation capabilities.

**Key Features:**
- Dual-model routing engine with context-aware request classification
- Google Gemini 2.5 Flash integration (site-specific operations)
- Meta Llama 3.3 70B integration via Groq (general queries)
- Memory-aware conversation context management
- RESTful API endpoints with comprehensive error handling

**Technology Stack:**
- FastAPI 0.115.5
- Google Generative AI SDK 0.8.3
- Groq SDK 0.11.0
- Pydantic for data validation
- Python 3.10+

### 2. Chrome Extension
Manifest V3 compliant browser extension with advanced AI interaction capabilities.

**Core Capabilities:**
- Multi-mode chat interface with conversation history
- Voice recognition and text-to-speech synthesis
- Intelligent page content extraction and analysis
- Real-time page summarization
- Memory management system (20-item rolling buffer)
- Agent Mode with visual AI core interface
- Browser automation commands

**Architecture:**
- Service worker-based background processing
- Content script injection for page interaction
- Modular popup interface (2,290 lines optimized from 2,700)
- Chrome Storage API for persistent state
- Web Speech API integration

### 3. Marketing Website
React-based landing page with modern UI/UX design.

**Features:**
- Responsive design with mobile optimization
- Animated components and visual effects
- Product feature showcase
- Download call-to-actions
- Performance-optimized asset delivery

**Technology Stack:**
- React 19
- Vite build system
- Tailwind CSS
- Framer Motion
- Three.js for 3D effects

## System Requirements

### Backend Server
- Python 3.10 or higher
- 2GB RAM minimum
- API keys for Google AI Studio and Groq Cloud

### Chrome Extension
- Google Chrome 88 or higher
- 50MB free disk space
- Internet connection for AI services

### Website
- Node.js 18 or higher
- npm 9 or higher

## Installation

### Backend Setup

1. Navigate to server directory and create virtual environment:
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies and configure:
```bash
pip install -r requirements.txt
```

Create `.env` file:
```
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

3. Start server:
```bash
python main.py
```

Server: `http://127.0.0.1:8000`  
API Docs: `http://127.0.0.1:8000/docs`

### Chrome Extension Setup

1. Load in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `extension` directory

2. Configure and use:
   - Click VynceAI toolbar icon
   - Select mode (Site-Specific or General)
   - Begin interaction

### Website Setup

```bash
cd website/client
npm install
npm run dev  # Development at http://localhost:5173
npm run build  # Production build
```

## Configuration

**Backend** (`server/app/core/config.py`):
```python
API_HOST = "127.0.0.1"
API_PORT = 8000
GEMINI_MODEL = "gemini-2.5-flash"
LLAMA_MODEL = "llama-3.3-70b-versatile"
```

**Extension** (`extension/popup/popup.js`):
```javascript
const FIXED_MODEL = 'gemini-2.5-flash';
const MAX_MEMORY_ITEMS = 20;
```

## API Documentation

### POST /api/v1/ai/chat
Generate AI response with dual-model routing.

**Request:**
```json
{
  "mode": "site-specific",
  "prompt": "Summarize this article",
  "context": {
    "url": "https://example.com",
    "title": "Article Title",
    "content": "Page content..."
  },
  "memory": []
}
```

**Response:**
```json
{
  "response": "AI generated response",
  "model": "gemini-2.5-flash",
  "mode": "site-specific"
}
```

### GET /api/v1/utils/health
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## Project Structure

```
Vynce-AI/
├── website/               Main marketing site
│   └── client/          → React + Vite + Tailwind
│       ├── src/
│       │   ├── components/
│       │   └── assets/
│       └── public/
│
├── extension/             Chrome Extension (COMPLETE!)
│   ├── manifest.json    → Chrome Manifest V3
│   ├── popup/           → Chat UI with AI models
│   ├── background/      → Service worker
│   ├── content/         → Page interaction
│   ├── scripts/         → API communication
│   ├── utils/           → Helper functions
│   └── assets/          → Icons (needs logo)
│
└── backend/               Coming next
    └── (API server)
```

## Current Status

### Website (Complete)
- Modern React landing page
- Beautiful animations (Liquid Ether, Decrypted Text)
- Responsive design
- Download CTAs for Mac/Windows
- Sections: Hero, Features, How It Works, Trusted By, CTA, Footer

### Extension (Complete)
- Professional chat interface
- ** AI Page Reader** - Summarize and analyze any webpage
- ** Natural Language Q&A** - Ask questions about current page
- 6 AI model options (GPT-4, Claude, Gemini, etc.)
- Dark theme with green accents
- Conversation history with memory
- Page context awareness
- Voice input support
- Mock AI responses (testing)
- Full documentation

### Backend (Next Step)
- AI model API integration
- Authentication
- Request handling
- Response processing

## Quick Start

### Website
```bash
cd website/client
npm install
npm run dev
```
Visit `http://localhost:5173`

### Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `/extension` folder
5. Click VynceAI icon to chat!

See `extension/SETUP.md` for detailed instructions.

### Backend
*Coming soon!*

## Design Theme

**Colors:**
- Background: Black (#000000)
- Accent: Green (#22c55e, #10b981, #14b8a6)
- Text: White/Gray

**Style:**
- Modern, clean, professional
- Dark mode throughout
- Smooth animations
- Green glow effects

## Tech Stack

### Website
- React 19
- Vite (Rolldown)
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- GSAP

### Extension
- Vanilla JavaScript (ES6 modules)
- Chrome Extension Manifest V3
- Chrome Storage API
- Service Workers

### Backend
- FastAPI
- OpenAI API
- Anthropic Claude API
- Google Gemini API

## Documentation

- **Website**: See `website/client/README.md`
- **Extension**: See `extension/README.md` and `extension/SETUP.md`
- **Page Reader Feature**: See `FEATURE_PAGE_READER.md`
- **Quick Start Guide**: See `QUICKSTART_PAGE_READER.md`
- **Build Summary**: See `extension/BUILD_SUMMARY.md`

## Contact

- **Website**: https://vynceai.imnitz.tech
- **Email**: nithyan.4417@gmail.com

---
