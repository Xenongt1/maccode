import { useEffect } from 'react';

interface KeyboardControlsProps {
  onStepForward: () => void;
  onStepBackward: () => void;
  onPlayPause: () => void;
  enabled: boolean;
}

export const useKeyboardControls = ({
  onStepForward,
  onStepBackward,
  onPlayPause,
  enabled
}: KeyboardControlsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          onStepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onStepBackward();
          break;
        case ' ':
          event.preventDefault();
          onPlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, onStepForward, onStepBackward, onPlayPause]);
};
