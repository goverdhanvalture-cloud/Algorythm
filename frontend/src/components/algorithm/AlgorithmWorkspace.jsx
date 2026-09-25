import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ALGORITHMS } from '@/data/algorithms';
import { GRAPH_PRESETS } from '@/data/graphs';
import {
  parseArray,
  isSorted,
  randomArray,
  parseGraph,
  buildGraphModel,
} from '@/algorithms';
import { usePlayback } from '@/engine/playback/usePlayback';
import { InputPanel } from '@/components/controls/InputPanel';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { StepInspector } from '@/components/learning/StepInspector';
import { ComplexityCards } from '@/components/learning/ComplexityCards';
import { Legend } from '@/components/common/Legend';
import { BarVisualizer } from '@/components/visualization/BarVisualizer';
import { MergeVisualizer } from '@/components/visualization/MergeVisualizer';
import { BinaryVisualizer } from '@/components/visualization/BinaryVisualizer';
import { GraphVisualizer } from '@/components/visualization/GraphVisualizer';

const MAX_SORT = 18;
const MAX_BINARY = 24;
const MAX_NODES = 12;
const MAX_EDGES = 24;

export const AlgorithmWorkspace = ({ algoKey }) => {
  const meta = ALGORITHMS[algoKey];

  const [arrayText, setArrayText] = useState('');
  const [target, setTarget] = useState('');
  const [edgesText, setEdgesText] = useState('');
  const [startNode, setStartNode] = useState('0');
  const [preset, setPreset] = useState('simple');
  const [presetPositions, setPresetPositions] = useState(null);

  const [steps, setSteps] = useState([]);
  const [graphModel, setGraphModel] = useState(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const playback = usePlayback(steps);
  const current = steps[playback.index] || steps[0] || null;

  // Initialise defaults + first run whenever the algorithm changes.
  useEffect(() => {
    setError('');
    setWarning('');
    if (meta.kind === 'sort' || meta.kind === 'merge') {
      const def = '5, 2, 9, 1, 7, 3, 8';
      setArrayText(def);
      setSteps(meta.generate(parseArray(def).values));
    } else if (meta.kind === 'binary') {
      const def = '2, 5, 8, 12, 16, 23, 38, 56, 72, 91';
      const tgt = '23';
      setArrayText(def);
      setTarget(tgt);
      setSteps(meta.generate(parseArray(def).values, Number(tgt)));
    } else if (meta.kind === 'graph') {
      const p = GRAPH_PRESETS.simple;
      setPreset('simple');
      setEdgesText(p.edgesText);
      setStartNode(String(p.start));
      setPresetPositions(p.positions);
      const model = buildGraphModel(parseGraph(p.edgesText).edges, p.positions);
      setGraphModel(model);
      setSteps(meta.generate(model, p.start));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoKey]);

  // Keyboard controls: space play/pause, arrows step.
  useEffect(() => {
    const handler = (e) => {
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (e.key === ' ') {
        e.preventDefault();
        playback.toggle();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        playback.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        playback.prev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playback]);

  const runSort = (text) => {
    const { values, error: err } = parseArray(text);
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }
    if (values.length > MAX_SORT) {
      const m = `Please use at most ${MAX_SORT} numbers so the visualisation stays clear.`;
      setError(m);
      toast.error(m);
      return;
    }
    setError('');
    setWarning('');
    setSteps(meta.generate(values));
  };

  const runBinary = (text, tgt) => {
    const { values, error: err } = parseArray(text);
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }
    if (values.length > MAX_BINARY) {
      const m = `Please use at most ${MAX_BINARY} numbers so the visualisation stays clear.`;
      setError(m);
      toast.error(m);
      return;
    }
    if (!/^-?\d+$/.test(String(tgt).trim())) {
      const m = 'Enter a valid integer target value.';
      setError(m);
      toast.error(m);
      return;
    }
    if (!isSorted(values)) {
      setError('');
      setWarning('Binary Search only works on a sorted array. Sort your input first, or use “Sort it for me”.');
      return;
    }
    setError('');
    setWarning('');
    setSteps(meta.generate(values, Number(tgt)));
  };

  const runGraph = (text, start, positions) => {
    const { edges, error: err } = parseGraph(text);
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }
    if (edges.length > MAX_EDGES) {
      const m = `Too many edges (${edges.length}). Use at most ${MAX_EDGES} for a clear diagram.`;
      setError(m);
      toast.error(m);
      return;
    }
    const model = buildGraphModel(edges, positions);
    if (model.nodes.length > MAX_NODES) {
      const m = `Too many nodes (${model.nodes.length}). Use at most ${MAX_NODES} for a clear diagram.`;
      setError(m);
      toast.error(m);
      return;
    }
    const s = Number(String(start).trim());
    if (!model.nodes.includes(s)) {
      const m = `Start node "${start}" is not in the graph. Available nodes: ${model.nodes.join(', ')}.`;
      setError(m);
      toast.error(m);
      return;
    }
    setError('');
    setWarning('');
    setGraphModel(model);
    setSteps(meta.generate(model, s));
  };

  const handleApply = () => {
    if (meta.kind === 'sort' || meta.kind === 'merge') runSort(arrayText);
    else if (meta.kind === 'binary') runBinary(arrayText, target);
    else if (meta.kind === 'graph') runGraph(edgesText, startNode, presetPositions);
  };

  const handleRandomize = () => {
    const arr = randomArray(Math.floor(Math.random() * 5) + 6);
    const text = arr.join(', ');
    setArrayText(text);
    runSort(text);
  };

  const handleSortForMe = () => {
    const { values } = parseArray(arrayText);
    if (!values) return;
    const sorted = [...values].sort((a, b) => a - b);
    const text = sorted.join(', ');
    setArrayText(text);
    runBinary(text, target);
  };

  const handlePresetChange = (key) => {
    if (key === 'custom') return;
    const p = GRAPH_PRESETS[key];
    setPreset(key);
    setEdgesText(p.edgesText);
    setStartNode(String(p.start));
    setPresetPositions(p.positions);
    runGraph(p.edgesText, p.start, p.positions);
  };

  const handleEdgesChange = (v) => {
    setEdgesText(v);
    setPreset('custom');
    setPresetPositions(null);
  };

  const renderVisualizer = () => {
    if (!current) return null;
    if (meta.kind === 'sort') return <BarVisualizer step={current} />;
    if (meta.kind === 'merge') return <MergeVisualizer step={current} />;
    if (meta.kind === 'binary') return <BinaryVisualizer step={current} />;
    if (meta.kind === 'graph') return <GraphVisualizer graph={graphModel} step={current} mode={algoKey} />;
    return null;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      {/* Identity */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 data-testid="algorithm-title" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {meta.name}
          </h1>
          <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-semibold text-accent-foreground">
            {meta.short}
          </span>
        </div>
        <p data-testid="algorithm-description" className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {meta.description}
        </p>
      </div>

      {/* Input */}
      <InputPanel
        kind={meta.kind}
        arrayText={arrayText}
        setArrayText={setArrayText}
        target={target}
        setTarget={setTarget}
        edgesText={edgesText}
        onEdgesChange={handleEdgesChange}
        startNode={startNode}
        setStartNode={setStartNode}
        preset={preset}
        onPresetChange={handlePresetChange}
        onApply={handleApply}
        onRandomize={handleRandomize}
        onSortForMe={meta.kind === 'binary' ? handleSortForMe : null}
        error={error}
        warning={warning}
      />

      {/* Visualization */}
      <div
        data-testid="visualization-canvas"
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-secondary/30 to-card"
      >
        <div className="absolute right-3 top-3 z-10">
          <Legend states={meta.legend} />
        </div>
        <div className="min-h-[360px]">{renderVisualizer()}</div>
      </div>

      {/* Playback */}
      <PlaybackControls playback={playback} current={current} />

      {/* Inspector */}
      <StepInspector step={current} />

      {/* Complexity */}
      <ComplexityCards meta={meta} />
    </div>
  );
};
