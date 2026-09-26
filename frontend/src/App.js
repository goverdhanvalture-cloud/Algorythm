import { useState, useEffect } from 'react';
import '@/App.css';
import { ThemeProvider } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { LandingPage } from '@/components/layout/LandingPage';
import { ExplorerCarousel } from '@/components/layout/ExplorerCarousel';
import { AlgorithmWorkspace } from '@/components/algorithm/AlgorithmWorkspace';
import { Toaster } from '@/components/ui/sonner';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, state = {}) => {
    window.history.pushState(state, '', path);
    setCurrentPath(path);
  };

  let content = null;
  let headerAlgoKey = null;

  if (currentPath === '/' || currentPath === '') {
    content = <LandingPage onStart={() => navigate('/explore')} />;
  } else if (currentPath === '/explore') {
    content = <ExplorerCarousel onSelect={(key) => navigate(`/explore/${key}`)} />;
  } else if (currentPath.startsWith('/explore/')) {
    const key = currentPath.split('/')[2];
    headerAlgoKey = key;
    content = <AlgorithmWorkspace algoKey={key} onBack={() => navigate('/explore', { returnedFrom: key })} />;
  } else {
    content = <LandingPage onStart={() => navigate('/explore')} />;
  }

  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-background text-foreground">
        {currentPath !== '/' && currentPath !== '/explore' && (
          <Header />
        )}
        <main className="relative flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
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
