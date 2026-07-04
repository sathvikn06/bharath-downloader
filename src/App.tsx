import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Grid2x2, History } from 'lucide-react';
import { useTheme } from './hooks/useStorage';
import { DownloaderView } from './components/DownloaderView';
import { BatchDownloaderView } from './components/BatchDownloaderView';
import { InspectorView } from './components/InspectorView';
import { AnalyzerView } from './components/AnalyzerView';
import { HistoryView } from './components/HistoryView';
import { StrawHatCrew } from './components/StrawHatCrew';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Top Nav */}
      <nav className="w-full px-6 py-5 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-transparent sticky top-0 z-50 bg-[#d1d5db]/80 dark:bg-[#111111]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Grid2x2 className="w-6 h-6" />
          <span className="font-dot font-bold text-lg tracking-tight uppercase">Media Engine</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => scrollTo('formats')} className="hover:opacity-60 transition-opacity outline-none">Downloader</button>
          <button onClick={() => scrollTo('inspector')} className="hover:opacity-60 transition-opacity outline-none">Inspector</button>
          <button onClick={() => scrollTo('history')} className="hover:opacity-60 transition-opacity outline-none">History</button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors outline-none"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => scrollTo('formats')} className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-transform outline-none">
            Start Demo
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 flex flex-col items-center pt-20 pb-20 overflow-hidden">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full mb-16 relative"
        >
          {/* Subtle line through the background */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-black/10 dark:bg-white/10 -z-10"></div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-dot tracking-widest uppercase bg-[#d1d5db] dark:bg-[#111111] px-4 md:px-8 mx-auto inline-block">
            DOWNLOAD.<br className="hidden md:block"/> ANYTHING.
          </h1>
        </motion.div>

        <motion.div
          id="formats"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 relative z-10 scroll-mt-24 mb-16"
        >
          {/* Connection Nodes */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>

          <DownloaderView />
          <BatchDownloaderView />
        </motion.div>
        
        <motion.div
          id="inspector"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 relative z-10 scroll-mt-24 mb-16"
        >
          {/* Connection Nodes */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>

          <InspectorView />
          <AnalyzerView />
        </motion.div>

        <motion.div
          id="history"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 relative z-10 scroll-mt-24"
        >
          {/* Connection Nodes */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#d1d5db] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>

          <div className="flex items-center gap-2 mb-6">
             <History className="w-5 h-5" />
             <h2 className="text-xl font-dot tracking-widest uppercase">Registry</h2>
          </div>
          
          <HistoryView />
        </motion.div>

            </main>
      
      {/* Footer */}
      <StrawHatCrew />
      <footer className="w-full border-t border-black/10 dark:border-white/10 py-8 text-center bg-[#c2c6cc] dark:bg-[#0a0a0a]">
         <div className="flex items-center justify-center gap-2 text-black/50 dark:text-white/50 text-xs font-dot tracking-widest uppercase">
            <Grid2x2 className="w-4 h-4" />
            <span>Media Engine © 2026</span>
         </div>
         <p className="text-[10px] text-black/40 dark:text-white/40 mt-2 font-mono uppercase">
            Powered by Gemini API & FFmpeg
         </p>
      </footer>
    </div>
  );
}
