import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useSectionPlayMode} from "../../contexts/SectionVisibilityContext";
import {ddiaChapters} from "../../data/ddiaContent";
import {CodeBlock} from "../shared/CodeBlock";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {ChapterBadge} from "../shared/ChapterBadge";
import {TechCard} from "../shared/TechCard";
import {AlertBanner} from "../shared/AlertBanner";
import {AnimatedNumber} from "../shared/AnimatedNumber";
import {Typewriter} from "../shared/Typewriter";

const chapter5 = ddiaChapters[1]; // DDIA Chapter 5 - Replication

// --- Sub-components ---

function OverflowDiagram() {
  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      viewport={{once: true, margin: "-50px"}}
      className="flex flex-col items-center my-8"
    >
      <ArchitectureDiagram
        nodes={[
          {
            id: "user",
            label: "👤 用户",
            x: 80,
            y: 100,
            width: 90,
            height: 44,
            color: "default",
            shape: "rect",
          },
          {
            id: "mysql",
            label: "MySQL\nCPU 100% 🔴",
            x: 280,
            y: 100,
            width: 110,
            height: 55,
            color: "danger",
            shape: "rect",
          },
        ]}
        arrows={[
          {
            from: "user",
            to: "mysql",
            label: "Read/Write",
            animated: true,
            color: "#ef4444",
          },
        ]}
        width={400}
        height={200}
      />
      <motion.p
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{delay: 0.8}}
        viewport={{once: true}}
        className="text-sm text-[#f87171] mt-2 font-mono"
      >
        读写全压在单机上，CPU 100% 🔥
      </motion.p>
    </motion.div>
  );
}

function LeaderReplicaDiagram() {
  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      viewport={{once: true, margin: "-50px"}}
      className="flex flex-col items-center my-8"
    >
      <ArchitectureDiagram
        nodes={[
          {
            id: "user",
            label: "👤 用户",
            x: 60,
            y: 70,
            width: 80,
            height: 40,
            color: "default",
            shape: "rect",
          },
          {
            id: "leader",
            label: "Leader\n(读写)",
            x: 230,
            y: 30,
            width: 90,
            height: 50,
            color: "primary",
            shape: "rect",
          },
          {
            id: "replica",
            label: "Replica\n(只读)",
            x: 230,
            y: 140,
            width: 90,
            height: 50,
            color: "success",
            shape: "rect",
          },
        ]}
        arrows={[
          {
            from: "user",
            to: "leader",
            label: "Write ✍️",
            animated: false,
            color: "#3b82f6",
          },
          {
            from: "leader",
            to: "replica",
            label: "binlog 📦",
            animated: true,
            color: "#f59e0b",
          },
          {from: "user", to: "replica", label: "Read 👀", color: "#22c55e"},
        ]}
        width={380}
        height={200}
      />
    </motion.div>
  );
}

function ReplicationLagAnimation() {
  const [phase, setPhase] = useState<"syncing" | "done">("syncing");
  const playMode = useSectionPlayMode(2);

  useEffect(() => {
    if (playMode === 'play') {
      const timer = setTimeout(() => setPhase("done"), 3500);
      return () => clearTimeout(timer);
    }
    if (playMode === 'skip') {
      setPhase("done");
    }
  }, [playMode]);

  return (
    <div className="my-6">
      <AnimatePresence mode="wait">
        {phase === "syncing" && (
          <motion.div
            key="syncing"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="flex flex-col items-center gap-4"
          >
            <AlertBanner
              message="Tweet Not Found — Replica 还在同步 binlog..."
              type="error"
            />

            {/* Binlog sync animation */}
            <div className="flex items-center gap-6 my-4">
              <div className="flex flex-col items-center">
                <div className="px-4 py-2 rounded-lg bg-[#1a3a5c] border border-[#3b82f6] text-sm text-[#60a5fa] font-mono">
                  Leader
                </div>
                <span className="text-xs text-[#888] mt-1">已写入 ✅</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <motion.div
                  className="flex gap-1"
                  animate={{opacity: [0.3, 1, 0.3]}}
                  transition={{duration: 1.5, repeat: Infinity}}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#f59e0b]"
                      animate={{
                        x: [0, 30, 0],
                        opacity: [0.2, 1, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
                <span className="text-[10px] text-[#f59e0b] font-mono mt-1">
                  binlog 同步中...
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="px-4 py-2 rounded-lg bg-[#1a3a1a] border border-[#22c55e66] text-sm text-[#4ade80] font-mono opacity-50">
                  Replica
                </div>
                <span className="text-xs text-[#888] mt-1">同步中 ⏳</span>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.5}}
            className="flex flex-col items-center gap-4"
          >
            <AlertBanner
              message="Tweet Found! — Replica 同步完成 ✅"
              type="info"
            />

            <div className="flex items-center gap-6 my-4">
              <div className="flex flex-col items-center">
                <div className="px-4 py-2 rounded-lg bg-[#1a3a5c] border border-[#3b82f6] text-sm text-[#60a5fa] font-mono">
                  Leader
                </div>
                <span className="text-xs text-[#4ade80] mt-1">已写入 ✅</span>
              </div>

              <motion.div
                className="text-[#22c55e] text-2xl"
                animate={{scale: [1, 1.4, 1]}}
                transition={{duration: 1}}
              >
                ⟶
              </motion.div>

              <div className="flex flex-col items-center">
                <motion.div
                  className="px-4 py-2 rounded-lg bg-[#1a3a1a] border border-[#22c55e] text-sm text-[#4ade80] font-mono"
                  initial={{borderColor: "#22c55e44"}}
                  animate={{borderColor: "#22c55e"}}
                  transition={{duration: 0.5}}
                >
                  Replica
                </motion.div>
                <span className="text-xs text-[#4ade80] mt-1">已同步 ✅</span>
              </div>
            </div>

            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.4}}
              className="bg-[#111] border border-[#2a2a2a] rounded-lg p-3 text-center max-w-md"
            >
              <span className="text-xs text-[#888]">🕐 复制滞后: ~2.3s</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Section ---

export default function Section03_Replication() {
  const SECTION_INDEX = 2;
  const playMode = useSectionPlayMode(SECTION_INDEX);

  const contentVisible = playMode !== 'hidden';

  return (
    <section className="min-h-screen relative bg-[#050505] py-16 px-6 md:px-16 overflow-hidden" style={{ opacity: contentVisible ? 1 : 0, pointerEvents: contentVisible ? 'auto' : 'none', transition: 'opacity 0.5s' }}>
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* --- 1. Title: 用户突破100万 --- */}
        <motion.div
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            用户突破{" "}
            <AnimatedNumber
              value={1000000}
              duration={2}
              suffix=" 人"
              color="#60a5fa"
              className="text-4xl md:text-6xl"
            />
          </h2>
          <p className="text-[#888] text-lg mt-3">
            你的推文应用突然火了。单台 MySQL 撑不住了。
          </p>
        </motion.div>

        {/* --- 2. Architecture: User → MySQL CPU 100% --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.3}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-6">
            🏗️ 当前架构
          </h3>
          <OverflowDiagram />
        </motion.div>

        {/* --- 3. "那我再买一台服务器。" --- */}
        <motion.div
          initial={{opacity: 0, x: -40}}
          whileInView={{opacity: 1, x: 0}}
          transition={{duration: 0.6}}
          viewport={{once: true, margin: "-50px"}}
          className="text-center my-16"
        >
          <Typewriter
            text="那我再买一台服务器。"
            speed={80}
            delay={0.3}
            className="text-white"
          />
          <motion.p
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{delay: 1.2}}
            viewport={{once: true}}
            className="text-[#60a5fa] mt-4 text-sm font-mono"
          >
            听起来简单。但数据怎么办？
          </motion.p>
        </motion.div>

        {/* --- 4. Leader → Replica Architecture --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            🏗️ 主从复制架构
          </h3>
          <p className="text-sm text-[#888] text-center mb-4">
            Leader 处理写入，Replica 通过 binlog 同步，只读查询分担到 Replica
          </p>
          <LeaderReplicaDiagram />
        </motion.div>

        {/* --- 5. Code: POST /tweet → Leader, GET /timeline → Replica --- */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-6">
            💻 应用层改造
          </h3>

          <CodeBlock
            code={`// 写入 → Leader
const tweet = await db.leader.tweets.create({
  data: { content: "Hello DDIA", userId: 42 }
});

// 读取 → Replica
const timeline = await db.replica.timeline.findMany({
  where: { userId: 42 },
  orderBy: { createdAt: 'desc' }
});`}
            language="ts"
            delay={0.2}
          />

          <motion.p
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{delay: 0.8}}
            viewport={{once: true}}
            className="text-sm text-[#888] text-center mt-4"
          >
            写走 Leader，读走 Replica — 读写分离
          </motion.p>
        </motion.div>

        {/* --- 6. User posts "Hello DDIA", refreshes immediately --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-6">
            🧪 真实场景模拟
          </h3>
          <p className="text-sm text-[#aaa] text-center mb-4">
            用户刚发了一条「Hello DDIA」→ 立刻刷新看时间线 →
          </p>

          <ReplicationLagAnimation />
        </motion.div>

        {/* --- 7. Replication Lag: Strong vs Eventual Consistency --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            📖 复制滞后：强一致 vs 最终一致
          </h3>
          <p className="text-sm text-[#888] text-center mb-8">
            这就是异步复制的代价 — 数据最终会一致，但不是立刻
          </p>

          {/* TechCards from DDIA Chapter 5 */}
          {chapter5.cards.slice(0, 2).map((card, i) => (
            <TechCard
              key={i}
              title={card.title}
              concept={card.concept}
              description={card.description}
              items={card.items?.map((item) => ({
                label: item.label,
                content: item.content,
                highlight: item.highlight,
              }))}
              delay={0.2}
              index={i}
            />
          ))}
        </motion.div>

        {/* --- 8. Replication Lag Anomalies --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            ⚠️ 复制滞后三大异常
          </h3>
          <p className="text-sm text-[#888] text-center mb-8">
            刚才经历的就是 Read-After-Write Consistency 问题
          </p>

          {/* Replication lag anomalies card */}
          {chapter5.cards.slice(2, 3).map((card, i) => (
            <TechCard
              key={i}
              title={card.title}
              concept={card.concept}
              description={card.description}
              items={card.items?.map((item) => ({
                label: item.label,
                content: item.content,
                highlight: item.highlight,
              }))}
              delay={0.2}
              index={i}
            />
          ))}
        </motion.div>

        {/* --- 9. Multi-leader & Quorum --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white text-center mb-8">
            🔧 进阶复制模式
          </h3>

          {chapter5.cards.slice(3).map((card, i) => (
            <TechCard
              key={i}
              title={card.title}
              concept={card.concept}
              description={card.description}
              items={card.items?.map((item) => ({
                label: item.label,
                content: item.content,
                highlight: item.highlight,
              }))}
              delay={0.2}
              index={i}
            />
          ))}
        </motion.div>

        {/* --- 10. ChapterBadge --- */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.3}}
          viewport={{once: true, margin: "-50px"}}
          className="mb-8"
        >
          <ChapterBadge
            chapter={chapter5.chapter}
            title={chapter5.chapterTitle}
          />
        </motion.div>

        {/* Summary line */}
        <motion.p
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.5}}
          viewport={{once: true, margin: "-50px"}}
          className="text-center text-[#aaa] italic text-sm mt-8"
        >
          「{chapter5.summary}」
        </motion.p>
      </div>
    </section>
  );
}
