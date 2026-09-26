import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { getStateColor } from '@/data/theme';

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
  const rowHeight = 60;

  return (
    <div className="h-full w-full overflow-auto px-4 py-6">
      <div className="relative mx-auto min-w-[320px] max-w-4xl" style={{ height: (maxDepth + 1) * rowHeight }}>
        {rows.map((rowNodes, d) => {
          let label = `LEVEL ${d}`;
          if (d === 0) label = 'ORIGINAL ARRAY';
          else if (d === maxDepth) label = 'SINGLE ELEMENTS';
          
          return (
            <div key={d} className="absolute left-0 right-0" style={{ top: d * rowHeight, height: rowHeight - 12 }}>
              <div className="absolute -left-2 top-2 -translate-x-full text-right font-mono text-[10px] font-semibold text-muted-foreground opacity-60">
                {label}
              </div>
              {rowNodes.map((node) => {
                const state = node.status || 'original';
                const c = getStateColor(theme, state);
                const leftPct = (node.lo / total) * 100;
                const widthPct = ((node.hi - node.lo + 1) / total) * 100;
                const isActive = node.id === step.activeId;
                
                return (
                  <motion.div
                    key={node.id}
                    layout
                    className="absolute flex items-center justify-center gap-1 rounded-lg px-1 py-1"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      top: 0,
                      height: rowHeight - 12,
                      backgroundColor: c.bg,
                      border: `1.5px solid ${c.border}`,
                      boxShadow: isActive ? `0 0 0 3px ${c.border}40` : 'none',
                    }}
                  >
                    {node.values.map((val, idx) => {
                      const comparing = (node.comparing || []).includes(idx);
                      const cmpColor = getStateColor(theme, 'comparing');
                      
                      return (
                        <div
                          key={idx}
                          className="flex flex-1 items-center justify-center rounded font-mono text-xs font-bold"
                          style={{
                            color: comparing ? cmpColor.text : c.text,
                            backgroundColor: comparing ? cmpColor.bg : 'transparent',
                            border: comparing ? `2px solid ${cmpColor.border}` : '2px solid transparent',
                            minWidth: 0,
                            height: '100%',
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
          );
        })}
      </div>
    </div>
  );
};
