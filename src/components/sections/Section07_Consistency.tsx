import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {ChapterBadge} from "../shared/ChapterBadge";
import {TechCard} from "../shared/TechCard";
import {AlertBanner} from "../shared/AlertBanner";
import {AnimatedNumber} from "../shared/AnimatedNumber";
import {Typewriter} from "../shared/Typewriter";
import {ddiaChapters} from "../../data/ddiaContent";
import {usePage} from "../../contexts/PageContext";
import {PageBlock} from "../shared/PageBlock";

const chapter = ddiaChapters[5];

function DatacenterDiagram() {
  const nodes = [
    {id: "shanghai", label: "上海\nShanghai", x: 100, y: 80, width: 100, height: 55, color: "primary" as const},
    {id: "beijing", label: "北京\nBeijing", x: 290, y: 80, width: 100, height: 55, color: "primary" as const},
    {id: "singapore", label: "新加坡\nSingapore", x: 480, y: 80, width: 100, height: 55, color: "primary" as const},
    {id: "globe", label: "🌍 全球用户", x: 290, y: 30, width: 80, height: 30, shape: "circle" as const, color: "default" as const},
  ];
  const arrows = [
    {from: "shanghai", to: "beijing", label: "骨干网", animated: true, color: "#3b82f6"},
    {from: "beijing", to: "singapore", label: "海底光缆", animated: true, color: "#3b82f6"},
  ];

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="my-6"
    >
      <ArchitectureDiagram
        nodes={nodes}
        arrows={arrows}
        width={600}
        height={150}
      />
      <p className="text-center text-xs text-[#60a5fa] mt-2 font-mono">
        三大数据中心，物理距离 = 网络延迟
      </p>
    </motion.div>
  );
}

function MessageFlowAnimation({showReorder}: {showReorder: boolean}) {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
      className="flex flex-col items-center my-8"
    >
      <div className="flex items-center gap-4 md:gap-8 mb-6">
        <motion.div
          className="flex flex-col items-center"
          animate={showReorder ? {x: [0, 180, 180]} : {}}
          transition={{duration: 1.5, delay: 0.3}}
        >
          <motion.div
            className={`px-3 py-2 rounded-lg border text-sm font-mono ${
              showReorder
                ? "bg-[#3a1a1a] border-[#ef444466] text-[#f87171]"
                : "bg-[#1a3a1a] border-[#22c55e66] text-[#4ade80]"
            }`}
          >
            消息 1
          </motion.div>
          <span className="text-[10px] text-[#888] mt-1">"你好"</span>
        </motion.div>

        <motion.div className="flex flex-col items-center">
          <motion.div
            className="text-lg"
            animate={{color: showReorder ? "#ef4444" : "#22c55e"}}
          >
            {showReorder ? "⟵" : "⟶"}
          </motion.div>
          <span className="text-[10px] text-[#888]">~40ms</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          animate={showReorder ? {x: [-200, 0, 0]} : {}}
          transition={{duration: 1.5, delay: 0.6}}
        >
          <motion.div
            className={`px-3 py-2 rounded-lg border text-sm font-mono ${
              showReorder
                ? "bg-[#3a3a1a] border-[#f59e0b66] text-[#fbbf24]"
                : "bg-[#1a3a1a] border-[#22c55e66] text-[#4ade80]"
            }`}
          >
            消息 2
          </motion.div>
          <span className="text-[10px] text-[#888] mt-1">"吃了吗"</span>
        </motion.div>

        <motion.div className="flex flex-col items-center">
          <motion.div
            className="text-lg"
            animate={{color: showReorder ? "#f59e0b" : "#22c55e"}}
          >
            {showReorder ? "⟶" : "⟶"}
          </motion.div>
          <span className="text-[10px] text-[#888]">~120ms</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          animate={showReorder ? {x: [-380, 0, 0]} : {}}
          transition={{duration: 1.5, delay: 0.9}}
        >
          <motion.div
            className={`px-3 py-2 rounded-lg border text-sm font-mono ${
              showReorder
                ? "bg-[#1a3a1a] border-[#22c55e66] text-[#4ade80]"
                : "bg-[#1a3a1a] border-[#22c55e66] text-[#4ade80]"
            }`}
          >
            消息 3
          </motion.div>
          <span className="text-[10px] text-[#888] mt-1">"回复"</span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!showReorder ? (
          <motion.div
            key="normal"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="text-center"
          >
            <span className="text-xs font-mono text-[#4ade80] bg-[#22c55e15] px-2 py-1 rounded">
              ✅ 正常顺序: 1 → 2 → 3
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="reorder"
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            className="text-center"
          >
            <span className="text-xs font-mono text-[#f87171] bg-[#ef444415] px-2 py-1 rounded">
              ❌ 乱序到达: 3 → 1 → 2
            </span>
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.4}}
              className="text-[11px] text-[#888] mt-2 font-mono"
            >
              新加坡→上海 ~120ms vs 北京→上海 ~40ms
              <br />
              网络延迟导致消息 3 比消息 2 先到达
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConsistencyComparison() {
  const columns = [
    {
      title: "强一致性",
      eng: "Strong Consistency",
      color: "#22c55e",
      bg: "#22c55e10",
      border: "#22c55e44",
      text: "#4ade80",
      desc: "写入后立即对所有节点可见。所有副本同步更新。",
      pros: "无歧义，读写立即可见",
      cons: "延迟高，网络分区不可用",
      example: "同步复制、2PC",
    },
    {
      title: "最终一致性",
      eng: "Eventual Consistency",
      color: "#f59e0b",
      bg: "#f59e0b10",
      border: "#f59e0b44",
      text: "#fbbf24",
      desc: "如果不继续写入，最终所有副本会收敛到相同值。",
      pros: "高可用，低延迟",
      cons: "可能读到旧数据",
      example: "DNS、Cassandra、DynamoDB",
    },
    {
      title: "线性一致性",
      eng: "Linearizability",
      color: "#3b82f6",
      bg: "#3b82f610",
      border: "#3b82f644",
      text: "#60a5fa",
      desc: "最强的单对象一致性：多副本表现得像只有一个副本。",
      pros: "全局实时顺序保证",
      cons: "网络延迟直接影响响应时间",
      example: "etcd、ZooKeeper、Raft",
    },
  ];

  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="my-10"
    >
      <h3 className="text-lg font-semibold text-white text-center mb-6">
        📊 三种一致性模型对比
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col, i) => (
          <motion.div
            key={col.eng}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: i * 0.15}}
            className="rounded-xl p-4 border"
            style={{background: col.bg, borderColor: col.border}}
          >
            <div className="text-center mb-3">
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{color: col.text, background: col.border}}
              >
                {col.eng}
              </span>
              <h4 className="text-base font-bold mt-2" style={{color: col.text}}>
                {col.title}
              </h4>
            </div>
            <p className="text-xs text-[#aaa] leading-relaxed mb-3 text-center">
              {col.desc}
            </p>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#888]">✅ 优势</span>
                <span className="text-[#ccc] text-right">{col.pros}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">⚠️ 代价</span>
                <span className="text-[#ccc] text-right">{col.cons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">🔧 实例</span>
                <span className="text-[#ccc] text-right">{col.example}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.6}}
        className="text-center mt-8"
      >
        <p className="text-xs text-[#666] font-mono mb-1">全球同步用户数</p>
        <AnimatedNumber
          value={2_500_000_000}
          duration={3}
          suffix=" 人"
          color="#60a5fa"
          className="text-3xl"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Section07_Consistency() {
  const {currentPage} = usePage();
  const [typingDone, setTypingDone] = useState(false);

  return (
    <section className="min-h-screen relative bg-[#050505] py-16 px-4 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <PageBlock page="701">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-8"
          >
            <Typewriter
              text="用户遍布全球"
              speed={80}
              className="text-white"
              onComplete={() => setTypingDone(true)}
            />
            <motion.p
              initial={{opacity: 0}}
              animate={typingDone ? {opacity: 1} : {}}
              transition={{delay: 0.3}}
              className="text-sm text-[#888] mt-3 font-mono"
            >
              你的应用从上海部署，但用户在北京、新加坡同时访问
            </motion.p>
          </motion.div>
        </PageBlock>

        <PageBlock page="702">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
          >
            <DatacenterDiagram />
          </motion.div>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}
            className="flex justify-center gap-6 my-6"
          >
            {[
              {from: "上海 → 北京", ms: 40, color: "#22c55e"},
              {from: "北京 → 新加坡", ms: 120, color: "#f59e0b"},
              {from: "上海 → 新加坡", ms: 150, color: "#ef4444"},
            ].map((item) => (
              <motion.div
                key={item.from}
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{delay: 0.5}}
                className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-center"
              >
                <div className="text-[11px] text-[#888] font-mono">{item.from}</div>
                <div className="text-lg font-bold font-mono" style={{color: item.color}}>
                  ~{item.ms}ms
                </div>
              </motion.div>
            ))}
          </motion.div>
        </PageBlock>

        <PageBlock page="703">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
          >
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              📨 消息顺序：理想 vs 现实
            </h3>
            <MessageFlowAnimation showReorder={currentPage >= 704} />
          </motion.div>
        </PageBlock>

        <PageBlock page="705">
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.5}}
          >
            <AlertBanner
              message="为什么回复比原消息先出现？"
              type="warning"
              delay={0.2}
            />
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.6}}
              className="text-center text-xs text-[#666] mt-2 font-mono"
            >
              网络延迟不可预测 → 消息顺序无法保证
            </motion.p>
          </motion.div>
        </PageBlock>

        <PageBlock page="706">
          <motion.div
            initial={{opacity: 0, y: 15}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1.0, duration: 0.5}}
            className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 my-6 text-center"
          >
            <p className="text-sm text-[#ccc] leading-relaxed">
              <span className="text-[#fbbf24] font-bold">最终一致性</span>
              {" "}意味着：数据最终会一致，但<span className="text-[#f87171]">不是立刻</span>。
              <br />
              在这段「不一致窗口」里，用户看到的就是乱序消息。
            </p>
            <motion.div
              className="mt-3 text-[10px] text-[#555] font-mono"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 1.5}}
            >
              不一致窗口 ≈ 网络延迟 ≈ 40ms ~ 150ms
            </motion.div>
          </motion.div>
        </PageBlock>

        <PageBlock page="707">
          <ConsistencyComparison />
        </PageBlock>

        <PageBlock page="708">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-white text-center mb-6">
              🔍 深入理解：DDIA Chapter 9 核心概念
            </h3>
            {chapter.cards.slice(0, 4).map((card, i) => (
              <TechCard
                key={i}
                title={card.title}
                concept={card.concept}
                description={card.description}
                items={card.items}
                delay={0.2}
                index={i}
              />
            ))}
          </motion.div>
        </PageBlock>

        <PageBlock page="709">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}
            className="mt-12 mb-8"
          >
            <ChapterBadge
              chapter={chapter.chapter}
              title={chapter.chapterTitle}
              delay={0.2}
            />
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.6}}
              className="text-center text-sm text-[#666] mt-2 font-mono italic"
            >
              &ldquo;{chapter.summary}&rdquo;
            </motion.p>
          </motion.div>

          <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, delay: 0.8}}
            className="text-center text-xs text-[#333] mt-16 font-mono"
          >
            ↓ 继续向下，了解共识算法 ↓
          </motion.p>
        </PageBlock>
      </div>
    </section>
  );
}