import { installExtension } from '../utils/downloadExtension';

const CTA = () => {
  const handleDownload = () => {
    installExtension('chrome');
  };

  return (
    <section id="download" className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-black/10 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              Join thousands of users already automating their web tasks with VynceAI
            </p>

            {/* CTA Button */}
            <button 
              onClick={handleDownload}
              className="px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 shadow-2xl text-sm sm:text-base"
            >
              Download for Free
            </button>

            {/* Trust badges */}
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
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
