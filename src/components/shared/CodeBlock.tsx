import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: 'ts' | 'sql' | 'bash' | 'text';
  delay?: number;
}

export function CodeBlock({ code, language = 'ts', delay = 0 }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: '-50px' }}
      className="relative group my-4"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] rounded-t-lg border border-b-0 border-[#2a2a2a]">
        <span className="text-xs text-[#888] font-mono uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-[#888] hover:text-white transition-colors px-2 py-1 rounded"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-b-lg overflow-x-auto text-sm font-mono leading-relaxed">
        <code className={language === 'ts' ? 'text-blue-300' : language === 'sql' ? 'text-green-300' : 'text-gray-300'}>
          {code}
        </code>
      </pre>
    </motion.div>
  );
}
