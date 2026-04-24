import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  title: string;
  year?: string;
  text: string;
  color: string;
}

const SLIDES: Slide[] = [
  {
    title: 'Ancient Ciphers',
    year: 'c. 1900 BC – 500 AD',
    text: 'Simple substitution and transposition techniques used in early civilizations (e.g., Egyptian hieroglyphic ciphers and Spartan scytale).',
    color: 'bg-yellow-300'
  },
  {
    title: 'Classical Era',
    year: '1500s – 1800s',
    text: 'Polyalphabetic ciphers like Vigenère and improved substitution methods spread across Europe, increasing secrecy.',
    color: 'bg-pink-400'
  },
  {
    title: 'Mechanical Age',
    year: '1910s – 1940s',
    text: 'Electromechanical machines such as Enigma and SIGABA introduced rotor-based polyalphabetic encryption used in world conflicts.',
    color: 'bg-cyan-400'
  },
  {
    title: 'Modern Cryptography',
    year: '1970s – present',
    text: 'Mathematics-driven public-key systems (RSA, ECC) and symmetric algorithms (AES) form the backbone of secure communications today.',
    color: 'bg-green-400'
  }
];

export default function CryptoHistoryCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [index, isPaused]);

  return (
    <section 
      className="relative overflow-hidden bg-white border-4 sm:border-8 border-black rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 lg:mx-6 my-4 sm:my-6 lg:my-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-black uppercase mb-2">Cryptography Timeline</h2>
            <p className="text-base sm:text-lg font-bold text-black">A journey through the evolution of secret codes</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={prev} 
              className="p-2 sm:p-3 lg:p-4 bg-yellow-300 border-4 border-black rounded-lg sm:rounded-xl hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none font-black text-lg sm:text-xl lg:text-2xl"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button 
              onClick={next} 
              className="p-2 sm:p-3 lg:p-4 bg-yellow-300 border-4 border-black rounded-lg sm:rounded-xl hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none font-black text-lg sm:text-xl lg:text-2xl"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className={`${SLIDES[index].color} border-4 sm:border-8 border-black p-4 sm:p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl sm:rounded-3xl`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-black border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                    <div className="text-center text-white">
                      <div className="text-xs uppercase font-black mb-1">ERA</div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-black">{index + 1}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-2 uppercase">{SLIDES[index].title}</h3>
                  <div className="inline-block bg-black text-white px-2 sm:px-4 py-1 sm:py-2 font-bold text-xs sm:text-sm mb-3 sm:mb-4 border-2 border-black rounded-lg">
                    {SLIDES[index].year}
                  </div>
                  <p className="text-black font-bold leading-relaxed text-sm sm:text-base lg:text-lg">{SLIDES[index].text}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 justify-center">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setIndex(i)}
                className={`h-4 border-4 border-black transition-all rounded-full ${
                  i === index 
                    ? 'bg-black w-16' 
                    : 'bg-white w-4 hover:bg-gray-200'
                }`}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
