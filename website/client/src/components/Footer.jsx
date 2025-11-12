import logo from '../assets/v.png'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 pt-8 sm:pt-10 md:pt-12 pb-24 sm:pb-28 md:pb-32 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-white/[0.05] select-none whitespace-nowrap">
          VynceAI
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <img src={logo} alt="VynceAI" className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-base sm:text-lg font-semibold text-white">VynceAI</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs">
              Your AI-powered browser assistant. Automate tasks and browse smarter.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Product</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Docs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Legal</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 VynceAI. All rights reserved.
            </p>
            <span className="hidden sm:inline text-gray-600">•</span>
            <p className="text-gray-400 text-xs sm:text-sm">
              Developed by <span className="text-white font-medium">Nithyan S</span>
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="https://github.com/nithyan-s/VynceAI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/nithyan--s" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="mailto:nithyan.4417@gmail.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
