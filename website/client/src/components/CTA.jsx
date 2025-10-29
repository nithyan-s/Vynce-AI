const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <br />
              <span className="text-gradient">Browsing Experience?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already browsing smarter with VynceAI.
              Download now and start commanding the web with your voice.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/50">
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                  </svg>
                  <span>Download for Chrome</span>
                </span>
              </button>

              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500/50 text-white font-semibold rounded-xl transition-all duration-300">
                View Documentation
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
