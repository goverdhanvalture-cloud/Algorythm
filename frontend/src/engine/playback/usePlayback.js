import { useState, useRef, useEffect, useCallback } from 'react';

const BASE_DELAY = 800; // ms at 1x speed

// Shared playback controller reused by every algorithm. It owns nothing about
// visualization; it simply drives an index across a list of pre-generated steps.
export function usePlayback(steps) {
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  // Reset whenever a fresh set of steps is generated.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (index >= total - 1) {
      setPlaying(false);
      return undefined;
    }
    timer.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, total - 1));
    }, BASE_DELAY / speed);
    return clearTimer;
  }, [isPlaying, index, speed, total]);

  useEffect(() => () => clearTimer(), []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p && index >= total - 1) setIndex(0);
      return !p;
    });
  }, [index, total]);

  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const goTo = useCallback(
    (i) => {
      setPlaying(false);
      setIndex(Math.max(0, Math.min(i, total - 1)));
    },
    [total]
  );

  return { index, isPlaying, speed, setSpeed, toggle, next, prev, reset, goTo, total };
}
