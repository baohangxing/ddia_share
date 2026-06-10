import {motion} from "framer-motion";

interface NavigationProps {
  sections: string[];
  currentSection: number;
  onNavigate: (index: number) => void;
}

export function Navigation({
  sections,
  currentSection,
  onNavigate,
}: NavigationProps) {
  return (
    <motion.nav
      initial={{y: -60}}
      animate={{y: 0}}
      transition={{duration: 0.5, delay: 1}}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505cc] backdrop-blur-md border-b border-[#1a1a1a]"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-mono text-[#555]">
          数据密集型应用系统设计分享 bhx 2026.6.10
        </span>
        <div className="flex gap-1 overflow-x-auto">
          {sections.map((label, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`text-xs px-2 py-1 rounded transition-colors whitespace-nowrap ${
                i === currentSection
                  ? "bg-[#3b82f622] text-[#60a5fa]"
                  : "text-[#555] hover:text-[#aaa]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-[#555]">
          {currentSection + 1} / {sections.length}
        </span>
      </div>
    </motion.nav>
  );
}
