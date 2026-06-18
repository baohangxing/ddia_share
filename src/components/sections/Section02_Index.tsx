import {useState, useEffect, useRef} from "react";
import {motion, useInView} from "framer-motion";
import {CodeBlock} from "../shared/CodeBlock";
import {ArchitectureDiagram} from "../shared/ArchitectureDiagram";
import {AnimatedNumber} from "../shared/AnimatedNumber";
import {AlertBanner} from "../shared/AlertBanner";
import {ChapterBadge} from "../shared/ChapterBadge";
import {TechCard} from "../shared/TechCard";
import {Typewriter} from "../shared/Typewriter";
import {MysqlExplainDiff} from "../shared/MysqlExplainDiff";
import {ddiaChapters} from "../../data/ddiaContent";
import {PageBlock} from "../shared/PageBlock";

const chapter3 = ddiaChapters[0];

const TABLE_SQL = `CREATE TABLE tweets (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  content    VARCHAR(280),
  create_time DATETIME NOT NULL,
  INDEX idx_user (user_id)
) ENGINE=InnoDB;
`;

const TIMELINE_SQL = `-- 首页时间线查询：取每个用户最近的推文
SELECT t.* FROM tweets t
JOIN (
  SELECT user_id, MAX(create_time) AS latest
  FROM tweets GROUP BY user_id
) sub ON t.user_id = sub.user_id
     AND t.create_time = sub.latest
ORDER BY t.create_time DESC LIMIT 50;`;

const EXPLAIN_SQL = `EXPLAIN
SELECT t.* FROM tweets t
JOIN (
  SELECT user_id, MAX(create_time) AS latest
  FROM tweets GROUP BY user_id
) sub ON t.user_id = sub.user_id
     AND t.create_time = sub.latest
ORDER BY t.create_time DESC LIMIT 50;
-- type: ALL   rows: 1000000   Extra: Using filesort
-- 全表扫描！每条记录都被读取 💀`;

const INDEX_SQL = `ALTER TABLE tweets ADD INDEX idx_user_time (user_id, create_time);;
-- 查询时间: 3000ms → 5ms (600x)
-- 🎯 B+Tree 索引在 user_id, create_time 列上建立，其排序规则是：
先按 user_id 升序排列，user_id 相同的情况下再按 create_time 升序排列`;

const rowCounts = [100, 1000, 10000, 100000, 1000000];
const queryTimes = [5, 50, 300, 1200, 3000];
const cpuPercents = [10, 20, 50, 80, 100];

export function Section02_Index() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative max-w-4xl mx-auto px-4 py-20"
      style={{background: "#050505", color: "#f5f5f5"}}
    >
      {/* ─── TITLE ─── */}
      <PageBlock page="201">
        <motion.div
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="text-center mb-12"
        >
          <Typewriter
            text="Day 1 - 用户越来越多了"
            speed={80}
            className="text-3xl md:text-5xl font-bold text-white"
          />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 1: TABLE SQL ─── */}
      <PageBlock page="202">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <p className="text-[#aaa] mb-2 text-sm font-mono">
            📋 tweets 表结构 — 初期设计
          </p>
          <CodeBlock code={TABLE_SQL} language="sql" delay={0} />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 2: TIMELINE QUERY ─── */}
      <PageBlock page="203">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <p className="text-[#aaa] mb-2 text-sm font-mono">
            ⚡ 首页查询：展示50个用户的最新的微博 （高频接口）
          </p>
          <CodeBlock code={TIMELINE_SQL} language="sql" delay={0.1} />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 3: DATA GROWTH + QUERY TIME + CPU ─── */}
      <PageBlock page="204">
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.6}}
          className="my-10 space-y-6"
        >
          <DataGrowthRow
            label="📊 数据行数"
            values={rowCounts}
            suffix=" rows"
            barColor="#3b82f6"
          />

          <DataGrowthRow
            label="⏱️ 查询耗时"
            values={queryTimes}
            suffix="ms"
            barColor="#f59e0b"
            dangerThreshold={1000}
          />

          <DataGrowthRow
            label="🔥 CPU"
            values={cpuPercents}
            suffix="%"
            barColor="#ef4444"
            dangerThreshold={80}
          />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 5: ARCH DIAGRAM MYSQL RED ─── */}
      <PageBlock page="206">
        <motion.div
          initial={{opacity: 0, scale: 0.9}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.5}}
        >
          <ArchitectureDiagram
            nodes={[
              {
                id: "web",
                label: "Web 服务",
                x: 150,
                y: 60,
                width: 80,
                height: 40,
                color: "default",
              },
              {
                id: "mysql",
                label: "MySQL",
                x: 350,
                y: 60,
                width: 80,
                height: 40,
                color: "danger",
              },
              {
                id: "disk",
                label: "磁盘 I/O",
                x: 350,
                y: 150,
                width: 80,
                height: 40,
                color: "warning",
              },
            ]}
            arrows={[
              {
                from: "web",
                to: "mysql",
                label: "SQL 查询",
                animated: true,
                color: "#ef4444",
              },
              {
                from: "mysql",
                to: "disk",
                label: "全表扫描",
                animated: true,
                color: "#f59e0b",
              },
            ]}
            width={500}
            height={220}
            delay={0}
          />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 6: ALERT ─── */}
      <PageBlock page="207">
        <motion.div
          initial={{opacity: 0, scale: 0.8}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.5, type: "spring"}}
        >
          <AlertBanner
            message="首页打开失败 — 数据库连接超时"
            type="error"
            delay={0}
          />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 7: DIALOGUE ─── */}
      <PageBlock page="208">
        <motion.div
          initial={{opacity: 0, x: -40}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.5, delay: 0.3}}
          className="my-6 p-5 rounded-xl bg-[#111] border border-[#2a2a2a] text-center"
        >
          <p className="text-2xl mb-2">😰</p>
          <p className="text-lg text-[#ddd] italic">
            "我什么都没改啊……代码没动，配置没动……"
          </p>
          <p className="text-sm text-[#888] mt-2">
            — 每一位后端工程师在事故前都说过的话
          </p>
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 8: EXPLAIN ANIMATION ─── */}
      <PageBlock page="209">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="my-8"
        >
          <p className="text-[#f87171] mb-2 text-sm font-mono font-bold">
            🔍 EXPLAIN 分析 — 揭开真相
          </p>
          <CodeBlock code={EXPLAIN_SQL} language="sql" delay={0.1} />

          {/* Full table scan animation */}
          <FullTableScanAnimation />
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 9: SOLUTION ─── */}
      <PageBlock page="210">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="my-8"
        >
          <p className="text-[#4ade80] mb-2 text-sm font-mono font-bold">
            ✅ 解决方案：添加索引
          </p>
          <CodeBlock code={INDEX_SQL} language="sql" delay={0.1} />

          {/* B+Tree animation */}
          <BTreeAnimation />

          {/* MySQL EXPLAIN diff */}
          <MysqlExplainDiff />

          {/* Before/After comparison */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 2, duration: 0.6}}
            className="mt-6 p-5 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a]"
          >
            <p className="text-center text-sm text-[#aaa] mb-3">查询耗时对比</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <span className="text-xs text-[#f87171] block mb-1">
                  Before
                </span>
                <AnimatedNumber
                  value={3000}
                  suffix="ms"
                  color="#ef4444"
                  className="text-3xl"
                />
              </div>
              <span className="text-2xl text-[#555]">→</span>
              <div className="text-center">
                <span className="text-xs text-[#4ade80] block mb-1">After</span>
                <AnimatedNumber
                  value={5}
                  suffix="ms"
                  color="#22c55e"
                  className="text-3xl"
                />
              </div>
            </div>
            <p className="text-center text-sm text-[#4ade80] mt-3 font-bold">
              快了 600 倍！🚀
            </p>
          </motion.div>
        </motion.div>
      </PageBlock>

      {/* ─── PHASE 10: CHAPTER BADGE + SUMMARY ─── */}
      <PageBlock page="211">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="my-10"
        >
          <ChapterBadge
            chapter={chapter3.chapter}
            title={chapter3.chapterTitle}
            delay={0}
          />

          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            transition={{delay: 0.5, duration: 0.6}}
            viewport={{once: true}}
            className="text-center my-8"
          >
            <p className="text-2xl md:text-3xl font-bold text-white">
              索引不是优化。
              <span className="text-[#3b82f6]">索引是生存条件。</span>
            </p>
          </motion.div>
        </motion.div>
      </PageBlock>

      {/* ─── DDIA KNOWLEDGE CARDS ─── */}
      <PageBlock page="211">
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1, duration: 0.6}}
          className="my-12"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            📚 DDIA 知识卡片
          </h3>
          {chapter3.cards.map((card, i) => (
            <TechCard
              key={i}
              title={card.title}
              concept={card.concept}
              description={card.description}
              items={card.items}
              delay={1.2}
              index={i}
            />
          ))}
        </motion.div>
      </PageBlock>
    </section>
  );
}

// ── Sub-component: Data Growth Row ──
function DataGrowthRow({
  label,
  values,
  suffix,
  barColor,
  dangerThreshold,
}: {
  label: string;
  values: number[];
  suffix: string;
  barColor: string;
  dangerThreshold?: number;
}) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  useEffect(() => {
    if (!isInView || values.length <= 1) return;
    const interval = 4000 / values.length;
    const timer = setInterval(() => {
      setIdx((prev) => {
        if (prev >= values.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isInView, values]);

  const current = values[idx];
  const maxVal = values[values.length - 1];
  const barWidth = Math.max(5, (current / maxVal) * 100);
  const isDanger = dangerThreshold != null && current >= dangerThreshold;

  return (
    <div ref={ref} className="space-y-1">
      <p className="text-xs text-[#888] font-mono">{label}</p>
      <div className="flex items-center gap-3">
        <AnimatedNumber
          value={current}
          suffix={suffix}
          format={true}
          color={isDanger ? "#ef4444" : "#f5f5f5"}
          className="text-lg w-32 shrink-0"
        />
        <div className="flex-1 h-6 bg-[#1a1a1a] rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{background: isDanger ? "#ef4444" : barColor}}
            animate={{width: `${barWidth}%`}}
            transition={{duration: 1.5, ease: "easeOut"}}
          />
          {isDanger && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{border: `2px solid #ef4444`}}
              animate={{opacity: [0.6, 0, 0.6]}}
              transition={{duration: 1, repeat: Infinity}}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: Full Table Scan Animation ──
function FullTableScanAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  const rowLabels = Array.from({length: 20}, (_, i) => ({
    id: i + 1,
    color: i < 3 ? "#4ade80" : i < 6 ? "#60a5fa" : "#333",
  }));

  return (
    <div
      ref={ref}
      className="my-4 p-4 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a]"
    >
      <p className="text-xs text-[#f87171] font-mono mb-3 text-center">
        ⚡ 全表扫描中... 扫描 1,000,000 行
      </p>

      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-4">
        {rowLabels.map((row, i) => (
          <motion.div
            key={i}
            initial={{opacity: 0.2, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: i * 0.3, duration: 0.4}}
            className="h-8 rounded flex items-center justify-center text-xs font-mono"
            style={{
              background: i < 3 ? "#22c55e22" : i < 6 ? "#3b82f622" : "#1a1a1a",
              border: `1px solid ${row.color}`,
              color: row.color,
            }}
          >
            <motion.span
              animate={{opacity: [0.3, 1, 0.3]}}
              transition={{delay: i * 0.3, duration: 1.5, repeat: Infinity}}
            >
              #{i * 50000 + 1}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#ef4444] rounded-full"
            initial={{width: "0%"}}
            animate={isInView ? {width: "100%"} : {}}
            transition={{duration: 8, ease: "linear"}}
          />
        </div>
        <div className="flex justify-between text-xs text-[#888] mt-1 font-mono">
          <span>Row 1</span>
          <span>Row 1,000,000</span>
        </div>
      </div>

      <motion.div
        className="text-center mt-3"
        initial={{opacity: 0}}
        animate={isInView ? {opacity: 1} : {}}
        transition={{delay: 1, duration: 0.5}}
      >
        <span className="text-xs text-[#888] font-mono">已扫描: </span>
        <AnimatedNumber
          value={1000000}
          duration={7}
          suffix=" rows"
          color="#f87171"
          className="text-sm"
        />
      </motion.div>
    </div>
  );
}

// ── Sub-component: B+Tree Growing Animation ──
function BTreeAnimation() {
  const [grown, setGrown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setGrown(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const rootNode = {x: 200, y: 30};
  const internalNodes = [
    {x: 80, y: 100},
    {x: 200, y: 100},
    {x: 320, y: 100},
  ];
  const leafNodes = [
    {x: 30, y: 180},
    {x: 115, y: 180},
    {x: 200, y: 180},
    {x: 285, y: 180},
    {x: 370, y: 180},
  ];

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0}}
      animate={isInView ? {opacity: 1} : {}}
      transition={{duration: 0.5}}
      className="my-6 flex justify-center"
    >
      <svg
        viewBox="0 0 400 230"
        className="w-full max-w-md"
        style={{maxHeight: 230}}
      >
        {internalNodes.map((node, i) => (
          <motion.line
            key={`r2i-${i}`}
            x1={rootNode.x}
            y1={rootNode.y + 15}
            x2={node.x}
            y2={node.y - 15}
            stroke="#3b82f644"
            strokeWidth="1.5"
            initial={{pathLength: 0}}
            animate={grown ? {pathLength: 1} : {}}
            transition={{delay: 0.3 + i * 0.15, duration: 0.5}}
          />
        ))}

        {leafNodes.map((leaf, i) => {
          const parent = internalNodes[Math.floor(i / 2)];
          return (
            <motion.line
              key={`i2l-${i}`}
              x1={parent.x}
              y1={parent.y + 15}
              x2={leaf.x}
              y2={leaf.y - 15}
              stroke="#3b82f644"
              strokeWidth="1.5"
              initial={{pathLength: 0}}
              animate={grown ? {pathLength: 1} : {}}
              transition={{delay: 0.6 + i * 0.1, duration: 0.5}}
            />
          );
        })}

        {leafNodes.map((leaf, i) => {
          if (i === leafNodes.length - 1) return null;
          const next = leafNodes[i + 1];
          return (
            <motion.line
              key={`link-${i}`}
              x1={leaf.x + 28}
              y1={leaf.y}
              x2={next.x - 28}
              y2={next.y}
              stroke="#22c55e44"
              strokeWidth="1"
              strokeDasharray="3,3"
              initial={{opacity: 0}}
              animate={grown ? {opacity: 1} : {}}
              transition={{delay: 1.5, duration: 0.5}}
            />
          );
        })}

        <BTreeNode
          cx={rootNode.x}
          cy={rootNode.y}
          label="Root"
          grown={grown}
          delay={0}
        />

        {internalNodes.map((node, i) => (
          <BTreeNode
            key={`int-${i}`}
            cx={node.x}
            cy={node.y}
            label={["(1, 01-15)", "(2, 01-15)", "(3, 01-15)"][i]}
            grown={grown}
            delay={0.4 + i * 0.15}
            color="#3b82f6"
          />
        ))}

        {leafNodes.map((node, i) => (
          <BTreeNode
            key={`leaf-${i}`}
            cx={node.x}
            cy={node.y}
            label={
              ["(1,01-07)", "(1,08-15)", "(2,01-07)", "(2,08-15)", "(3,01-15)"][
                i
              ]
            }
            grown={grown}
            delay={0.7 + i * 0.1}
            color="#22c55e"
            isLeaf
          />
        ))}

        <motion.text
          x="200"
          y="215"
          textAnchor="middle"
          fill="#4ade80"
          fontSize="11"
          fontFamily="var(--font-mono)"
          initial={{opacity: 0}}
          animate={grown ? {opacity: 1} : {}}
          transition={{delay: 2, duration: 0.5}}
        >
          B+Tree: 复合索引先按 user_id 排序，再按 create_time
          排序，叶子链表支持范围扫描
        </motion.text>
      </svg>
    </motion.div>
  );
}

// ── B+Tree Node sub-component ──
function BTreeNode({
  cx,
  cy,
  label,
  grown,
  delay,
  color = "#3b82f6",
  isLeaf = false,
}: {
  cx: number;
  cy: number;
  label: string;
  grown: boolean;
  delay: number;
  color?: string;
  isLeaf?: boolean;
}) {
  return (
    <motion.g
      initial={{scale: 0, opacity: 0}}
      animate={grown ? {scale: 1, opacity: 1} : {}}
      transition={{delay, duration: 0.4, type: "spring"}}
    >
      <rect
        x={cx - 24}
        y={cy - 14}
        width={isLeaf ? 56 : 48}
        height={28}
        rx="4"
        fill={`${color}15`}
        stroke={color}
        strokeWidth="1.5"
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontFamily="var(--font-mono)"
        fontWeight="600"
      >
        {label}
      </text>
    </motion.g>
  );
}

export default Section02_Index;
