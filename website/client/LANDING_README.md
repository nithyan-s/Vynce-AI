# VynceAI Landing Page

A professional, modern landing page for VynceAI - an intelligent browser extension that acts as a voice-driven web agent.

## 🚀 Features

- **Modern Design**: Sleek, futuristic UI with dark theme and neon accents
- **Smooth Animations**: Built with Framer Motion for fluid transitions
- **Responsive Layout**: Optimized for all devices
- **Tailwind CSS**: Utility-first styling for rapid development
- **React + Vite**: Fast development and optimized builds

## 📦 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations (optional)

## 🛠️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Tailwind CSS (if not already installed):**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Install Framer Motion (optional, for enhanced animations):**
   ```bash
   npm install framer-motion
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Navigation bar with sticky behavior
│   ├── Hero.jsx         # Hero section with CTA
│   ├── Features.jsx     # Features grid
│   ├── HowItWorks.jsx   # Step-by-step guide
│   ├── CTA.jsx          # Call-to-action section
│   └── Footer.jsx       # Footer with links
├── App.jsx              # Main app component
├── index.css            # Global styles with Tailwind
└── main.jsx             # App entry point
```

## 🎨 Customization

### Colors
The design uses a dark theme with cyan/blue accents. You can customize colors in `tailwind.config.js` and `index.css`.

### Content
Update text content in each component file to match your branding and messaging.

### Links
Replace placeholder links in components (GitHub, Twitter, Email, Download button) with actual URLs.

## 🌐 Deployment

Build the project for production:
```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 📝 License

MIT

---

Built with ❤️ for VynceAI
