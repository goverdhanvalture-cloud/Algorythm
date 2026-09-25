import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getStateColor } from '@/data/theme';

export const BinaryVisualizer = ({ step }) => {
  const { theme } = useTheme();
  if (!step || !step.array) return null;
  const { array, low, high, mid, foundIndex, eliminated = [] } = step;

  if (array.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Empty array — nothing to search.
      </div>
    );
  }

  const cellState = (i) => {
    if (foundIndex === i) return 'found';
    if (eliminated.includes(i)) return 'eliminated';
    if (i === mid) return 'active';
    return 'neutral';
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-3 py-6">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-muted-foreground">target</span>
        <span
          className="rounded-md px-2.5 py-1 font-bold"
          style={{
            backgroundColor: getStateColor(theme, 'found').bg,
            color: getStateColor(theme, 'found').text,
          }}
        >
          {step.target}
        </span>
      </div>

      <div className="no-scrollbar flex w-full items-start justify-center gap-1.5 overflow-x-auto sm:gap-2">
        {array.map((v, i) => {
          const state = cellState(i);
          const c = getStateColor(theme, state);
          const inRange = low >= 0 && i >= low && i <= high;
          const flags = [];
          if (i === low) flags.push('LOW');
          if (i === high && high !== low) flags.push('HIGH');
          if (i === mid) flags.push('MID');
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex h-5 flex-col items-center justify-end gap-0.5">
                {flags.map((f) => (
                  <span
                    key={f}
                    className="rounded px-1 font-mono text-[8px] font-bold leading-tight"
                    style={{
                      backgroundColor: getStateColor(theme, f === 'MID' ? 'active' : 'selected').bg,
                      color: getStateColor(theme, f === 'MID' ? 'active' : 'selected').text,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <motion.div
                animate={{ backgroundColor: c.bg, borderColor: c.border, opacity: state === 'eliminated' ? 0.5 : 1 }}
                className="relative flex h-11 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold sm:h-12 sm:w-11"
                style={{
                  boxShadow: inRange && state !== 'eliminated' ? `0 0 0 2px ${getStateColor(theme, 'selected').border}` : 'none',
                }}
              >
                {state === 'found' && <Target className="absolute -right-1 -top-1 h-3.5 w-3.5" style={{ color: c.bg }} />}
                <span style={{ color: c.text }}>{v}</span>
              </motion.div>
              <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
