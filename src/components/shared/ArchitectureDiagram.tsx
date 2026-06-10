import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: 'default' | 'primary' | 'danger' | 'success' | 'warning';
  shape?: 'rect' | 'circle';
}

interface Arrow {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  color?: string;
}

interface ArchitectureDiagramProps {
  nodes: Node[];
  arrows: Arrow[];
  width?: number;
  height?: number;
  delay?: number;
}

const colorMap = {
  default: { fill: '#1a1a1a', stroke: '#333', text: '#f5f5f5' },
  primary: { fill: '#1a3a5c', stroke: '#3b82f6', text: '#60a5fa' },
  danger: { fill: '#3a1a1a', stroke: '#ef4444', text: '#f87171' },
  success: { fill: '#1a3a1a', stroke: '#22c55e', text: '#4ade80' },
  warning: { fill: '#3a3a1a', stroke: '#f59e0b', text: '#fbbf24' },
};

export function ArchitectureDiagram({ nodes, arrows, width = 500, height = 250, delay = 0 }: ArchitectureDiagramProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-50px' }}
      className="flex justify-center my-6"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg" style={{ maxHeight: height }}>
        {/* Arrows */}
        {arrows.map((arrow, i) => {
          const fromNode = nodes.find(n => n.id === arrow.from);
          const toNode = nodes.find(n => n.id === arrow.to);
          if (!fromNode || !toNode) return null;
          return <ArrowSvg key={i} from={fromNode} to={toNode} label={arrow.label} animated={arrow.animated ?? false} color={arrow.color ?? '#555'} index={i} />;
        })}

        {/* Nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            {node.shape === 'circle' ? (
              <motion.circle
                cx={node.x} cy={node.y} r={node.width ? node.width / 2 : 30}
                fill={colorMap[node.color || 'default'].fill}
                stroke={colorMap[node.color || 'default'].stroke}
                strokeWidth="2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: delay + 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
              />
            ) : (
              <motion.rect
                x={node.x - (node.width || 70) / 2}
                y={node.y - (node.height || 40) / 2}
                width={node.width || 70}
                height={node.height || 40}
                rx="6"
                fill={colorMap[node.color || 'default'].fill}
                stroke={colorMap[node.color || 'default'].stroke}
                strokeWidth="2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: delay + 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
              />
            )}
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill={colorMap[node.color || 'default'].text}
              fontSize="12"
              fontFamily="var(--font-sans)"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

function ArrowSvg({ from, to, label, animated, color = '#555', index }: {
  from: Node; to: Node; label?: string; animated: boolean; color: string; index: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / dist;
  const ny = dy / dist;

  const startX = from.x + nx * 35;
  const startY = from.y + ny * 35;
  const endX = to.x - nx * 35;
  const endY = to.y - ny * 35;

  const arrowSize = 8;
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <g>
      <motion.line
        x1={startX} y1={startY} x2={endX} y2={endY}
        stroke={color} strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        viewport={{ once: true, margin: '-50px' }}
        strokeDasharray={animated ? '5,5' : 'none'}
      />
      {animated && (
        <motion.circle
          r="3"
          fill={color}
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ offsetPath: `path('M${startX},${startY} L${endX},${endY}')` }}
        />
      )}
      {/* Arrow head */}
      <polygon
        points={`${endX},${endY} ${endX - nx * arrowSize + ny * 5},${endY - ny * arrowSize - nx * 5} ${endX - nx * arrowSize - ny * 5},${endY - ny * arrowSize + nx * 5}`}
        fill={color}
      />
      {label && (
        <text x={midX} y={midY - 8} textAnchor="middle" fill="#888" fontSize="10">
          {label}
        </text>
      )}
    </g>
  );
}
