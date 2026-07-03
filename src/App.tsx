import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Grid2x2 } from 'lucide-react';
import { useTheme } from './hooks/useStorage';
import { DownloaderView } from './components/DownloaderView';
import { StudioView } from './components/StudioView';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Top Nav */}
      <nav className="w-full px-6 py-5 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-transparent sticky top-0 z-50 bg-[#F2F2ED]/80 dark:bg-[#111111]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Grid2x2 className="w-6 h-6" />
          <span className="font-dot font-bold text-lg tracking-tight uppercase">Media Engine</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => scrollTo('platform')} className="hover:opacity-60 transition-opacity outline-none">Platform</button>
          <button onClick={() => scrollTo('formats')} className="hover:opacity-60 transition-opacity outline-none">Formats</button>
          <button onClick={() => scrollTo('studio')} className="hover:opacity-60 transition-opacity outline-none">Studio</button>
          <button onClick={() => scrollTo('resources')} className="hover:opacity-60 transition-opacity outline-none">Resources</button>
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
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-dot tracking-widest uppercase bg-[#F2F2ED] dark:bg-[#111111] px-4 md:px-8 mx-auto inline-block">
            FETCH. TRIM.<br className="hidden md:block"/> CLONE.
          </h1>
        </motion.div>

        <motion.div
          id="formats"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 relative z-10 scroll-mt-24"
        >
          {/* Connection Nodes */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>

          <DownloaderView />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full mt-16 mb-16 relative"
        >
          <div className="absolute top-1/2 left-0 w-full h-px bg-black/10 dark:bg-white/10 -z-10"></div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-dot tracking-widest uppercase bg-[#F2F2ED] dark:bg-[#111111] px-4 md:px-8 mx-auto inline-block">
            STUDIO.
          </h1>
        </motion.div>

        <motion.div
          id="studio"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 relative z-10 scroll-mt-24"
        >
          {/* Connection Nodes */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F2F2ED] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
          </div>
          <StudioView />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-black/60 dark:text-white/60 text-center max-w-sm mb-20"
        >
          Media extraction brings universal compatibility to a new era of software development.
        </motion.p>

        {/* Info Grid similar to the screenshot */}
        <motion.div
          id="resources"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 border-t border-black/10 dark:border-white/10 pt-16 px-4 scroll-mt-24"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-4 text-black/80 dark:text-white/80">
              <div className="flex gap-[2px]">
                <div className="w-1 h-4 bg-current"></div>
                <div className="w-1 h-6 bg-current"></div>
                <div className="w-1 h-3 bg-current"></div>
                <div className="w-1 h-5 bg-current"></div>
              </div>
              <span className="font-bold tracking-widest text-xs uppercase">KeyData</span>
            </div>
            <h2 className="text-4xl font-dot tracking-widest">3x</h2>
            <p className="text-sm text-black/60 dark:text-white/60 max-w-[200px]">Faster extraction and processing time.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-4 text-black/80 dark:text-white/80 font-bold uppercase tracking-widest text-xs">
              <Grid2x2 className="w-5 h-5" />
              <span>Cayuse</span>
            </div>
            <h2 className="text-4xl font-dot tracking-widest">90%</h2>
            <p className="text-sm text-black/60 dark:text-white/60 max-w-[200px]">Compression artifacts removed before download.</p>
          </div>

          <div className="flex flex-col gap-4 pt-8 md:pt-0">
            <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed max-w-[250px]">
              Fetch your media. Our engine parses, understands, and extracts from any source seamlessly.
            </p>
            <button onClick={() => scrollTo('formats')} className="bg-black text-white dark:bg-white dark:text-black w-fit px-5 py-2 mt-4 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 outline-none">
              <Grid2x2 className="w-3 h-3" />
              <span>Get Started</span>
            </button>
          </div>
        </motion.div>

        {/* Section 3: The intro blurb */}
        <motion.div
          id="platform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start pt-32 pb-16 px-4 scroll-mt-24"
        >
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-black dark:text-white leading-tight">
              Introducing Gen-1<br/>
              <span className="text-black/40 dark:text-white/40">Our smartest engine capable of extracting any format</span>
            </h2>
            
            <p className="mt-12 text-sm text-black/70 dark:text-white/70 max-w-xs leading-relaxed">
              A new category of engines built to understand and process how media behaves in complex, real-world formats.
            </p>
            
            <button onClick={() => scrollTo('formats')} className="bg-black text-white dark:bg-white dark:text-black w-fit px-5 py-2 mt-8 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 outline-none">
              <Grid2x2 className="w-3 h-3" />
              <span>Try it Now</span>
            </button>
          </div>

          <div className="hidden md:block w-[400px] h-[400px] relative">
            {/* ASCII/Dot art placeholder to match reference image */}
            <div className="absolute inset-0 font-dot text-[8px] leading-[8px] text-black/20 dark:text-white/20 select-none overflow-hidden" style={{ wordBreak: 'break-all' }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i}>{Array.from({ length: 80 }).map(() => (Math.random() > 0.7 ? '+' : '.')).join('')}</div>
              ))}
            </div>
            
            <div className="absolute -bottom-10 -right-10 max-w-[200px]">
              <p className="text-sm font-medium text-black/80 dark:text-white/80 leading-relaxed">
                The first-of-its kind extraction system that can understand and predict state in large distributed platforms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Huge bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full max-w-5xl px-4 mt-20 pb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-black/80 dark:text-white/80 leading-tight max-w-2xl">
            Extract any media down to the highest quality, <span className="text-black/40 dark:text-white/40">and make sure you never lose it again</span>
          </h2>
        </motion.div>
      </main>
    </div>
  );
}
