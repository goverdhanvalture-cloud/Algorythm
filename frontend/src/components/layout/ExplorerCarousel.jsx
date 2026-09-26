import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALGORITHMS, ALGO_ORDER } from '@/data/algorithms';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ExplorerCarousel = ({ onSelect }) => {
  const [index, setIndex] = useState(() => {
    const st = window.history.state;
    if (st && st.returnedFrom) {
      const idx = ALGO_ORDER.indexOf(st.returnedFrom);
      if (idx >= 0) return idx;
    }
    if (st && st.slideIndex !== undefined) {
      return st.slideIndex;
    }
    return 0;
  });
  const [direction, setDirection] = useState(1);

  const key = ALGO_ORDER[index];
  const meta = ALGORITHMS[key];

  const handleNext = useCallback(() => {
    setIndex((prev) => {
      if (prev < ALGO_ORDER.length - 1) {
        setDirection(1);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setIndex((prev) => {
      if (prev > 0) {
        setDirection(-1);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    const st = window.history.state || {};
    window.history.replaceState({ ...st, slideIndex: index }, '');
  }, [index]);

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-8">
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={key}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="flex w-full flex-col items-center text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="font-mono text-5xl font-extrabold text-muted-foreground/30">
                0{index + 1}
              </span>
            </div>
            
            <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
              {meta.name}
            </h2>
            
            <div className="mb-8 rounded-full bg-secondary/50 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {meta.short}
            </div>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {meta.description}
            </p>

            <div className="mb-12 flex h-32 w-full max-w-md items-center justify-center rounded-xl border border-border bg-card/50 p-6 shadow-sm">
              <div className="text-center font-mono text-sm text-muted-foreground">
                <span className="block font-semibold text-primary">{meta.intuition}</span>
              </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={index === 0}
                className={`h-14 w-[140px] text-base font-semibold ${index === 0 ? 'invisible sm:visible opacity-0 pointer-events-none' : ''}`}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              <Button 
                onClick={() => onSelect(key)} 
                size="lg" 
                className="h-14 w-[280px] text-base font-semibold shadow-md"
              >
                Explore {meta.name} →
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleNext}
                disabled={index === ALGO_ORDER.length - 1}
                className={`h-14 w-[140px] text-base font-semibold ${index === ALGO_ORDER.length - 1 ? 'invisible sm:visible opacity-0 pointer-events-none' : ''}`}
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex h-8 items-center justify-center gap-3">
        {ALGO_ORDER.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
