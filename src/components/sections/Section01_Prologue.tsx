import {motion} from "framer-motion";
import {Typewriter} from "../shared/Typewriter";
import {CodeBlock} from "../shared/CodeBlock";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {AnimatedSequence} from "../shared/AnimatedNumber";
import {usePage} from "../../contexts/PageContext";
import {PageBlock} from "../shared/PageBlock";
import {useRef, useCallback} from "react";

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

export default function Section01_Prologue() {
  const {advancePage} = usePage();
  const typewriterCompleted = useRef(false);

  const handleTypingComplete = useCallback(() => {
    if (typewriterCompleted.current) return;
    typewriterCompleted.current = true;
    advancePage();
  }, [advancePage]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-20 relative overflow-hidden">
      {/* Phase 0+: Title */}
      <PageBlock page="101">
        <motion.h1
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94]}}
          className="text-4xl md:text-6xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
        >
          2026年某个周末
        </motion.h1>
      </PageBlock>

      {/* Phase 1+: Typewriter narrative */}
      <PageBlock page="102">
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
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
      </PageBlock>

      {/* Phase 2+: Code block */}
      <PageBlock page="103">
        <motion.div
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
      </PageBlock>

      {/* Phase 2+: Architecture diagram (staggered after code) */}
      <PageBlock page="103">
        <motion.div
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
      </PageBlock>

      {/* Phase 2+: "毕竟能有多少人用呢？" (staggered last) */}
      <PageBlock page="103">
        <motion.p
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 1.2, ease: "easeOut"}}
          className="text-xl md:text-2xl text-gray-400 mt-6 font-sans italic tracking-wide"
        >
          毕竟能有多少人用呢？
        </motion.p>
      </PageBlock>

      {/* Phase 4+: User count explosion */}
      <PageBlock page="105">
        <motion.div
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
      </PageBlock>

      {/* Phase 5: Fade-to-next gradient overlay at bottom */}
      <PageBlock page="106">
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1.2, ease: "easeOut"}}
          className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"
        />
      </PageBlock>
    </section>
  );
}
