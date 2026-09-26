import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ThinkAhead = ({ activeQuestion, onAnswer, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!activeQuestion || !activeQuestion.data) return null;

  const { data, answered, isCorrect } = activeQuestion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 right-4 z-50 w-full max-w-sm overflow-hidden rounded-xl border border-primary/30 bg-card shadow-2xl"
    >
      <div className="border-b border-primary/10 bg-primary/10 px-4 py-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Think Ahead</h3>
      </div>
      
      <div className="p-4">
        <p className="mb-4 text-sm font-semibold text-foreground">{data.question}</p>
        
        <div className="flex flex-col gap-2">
          {data.options.map((opt, idx) => {
            let btnClass = "h-auto justify-start whitespace-normal px-3 py-2 text-left text-xs font-medium transition-all";
            let variant = "outline";
            
            if (answered) {
              if (idx === data.answerIndex) {
                btnClass += " border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
              } else if (idx === selectedIndex) {
                btnClass += " border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
              } else {
                btnClass += " opacity-40";
              }
            } else {
              if (selectedIndex === idx) {
                btnClass += " border-primary bg-primary/10 text-primary";
              } else {
                btnClass += " hover:bg-secondary/50";
              }
            }

            return (
              <Button
                key={idx}
                variant={variant}
                className={btnClass}
                onClick={() => !answered && setSelectedIndex(idx)}
                disabled={answered}
              >
                <span className="mr-2 font-mono text-[10px] opacity-60">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </Button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Button 
                onClick={() => onAnswer(selectedIndex)} 
                disabled={selectedIndex === null} 
                className="mt-4 h-9 w-full text-xs font-semibold"
              >
                Check Answer
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-xs font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isCorrect ? 'Correct.' : 'Not quite.'}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                {data.explanation}
              </p>
              <Button onClick={onClose} className="h-8 w-full text-xs font-semibold">
                Continue Playback
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
