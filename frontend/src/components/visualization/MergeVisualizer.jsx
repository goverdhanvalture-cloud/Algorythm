import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { getStateColor } from '@/data/theme';

const STATUS_STATE = {
  unsorted: 'neutral',
  splitting: 'selected',
  merging: 'comparing',
  sorted: 'sorted',
};

export const MergeVisualizer = ({ step }) => {
  const { theme } = useTheme();
  if (!step || !step.nodes) return null;

  const { nodes, total } = step;
  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Empty array — nothing to visualise.
      </div>
    );
  }

  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const rows = Array.from({ length: maxDepth + 1 }, (_, d) => nodes.filter((n) => n.depth === d));
  const rowHeight = 52;

  return (
    <div className="h-full w-full overflow-auto px-3 py-4">
      <div className="relative mx-auto min-w-[280px]" style={{ height: (maxDepth + 1) * rowHeight }}>
        {rows.map((rowNodes, d) => (
          <div key={d} className="absolute left-0 right-0" style={{ top: d * rowHeight, height: rowHeight - 8 }}>
            <div className="absolute -left-1 top-1 font-mono text-[10px] text-muted-foreground">L{d}</div>
            {rowNodes.map((node) => {
              const state = STATUS_STATE[node.status] || 'neutral';
              const c = getStateColor(theme, state);
              const leftPct = (node.lo / total) * 100;
              const widthPct = ((node.hi - node.lo + 1) / total) * 100;
              const isActive = node.id === step.activeId;
              return (
                <motion.div
                  key={node.id}
                  layout
                  className="absolute flex items-center gap-0.5 rounded-md p-0.5"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: 0,
                    height: rowHeight - 10,
                    outline: isActive ? `2px solid ${c.border}` : 'none',
                    outlineOffset: 2,
                  }}
                >
                  {node.values.map((val, idx) => {
                    const comparing = (node.comparing || []).includes(idx);
                    return (
                      <div
                        key={idx}
                        className="flex flex-1 items-center justify-center rounded font-mono text-[11px] font-semibold"
                        style={{
                          backgroundColor: c.bg,
                          color: c.text,
                          border: `1px solid ${comparing ? getStateColor(theme, 'swapping').bg : c.border}`,
                          boxShadow: comparing ? `0 0 0 2px ${getStateColor(theme, 'swapping').bg}` : 'none',
                          minWidth: 0,
                          height: rowHeight - 14,
                        }}
                      >
                        {val}
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
