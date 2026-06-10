import {motion} from "framer-motion";

interface AppShellProps {
  children: React.ReactNode;
  progress: number;
}

export function AppShell({children, progress}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] relative">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-[#3b82f6] z-50"
        style={{width: `${Math.min(100, progress)}%`}}
        transition={{duration: 0.1}}
      />

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="py-12 text-center text-xs text-[#333]">
        <p>《我只是想做个简单的微博，为什么最后学会了 DDIA》 © 2026</p>
      </footer>
    </div>
  );
}
