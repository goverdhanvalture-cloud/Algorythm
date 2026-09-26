import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getStateColor } from '@/data/theme';

function edgeActive(exploreEdge, a, b) {
  if (!exploreEdge) return false;
  const [x, y] = exploreEdge;
  return (x === a && y === b) || (x === b && y === a);
}

export const GraphVisualizer = ({ graph, step, mode }) => {
  const { theme } = useTheme();
  if (!graph || !step) return null;

  const { nodes, edges, positions } = graph;
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

  return (
    <div className="flex h-full w-full flex-col gap-3 px-2 py-3">
      <svg viewBox="0 0 600 380" className="h-full max-h-[300px] w-full" role="img" aria-label="Graph traversal diagram">
        {edges.map(([a, b], i) => {
          const pa = positions[a];
          const pb = positions[b];
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
        {nodes.map((id) => {
          const p = positions[id];
          const state = nodeState(id);
          const c = getStateColor(theme, state);
          return (
            <g key={id}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={22}
                animate={{ fill: c.bg, stroke: c.border }}
                strokeWidth={3}
                className={state === 'active' ? 'pulse-ring' : ''}
              />
              <text
                x={p.x}
                y={p.y + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                fill={c.text}
              >
                {id}
              </text>
              {state === 'visited' && (
                <g transform={`translate(${p.x + 12}, ${p.y - 20})`}>
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
            Traversal Order
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
