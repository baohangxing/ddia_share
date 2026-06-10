import { useState, useEffect, useRef } from 'react';

interface ScrollProgress {
  scrollY: number;
  windowHeight: number;
  documentHeight: number;
  progress: number; // 0-100
  currentSection: number;
}

export function useScrollProgress(sectionCount: number): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    scrollY: 0,
    windowHeight: 0,
    documentHeight: 0,
    progress: 0,
    currentSection: 0,
  });

  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const progress = Math.min(100, (scrollY / (documentHeight - windowHeight)) * 100);
          const sectionHeight = documentHeight / sectionCount;
          const currentSection = Math.min(sectionCount - 1, Math.floor(scrollY / sectionHeight));

          setState({
            scrollY,
            windowHeight,
            documentHeight,
            progress,
            currentSection,
          });

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionCount]);

  return state;
}

export function useElementVisibility(ref: React.RefObject<HTMLElement | null>, threshold = 0.2) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { isVisible, hasBeenVisible };
}
