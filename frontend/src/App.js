import { useState } from 'react';
import '@/App.css';
import { ThemeProvider } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { AlgorithmWorkspace } from '@/components/algorithm/AlgorithmWorkspace';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [algoKey, setAlgoKey] = useState('bubble');

  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-background text-foreground">
        <Header algoKey={algoKey} setAlgoKey={setAlgoKey} />
        <main>
          <AlgorithmWorkspace key={algoKey} algoKey={algoKey} />
        </main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <span className="font-mono">Algorythm</span> — Experience algorithms in motion. · WATCH → TRACE → UNDERSTAND
        </footer>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

export default App;
