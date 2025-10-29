const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-cyan-500/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-cyan-400 font-medium">Now Available for Chrome</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          Meet <span className="text-gradient glow">VynceAI</span>
          <br />
          <span className="text-slate-200">Your Personal AI Agent</span>
          <br />
          <span className="text-slate-400 text-4xl md:text-5xl lg:text-6xl">for the Web</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Automate, explore, and command the internet — with your voice.
          <br />
          <span className="text-cyan-400">Browse smarter. Work faster. Think bigger.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-400/60">
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
              </svg>
              <span>Download Extension</span>
            </span>
          </button>
          
          <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm">
            Watch Demo
          </button>
        </div>

        {/* Demo Video/Screenshot Placeholder */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl card-glow">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              {/* Placeholder - Replace with actual demo video or screenshot */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-400">Demo Video Coming Soon</p>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 -z-10"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
