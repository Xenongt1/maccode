import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Frame } from '../types';
import { Play, Pause, SkipBack, SkipForward, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

interface AnimationControlsProps {
  frames: Frame[];
  currentFrameIndex: number;
  onFrameChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export default function AnimationControls({
  frames,
  currentFrameIndex,
  onFrameChange,
  isPlaying,
  onPlayPause,
  playbackSpeed,
  onSpeedChange
}: AnimationControlsProps) {
  
  const handleStepBackward = () => {
    if (currentFrameIndex > 0) {
      onFrameChange(currentFrameIndex - 1);
    }
  };

  const handleStepForward = () => {
    if (currentFrameIndex < frames.length - 1) {
      onFrameChange(currentFrameIndex + 1);
    }
  };

  // Enable keyboard controls
  useKeyboardControls({
    onStepForward: handleStepForward,
    onStepBackward: handleStepBackward,
    onPlayPause,
    enabled: frames.length > 0
  });
  
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const interval = setInterval(() => {
      if (currentFrameIndex < frames.length - 1) {
        onFrameChange(currentFrameIndex + 1);
      } else {
        onPlayPause(); // Stop at the end
      }
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, currentFrameIndex, frames.length, playbackSpeed, onFrameChange, onPlayPause]);

  const handleSkipToStart = () => {
    onFrameChange(0);
  };

  const handleSkipToEnd = () => {
    onFrameChange(frames.length - 1);
  };

  if (frames.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-2xl"
    >
      <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-black mb-6 uppercase">
        Animation Controls
      </h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-black text-black mb-3">
          <span>Frame {currentFrameIndex + 1}</span>
          <span>{frames.length} total</span>
        </div>
        <div className="relative h-4 bg-gray-200 border-4 border-black overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentFrameIndex + 1) / frames.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Clickable progress dots */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {frames.map((frame, idx) => (
            <button
              key={frame.id}
              onClick={() => onFrameChange(idx)}
              className={`flex-shrink-0 h-4 border-2 border-black transition-all rounded-full ${
                idx === currentFrameIndex
                  ? 'bg-cyan-400 w-10'
                  : idx < currentFrameIndex
                  ? 'bg-cyan-200 w-4'
                  : 'bg-white w-4'
              }`}
              title={frame.label}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={handleSkipToStart}
          disabled={currentFrameIndex === 0}
          className="p-3 bg-white border-4 border-black hover:translate-x-1 hover:translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none rounded-xl"
          title="Skip to start"
        >
          <ChevronsLeft className="w-5 h-5 text-black" />
        </button>
        
        <button
          onClick={handleStepBackward}
          disabled={currentFrameIndex === 0}
          className="p-3 bg-white border-4 border-black hover:translate-x-1 hover:translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none rounded-xl"
          title="Step backward"
        >
          <SkipBack className="w-5 h-5 text-black" />
        </button>

        <button
          onClick={onPlayPause}
          className="p-6 bg-gradient-to-r from-pink-400 to-purple-500 border-4 border-black hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white" />
          ) : (
            <Play className="w-7 h-7 text-white" />
          )}
        </button>

        <button
          onClick={handleStepForward}
          disabled={currentFrameIndex === frames.length - 1}
          className="p-3 bg-white border-4 border-black hover:translate-x-1 hover:translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none rounded-xl"
          title="Step forward"
        >
          <SkipForward className="w-5 h-5 text-black" />
        </button>

        <button
          onClick={handleSkipToEnd}
          disabled={currentFrameIndex === frames.length - 1}
          className="p-3 bg-white border-4 border-black hover:translate-x-1 hover:translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none rounded-xl"
          title="Skip to end"
        >
          <ChevronsRight className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Speed Control */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-black text-black mb-3 uppercase">
          <span>Playback Speed</span>
          <span className="bg-cyan-400 px-3 py-1 border-2 border-black">{playbackSpeed}x</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-black">0.25x</span>
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.25"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="flex-1 h-3 bg-gray-200 border-2 border-black appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-bold text-black">4x</span>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="pt-6 border-t-4 border-black">
        <div className="text-sm font-bold text-black space-y-3">
          <div className="flex gap-3 items-center">
            <kbd className="px-3 py-2 bg-yellow-300 border-4 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">←</kbd>
            <span>Previous frame</span>
          </div>
          <div className="flex gap-3 items-center">
            <kbd className="px-3 py-2 bg-yellow-300 border-4 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">→</kbd>
            <span>Next frame</span>
          </div>
          <div className="flex gap-3 items-center">
            <kbd className="px-3 py-2 bg-yellow-300 border-4 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Space</kbd>
            <span>Play/Pause</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
