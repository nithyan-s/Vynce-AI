# VynceAI - Your AI Web Assistant

<div align="center">
  
  **Command your browser with AI-powered assistance**
  
  *Voice commands • Multiple AI models • Smart automation*
  
</div>

---

## 🚀 Project Overview

VynceAI is a comprehensive AI-powered browser assistant consisting of:

1. **Marketing Website** (`/website`) - Landing page for users to learn about and download VynceAI
2. **Chrome Extension** (`/extension`) - Browser extension with AI chat interface ✅ **COMPLETE**
3. **Backend API** (`/backend`) - Server for AI model integration (Coming next)

## 📦 Project Structure

```
Vynce-AI/
├── website/              ✅ Main marketing site
│   └── client/          → React + Vite + Tailwind
│       ├── src/
│       │   ├── components/
│       │   └── assets/
│       └── public/
│
├── extension/            ✅ Chrome Extension (COMPLETE!)
│   ├── manifest.json    → Chrome Manifest V3
│   ├── popup/           → Chat UI with AI models
│   ├── background/      → Service worker
│   ├── content/         → Page interaction
│   ├── scripts/         → API communication
│   ├── utils/           → Helper functions
│   └── assets/          → Icons (needs logo)
│
└── backend/              🔄 Coming next
    └── (API server)
```

## ✨ Current Status

### ✅ Website (Complete)
- Modern React landing page
- Beautiful animations (Liquid Ether, Decrypted Text)
- Responsive design
- Download CTAs for Mac/Windows
- Sections: Hero, Features, How It Works, Trusted By, CTA, Footer

### ✅ Extension (Complete)
- Professional chat interface
- 6 AI model options (GPT-4, Claude, Gemini, etc.)
- Dark theme with green accents
- Conversation history
- Page context awareness
- Mock AI responses (testing)
- Full documentation

### 🔄 Backend (Next Step)
- AI model API integration
- Authentication
- Request handling
- Response processing

## 🎯 Quick Start

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

## 🎨 Design Theme

**Colors:**
- Background: Black (#000000)
- Accent: Green (#22c55e, #10b981, #14b8a6)
- Text: White/Gray

**Style:**
- Modern, clean, professional
- Dark mode throughout
- Smooth animations
- Green glow effects

## 🛠️ Tech Stack

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

### Backend (Planned)
- Node.js / Express (or your choice)
- OpenAI API
- Anthropic Claude API
- Google Gemini API

## 📚 Documentation

- **Website**: See `website/client/README.md`
- **Extension**: See `extension/README.md` and `extension/SETUP.md`
- **Build Summary**: See `extension/BUILD_SUMMARY.md`

## 🚀 Next Steps

1. ✅ ~~Build website~~ (Complete)
2. ✅ ~~Build extension UI~~ (Complete)
3. 🔄 Build backend API (In Progress)
4. 🔲 Connect extension to backend
5. 🔲 Add voice commands
6. 🔲 Implement automation features
7. 🔲 Publish to Chrome Web Store

## 🤝 Contributing

This is a private project. Contact the team for collaboration opportunities.

## 📧 Contact

- **Website**: https://vynceai.com
- **Email**: support@vynceai.com

---

<div align="center">
  
  **Made with ❤️ by the VynceAI Team**
  
  *Revolutionizing browser AI assistance* 🚀
  
</div>