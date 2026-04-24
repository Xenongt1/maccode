import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Square } from 'lucide-react';

export interface CipherStep {
  title: string;
  visual: React.ReactNode;
  explanation: string;
}

interface StepPlayerProps {
  steps: CipherStep[];
  accentColor?: string;
}

export default function StepPlayer({ steps, accentColor = 'bg-yellow-300' }: StepPlayerProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= steps.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 1800);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, steps.length]);

  const prev = () => { setPlaying(false); setStep(s => Math.max(0, s - 1)); };
  const next = () => { setPlaying(false); setStep(s => Math.min(steps.length - 1, s + 1)); };
  const togglePlay = () => {
    if (step >= steps.length - 1) setStep(0);
    setPlaying(p => !p);
  };

  const current = steps[step];

  const DotIndicators = () => (
    <div className="flex items-center gap-1.5">
      {steps.map((_, i) => (
        <button
          key={i}
          onClick={() => { setPlaying(false); setStep(i); }}
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 transition-colors ${
            i === step ? 'bg-yellow-300 border-yellow-300' : 'bg-transparent border-yellow-300/50 hover:border-yellow-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`${accentColor} border-b-4 border-black px-4 py-2 flex items-center justify-between`}>
        <span className="font-black uppercase text-sm tracking-wide">{current.title}</span>
        <span className="bg-black text-yellow-300 font-black text-xs px-2 py-0.5 rounded-lg">
          {step + 1} / {steps.length}
        </span>
      </div>

      {/* Visual area */}
      <div className="bg-white px-4 py-5 min-h-[180px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full flex items-center justify-center"
          >
            {current.visual}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explanation */}
      <div className="bg-white border-t-4 border-black px-4 py-3 text-sm font-bold leading-relaxed">
        {current.explanation}
      </div>

      {/* Controls */}
      <div className="bg-black px-3 sm:px-4 py-3 space-y-2 md:space-y-0">
        {/* Dot indicators - own centered row on mobile */}
        <div className="flex items-center justify-center md:hidden">
          <DotIndicators />
        </div>

        {/* Button row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-yellow-300 border-2 border-yellow-300 font-black uppercase text-xs sm:text-sm rounded-xl hover:bg-yellow-400 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Dot indicators for md+ screens */}
          <div className="hidden md:flex items-center gap-1.5">
            <DotIndicators />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={togglePlay}
              className={`flex items-center gap-1 px-2 sm:px-3 py-2 font-black uppercase text-xs border-2 rounded-xl transition-colors ${
                playing
                  ? 'bg-red-400 border-red-400 text-black hover:bg-red-500'
                  : 'bg-transparent border-yellow-300 text-yellow-300 hover:bg-yellow-300/10'
              }`}
            >
              {playing ? <Square size={12} /> : <Play size={12} />}
              <span className="hidden sm:inline">{playing ? 'Stop' : 'Auto'}</span>
            </button>
            <button
              onClick={next}
              disabled={step === steps.length - 1}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-yellow-300 border-2 border-yellow-300 font-black uppercase text-xs sm:text-sm rounded-xl hover:bg-yellow-400 disabled:opacity-40 transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
