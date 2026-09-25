import { Shuffle, Play, AlertTriangle, ArrowDownAZ } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GRAPH_PRESETS } from '@/data/graphs';

export const InputPanel = ({
  kind,
  arrayText,
  setArrayText,
  target,
  setTarget,
  edgesText,
  onEdgesChange,
  startNode,
  setStartNode,
  preset,
  onPresetChange,
  onApply,
  onRandomize,
  onSortForMe,
  error,
  warning,
}) => {
  const isSort = kind === 'sort' || kind === 'merge';

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {(isSort || kind === 'binary') && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="array-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {kind === 'binary' ? 'Sorted Array' : 'Array'} (comma or space separated)
            </Label>
            <Input
              id="array-input"
              data-testid="input-custom-array"
              value={arrayText}
              onChange={(e) => setArrayText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onApply()}
              placeholder="e.g. 5, 2, 9, 1, 7"
              className="font-mono"
            />
          </div>

          {kind === 'binary' && (
            <div className="w-full sm:w-28">
              <Label htmlFor="target-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target
              </Label>
              <Input
                id="target-input"
                data-testid="input-target-value"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onApply()}
                placeholder="23"
                className="font-mono"
              />
            </div>
          )}

          <div className="flex gap-2">
            {isSort && (
              <Button data-testid="btn-generate-random" variant="outline" onClick={onRandomize}>
                <Shuffle className="mr-1.5 h-4 w-4" /> Randomize
              </Button>
            )}
            <Button data-testid="btn-apply-input" onClick={onApply}>
              <Play className="mr-1.5 h-4 w-4" /> Run
            </Button>
          </div>
        </div>
      )}

      {kind === 'graph' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-56">
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preset Graph
              </Label>
              <Select value={preset} onValueChange={onPresetChange}>
                <SelectTrigger data-testid="graph-preset-select">
                  <SelectValue placeholder="Choose a preset" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GRAPH_PRESETS).map(([key, p]) => (
                    <SelectItem key={key} value={key}>
                      {p.label}
                    </SelectItem>
                  ))}
                  {preset === 'custom' && <SelectItem value="custom">Custom</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-28">
              <Label htmlFor="start-node" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Start Node
              </Label>
              <Input
                id="start-node"
                data-testid="input-start-node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button data-testid="btn-apply-input" onClick={onApply}>
              <Play className="mr-1.5 h-4 w-4" /> Run
            </Button>
          </div>
          <div>
            <Label htmlFor="edges-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Edges (undirected, e.g. 0-1, 1-2, 2-0)
            </Label>
            <Textarea
              id="edges-input"
              data-testid="input-graph-edges"
              value={edgesText}
              onChange={(e) => onEdgesChange(e.target.value)}
              rows={2}
              className="font-mono text-sm"
            />
          </div>
        </div>
      )}

      {warning && (
        <div
          data-testid="input-warning"
          className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <span>{warning}</span>
            {onSortForMe && (
              <Button
                data-testid="btn-sort-for-me"
                variant="outline"
                size="sm"
                onClick={onSortForMe}
                className="ml-3 mt-2 h-7"
              >
                <ArrowDownAZ className="mr-1 h-3.5 w-3.5" /> Sort it for me
              </Button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          data-testid="input-error"
          className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
