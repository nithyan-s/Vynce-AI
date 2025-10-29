const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Install the Extension",
      description: "Add VynceAI to Chrome in seconds. No complex setup required.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Activate with Your Voice",
      description: "Press the hotkey or click the icon, then speak your command naturally.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Watch the Magic Happen",
      description: "VynceAI executes your task automatically while you sit back and relax.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get started in three simple steps. No learning curve, just pure productivity.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              )}

              {/* Step Card */}
              <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-sm group hover:border-cyan-500/50 transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/50">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 mt-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-400 mb-6">
            Ready to experience the future of browsing?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-cyan-500/30">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
