import { Play, Pause, SkipForward, SkipBack, RotateCcw, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const TYPE_LABELS = {
  start: 'Start',
  compare: 'Compare',
  swap: 'Swap',
  select: 'Select',
  split: 'Split',
  merge: 'Merge',
  visit: 'Visit',
  enqueue: 'Enqueue',
  dequeue: 'Dequeue',
  found: 'Found',
  notFound: 'Not Found',
  complete: 'Complete',
};

export const PlaybackControls = ({ playback, current }) => {
  const { index, total, isPlaying, speed, setSpeed, toggle, next, prev, reset, goTo } = playback;
  const disabled = total === 0;
  const atEnd = index >= total - 1;

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-1.5 sm:justify-start">
          <Button
            data-testid="playback-reset-btn"
            variant="outline"
            size="icon"
            onClick={reset}
            disabled={disabled}
            aria-label="Reset to first step"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            data-testid="playback-prev-btn"
            variant="outline"
            size="icon"
            onClick={prev}
            disabled={disabled || index === 0}
            aria-label="Previous step"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            data-testid="playback-play-pause-btn"
            size="icon"
            onClick={toggle}
            disabled={disabled}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="h-10 w-10"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            data-testid="playback-next-btn"
            variant="outline"
            size="icon"
            onClick={next}
            disabled={disabled || atEnd}
            aria-label="Next step"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div
            data-testid="step-counter-display"
            className="flex items-center gap-2 font-mono text-sm"
          >
            <span className="rounded bg-secondary px-2 py-1 font-semibold text-secondary-foreground">
              {TYPE_LABELS[current?.type] || '—'}
            </span>
            <span className="text-muted-foreground">
              Step <span className="font-semibold text-foreground">{total ? index + 1 : 0}</span> / {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <div className="w-24 sm:w-28">
              <Slider
                data-testid="playback-speed-slider"
                min={0.25}
                max={4}
                step={0.25}
                value={[speed]}
                onValueChange={(v) => setSpeed(v[0])}
                aria-label="Playback speed"
              />
            </div>
            <span className="w-10 font-mono text-xs font-semibold text-muted-foreground">{speed}x</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Slider
          data-testid="playback-progress-bar"
          min={0}
          max={Math.max(total - 1, 0)}
          step={1}
          value={[index]}
          onValueChange={(v) => goTo(v[0])}
          disabled={disabled}
          aria-label="Progress — scrub through steps"
        />
      </div>
    </div>
  );
};
