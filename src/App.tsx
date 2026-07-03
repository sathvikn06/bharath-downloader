import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, History, BarChart3, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useTheme } from './hooks/useStorage';
import { DownloaderView } from './components/DownloaderView';
import { HistoryView } from './components/HistoryView';
import { AnalyticsView } from './components/AnalyticsView';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'download' | 'history' | 'analytics'>('download');

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-light-surface dark:bg-cm-blue-light border-b md:border-r border-slate-200 dark:border-slate-800 shadow-xl flex-shrink-0 z-10 relative">
        <div className="p-6">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="h-10 w-10 bg-cm-blue dark:bg-cm-gold rounded-lg flex items-center justify-center shadow-lg">
              <Download className="text-white dark:text-cm-blue w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl tracking-tight text-light-blue dark:text-cm-gold">
                BHARAT
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Media Engine
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <NavButton 
            active={activeTab === 'download'} 
            onClick={() => setActiveTab('download')}
            icon={<Download className="w-4 h-4" />}
            label="Download"
          />
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<History className="w-4 h-4" />}
            label="History"
          />
          <NavButton 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Analytics"
          />
        </div>
        
        <div className="hidden md:block absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 rounded-md">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Local Privacy Active</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-80px)] md:h-screen">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white/50 dark:bg-cm-blue/50 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-heading text-lg font-semibold tracking-wide capitalize">
            {activeTab} Workspace
          </h2>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-cm-gold" /> : <Moon className="w-5 h-5 text-light-blue" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'download' && <DownloaderView />}
                {activeTab === 'history' && <HistoryView />}
                {activeTab === 'analytics' && <AnalyticsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
        active 
          ? 'bg-light-blue text-white dark:bg-cm-gold dark:text-cm-blue shadow-md' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
