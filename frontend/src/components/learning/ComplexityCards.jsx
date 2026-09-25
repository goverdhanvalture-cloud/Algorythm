const CARDS = [
  { key: 'best', label: 'Best Case', testId: 'complexity-card-best-time' },
  { key: 'average', label: 'Average Case', testId: 'complexity-card-avg-time' },
  { key: 'worst', label: 'Worst Case', testId: 'complexity-card-worst-time' },
  { key: 'space', label: 'Space', testId: 'complexity-card-space' },
];

export const ComplexityCards = ({ meta }) => {
  if (!meta) return null;
  const { complexity } = meta;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-1.5 text-sm font-semibold text-foreground">About {meta.name}</h3>
        <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{meta.description}</p>
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-primary">Intuition: </span>
          {meta.intuition}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.key}
            data-testid={card.testId}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </div>
            <div className="mt-1 font-mono text-base font-bold text-primary sm:text-lg">
              {complexity[card.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
