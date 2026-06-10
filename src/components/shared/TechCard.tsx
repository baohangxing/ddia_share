import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface TechCardProps {
  title: string;
  concept: string;
  description: string;
  items?: { label: string; content: string; highlight?: boolean }[];
  delay?: number;
  index?: number;
}

export function TechCard({ title, concept, description, items, delay = 0, index = 0 }: TechCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay + index * 0.15 }}
      viewport={{ once: true, margin: '-50px' }}
      className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 my-4 hover:border-[#3b82f644] transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className="text-xs text-[#3b82f6] font-mono uppercase tracking-wider mb-1 block">
            {concept}
          </span>
          <h4 className="text-base font-semibold text-white mb-2">{title}</h4>
          <p className="text-sm text-[#aaa] leading-relaxed">{description}</p>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-[#555] text-lg mt-1 shrink-0"
        >
          ▾
        </motion.span>
      </div>

      <AnimatePresence>
        {expanded && items && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[#1a1a1a] space-y-3">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-3 rounded-lg ${item.highlight ? 'bg-[#3b82f610] border border-[#3b82f633]' : 'bg-[#111]'}`}
                >
                  <div className={`text-xs font-semibold mb-1 ${item.highlight ? 'text-[#3b82f6]' : 'text-[#ddd]'}`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-[#999] leading-relaxed">{item.content}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
