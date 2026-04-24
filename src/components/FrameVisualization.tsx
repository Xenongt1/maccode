import { motion, AnimatePresence } from 'framer-motion';
import { Frame, CipherOptions } from '../types';
import { Eye } from 'lucide-react';

interface FrameVisualizationProps {
  frames: Frame[];
  currentFrameIndex: number;
  options: CipherOptions;
}

export default function FrameVisualization({ 
  frames, 
  currentFrameIndex, 
  options 
}: FrameVisualizationProps) {
  const currentFrame = frames[currentFrameIndex];

  if (!currentFrame) {
    return (
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 min-h-[400px] flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-pink-400 border-4 border-black mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
            <Eye className="w-10 h-10 text-black" />
          </div>
          <h3 className="text-2xl font-black text-black mb-3 uppercase">
            No Visualization Yet
          </h3>
          <p className="text-black font-bold">
            Enter text and click encrypt/decrypt to see the step-by-step visualization
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-2xl">
      {/* Frame Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 border-b-4 border-black rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-xl uppercase">
            Step {currentFrameIndex + 1} of {frames.length}
          </h3>
          <div className="bg-black px-4 py-2 border-2 border-white rounded-lg">
            <span className="text-yellow-300 text-sm font-black uppercase">{currentFrame.operationType}</span>
          </div>
        </div>
      </div>

      {/* Frame Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrameIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Frame Label */}
            <h4 className="text-2xl font-black text-black mb-6 uppercase">
              {currentFrame.label}
            </h4>

            {/* Intermediate Text Display */}
            {currentFrame.intermediateText && (
              <div className="bg-yellow-100 border-4 border-black p-6 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                  <div className="flex flex-wrap gap-3">
                  {currentFrame.intermediateText.split('').map((char, idx) => {
                    const isHighlighted = currentFrame.highlightIndices.includes(idx);
                    return (
                      <motion.span
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`font-mono text-xl px-4 py-2 border-4 border-black font-black rounded-lg ${
                          isHighlighted 
                            ? 'bg-cyan-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                            : 'bg-white text-black'
                        }`}
                      >
                        {char === ' ' ? '·' : char}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Math/Calculation Display */}
            {options.showMath && currentFrame.meta?.calculation && (
              <div className="bg-pink-100 border-4 border-black p-6 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                <div className="flex items-start gap-2">
                  <div className="text-black font-mono text-base font-bold whitespace-pre-wrap">
                    {currentFrame.meta.calculation}
                  </div>
                </div>
              </div>
            )}

            {/* Grid Visualization (for Playfair, etc.) */}
            {currentFrame.meta?.grid && (
              <div className="mb-6">
                <h5 className="text-lg font-black text-black mb-4 uppercase">
                  Grid:
                </h5>
                <div className="inline-block bg-cyan-100 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                  {currentFrame.meta.grid.map((row: string[], rowIdx: number) => (
                    <div key={rowIdx} className="flex gap-3 mb-3 last:mb-0">
                      {row.map((cell: string, colIdx: number) => {
                        const isHighlighted = currentFrame.meta?.positions?.some(
                          ([r, c]: [number, number]) => r === rowIdx && c === colIdx
                        );

                        return (
                          <motion.div
                            key={`${rowIdx}-${colIdx}`}
                            animate={{
                              scale: isHighlighted ? 1.1 : 1
                            }}
                            className={`w-14 h-14 flex items-center justify-center font-mono text-lg font-black border-4 border-black rounded-lg ${
                              isHighlighted 
                                ? 'bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                                : 'bg-white'
                            }`}
                          >
                            <span className="select-none">{cell || '·'}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matrix Visualization (for Hill cipher) */}
            {currentFrame.meta?.matrix && (
              <div className="mb-6">
                <h5 className="text-lg font-black text-black mb-4 uppercase">
                  Matrix:
                </h5>
                <div className="inline-block bg-green-100 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                  {currentFrame.meta.matrix.map((row: number[], rowIdx: number) => (
                    <div key={rowIdx} className="flex gap-3 mb-3 last:mb-0">
                      {row.map((cell: number, colIdx: number) => (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className="w-14 h-14 flex items-center justify-center font-mono font-black border-4 border-black bg-white text-black rounded-lg"
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
