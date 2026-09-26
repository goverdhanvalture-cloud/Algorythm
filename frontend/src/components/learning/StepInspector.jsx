import { Eye, HelpCircle, Terminal } from 'lucide-react';

export const StepInspector = ({ step }) => {
  if (!step) return null;
  const trace = step.trace || {};
  const entries = Object.entries(trace);

  return (
    <div data-testid="inspector-panel" className="grid gap-3 lg:grid-cols-3">
      <div
        data-testid="inspector-whats-happening"
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-2 flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What&apos;s Happening
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-foreground">{step.what}</p>
      </div>

      <div
        data-testid="inspector-why-this-step"
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-2 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Why This Step
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{step.why}</p>
      </div>

      <div
        data-testid="inspector-trace-variables"
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-2 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step Details
          </h3>
        </div>
        {entries.length === 0 ? (
          <p className="font-mono text-xs text-muted-foreground">no state</p>
        ) : (
          <dl className="space-y-1.5">
            {entries.map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-3 text-xs">
                <dt className="font-mono text-muted-foreground">{k}</dt>
                <dd className="max-w-[60%] break-words text-right font-mono font-semibold text-foreground">
                  {String(v)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
};
