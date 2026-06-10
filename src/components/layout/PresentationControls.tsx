import { motion } from 'framer-motion';

interface PresentationControlsProps {
  isPresentation: boolean;
  onToggle: () => void;
}

export function PresentationControls({ isPresentation, onToggle }: PresentationControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-6 right-6 z-50 flex gap-2"
    >
      <button
        onClick={onToggle}
        className="px-3 py-2 text-xs rounded-lg bg-[#ffffff11] hover:bg-[#ffffff22] text-[#888] hover:text-white transition-all border border-[#333]"
        title="按 F 键进入演讲模式"
      >
        {isPresentation ? '退出全屏' : '▶ 演讲模式'}
      </button>
    </motion.div>
  );
}
