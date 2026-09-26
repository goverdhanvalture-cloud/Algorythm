import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ALGORITHMS } from '@/data/algorithms';

export const LandingPage = ({ onStart }) => {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl"
      >
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          <span className="font-mono text-primary">Algorythm</span>
        </h1>
        <p className="mb-12 text-xl font-medium tracking-wide text-muted-foreground sm:text-2xl">
          Experience algorithms in motion.
        </p>

        <div className="mb-12 space-y-6">
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            "Watch the thinking,
            <br className="hidden sm:block" /> not just the answer."
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Build intuition by following every comparison, decision, and consequence as it happens.
          </p>
        </div>

        <div className="mb-16 flex flex-col items-center gap-3">
          <Button onClick={onStart} size="lg" className="h-14 px-8 text-lg font-semibold">
            Start Exploring Algorithms
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
