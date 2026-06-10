import {motion} from "framer-motion";

interface ChapterBadgeProps {
  chapter: number;
  title: string;
  delay?: number;
}

export function ChapterBadge({chapter, title, delay = 0}: ChapterBadgeProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay}}
      viewport={{once: true, margin: "-50px"}}
      className="my-6 text-center"
    >
      <motion.div
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#3b82f633] bg-[#3b82f610]"
        animate={{
          boxShadow: [
            "0 0 0px #3b82f600",
            "0 0 20px #3b82f622",
            "0 0 0px #3b82f600",
          ],
        }}
        transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
      >
        <span className="text-xs font-mono text-[#60a5fa]">
          DDIA 第{chapter}章
        </span>
        <span className="text-xs text-[#aaa]">|</span>
        <span className="text-sm font-semibold text-white">{title}</span>
      </motion.div>
    </motion.div>
  );
}
