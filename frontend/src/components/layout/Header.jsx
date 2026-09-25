import { Sun, Moon, Activity } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { ALGO_ORDER, ALGORITHMS } from '@/data/algorithms';
import { cn } from '@/lib/utils';

export const Header = ({ algoKey, setAlgoKey }) => {
  const { theme, toggle } = useTheme();

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3" data-testid="brand-logo">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-xl font-extrabold tracking-tight text-foreground">
                Algo<span className="text-primary">rythm</span>
              </div>
              <div className="hidden text-[11px] font-medium tracking-wide text-muted-foreground sm:block">
                Experience algorithms in motion.
              </div>
            </div>
          </div>

          <button
            data-testid="theme-toggle-btn"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <nav
          aria-label="Algorithm navigation"
          className="no-scrollbar -mb-px flex gap-1 overflow-x-auto pb-0"
        >
          {ALGO_ORDER.map((key) => {
            const meta = ALGORITHMS[key];
            const active = key === algoKey;
            return (
              <button
                key={key}
                data-testid={meta.testId}
                onClick={() => setAlgoKey(key)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {meta.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
