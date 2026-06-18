import {motion} from "framer-motion";
import {CodeBlock} from "../shared/CodeBlock";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {ChapterBadge} from "../shared/ChapterBadge";
import {TechCard} from "../shared/TechCard";
import {AlertBanner} from "../shared/AlertBanner";
import {AnimatedNumber} from "../shared/AnimatedNumber";
import {Typewriter} from "../shared/Typewriter";
import {ddiaChapters} from "../../data/ddiaContent";
import {PageBlock} from "../shared/PageBlock";

const chapter = ddiaChapters[2];

const balancedNodes = [
  {id: "shard1", label: "Shard 1", x: 80, y: 100, width: 80, height: 40, color: "primary" as const},
  {id: "shard2", label: "Shard 2", x: 220, y: 100, width: 80, height: 40, color: "primary" as const},
  {id: "shard3", label: "Shard 3", x: 360, y: 100, width: 80, height: 40, color: "primary" as const},
  {id: "shard4", label: "Shard 4", x: 500, y: 100, width: 80, height: 40, color: "primary" as const},
  {id: "users", label: "Users", x: 290, y: 40, width: 60, height: 30, shape: "circle" as const, color: "default" as const},
];

const skewedNodes = [
  {id: "shard1", label: "Shard 1", x: 80, y: 100, width: 80, height: 40, color: "default" as const},
  {id: "shard2", label: "🔥 Shard 2", x: 220, y: 100, width: 90, height: 40, color: "danger" as const},
  {id: "shard3", label: "Shard 3", x: 360, y: 100, width: 80, height: 40, color: "default" as const},
  {id: "shard4", label: "Shard 4", x: 500, y: 100, width: 80, height: 40, color: "default" as const},
  {id: "users", label: "Users", x: 290, y: 40, width: 60, height: 30, shape: "circle" as const, color: "default" as const},
  {id: "superstar", label: "SuperStar", x: 220, y: 40, width: 60, height: 30, shape: "circle" as const, color: "danger" as const},
];

const balancedArrows = [
  {from: "users", to: "shard1", animated: true},
  {from: "users", to: "shard2", animated: true},
  {from: "users", to: "shard3", animated: true},
  {from: "users", to: "shard4", animated: true},
];

const skewedArrows = [
  {from: "users", to: "shard1", animated: false, color: "#333"},
  {from: "superstar", to: "shard2", animated: true, color: "#ef4444"},
  {from: "users", to: "shard3", animated: false, color: "#333"},
  {from: "users", to: "shard4", animated: false, color: "#333"},
];

export default function Section04_Partitioning() {
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
        <PageBlock page="401">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-8"
          >
            <Typewriter
              text="一个明星注册了"
              speed={80}
              className="text-white"
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.5, delay: 0.3}}
            className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 mb-8 text-center"
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center text-2xl"
              animate={{boxShadow: ["0 0 10px #f59e0b44", "0 0 30px #f59e0b88", "0 0 10px #f59e0b44"]}}
              transition={{duration: 2, repeat: Infinity}}
            >
              ⭐
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">User: SuperStar</h3>
            <p className="text-[#aaa] text-sm">
              Followers:{" "}
              <AnimatedNumber
                value={100_000_000}
                duration={2}
                color="#f59e0b"
                className="text-2xl"
              />
            </p>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.5}}
            className="text-center mb-8"
          >
            <p className="text-sm text-[#888] mb-4 font-mono">Database Size</p>
            <div className="flex items-center justify-center gap-3 text-lg font-mono">
              {[100, 500, 1000, 2000].map((size, i) => (
                <motion.span
                  key={size}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.3, delay: 0.8 + i * 0.25}}
                  className={`px-3 py-1 rounded ${
                    size >= 2000 ? "bg-[#ef444422] text-[#f87171] border border-[#ef444444]" :
                    size >= 1000 ? "bg-[#f59e0b22] text-[#fbbf24] border border-[#f59e0b44]" :
                    "bg-[#111] text-[#aaa] border border-[#2a2a2a]"
                  }`}
                >
                  {size}GB
                  {i < 3 && <span className="text-[#555] ml-2">→</span>}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.4, delay: 1.2}}
          >
            <AlertBanner
              message="单机放不下了。需要分片（Partitioning/Sharding）"
              type="warning"
              delay={0.2}
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.3}}
          >
            <CodeBlock
              code={`// 最简单的哈希分片——取模
const shard = userId % 4;
// userId 哈希后映射到 Shard 0~3
db[shard].insert(record);`}
              language="ts"
              delay={0.5}
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.3}}
            className="my-8"
          >
            <p className="text-sm text-[#888] text-center mb-4 font-mono">正常用户 → 均匀分布</p>
            <ArchitectureDiagram
              nodes={balancedNodes}
              arrows={balancedArrows}
              width={580}
              height={160}
              delay={0.4}
            />
          </motion.div>
        </PageBlock>

        <PageBlock page="402">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="my-8"
          >
            <p className="text-sm text-[#f87171] text-center mb-4 font-mono">
              SuperStar 1亿粉丝 → 全部落入 Shard 2
            </p>
            <ArchitectureDiagram
              nodes={skewedNodes}
              arrows={skewedArrows}
              width={580}
              height={160}
              delay={0.2}
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.4, delay: 0.2}}
          >
            <AlertBanner
              message="热点分区（Hot Partition）！数据倾斜（Data Skew）！分片不难，难的是热点。"
              type="error"
              delay={0.2}
            />
          </motion.div>
        </PageBlock>

        <PageBlock page="403">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.3}}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-white text-center mb-6">
              🔍 深入理解：DDIA Chapter 6 核心概念
            </h3>
            {chapter.cards.map((card, i) => (
              <TechCard
                key={i}
                title={card.title}
                concept={card.concept}
                description={card.description}
                items={card.items}
                delay={0.4}
                index={i}
              />
            ))}
          </motion.div>
        </PageBlock>

        <PageBlock page="404">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.3}}
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
            ↓ 继续向下，了解流处理 ↓
          </motion.p>
        </PageBlock>
      </div>
    </section>
  );
}