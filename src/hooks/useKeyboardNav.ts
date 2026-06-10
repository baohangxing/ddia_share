import { useState, useEffect, useCallback } from 'react';

export function useKeyboardNav(sectionCount: number, onSectionChange?: (index: number) => void) {
  const [enabled, setEnabled] = useState(false);

  const navigateToSection = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(sectionCount - 1, index));
      const sectionEl = document.getElementById(`section-${clamped}`);
      if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth' });
      onSectionChange?.(clamped);
    },
    [sectionCount, onSectionChange],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabled) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          {
            const current = Math.floor(window.scrollY / (document.documentElement.scrollHeight / sectionCount));
            // Backward: just scroll, don't change section state
            const prev = Math.max(0, current - 1);
            const sectionEl = document.getElementById(`section-${prev}`);
            if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          {
            const current = Math.floor(window.scrollY / (document.documentElement.scrollHeight / sectionCount));
            navigateToSection(current + 1);
          }
          break;
        case 'Escape':
          setEnabled(false);
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setEnabled(prev => !prev);
          }
          break;
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
          {
            const num = parseInt(e.key);
            if (num >= 0 && num < sectionCount) {
              e.preventDefault();
              navigateToSection(num);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, sectionCount, navigateToSection]);

  return { enabled, setEnabled, navigateToSection };
}