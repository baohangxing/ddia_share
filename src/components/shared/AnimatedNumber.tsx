import {useState, useEffect, useRef} from "react";
import {motion, useInView} from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  format?: boolean; // Format with commas
  color?: string;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 10000) return (num / 1000).toFixed(0) + "K";
  return num.toLocaleString();
}

export function AnimatedNumber({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  format = true,
  color = "#f5f5f5",
  className = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const startValue = displayValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = startValue + (value - startValue) * eased;
      setDisplayValue(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return (
    <motion.span
      ref={ref}
      className={`font-mono font-bold tabular-nums ${className}`}
      style={{color}}
      initial={{opacity: 0}}
      animate={isInView ? {opacity: 1} : {}}
      transition={{duration: 0.3}}
    >
      {prefix}
      {format ? formatNumber(displayValue) : displayValue}
      {suffix}
    </motion.span>
  );
}

// Sequence: animates through a series of values
interface AnimatedSequenceProps {
  values: number[];
  duration?: number;
  format?: boolean;
  className?: string;
}

export function AnimatedSequence({
  values,
  duration = 3,
  format = true,
  className = "",
}: AnimatedSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  useEffect(() => {
    if (!isInView || values.length <= 1) return;

    const interval = (duration / values.length) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= values.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, values, duration]);

  return (
    <div ref={ref} className={className}>
      <AnimatedNumber
        value={values[currentIndex]}
        duration={duration / values.length}
        format={format}
      />
    </div>
  );
}
