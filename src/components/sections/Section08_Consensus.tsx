import {motion, AnimatePresence} from "framer-motion";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {ChapterBadge} from "../shared/ChapterBadge";
import {TechCard} from "../shared/TechCard";
import {AlertBanner} from "../shared/AlertBanner";
import {AnimatedNumber} from "../shared/AnimatedNumber";
import {ddiaChapters} from "../../data/ddiaContent";
import {PageBlock} from "../shared/PageBlock";

const chapter = ddiaChapters[5];

const raceNodes = [
  {id: "user-a", label: "👤 User A", x: 60, y: 40, width: 90, height: 36, color: "primary" as const},
  {id: "user-b", label: "👤 User B", x: 60, y: 140, width: 90, height: 36, color: "warning" as const},
  {id: "node-a", label: "Node A\n库存=1", x: 240, y: 40, width: 90, height: 50, color: "primary" as const},
  {id: "node-b", label: "Node B\n库存=1", x: 240, y: 140, width: 90, height: 50, color: "warning" as const},
  {id: "stock", label: "实际库存: 1", x: 420, y: 90, width: 110, height: 36, color: "default" as const},
];

const raceArrows = [
  {from: "user-a", to: "node-a", animated: true, label: "抢购!"},
  {from: "user-b", to: "node-b", animated: true, label: "抢购!"},
  {from: "node-a", to: "stock", animated: false, label: "扣减"},
  {from: "node-b", to: "stock", animated: false, label: "扣减"},
];

const raftElectionNodes = [
  {id: "candidate", label: "Candidate\n(发起选举)", x: 60, y: 80, width: 100, height: 50, color: "primary" as const},
  {id: "f1", label: "Follower 1", x: 220, y: 30, width: 80, height: 36, color: "default" as const},
  {id: "f2", label: "Follower 2", x: 220, y: 90, width: 80, height: 36, color: "default" as const},
  {id: "f3", label: "Follower 3", x: 220, y: 150, width: 80, height: 36, color: "default" as const},
  {id: "leader-badge", label: "👑 Leader", x: 400, y: 80, width: 90, height: 40, color: "success" as const},
];

const raftElectionArrows = [
  {from: "candidate", to: "f1", animated: true, label: "RequestVote"},
  {from: "candidate", to: "f2", animated: true, label: "RequestVote"},
  {from: "candidate", to: "f3", animated: true, label: "RequestVote"},
  {from: "f1", to: "leader-badge", animated: false, label: "✅"},
  {from: "f2", to: "leader-badge", animated: false, label: "✅"},
  {from: "f3", to: "leader-badge", animated: false, label: "❌"},
];

const logReplicationNodes = [
  {id: "leader", label: "👑 Leader", x: 60, y: 80, width: 90, height: 40, color: "success" as const},
  {id: "flr1", label: "Follower A", x: 240, y: 30, width: 80, height: 36, color: "default" as const},
  {id: "flr2", label: "Follower B", x: 240, y: 90, width: 80, height: 36, color: "default" as const},
  {id: "flr3", label: "Follower C", x: 240, y: 150, width: 80, height: 36, color: "default" as const},
  {id: "committed", label: "✅ Committed", x: 420, y: 80, width: 100, height: 40, color: "success" as const},
];

const logReplicationArrows = [
  {from: "leader", to: "flr1", animated: true, label: "AppendEntries"},
  {from: "leader", to: "flr2", animated: true, label: "AppendEntries"},
  {from: "leader", to: "flr3", animated: true, label: "AppendEntries"},
  {from: "flr1", to: "committed", animated: false, label: "✅"},
  {from: "flr2", to: "committed", animated: false, label: "✅"},
];

function InventoryCounter({remaining, animateCrash}: {remaining: number; animateCrash: boolean}) {
  return (
    <motion.div
      initial={{opacity: 0, scale: 0.9}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.5}}
      className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 text-center"
    >
      <p className="text-sm text-[#888] font-mono mb-3">📦 库存剩余</p>
      <motion.div
        animate={animateCrash ? {scale: [1, 1.3, 0.8, 1.1, 0.9, 1]} : {}}
        transition={{duration: 0.6}}
      >
        <AnimatedNumber
          value={remaining}
          duration={1}
          color={remaining <= 0 ? "#ef4444" : "#22c55e"}
          className="text-5xl"
        />
        <span className="text-lg text-[#888] ml-1">件</span>
      </motion.div>
    </motion.div>
  );
}

function BossTitle() {
  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="text-center mb-8"
    >
      <motion.div
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ef444433] bg-[#ef444410] mb-4"
        animate={{boxShadow: ["0 0 5px #ef444400", "0 0 25px #ef444444", "0 0 5px #ef444400"]}}
        transition={{duration: 2, repeat: Infinity}}
      >
        <span className="text-lg">👹</span>
        <span className="text-xs font-mono text-[#f87171] uppercase tracking-widest">Final Boss</span>
      </motion.div>
      <h2 className="text-3xl font-bold text-white">
        最后的
        <motion.span
          className="text-[#f87171] ml-2"
          animate={{textShadow: ["0 0 0px #ef444400", "0 0 20px #ef444488", "0 0 0px #ef444400"]}}
          transition={{duration: 2, repeat: Infinity}}
        >
          大Boss
        </motion.span>
      </h2>
      <p className="text-sm text-[#666] mt-3 font-mono">
        当所有单个节点都工作正常，整个系统却崩了
      </p>
    </motion.div>
  );
}

export default function Section08_Consensus() {
  return (
    <section className="min-h-screen relative bg-[#050505] py-16 px-4">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <PageBlock page="801">
          <BossTitle />
        </PageBlock>

        <PageBlock page="802">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="mb-8"
          >
            <InventoryCounter remaining={1} animateCrash={false} />
          </motion.div>
        </PageBlock>

        <PageBlock page="803">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="my-8"
          >
            <p className="text-sm text-[#f59e0b] text-center mb-4 font-mono">
              ⚡ 双11零点 — User A 和 User B 同时抢购
            </p>
            <ArchitectureDiagram
              nodes={raceNodes}
              arrows={raceArrows}
              width={540}
              height={200}
              delay={0.2}
            />
            <p className="text-xs text-[#666] text-center mt-3 font-mono">
              两个节点各自检查库存 → 都看到 1 件 → 都允许下单
            </p>
          </motion.div>
        </PageBlock>

        <PageBlock page="804">
          <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.5, type: "spring"}}
          >
            <AlertBanner
              message="超卖了！2 件售出，库存仅 1 件！每个节点都「正确」但系统整体错了。"
              type="error"
              delay={0.1}
            />
            <motion.div
              className="text-center mt-2"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.6}}
            >
              <span className="text-xs font-mono text-[#f87171] bg-[#ef444415] px-3 py-1 rounded-full">
                ⚠️ Oversold: 分布式一致性问题
              </span>
            </motion.div>
          </motion.div>
        </PageBlock>

        <PageBlock page="805">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="my-8 text-center"
          >
            <motion.p
              className="text-xl font-bold text-white mb-2"
              animate={{opacity: [0.6, 1, 0.6]}}
              transition={{duration: 3, repeat: Infinity}}
            >
              🤔 为什么每个节点都正确，结果却错了？
            </motion.p>
            <p className="text-sm text-[#888] font-mono">
              答案：缺乏 <span className="text-[#60a5fa]">共识（Consensus）</span>
            </p>
          </motion.div>
        </PageBlock>

        <PageBlock page="806">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="my-10"
          >
            <div className="text-center mb-4">
              <span className="text-xs font-mono text-[#60a5fa] bg-[#3b82f615] px-3 py-1 rounded-full">
                Raft 共识算法
              </span>
              <h3 className="text-lg font-semibold text-white mt-2">
                Phase 1: Leader 选举（Leader Election）
              </h3>
            </div>

            <ArchitectureDiagram
              nodes={raftElectionNodes}
              arrows={raftElectionArrows}
              width={520}
              height={200}
              delay={0.2}
            />

            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
              className="mt-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4"
            >
              <div className="flex gap-2 flex-wrap text-xs font-mono">
                <span className="text-[#60a5fa]">① 超时 150-300ms</span>
                <span className="text-[#555]">→</span>
                <span className="text-[#f59e0b]">② 变 Candidate, Term++</span>
                <span className="text-[#555]">→</span>
                <span className="text-[#60a5fa]">③ RequestVote RPC</span>
                <span className="text-[#555]">→</span>
                <span className="text-[#4ade80]">④ 多数派 → Leader</span>
              </div>
            </motion.div>
          </motion.div>
        </PageBlock>

        <PageBlock page="807">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="my-10"
          >
            <div className="text-center mb-4">
              <span className="text-xs font-mono text-[#60a5fa] bg-[#3b82f615] px-3 py-1 rounded-full">
                Raft 共识算法
              </span>
              <h3 className="text-lg font-semibold text-white mt-2">
                Phase 2: 日志复制（Log Replication）
              </h3>
            </div>

            <ArchitectureDiagram
              nodes={logReplicationNodes}
              arrows={logReplicationArrows}
              width={540}
              height={200}
              delay={0.2}
            />

            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
              className="mt-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4"
            >
              <div className="flex gap-2 flex-wrap text-xs font-mono">
                <span className="text-[#60a5fa]">① 客户端→Leader</span>
                <span className="text-[#555]">→</span>
                <span className="text-[#f59e0b]">② AppendEntries RPC</span>
                <span className="text-[#555]">→</span>
                <span className="text-[#60a5fa]">③ 多数确认</span>
                <span className="text-[#555]">→</span>
                <span className="text-[#4ade80]">④ Committed → Apply</span>
              </div>
            </motion.div>
          </motion.div>
        </PageBlock>

        <PageBlock page="808">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-white text-center mb-6">
              🔍 深入理解：DDIA Chapter 9 核心概念
            </h3>
            {chapter.cards.map((card, i) => (
              <TechCard
                key={i}
                title={card.title}
                concept={card.concept}
                description={card.description}
                items={card.items}
                delay={0.3}
                index={i}
              />
            ))}
          </motion.div>
        </PageBlock>

        <PageBlock page="809">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="mt-12 mb-8"
          >
            <ChapterBadge
              chapter={chapter.chapter}
              title={chapter.chapterTitle}
              delay={0.2}
            />
            <p className="text-center text-sm text-[#666] mt-2 font-mono italic">
              &ldquo;{chapter.summary}&rdquo;
            </p>
          </motion.div>

          <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, delay: 0.8}}
            className="text-center text-xs text-[#333] mt-16 font-mono"
          >
            ↓ 恭喜通关！你已掌握分布式系统的核心挑战 ↓
          </motion.p>
        </PageBlock>
      </div>
    </section>
  );
}