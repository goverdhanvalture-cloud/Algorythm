import { motion } from 'framer-motion';
import { ArrowLeftRight, Lock } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getStateColor } from '@/data/theme';

function barState(i, step) {
  if (step.sortedFrom != null && i >= step.sortedFrom) return 'sorted';
  if ((step.swapping || []).includes(i)) return 'swapping';
  if ((step.comparing || []).includes(i)) return 'comparing';
  return 'neutral';
}

export const BarVisualizer = ({ step }) => {
  const { theme } = useTheme();
  if (!step || !step.array) return null;
  const values = step.array;

  if (values.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Empty array — nothing to visualise.
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const maxH = 240;
  const minH = 34;

  return (
    <div className="flex h-full w-full items-end justify-center gap-1.5 px-2 pb-8 pt-10 sm:gap-2">
      {values.map((v, i) => {
        const state = barState(i, step);
        const c = getStateColor(theme, state);
        const h = minH + ((v - min) / range) * (maxH - minH);
        return (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center" style={{ maxWidth: 56 }}>
            <div className="relative flex w-full flex-col items-center justify-end" style={{ height: maxH + 8 }}>
              {state === 'swapping' && (
                <ArrowLeftRight className="mb-1 h-3.5 w-3.5" style={{ color: c.bg }} />
              )}
              {state === 'sorted' && (
                <Lock className="mb-1 h-3 w-3" style={{ color: c.bg }} />
              )}
              <motion.div
                layout
                initial={false}
                animate={{ height: h, backgroundColor: c.bg, borderColor: c.border }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="flex w-full items-start justify-center rounded-md border pt-1"
                style={{ height: h }}
              >
                <span
                  className="font-mono text-[11px] font-semibold sm:text-xs"
                  style={{ color: c.text }}
                >
                  {v}
                </span>
              </motion.div>
            </div>
            <span className="mt-1.5 font-mono text-[10px] text-muted-foreground">{i}</span>
          </div>
        );
      })}
    </div>
  );
};
