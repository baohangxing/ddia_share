import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, speed = 60, delay = 0, className = '', onComplete }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    setDisplayedText('');
    completedRef.current = false;

    const startTimeout = setTimeout(() => {
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
        }
      }, speed);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <motion.span
      className={`font-mono text-2xl md:text-4xl ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayedText}
      <span
        className="ml-1 text-primary animate-pulse"
        style={{ opacity: showCursor ? 1 : 0 }}
      >
        ▌
      </span>
    </motion.span>
  );
}
