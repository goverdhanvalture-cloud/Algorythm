import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ALGORITHMS } from '@/data/algorithms';
import { TREE_PRESETS } from '@/data/trees';

import {
  parseArray,
  isSorted,
  randomArray,
  parseCustomTree,
  buildCustomTreeModel,
} from '@/algorithms';
import { usePlayback } from '@/engine/playback/usePlayback';
import { ThinkAhead } from '@/components/learning/ThinkAhead';
import { generateThinkAheadQuestion } from '@/engine/learning/thinkAhead';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BrainCircuit } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { InputPanel } from '@/components/controls/InputPanel';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { StepInspector } from '@/components/learning/StepInspector';
import { ComplexityCards } from '@/components/learning/ComplexityCards';
import { Legend } from '@/components/common/Legend';
import { BarVisualizer } from '@/components/visualization/BarVisualizer';
import { MergeVisualizer } from '@/components/visualization/MergeVisualizer';
import { BinaryVisualizer } from '@/components/visualization/BinaryVisualizer';
import { TreeVisualizer } from '@/components/visualization/TreeVisualizer';

const MAX_SORT = 18;
const MAX_BINARY = 24;
const MAX_NODES = 12;
const MAX_EDGES = 24;

export const AlgorithmWorkspace = ({ algoKey, onBack }) => {
  const meta = ALGORITHMS[algoKey];

  const [learningMode, setLearningMode] = useState(() => {
    const saved = localStorage.getItem('algorythm_learning_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [arrayText, setArrayText] = useState('');
  const [target, setTarget] = useState('');
  const [preset, setPreset] = useState('simple');
  const [traversalType, setTraversalType] = useState('preorder');
  const [customTreeText, setCustomTreeText] = useState('1, 2, 3, 4, 5, null, 7');

  const [steps, setSteps] = useState([]);
  const [treeModel, setTreeModel] = useState(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const playback = usePlayback(steps);
  const currentStepIndex = playback.index;
  const current = steps[currentStepIndex] || steps[0] || null;
  const nextStep = steps[currentStepIndex + 1];

  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    if (!learningMode || !nextStep || !current) return;
    if (activeQuestion) return;

    const q = generateThinkAheadQuestion(current, nextStep, meta.kind);
    if (q) {
      const wasPlaying = playback.isPlaying;
      if (wasPlaying) playback.toggle();
      setActiveQuestion({
        stepIndex: currentStepIndex,
        data: q,
        answered: false,
        isCorrect: null,
        wasPlaying,
      });
    }
  }, [currentStepIndex, nextStep, learningMode, meta.kind, activeQuestion, playback.isPlaying, playback]);

  const handleAnswerQuestion = (optionIndex) => {
    if (!activeQuestion) return;
    const isCorrect = optionIndex === activeQuestion.data.answerIndex;
    setActiveQuestion({
      ...activeQuestion,
      answered: true,
      isCorrect,
    });
    playback.next();
  };

  const handleCloseQuestion = () => {
    if (activeQuestion && activeQuestion.wasPlaying) {
      playback.toggle(); // Resume playing
    }
    setActiveQuestion(null);
  };

  const handleLearningModeToggle = () => {
    const next = !learningMode;
    setLearningMode(next);
    localStorage.setItem('algorythm_learning_mode', next.toString());
    if (!next && activeQuestion) setActiveQuestion(null);
  };

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
    } else if (meta.kind === 'tree') {
      const p = TREE_PRESETS.simple;
      setPreset('simple');
      setTreeModel(p);
      setSteps(meta.generate(p, traversalType));
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

  const runTree = (type, travType, text = customTreeText) => {
    if (type === 'custom') {
      const { values, error: err } = parseCustomTree(text);
      if (err) {
        setError(err);
        toast.error(err);
        return;
      }
      setError('');
      setWarning('');
      const model = buildCustomTreeModel(values);
      setTreeModel(model);
      setSteps(meta.generate(model, travType));
    } else {
      setError('');
      setWarning('');
      const p = TREE_PRESETS[type];
      setTreeModel(p);
      setSteps(meta.generate(p, travType));
    }
  };

  const handleApply = () => {
    if (meta.kind === 'sort' || meta.kind === 'merge') runSort(arrayText);
    else if (meta.kind === 'binary') runBinary(arrayText, target);
    else if (meta.kind === 'tree') runTree(preset, traversalType, customTreeText);
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
    setPreset(key);
    runTree(key, traversalType, customTreeText);
  };

  const handleTraversalChange = (type) => {
    setTraversalType(type);
    runTree(preset, type, customTreeText);
  };

  const renderVisualizer = () => {
    if (!current) return null;
    if (meta.kind === 'sort') return <BarVisualizer step={current} />;
    if (meta.kind === 'merge') return <MergeVisualizer step={current} />;
    if (meta.kind === 'binary') return <BinaryVisualizer step={current} />;
    if (meta.kind === 'tree') return <TreeVisualizer tree={treeModel} step={current} mode={algoKey} traversalType={traversalType} />;
    return null;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      {/* Identity */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-3 text-muted-foreground">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Algorithms
            </Button>
          )}
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
        
        <Button
          variant={learningMode ? "default" : "outline"}
          onClick={handleLearningModeToggle}
          className="shrink-0 font-semibold shadow-sm"
        >
          <BrainCircuit className="mr-2 h-4 w-4" />
          Learning Mode: {learningMode ? 'ON' : 'OFF'}
        </Button>
      </div>

      {/* Input */}
      <InputPanel
        kind={meta.kind}
        arrayText={arrayText}
        setArrayText={setArrayText}
        target={target}
        setTarget={setTarget}
        algoKey={algoKey}
        preset={preset}
        onPresetChange={handlePresetChange}
        traversalType={traversalType}
        onTraversalTypeChange={handleTraversalChange}
        customTreeText={customTreeText}
        setCustomTreeText={setCustomTreeText}
        onApply={handleApply}
        onRandomize={handleRandomize}
        onSortForMe={meta.kind === 'binary' ? handleSortForMe : null}
        error={error}
        warning={warning}
      />

      {/* Visualization */}
      <div
        data-testid="visualization-canvas"
        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-secondary/10"
      >
        <div className="flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{meta.name} VISUALIZATION</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Follow the execution states below</p>
          </div>
          <Legend states={meta.legend} />
        </div>
        <div className="relative min-h-[360px] p-2">
          {renderVisualizer()}
          <AnimatePresence>
            {activeQuestion && (
              <ThinkAhead
                activeQuestion={activeQuestion}
                onAnswer={handleAnswerQuestion}
                onClose={handleCloseQuestion}
              />
            )}
          </AnimatePresence>
        </div>
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
