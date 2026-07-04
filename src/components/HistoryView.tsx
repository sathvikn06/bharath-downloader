import React from 'react';
import { format } from 'timeago.js';
import { Youtube, Instagram, Facebook, Twitter, Music, HelpCircle, FileVideo, Download, RefreshCw, Trash2, History as HistoryIcon } from 'lucide-react';
import { useHistory } from '../hooks/useStorage';
import { Platform, DownloadItem } from '../types';

export function HistoryView() {
  const { history, clearHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <HistoryIcon className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-medium">No download history available.</p>
        <p className="text-sm">Extracted media will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg">Extraction Log</h3>
        <button 
          onClick={clearHistory}
          className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Registry
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ item }: { item: DownloadItem; key?: React.Key }) {
  const handleRedownload = () => {
    const downloadUrl = `/api/download?url=${encodeURIComponent(item.url)}&format=${encodeURIComponent(item.format)}&quality=${encodeURIComponent(item.quality)}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-light-surface dark:bg-cm-blue-light border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
            <PlatformIcon platform={item.platform} />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate" title={item.title || item.url}>
              {item.title || 'Untitled Media'}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)} • {item.quality}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5 text-xs font-mono text-slate-600 dark:text-slate-400 break-all line-clamp-2">
        {item.url}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-slate-400">
          {item.completedAt ? format(item.completedAt) : 'Unknown'}
        </span>
        
        <button 
          onClick={handleRedownload}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-light-blue/10 dark:bg-cm-gold/10 text-light-blue dark:text-cm-gold rounded-full hover:bg-light-blue hover:text-white dark:hover:bg-cm-gold dark:hover:text-cm-blue"
          title="Re-download"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const props = { className: "w-5 h-5 text-slate-500" };
  switch (platform) {
    case 'youtube': return <Youtube {...props} className="w-5 h-5 text-red-500" />;
    case 'instagram': return <Instagram {...props} className="w-5 h-5 text-pink-500" />;
    case 'facebook': return <Facebook {...props} className="w-5 h-5 text-blue-600" />;
    case 'twitter': return <Twitter {...props} className="w-5 h-5 text-sky-500" />;
    case 'tiktok': return <Music {...props} className="w-5 h-5 text-black dark:text-white" />;
    default: return <HelpCircle {...props} />;
  }
}
