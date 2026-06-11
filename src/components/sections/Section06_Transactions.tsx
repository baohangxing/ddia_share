import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock } from '../shared/CodeBlock';
import { ChapterBadge } from '../shared/ChapterBadge';
import { TechCard } from '../shared/TechCard';
import { AlertBanner } from '../shared/AlertBanner';
import { AnimatedNumber } from '../shared/AnimatedNumber';
import { ddiaChapters } from '../../data/ddiaContent';
import { useSectionVisibility } from '../../contexts/SectionVisibilityContext';

const chapter = ddiaChapters[4]; // DDIA Chapter 7 - Transactions

// ===== Sub-components =====

function WALJournalAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
      className="flex flex-col items-center my-8"
    >
      <p className="text-sm text-[#888] text-center mb-4 font-mono">
        WAL（Write-Ahead Log）：先写日志，再写数据
      </p>

      <svg viewBox="0 0 500 220" className="w-full max-w-lg">
        {/* Data file area (bottom) */}
        <motion.rect
          x="20" y="120" width="460" height="80" rx="8"
          fill="#0d0d0d" stroke="#2a2a2a" strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.text
          x="250" y="165" textAnchor="middle"
          fill="#555" fontSize="13" fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Data File (pages)
        </motion.text>

        {/* WAL area (top) */}
        <motion.rect
          x="20" y="20" width="460" height="60" rx="8"
          fill="#0d0d0d" stroke="#3b82f644" strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        />
        <motion.text
          x="250" y="48" textAnchor="middle"
          fill="#60a5fa" fontSize="13" fontFamily="monospace"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Write-Ahead Log
        </motion.text>

        {/* Log entries flowing into WAL */}
        {[
          { x: 60, label: 'txn=1', color: '#4ade80', delay: 0.6 },
          { x: 160, label: 'A-=100', color: '#f59e0b', delay: 1.0 },
          { x: 260, label: 'B+=100', color: '#f59e0b', delay: 1.4 },
          { x: 360, label: 'commit', color: '#3b82f6', delay: 1.8 },
        ].map((entry, i) => (
          <motion.g key={i}>
            <motion.rect
              x={entry.x - 35} y="28" width="60" height="24" rx="4"
              fill={`${entry.color}18`}
              stroke={entry.color} strokeWidth="1"
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: entry.delay, duration: 0.4, type: 'spring' }}
            />
            <motion.text
              x={entry.x - 5} y="45" textAnchor="middle"
              fill={entry.color} fontSize="11" fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: entry.delay + 0.15 }}
            >
              {entry.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Arrow from WAL to data (fsync) */}
        <motion.path
          d="M 250 80 L 250 120"
          stroke="#3b82f644" strokeWidth="2"
          strokeDasharray="6,4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
        />
        <motion.text
          x="270" y="105"
          fill="#3b82f6" fontSize="10" fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          fsync
        </motion.text>
      </svg>
    </motion.div>
  );
}

function ACIDLetters() {
  const letters = ['A', 'C', 'I', 'D'];
  const labels = ['Atomicity', 'Consistency', 'Isolation', 'Durability'];
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-50px' }}
      className="flex flex-wrap items-center justify-center gap-6 my-10"
    >
      {letters.map((letter, i) => (
        <motion.div
          key={letter}
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.35, duration: 0.5, type: 'spring' }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.span
            className="text-5xl md:text-6xl font-extrabold font-mono"
            style={{ color: colors[i] }}
            animate={{
              textShadow: [
                `0 0 0px ${colors[i]}00`,
                `0 0 25px ${colors[i]}88`,
                `0 0 50px ${colors[i]}44`,
                `0 0 25px ${colors[i]}88`,
                `0 0 0px ${colors[i]}00`,
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 + i * 0.35 }}
          >
            {letter}
          </motion.span>
          <motion.span
            className="text-xs font-mono"
            style={{ color: `${colors[i]}cc` }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.35 }}
          >
            {labels[i]}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ===== Main Section =====

export default function Section06_Transactions() {
  const SECTION_INDEX = 5;
  const { getSectionState } = useSectionVisibility();
  const { mode, activePhase } = getSectionState(SECTION_INDEX);

  const contentVisible = mode !== 'hidden';

  const phase = mode === 'done' ? 8 : activePhase;

  return (
    <section
      className="min-h-screen relative bg-[#050505] py-20 px-4 overflow-hidden"
      style={{ opacity: contentVisible ? 1 : 0, pointerEvents: contentVisible ? 'auto' : 'none', transition: 'opacity 0.5s' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* ===== Phase 0: Title ===== */}
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                微博开始赚钱
              </h2>
              <p className="text-lg text-[#aaa] mb-4">
                用户充值余额，广告系统自动扣费
              </p>
              <div className="flex items-center justify-center gap-8 my-8">
                <motion.div
                  className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <span className="text-sm text-[#888] font-mono">用户 A</span>
                  <AnimatedNumber
                    value={100}
                    duration={1.5}
                    prefix="¥"
                    suffix=" 元"
                    color="#4ade80"
                    className="text-3xl block mt-2"
                  />
                </motion.div>
                <motion.div
                  className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <span className="text-sm text-[#888] font-mono">用户 B</span>
                  <AnimatedNumber
                    value={0}
                    duration={1.5}
                    prefix="¥"
                    suffix=" 元"
                    color="#f87171"
                    className="text-3xl block mt-2"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ===== Phase 1: Transfer SQL ===== */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                A 向 B 转账 ¥100
              </h3>
              <CodeBlock
                code={`-- 第 1 步：扣 A 的钱
UPDATE accounts SET balance = balance - 100 WHERE user = 'A';

-- 第 2 步：加 B 的钱
UPDATE accounts SET balance = balance + 100 WHERE user = 'B';`}
                language="sql"
                delay={0.2}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-[#888] text-center mt-4 font-mono"
              >
                两条独立的 UPDATE 语句，简单直接。
              </motion.p>
            </motion.div>
          )}

          {/* ===== Phase 2: Power outage + Money Lost ===== */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Animated outage effect */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-lg bg-[#3a1a1a] border border-[#ef444466]"
                  animate={{
                    boxShadow: [
                      '0 0 0px #ef444400',
                      '0 0 40px #ef444466',
                      '0 0 0px #ef444400',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }}
                  >
                    ⚡
                  </motion.span>
                  <span className="text-lg font-bold text-[#f87171] font-mono">
                    断电！数据库崩溃！
                  </span>
                </motion.div>
              </motion.div>

              <p className="text-sm text-[#888] mb-6">
                第 1 步执行了 → 第 2 步没执行 →
              </p>

              {/* Result: A=0, B=0, Money Lost */}
              <motion.div
                className="flex items-center justify-center gap-8 mb-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="bg-[#0d0d0d] border border-[#ef444444] rounded-xl p-5 text-center">
                  <span className="text-sm text-[#888] font-mono">用户 A</span>
                  <motion.p
                    className="text-3xl font-bold font-mono text-[#f87171] mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                  >
                    ¥0
                  </motion.p>
                  <span className="text-[10px] text-[#f87171] font-mono">-100 已扣</span>
                </div>
                <motion.span
                  className="text-2xl text-[#555]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
                <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 text-center">
                  <span className="text-sm text-[#888] font-mono">用户 B</span>
                  <motion.p
                    className="text-3xl font-bold font-mono text-[#f87171] mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: 'spring' }}
                  >
                    ¥0
                  </motion.p>
                  <span className="text-[10px] text-[#f87171] font-mono">+100 未执行</span>
                </div>
              </motion.div>

              <motion.p
                className="text-xl font-bold text-[#ef4444] font-mono"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                💸 ¥100 凭空消失了！
              </motion.p>
            </motion.div>
          )}

          {/* ===== Phase 3: Red alert ===== */}
          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AlertBanner
                message="没有事务保护的数据库：钱会丢、数据会乱、用户会炸！"
                type="error"
                delay={0.1}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-[#888] text-center mt-6 font-mono"
              >
                这两条 UPDATE 必须在同一个事务中 -- 要么全成功，要么全回滚
              </motion.p>
            </motion.div>
          )}

          {/* ===== Phase 4: BEGIN/COMMIT Transaction SQL ===== */}
          {phase === 4 && (
            <motion.div
              key="phase4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                🔧 解决方案：事务
              </h3>
              <p className="text-sm text-[#888] text-center mb-6 font-mono">
                BEGIN 和 COMMIT 之间的操作是原子的
              </p>
              <CodeBlock
                code={`BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE user = 'A';
  UPDATE accounts SET balance = balance + 100 WHERE user = 'B';
COMMIT;
-- 如果中途崩溃，数据库自动 ROLLBACK
-- A 的钱不会丢！`}
                language="sql"
                delay={0.2}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-4 mt-6"
              >
                <span className="text-xs text-[#4ade80] font-mono">✅ 全成功 → COMMIT</span>
                <span className="text-[#444]">|</span>
                <span className="text-xs text-[#f87171] font-mono">❌ 任意失败 → ROLLBACK</span>
              </motion.div>
            </motion.div>
          )}

          {/* ===== Phase 5: WAL Animation ===== */}
          {phase === 5 && (
            <motion.div
              key="phase5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                🪵 事务如何保证持久性？
              </h3>
              <WALJournalAnimation />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-[#aaa] text-center mt-4 max-w-lg mx-auto leading-relaxed"
              >
                崩溃恢复时，数据库读取 WAL 日志：已 COMMIT 的事务重做（Redo），
                未 COMMIT 的事务回滚（Undo）。保证 A 和 B 的余额永远一致。
              </motion.p>
            </motion.div>
          )}

          {/* ===== Phase 6: ACID Letters ===== */}
          {phase === 6 && (
            <motion.div
              key="phase6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                🧬 事务的本质：ACID
              </h3>
              <p className="text-sm text-[#888] text-center mb-4 font-mono">
                四个理想属性，各司其职
              </p>
              <ACIDLetters />
            </motion.div>
          )}

          {/* ===== Phase 7: ChapterBadge ===== */}
          {phase === 7 && (
            <motion.div
              key="phase7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <ChapterBadge
                chapter={chapter.chapter}
                title={chapter.chapterTitle}
                delay={0.2}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-[#aaa] mt-3 italic font-mono"
              >
                &ldquo;{chapter.summary}&rdquo;
              </motion.p>
            </motion.div>
          )}

          {/* ===== Phase 8: All DDIA TechCards ===== */}
          {phase >= 7 && (
            <motion.div
              key="phase8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <h3 className="text-lg font-semibold text-white text-center mb-6">
                🔍 深入理解：DDIA Chapter 7 核心概念
              </h3>

              {chapter.cards.map((card, i) => (
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
          )}
        </AnimatePresence>

        {/* Section transition hint */}
        {phase >= 7 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-xs text-[#333] mt-16 font-mono"
          >
            ↓ 继续向下，了解共识与一致性 ↓
          </motion.p>
        )}
      </div>
    </section>
  );
}
