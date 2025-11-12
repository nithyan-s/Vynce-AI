import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is VynceAI?",
      answer: "VynceAI is an intelligent AI-powered browser assistant that seamlessly integrates into your Chrome browser. It combines advanced AI capabilities with browser automation to help you navigate the web, understand content, and automate repetitive tasks—all through natural language commands."
    },
    {
      question: "How does VynceAI work?",
      answer: "VynceAI uses a dual-model architecture powered by Google Gemini 2.5 Flash for site-specific queries and Meta Llama 3.3 70B for general conversations. Simply install the Chrome extension, choose your mode (Site-Specific or General), and start chatting. VynceAI understands your current webpage context and provides intelligent, relevant responses."
    },
    {
      question: "What can VynceAI do?",
      answer: "VynceAI can summarize web pages, answer questions about content, automate browser tasks (like filling forms or clicking buttons), search YouTube, navigate pages intelligently, remember conversation context, and provide voice-to-text and text-to-speech capabilities. It's like having an AI assistant that understands your browsing context."
    },
    {
      question: "Is VynceAI free to use?",
      answer: "Yes! VynceAI is completely free to use. Just download the Chrome extension and connect it to your backend server. You'll need API keys for Google Gemini and/or Groq (which offer free tiers) to power the AI features."
    },
    {
      question: "What browsers does VynceAI support?",
      answer: "Currently, VynceAI is available as a Chrome extension compatible with Google Chrome, Microsoft Edge, Brave, and other Chromium-based browsers. We're working on bringing VynceAI to more platforms in the future."
    },
    {
      question: "How is my data handled?",
      answer: "VynceAI prioritizes your privacy. Your conversations and page context are processed securely through your own backend server. We don't store your personal data on external servers. Conversation history is saved locally in your browser storage, and you can clear it anytime."
    },
    {
      question: "Can VynceAI work offline?",
      answer: "VynceAI requires an internet connection to communicate with AI models (Gemini and Llama). However, the extension itself and its automation features can work offline for basic tasks that don't require AI processing."
    },
    {
      question: "What's the difference between Site-Specific and General modes?",
      answer: "Site-Specific mode uses Google Gemini to analyze and answer questions about the current webpage you're viewing. General mode uses Meta Llama for broader conversations not tied to a specific page. You can switch between modes anytime based on your needs."
    },
    {
      question: "Does VynceAI support voice commands?",
      answer: "Yes! VynceAI includes full voice support with speech recognition and text-to-speech. You can speak your questions and have VynceAI read responses aloud. There's even an Agent Mode with a visual AI core interface for hands-free interaction."
    },
    {
      question: "How do I install VynceAI?",
      answer: "Installation is simple: 1) Download the extension files, 2) Go to chrome://extensions/ in your browser, 3) Enable 'Developer mode', 4) Click 'Load unpacked' and select the extension folder, 5) Set up your backend server with API keys. Full instructions are available in our documentation."
    },
    {
      question: "Can VynceAI automate tasks on any website?",
      answer: "VynceAI can automate many common tasks like clicking buttons, filling forms, scrolling, and navigating pages. However, browser security restrictions prevent extensions from working on internal browser pages (chrome://, edge://) and some websites may have Content Security Policies that limit automation."
    },
    {
      question: "Is there a limit to how much I can use VynceAI?",
      answer: "Usage limits depend on your AI provider's API quotas. Google Gemini and Groq offer generous free tiers. If you're on a free tier and hit rate limits, you may need to wait or upgrade to a paid plan with your AI provider."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">
            FAQs
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            Quick answers to questions you may have about VynceAI.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="group"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left bg-black/40 backdrop-blur-sm border border-gray-800/50 hover:border-green-500/40 rounded-lg p-3 sm:p-4 md:p-5 transition-all duration-300 hover:bg-black/50"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-white group-hover:text-green-400 transition-colors">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-2 sm:mt-3 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-10 sm:mt-12 px-4 sm:px-0"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
            Got more questions?
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
            Contact us for more information.
          </p>
          <a
            href="mailto:nithyan.4417@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
          >
            Contact Us
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
