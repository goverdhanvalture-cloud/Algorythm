import { getStateColor, STATE_LABELS } from '@/data/theme';
import { useTheme } from '@/hooks/useTheme';

const LEGEND_ICON = {
  swapping: '⇄',
  comparing: '⁉',
  sorted: '✓',
  found: '◎',
  visited: '✓',
  active: '▶',
  selected: '●',
  eliminated: '✕',
};

export const Legend = ({ states = [] }) => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {states.map((s) => {
        const c = getStateColor(theme, s);
        return (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              {LEGEND_ICON[s] || ''}
            </span>
            <span className="text-xs font-medium text-muted-foreground">{STATE_LABELS[s]}</span>
          </div>
        );
      })}
    </div>
  );
};
