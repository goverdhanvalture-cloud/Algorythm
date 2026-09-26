import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { getStateColor } from '@/data/theme';

function edgeActive(exploreEdge, a, b) {
  if (!exploreEdge) return false;
  const [x, y] = exploreEdge;
  return (x === a && y === b) || (x === b && y === a);
}

export const TreeVisualizer = ({ tree, step, mode, traversalType }) => {
  const { theme } = useTheme();
  if (!tree || !step) return null;

  const { nodes } = tree;
  const visited = step.visited || [];
  const current = step.current;
  const frontier = mode === 'dfs' ? step.stack || [] : step.queue || [];
  const order = step.order || [];

  const nodeState = (id) => {
    if (id === current) return 'active';
    if (visited.includes(id)) return 'visited';
    return 'neutral';
  };

  const edgeColorActive = getStateColor(theme, 'comparing').bg;
  const edgeColorBase = theme === 'dark' ? '#2A4E49' : '#B9CCC9';

  // Compute all edges from the tree
  const edges = [];
  Object.values(nodes).forEach(node => {
    if (node.left != null) edges.push([node.id, node.left]);
    if (node.right != null) edges.push([node.id, node.right]);
  });

  return (
    <div className="flex h-full w-full flex-col gap-3 px-2 py-3">
      <svg viewBox="0 0 600 380" className="h-full max-h-[300px] w-full" role="img" aria-label="Tree traversal diagram">
        {edges.map(([a, b], i) => {
          const pa = nodes[a];
          const pb = nodes[b];
          if (!pa || !pb) return null;
          const active = edgeActive(step.exploreEdge, a, b);
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={active ? edgeColorActive : edgeColorBase}
              strokeWidth={active ? 4 : 2}
            />
          );
        })}
        {Object.values(nodes).map((node) => {
          const state = nodeState(node.id);
          const c = getStateColor(theme, state);
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={22}
                animate={{ fill: c.bg, stroke: c.border }}
                strokeWidth={3}
                className={state === 'active' ? 'pulse-ring' : ''}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                fill={c.text}
              >
                {node.id}
              </text>
              {state === 'visited' && (
                <g transform={`translate(${node.x + 12}, ${node.y - 20})`}>
                  <circle r="8" fill={getStateColor(theme, 'visited').border} />
                  <path d="M -3 0 L -1 2 L 3 -3" stroke="#fff" strokeWidth="1.8" fill="none" />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-secondary/40 p-2.5">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {mode === 'dfs' ? 'Stack (LIFO)' : 'Queue (FIFO)'}
          </div>
          <div className="flex min-h-[28px] flex-wrap items-center gap-1">
            {frontier.length === 0 ? (
              <span className="font-mono text-xs text-muted-foreground">empty</span>
            ) : (
              frontier.map((id, i) => {
                const c = getStateColor(theme, 'selected');
                return (
                  <span
                    key={`${id}-${i}`}
                    className="flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-semibold"
                    style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                  >
                    {id}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-2.5">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Traversal Order {mode === 'dfs' ? `(${traversalType})` : ''}
          </div>
          <div className="flex min-h-[28px] flex-wrap items-center gap-1">
            {order.length === 0 ? (
              <span className="font-mono text-xs text-muted-foreground">—</span>
            ) : (
              order.map((id, i) => {
                const c = getStateColor(theme, 'visited');
                return (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-muted-foreground">→</span>}
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-semibold"
                      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                    >
                      {id}
                    </span>
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
