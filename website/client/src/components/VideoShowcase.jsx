import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    handlePlayPause();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mt-6 sm:mt-8 px-2 sm:px-0">
      {/* Browser Chrome */}
      <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-green-500/20 backdrop-blur-sm">
        {/* Browser Header */}
        <div className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800/50 px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5 sm:gap-2">
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
          </div>
          <div className="flex-1 mx-2 sm:mx-3 bg-gray-800/50 backdrop-blur-sm rounded-md px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 sm:gap-2 border border-gray-700/30">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="flex-1 truncate">vynceai.com/demo</span>
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Video Container */}
        <div 
          className="relative aspect-video bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 cursor-pointer group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={handleVideoClick}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            playsInline
            preload="metadata"
          >
            <source src="/assets/Video Project.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none"></div>
          
          {/* Play/Pause Button Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: !isPlaying || showControls ? 1 : 0,
              scale: !isPlaying || showControls ? 1 : 0.8
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-green-500/50 border-2 border-white/20 hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
            >
              {isPlaying ? (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-0.5 sm:ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>
          </motion.div>

          {/* Video Controls Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showControls || !isPlaying ? 1 : 0,
              y: showControls || !isPlaying ? 0 : 20
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-white">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              
              <div className="flex-1 text-[10px] sm:text-xs text-gray-300">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="font-medium">VynceAI Demo</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                  }
                }}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    } else if (videoRef.current.webkitRequestFullscreen) {
                      videoRef.current.webkitRequestFullscreen();
                    }
                  }
                }}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Status Badge */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-green-500/30 flex items-center gap-1.5 sm:gap-2"
            >
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs text-gray-200 font-medium">Click to Play</span>
            </motion.div>
          )}
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
      </div>

      {/* Feature Tags Below Video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6"
      >
        <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-full text-[10px] sm:text-xs text-gray-300 flex items-center gap-1 sm:gap-1.5">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Voice Commands
        </div>
        <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-full text-[10px] sm:text-xs text-gray-300 flex items-center gap-1 sm:gap-1.5">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          AI Automation
        </div>
        <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-full text-[10px] sm:text-xs text-gray-300 flex items-center gap-1 sm:gap-1.5">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Real-time Context
        </div>
        <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-full text-[10px] sm:text-xs text-gray-300 flex items-center gap-1 sm:gap-1.5">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Privacy-First
        </div>
      </motion.div>
    </div>
  );
};

export default VideoShowcase;
