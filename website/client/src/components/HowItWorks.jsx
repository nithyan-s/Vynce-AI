const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
          Simple & Powerful
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-12 sm:mb-16">
          Get started in three easy steps
        </p>

        <div className="space-y-8 sm:space-y-12">
          {/* Step 1 */}
          <div className="flex items-start gap-4 sm:gap-6 text-left">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-black font-bold text-lg sm:text-xl shadow-lg shadow-green-500/50">
              1
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">Install the Extension</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-400">Download and add VynceAI to your browser in one click</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 sm:gap-6 text-left">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-black font-bold text-lg sm:text-xl shadow-lg shadow-emerald-500/50">
              2
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">Activate with Voice</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-400">Press the hotkey and speak your command naturally</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 sm:gap-6 text-left">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center text-black font-bold text-lg sm:text-xl shadow-lg shadow-teal-500/50">
              3
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">Watch It Work</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-400">VynceAI executes your task automatically while you relax</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
