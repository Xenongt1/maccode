import { motion } from 'framer-motion';

interface HeroLandingProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export default function HeroLanding({ onGetStarted, onLearnMore }: HeroLandingProps) {
  return (
    <section className="relative overflow-hidden bg-cyan-400 border-b-8 border-black">
      {/* Decorative elements with rounded corners - Hidden on mobile */}
      <div className="hidden sm:block absolute top-4 sm:top-10 left-4 sm:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-yellow-300 border-4 border-black rotate-12 rounded-3xl"></div>
      <div className="hidden sm:block absolute bottom-16 sm:bottom-20 left-1/4 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-pink-400 border-4 border-black -rotate-6 rounded-2xl"></div>
      <div className="hidden lg:block absolute top-1/3 right-20 w-40 h-40 bg-green-400 border-4 border-black rotate-45 rounded-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Main Heading - Neobrutalism Style with rounded corners */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="block mb-3 text-black">A BETTER WAY</span>
              <span className="block mb-2 sm:mb-3 bg-black text-yellow-300 px-2 sm:px-4 py-1 sm:py-2 inline-block border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 rounded-xl sm:rounded-2xl">
                TO LEARN
              </span>
              <span className="block mt-2 sm:mt-3 bg-pink-500 text-white px-2 sm:px-4 py-1 sm:py-2 inline-block border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1 rounded-xl sm:rounded-2xl">
                CRYPTOGRAPHY
              </span>
            </h1>
            
            {/* Description */}
            <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              <p className="text-base sm:text-lg lg:text-xl font-bold leading-relaxed">
                Master classical cryptography through <span className="bg-yellow-300 px-1 sm:px-2 py-1 border-2 border-black rounded-lg">interactive visualizations</span>. 
                Explore ancient ciphers, understand encryption algorithms, and discover 
                the fascinating history of secret codes all in one place.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="bg-yellow-300 border-4 border-black p-3 sm:p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">6+</div>
                <div className="text-xs sm:text-sm font-bold uppercase">Cipher Types</div>
              </div>
              <div className="bg-green-400 border-4 border-black p-3 sm:p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">100%</div>
                <div className="text-xs sm:text-sm font-bold uppercase">Free Forever</div>
              </div>
              <div className="bg-pink-400 border-4 border-black p-3 sm:p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">∞</div>
                <div className="text-xs sm:text-sm font-bold uppercase">Possibilities</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <motion.button 
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-black text-yellow-300 border-4 border-black font-black text-base sm:text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all rounded-2xl"
              >
                Get Started →
              </motion.button>
              <motion.button 
                onClick={onLearnMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-white text-black border-4 border-black font-black text-base sm:text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all rounded-2xl"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Right visual - Pure Neobrutalism Geometric Art with rounded corners */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[300px] sm:h-[400px] lg:h-[500px] hidden md:block"
          >
            {/* Large yellow square with inner pattern - ROUNDED */}
            <motion.div
              animate={{ 
                rotate: [0, 5, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-yellow-300 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] lg:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-3xl"
            >
              <div className="absolute inset-6 border-4 border-black rounded-2xl"></div>
              <div className="absolute inset-12 bg-black rounded-xl"></div>
            </motion.div>
            
            {/* Pink circle with concentric rings */}
            <motion.div
              animate={{ 
                scale: [1, 1.08, 1],
                x: [0, -20, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-20 sm:top-40 right-0 w-28 sm:w-40 lg:w-56 h-28 sm:h-40 lg:h-56 bg-pink-500 border-8 border-black rounded-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] lg:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] z-10"
            >
              <div className="absolute inset-6 border-4 border-black rounded-full"></div>
              <div className="absolute inset-12 bg-black rounded-full"></div>
            </motion.div>
            
            {/* Green square with diagonal split - ROUNDED */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 sm:bottom-20 right-16 sm:right-32 w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 bg-green-400 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
            </motion.div>
            
            {/* Small cyan square with rotation - ROUNDED */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 sm:top-10 right-0 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-cyan-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl"
            >
              <div className="absolute inset-3 bg-black rounded-lg"></div>
            </motion.div>
            
            {/* Purple triangle accent - ROUNDED */}
            <motion.div
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-purple-500 border-6 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl"
              style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
            />
            
            {/* Orange rectangle accent - ROUNDED */}
            <motion.div
              animate={{ 
                x: [0, 20, 0],
                y: [0, -15, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-1/3 right-1/4 w-20 sm:w-32 lg:w-40 h-12 sm:h-18 lg:h-24 bg-orange-400 border-6 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -rotate-12 rounded-2xl"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-2 bg-black rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-12 bg-black rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
