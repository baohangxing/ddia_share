import {motion} from "framer-motion";
import {useState} from "react";

interface HomePageProps {
  onEnter: () => void;
}

export default function HomePage({onEnter}: HomePageProps) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] cursor-pointer select-none"
      onClick={handleEnter}
      animate={exiting ? {opacity: 0, scale: 1.05} : {opacity: 1}}
      transition={{duration: 0.5, ease: "easeInOut"}}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"
        initial={{scaleX: 0}}
        animate={{scaleX: 1}}
        transition={{duration: 1.2, delay: 0.3}}
      />

      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center tracking-wider leading-relaxed px-4"
        initial={{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 0.2}}
      >
        <span className="bg-gradient-to-r from-[#f5f5f5] via-[#e5e5e5] to-[#a0a0a0] bg-clip-text text-transparent">
          《数据密集型应用系统设计》
        </span>
        <span className="text-2xl md:text-3xl lg:text-4xl text-[#60a5fa]">
          分享
        </span>
      </motion.h1>

      <motion.div
        className="w-16 h-[1px] bg-[#333] my-8"
        initial={{scaleX: 0}}
        animate={{scaleX: 1}}
        transition={{duration: 0.6, delay: 0.6}}
      />

      <motion.div
        className="flex flex-col items-center gap-1 text-[#b8b6b6]"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.8}}
      >
        <span className="text-lg font-light">bhx</span>
        <span className="text-sm tracking-wider font-light">2026.6.10</span>
      </motion.div>

      <motion.div
        className="absolute bottom-12 flex flex-col items-center gap-2"
        initial={{opacity: 0}}
        animate={{opacity: [0.3, 1, 0.3]}}
        transition={{duration: 2, delay: 1.5, repeat: Infinity}}
      >
        <span className="text-xs text-[#444] tracking-widest">
          点击任意位置进入
        </span>
        <motion.div
          className="w-4 h-4 border-r-2 border-b-2 border-[#444] rotate-45"
          animate={{y: [0, 4, 0]}}
          transition={{duration: 1.5, repeat: Infinity}}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"
        initial={{scaleX: 0}}
        animate={{scaleX: 1}}
        transition={{duration: 1.2, delay: 0.3}}
      />
    </motion.div>
  );
}
