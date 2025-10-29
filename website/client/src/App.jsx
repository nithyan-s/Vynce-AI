import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
        />
      </div>

      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
