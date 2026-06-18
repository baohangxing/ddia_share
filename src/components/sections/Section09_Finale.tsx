import {motion, AnimatePresence} from "framer-motion";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {ChapterBadge} from "../shared/ChapterBadge";
import {usePage} from "../../contexts/PageContext";
import {PageBlock} from "../shared/PageBlock";

const ALL_NODES = [
  {id: "user", label: "Users", x: 250, y: 30, color: "primary" as const},
  {id: "lb", label: "Load\nBalancer", x: 250, y: 80, color: "default" as const},
  {id: "app", label: "App\nCluster", x: 250, y: 130, color: "default" as const},
  {id: "cache", label: "Cache", x: 150, y: 180, color: "warning" as const},
  {id: "kafka", label: "Kafka", x: 350, y: 180, color: "warning" as const},
  {id: "shard", label: "Sharding", x: 250, y: 230, color: "success" as const},
  {id: "repl", label: "Replication", x: 250, y: 280, color: "success" as const},
  {id: "txn", label: "Transactions", x: 250, y: 330, color: "danger" as const},
  {id: "cons", label: "Consensus", x: 250, y: 380, color: "danger" as const},
  {id: "store", label: "Storage", x: 250, y: 430, color: "primary" as const},
];

const ALL_ARROWS = [
  {from: "user", to: "lb", animated: true},
  {from: "lb", to: "app", animated: true},
  {from: "app", to: "cache", animated: true},
  {from: "app", to: "kafka", animated: true},
  {from: "cache", to: "shard"},
  {from: "kafka", to: "shard"},
  {from: "shard", to: "repl", animated: true},
  {from: "repl", to: "txn", animated: true},
  {from: "txn", to: "cons", animated: true},
  {from: "cons", to: "store", animated: true},
];

function filterDiagram(nodeIds: string[]) {
  const nodes = ALL_NODES.filter((n) => nodeIds.includes(n.id));
  const arrows = ALL_ARROWS.filter(
    (a) => nodeIds.includes(a.from) && nodeIds.includes(a.to),
  );
  return {nodes, arrows};
}

const KEYWORDS = [
  {label: "Storage", chapter: 3, title: "存储与检索"},
  {label: "Replication", chapter: 5, title: "复制"},
  {label: "Partitioning", chapter: 6, title: "分区"},
  {label: "Transactions", chapter: 7, title: "事务"},
  {label: "Consistency", chapter: 9, title: "一致性与共识"},
  {label: "Consensus", chapter: 9, title: "一致性与共识"},
];

function GlowKeyword({
  label,
  chapter,
  title,
}: {
  label: string;
  chapter: number;
  title: string;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20, scale: 0.9}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{duration: 0.5, ease: "easeOut"}}
      className="flex flex-col items-center gap-2"
    >
      <motion.span
        className="text-xl md:text-3xl font-bold text-white"
        animate={{
          textShadow: [
            "0 0 4px #3b82f600",
            "0 0 24px #3b82f6cc",
            "0 0 48px #3b82f644",
            "0 0 4px #3b82f600",
          ],
        }}
        transition={{duration: 2.5, repeat: Infinity, ease: "easeInOut"}}
      >
        {label}
      </motion.span>
      <ChapterBadge chapter={chapter} title={title} delay={0.1} />
    </motion.div>
  );
}

const ARCH_STEPS: {minPage: number; nodeIds: string[]; label: string}[] = [
  {minPage: 902, nodeIds: ["user", "app", "store"], label: "最初的样子"},
  {minPage: 903, nodeIds: ["user", "lb", "app", "store"], label: "流量来了"},
  {
    minPage: 904,
    nodeIds: ["user", "lb", "app", "cache", "kafka", "store"],
    label: "缓存 + 消息队列",
  },
  {
    minPage: 905,
    nodeIds: ["user", "lb", "app", "cache", "kafka", "shard", "store"],
    label: "分片扩展",
  },
  {
    minPage: 906,
    nodeIds: ["user", "lb", "app", "cache", "kafka", "shard", "repl", "store"],
    label: "冗余副本",
  },
  {
    minPage: 907,
    nodeIds: [
      "user",
      "lb",
      "app",
      "cache",
      "kafka",
      "shard",
      "repl",
      "txn",
      "store",
    ],
    label: "保证正确",
  },
  {
    minPage: 908,
    nodeIds: [
      "user",
      "lb",
      "app",
      "cache",
      "kafka",
      "shard",
      "repl",
      "txn",
      "cons",
      "store",
    ],
    label: "达成共识",
  },
];

export default function Section09_Finale() {
  const {currentPage} = usePage();

  let currentArchStep = ARCH_STEPS[0];
  for (const step of ARCH_STEPS) {
    if (currentPage >= step.minPage) {
      currentArchStep = step;
    }
  }
  const diagram = filterDiagram(currentArchStep.nodeIds);

  return (
    <section className="min-h-screen relative bg-[#050505] py-16 px-4 flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10 w-full">
        <PageBlock page="901">
          <motion.h1
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94]}}
            className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
          >
            终章 · 回顾
          </motion.h1>

          <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.4}}
            className="text-center text-sm text-[#555] mb-10 font-mono"
          >
            从零到分布式 · 一路走来的架构演进
          </motion.p>
        </PageBlock>

        <PageBlock page="902" />
        <PageBlock page="903" />
        <PageBlock page="904" />
        <PageBlock page="905" />
        <PageBlock page="906" />
        <PageBlock page="907" />
        <PageBlock page="908" />
        {currentPage >= 902 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`arch-${currentArchStep.label}`}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.35}}
                className="mb-6"
              >
                <ArchitectureDiagram
                  nodes={diagram.nodes}
                  arrows={diagram.arrows}
                  width={500}
                  height={480}
                  delay={0}
                />
              </motion.div>
            </AnimatePresence>

            <motion.p
              key={`sub-${currentArchStep.label}`}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.3}}
              className="text-center text-xs text-[#555] font-mono tracking-widest uppercase mb-6"
            >
              {currentArchStep.label}
            </motion.p>
          </>
        )}

        <PageBlock page="909">
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.8, ease: "easeOut"}}
            className="text-center mt-10 mb-10"
          >
            <motion.p
              className="text-xl md:text-3xl font-bold text-white leading-relaxed"
              animate={{opacity: [0.6, 1, 0.6]}}
              transition={{duration: 3, repeat: Infinity, ease: "easeInOut"}}
            >
              一开始，我只是想做个简单的微博。
            </motion.p>
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 1.2, duration: 0.8}}
              className="text-xl md:text-3xl font-bold text-[#60a5fa] mt-3"
            >
              后来，我学完了 DDIA。
            </motion.p>
          </motion.div>
        </PageBlock>

        <PageBlock page="910">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
            className="mt-8"
          >
            <p className="text-center text-xs text-[#555] mb-6 font-mono tracking-widest uppercase">
              · 我们一起走过 ·
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <GlowKeyword
                label={KEYWORDS[0].label}
                chapter={KEYWORDS[0].chapter}
                title={KEYWORDS[0].title}
              />
              <GlowKeyword
                label={KEYWORDS[1].label}
                chapter={KEYWORDS[1].chapter}
                title={KEYWORDS[1].title}
              />
              <GlowKeyword
                label={KEYWORDS[2].label}
                chapter={KEYWORDS[2].chapter}
                title={KEYWORDS[2].title}
              />
              <GlowKeyword
                label={KEYWORDS[3].label}
                chapter={KEYWORDS[3].chapter}
                title={KEYWORDS[3].title}
              />
              <GlowKeyword
                label={KEYWORDS[4].label}
                chapter={KEYWORDS[4].chapter}
                title={KEYWORDS[4].title}
              />
              <GlowKeyword
                label={KEYWORDS[5].label}
                chapter={KEYWORDS[5].chapter}
                title={KEYWORDS[5].title}
              />
            </div>
          </motion.div>
        </PageBlock>

        <PageBlock page="916">
          <motion.div
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1.2, ease: "easeOut"}}
            className="text-center mt-16"
          >
            <motion.p
              className="text-4xl md:text-6xl font-bold text-[#3b82f6] select-none"
              animate={{
                textShadow: [
                  "0 0 4px #3b82f600",
                  "0 0 32px #3b82f699",
                  "0 0 4px #3b82f600",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              — 终 —
            </motion.p>
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.8, duration: 0.6}}
              className="text-xs text-[#444] mt-4 font-mono"
            >
              Designing Data-Intensive Applications
            </motion.p>
          </motion.div>
        </PageBlock>
      </div>
    </section>
  );
}
