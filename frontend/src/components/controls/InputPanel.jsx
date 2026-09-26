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
import { TREE_PRESETS } from '@/data/trees';

export const InputPanel = ({
  kind,
  arrayText,
  setArrayText,
  target,
  setTarget,
  algoKey,
  preset,
  onPresetChange,
  traversalType,
  onTraversalTypeChange,
  customTreeText,
  setCustomTreeText,
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
              onBlur={onApply}
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
                onBlur={onApply}
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
          </div>
        </div>
      )}

      {kind === 'tree' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-56">
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tree Type
              </Label>
              <Select value={preset} onValueChange={onPresetChange}>
                <SelectTrigger data-testid="tree-preset-select">
                  <SelectValue placeholder="Choose a tree type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TREE_PRESETS).map(([key, p]) => (
                    <SelectItem key={key} value={key}>
                      {p.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Tree</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {algoKey === 'dfs' && (
              <div className="w-full sm:w-56">
                <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Traversal
                </Label>
                <Select value={traversalType} onValueChange={onTraversalTypeChange}>
                  <SelectTrigger data-testid="traversal-type-select">
                    <SelectValue placeholder="Traversal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preorder">Preorder (Root, L, R)</SelectItem>
                    <SelectItem value="inorder">Inorder (L, Root, R)</SelectItem>
                    <SelectItem value="postorder">Postorder (L, R, Root)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {preset === 'custom' && (
            <div className="mt-1">
              <Label htmlFor="custom-tree-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                TREE VALUES (Level-order, use null for missing nodes)
              </Label>
              <Input
                id="custom-tree-input"
                data-testid="input-custom-tree"
                value={customTreeText}
                onChange={(e) => setCustomTreeText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onApply()}
                onBlur={onApply}
                placeholder="e.g. 1, 2, 3, 4, 5, null, 7"
                className="font-mono"
              />
            </div>
          )}
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
