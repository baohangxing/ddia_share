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

const chapter = ddiaChapters[3];

const kafkaNodes = [
  {id: "producer", label: "Producer", x: 60, y: 80, width: 80, height: 40, color: "primary" as const},
  {id: "kafka", label: "Kafka", x: 260, y: 80, width: 100, height: 50, color: "warning" as const},
  {id: "consumer1", label: "Consumer 1", x: 460, y: 40, width: 80, height: 36, color: "success" as const},
  {id: "consumer2", label: "Consumer 2", x: 460, y: 90, width: 80, height: 36, color: "success" as const},
  {id: "consumer3", label: "Consumer 3", x: 460, y: 140, width: 80, height: 36, color: "success" as const},
];

const kafkaArrows = [
  {from: "producer", to: "kafka", animated: true, label: "publish"},
  {from: "kafka", to: "consumer1", animated: true},
  {from: "kafka", to: "consumer2", animated: true},
  {from: "kafka", to: "consumer3", animated: true},
];

const waterNodes = [
  {id: "flood", label: "洪水", x: 60, y: 80, width: 70, height: 60, color: "danger" as const, shape: "circle" as const},
  {id: "dam", label: "水库", x: 260, y: 80, width: 90, height: 50, color: "warning" as const},
  {id: "river1", label: "河流", x: 440, y: 40, width: 70, height: 36, color: "primary" as const, shape: "circle" as const},
  {id: "river2", label: "河流", x: 440, y: 100, width: 70, height: 36, color: "primary" as const, shape: "circle" as const},
  {id: "river3", label: "河流", x: 440, y: 160, width: 70, height: 36, color: "primary" as const, shape: "circle" as const},
];

const waterArrows = [
  {from: "flood", to: "dam", animated: true, color: "#ef4444", label: "缓冲"},
  {from: "dam", to: "river1", animated: true, color: "#3b82f6"},
  {from: "dam", to: "river2", animated: true, color: "#3b82f6"},
  {from: "dam", to: "river3", animated: true, color: "#3b82f6"},
];

export default function Section05_Streams() {
  return (
    <section className="min-h-screen relative max-w-4xl mx-auto px-4 py-20">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10">
        <PageBlock page="501">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center mb-8"
          >
            <Typewriter
              text="流量洪峰"
              speed={100}
              className="text-white"
            />
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 1.2, duration: 0.5}}
              className="text-[#888] text-sm mt-3 font-mono"
            >
              SuperStar 发了一条推文——1亿粉丝同时拉取
            </motion.p>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}
          >
            <CodeBlock
              code={`// 1亿粉丝——全量 fan-out 推送
await Promise.all(
  followers.map(f => sendNotification(f, tweet))
);
// 响应时间：100ms → 1s → 5s → 30s → Timeout 💥`}
              language="ts"
              delay={0.3}
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.4}}
            className="text-center my-8"
          >
            <p className="text-sm text-[#888] mb-4 font-mono">Response Time</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                {label: "100ms", color: "#4ade80"},
                {label: "1s", color: "#fbbf24"},
                {label: "5s", color: "#fb923c"},
                {label: "30s", color: "#ef4444"},
                {label: "TIMEOUT", color: "#ef4444"},
              ].map((item, i) => (
                <motion.span
                  key={item.label}
                  initial={{opacity: 0, scale: 0.5}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.3, delay: 0.6 + i * 0.2}}
                  className={`px-3 py-1.5 rounded font-mono text-sm font-bold border ${
                    i === 4
                      ? "bg-[#ef444422] text-[#f87171] border-[#ef444444] animate-pulse"
                      : "bg-[#111] border-[#2a2a2a]"
                  }`}
                  style={{color: i < 4 ? item.color : undefined}}
                >
                  {item.label}
                  {i < 4 && <span className="text-[#555] ml-2">→</span>}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.4, delay: 0.3}}
          >
            <AlertBanner
              message="服务器炸了。同步 fan-out 不适用于高扇出场景。"
              type="error"
              delay={0.3}
            />
          </motion.div>

          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.5, delay: 0.5}}
            className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 my-8 text-center"
          >
            <p className="text-sm text-[#888] mb-2 font-mono">Fan-out 规模</p>
            <AnimatedNumber
              value={100_000_000}
              duration={2.5}
              color="#ef4444"
              className="text-3xl"
            />
            <p className="text-xs text-[#666] mt-1 font-mono">条通知需要推送</p>
          </motion.div>
        </PageBlock>

        <PageBlock page="502">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="mt-8"
          >
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.4, delay: 0.1}}
            >
              <AlertBanner
                message="解决方案：用消息队列削峰填谷。"
                type="info"
                delay={0.1}
              />
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}
            >
              <CodeBlock
                code={`// 不再直接 push——发布到 Kafka
await kafka.publish('tweets', {
  userId: 'superstar',
  tweet: content,
  timestamp: Date.now(),
});
// 写入成功即返回——延迟 < 10ms ✅`}
                language="ts"
                delay={0.3}
              />
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.4}}
            >
              <CodeBlock
                code={`// 消费者——按自己的节奏消费
const consumer = kafka.consumer({ groupId: 'notif' });
await consumer.subscribe({ topic: 'tweets' });

while (true) {
  const { message } = await consumer.consume();
  await sendNotification(message.userId, message.tweet);
}`}
                language="ts"
                delay={0.5}
              />
            </motion.div>
          </motion.div>
        </PageBlock>

        <PageBlock page="503">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6}}
            className="my-8"
          >
            <motion.p
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
              className="text-sm text-[#888] text-center mb-4 font-mono"
            >
              🌊 流量洪峰 → 水库缓冲 → 平稳泄洪
            </motion.p>
            <ArchitectureDiagram
              nodes={waterNodes}
              arrows={waterArrows}
              width={540}
              height={200}
              delay={0.2}
            />
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.4, delay: 0.5}}
              className="text-xs text-[#555] text-center mt-3 font-mono italic"
            >
              消息队列就是流量洪峰的水库——削峰填谷，保护下游
            </motion.p>
          </motion.div>
        </PageBlock>

        <PageBlock page="504">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6}}
            className="my-8"
          >
            <motion.p
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
              className="text-sm text-[#888] text-center mb-4 font-mono"
            >
              🏗️ 流处理架构：Producer → Kafka → Consumers
            </motion.p>
            <ArchitectureDiagram
              nodes={kafkaNodes}
              arrows={kafkaArrows}
              width={580}
              height={190}
              delay={0.2}
            />
          </motion.div>
        </PageBlock>

        <PageBlock page="505">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.3}}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-white text-center mb-6">
              🔍 深入理解：DDIA Chapter 11 核心概念
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
            ↓ 继续向下，事务与一致性 ↓
          </motion.p>
        </PageBlock>
      </div>
    </section>
  );
}