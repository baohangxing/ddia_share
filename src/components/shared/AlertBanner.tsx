import { motion } from 'framer-motion';

interface AlertBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  delay?: number;
}

export function AlertBanner({ message, type = 'error', delay = 0 }: AlertBannerProps) {
  const colors = {
    error: { bg: '#7f1d1d44', border: '#ef4444', text: '#f87171', icon: '🚨' },
    warning: { bg: '#78350f44', border: '#f59e0b', text: '#fbbf24', icon: '⚠️' },
    info: { bg: '#1e3a5f44', border: '#3b82f6', text: '#60a5fa', icon: 'ℹ️' },
  };

  const c = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true, margin: '-50px' }}
      className="my-4 p-4 rounded-lg text-center"
      style={{ background: c.bg, border: `1px solid ${c.border}44` }}
    >
      <motion.span
        className="text-3xl block mb-2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {c.icon}
      </motion.span>
      <p className="font-bold" style={{ color: c.text }}>{message}</p>
    </motion.div>
  );
}
