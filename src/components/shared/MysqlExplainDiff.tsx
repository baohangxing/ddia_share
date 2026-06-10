import {useRef} from "react";
import {motion, useInView} from "framer-motion";
import mysqlExplainDiff from "../../assets/images/mysql-explain-diff.png";

export function MysqlExplainDiff() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 40}}
      animate={isInView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.8, ease: "easeOut"}}
      className="my-8 flex justify-center w-full"
      style={{maxWidth: 1200}}
    >
      <motion.div
        initial={{scale: 0.95}}
        animate={isInView ? {scale: 1} : {}}
        transition={{delay: 0.2, duration: 0.6, ease: "easeOut"}}
        className="w-full rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]"
      >
        <motion.div
          initial={{opacity: 0}}
          animate={isInView ? {opacity: 1} : {}}
          transition={{delay: 0.4, duration: 0.5}}
          className="px-4 py-2 border-b border-[#2a2a2a] flex items-center gap-2"
        >
          <span className="w-3 h-3 rounded-full bg-[#f87171]" />
          <span className="w-3 h-3 rounded-full bg-[#fbbf24]" />
          <span className="w-3 h-3 rounded-full bg-[#4ade80]" />
          <span className="ml-3 text-xs text-[#888] font-mono">
            MySQL EXPLAIN — Before vs After
          </span>
        </motion.div>
        <motion.img
          src={mysqlExplainDiff}
          alt="MySQL EXPLAIN diff: before and after adding index"
          className="w-full h-auto block"
          initial={{opacity: 0, filter: "blur(8px)"}}
          animate={isInView ? {opacity: 1, filter: "blur(0px)"} : {}}
          transition={{delay: 0.5, duration: 0.8}}
        />
      </motion.div>
    </motion.div>
  );
}
