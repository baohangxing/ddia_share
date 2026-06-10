import { useState, useEffect, useCallback } from 'react';

export function usePresentationMode() {
  const [isPresentation, setIsPresentation] = useState(false);

  const togglePresentation = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsPresentation(true);
      } catch {
        // Fullscreen not supported
      }
    } else {
      await document.exitFullscreen();
      setIsPresentation(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPresentation(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isPresentation) {
      document.body.classList.add('presentation-mode');
    } else {
      document.body.classList.remove('presentation-mode');
    }
  }, [isPresentation]);

  return { isPresentation, togglePresentation };
}
