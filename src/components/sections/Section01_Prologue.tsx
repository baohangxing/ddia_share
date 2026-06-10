import {motion, AnimatePresence} from "framer-motion";
import {Typewriter} from "../shared/Typewriter";
import {CodeBlock} from "../shared/CodeBlock";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {AnimatedSequence} from "../shared/AnimatedNumber";
import {useSectionPlayMode, useSectionVisibility} from "../../contexts/SectionVisibilityContext";
import {useState, useRef, useEffect, useCallback} from "react";

const NARRATIVE =
  "\u2615 咖啡 + Cursor, 我写下了提示词：\n万能的ai,请给我写一个简单的微博。";

const ARCH_NODES = [
  {id: "user", label: "User", x: 250, y: 30, color: "primary" as const},
  {id: "nodejs", label: "Node.js", x: 250, y: 110, color: "default" as const},
  {id: "mysql", label: "MySQL", x: 250, y: 190, color: "default" as const},
];

const ARCH_ARROWS = [
  {from: "user", to: "nodejs", animated: true},
  {from: "nodejs", to: "mysql", animated: true},
];

const USER_COUNTS = [1, 10, 100, 1000, 10000, 100000];
const SECTION_INDEX = 0;

export default function Section01_Prologue() {
  const sectionRef = useRef<HTMLElement>(null);
  const playMode = useSectionPlayMode(SECTION_INDEX);
  const { markComplete } = useSectionVisibility();
  const [phase, setPhase] = useState(-1);
  const typewriterCompleted = useRef(false);
  const hasStarted = useRef(false);
  const skipActive = useRef(false);

  // Kick off the sequence when playMode becomes 'play'
  useEffect(() => {
    if (playMode === 'play' && !hasStarted.current) {
      hasStarted.current = true;
      setPhase(0);
    }
  }, [playMode]);

  // When in skip mode, show everything immediately and block further transitions
  useEffect(() => {
    if (playMode === 'skip') {
      skipActive.current = true;
      setPhase(5);
      markComplete(SECTION_INDEX);
    }
  }, [playMode, markComplete]);

  // Phase 0 → 1: title fade-in, then typewriter
  useEffect(() => {
    if (skipActive.current || phase !== 0) return;
    const t = setTimeout(() => setPhase(1), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  // After typewriter completes → phase 2: code + architecture + thought
  const handleTypingComplete = useCallback(() => {
    if (typewriterCompleted.current) return;
    typewriterCompleted.current = true;
    setPhase(2);
  }, []);

  // Phase 2 → 3: show content, then pause
  // Phase 3 → 4: 3-second pause, then user growth
  // Phase 4 → 5: growth animation, then complete
  useEffect(() => {
    if (skipActive.current) return;
    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 4000);
      return () => clearTimeout(t);
    }
    if (phase === 3) {
      const t = setTimeout(() => setPhase(4), 3000);
      return () => clearTimeout(t);
    }
    if (phase === 4) {
      const t = setTimeout(() => setPhase(5), 4500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Fallback: if typewriter doesn't complete within 8s, force next phase
  useEffect(() => {
    if (skipActive.current || phase !== 1) return;
    const fallback = setTimeout(() => {
      if (!typewriterCompleted.current) {
        typewriterCompleted.current = true;
        setPhase(2);
      }
    }, 8000);
    return () => clearTimeout(fallback);
  }, [phase]);

  // Notify context when animation completes
  useEffect(() => {
    if (phase === 5) {
      markComplete(SECTION_INDEX);
    }
  }, [phase, markComplete]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-20 relative overflow-hidden"
    >
      {/* Phase 0+: Title */}
      <AnimatePresence>
        {phase >= 0 && (
          <motion.h1
            key="title"
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94]}}
            className="text-4xl md:text-6xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
          >
            2026年某个周末
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Phase 1+: Typewriter narrative */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key="typewriter"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.4}}
            className="mb-6 text-center"
          >
            <Typewriter
              text={NARRATIVE}
              speed={55}
              onComplete={handleTypingComplete}
              className="text-xl md:text-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2+: Code block */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="code"
            initial={{opacity: 0, y: 24, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            transition={{duration: 0.5, ease: "easeOut"}}
            className="w-full max-w-md"
          >
            <CodeBlock
              code={`ai: 正在生成代码...
...
const express = require('express');
const app = express();
app.get('/weibo', (req, res) => {
  res.send('这是一个简单的微博。');
});
app.listen(3000, () => console.log('Server running on port 3000'));
...`}
              language="ts"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2+: Architecture diagram (staggered after code) */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="arch"
            initial={{opacity: 0, y: 24}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.6, ease: "easeOut"}}
            className="w-full"
          >
            <ArchitectureDiagram
              nodes={ARCH_NODES}
              arrows={ARCH_ARROWS}
              width={500}
              height={240}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2+: "毕竟能有多少人用呢？" (staggered last) */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.p
            key="thought"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 1.2, ease: "easeOut"}}
            className="text-xl md:text-2xl text-gray-400 mt-6 font-sans italic tracking-wide"
          >
            毕竟能有多少人用呢？
          </motion.p>
        )}
      </AnimatePresence>

      {/* Phase 4+: User count explosion */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            key="growth"
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.5, ease: "easeOut"}}
            className="mt-14 text-center"
          >
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
              className="text-lg text-gray-500 mb-4 tracking-widest uppercase"
            >
              用户数
            </motion.p>
            <AnimatedSequence
              values={USER_COUNTS}
              duration={3}
              className="text-6xl md:text-8xl font-bold text-blue-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 5: Fade-to-next gradient overlay at bottom */}
      <AnimatePresence>
        {phase >= 5 && (
          <motion.div
            key="fadeout"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1.2, ease: "easeOut"}}
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
