import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Code2, Loader2, Link2, Copy, Check } from 'lucide-react';

export function InspectorView() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsProcessing(true);
    setMetadata(null);
    try {
      const res = await fetch('/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setMetadata(data);
    } catch (err) {
      console.error(err);
      setMetadata({ error: 'Failed to extract metadata' });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (metadata) {
      navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-10">
      <div className="flex items-center gap-2 mb-2">
        <Code2 className="w-5 h-5" />
        <h2 className="text-xl font-dot tracking-widest uppercase">Inspector</h2>
      </div>
      
      <form onSubmit={handleInspect} className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-black/40 dark:text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Paste URL to inspect metadata..."
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-3 pl-11 pr-4 outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isProcessing || !url}
          className="bg-black text-white dark:bg-white dark:text-black px-6 rounded-full text-xs font-bold tracking-widest hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 min-w-[120px]"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'INSPECT'}
        </button>
      </form>

      <AnimatePresence>
        {metadata && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#c2c6cc] dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl p-4 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors outline-none"
                  title="Copy JSON"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-black/60 dark:text-white/60">
                <Link2 className="w-4 h-4" />
                <span className="text-xs font-dot tracking-widest uppercase">Raw Payload</span>
              </div>
              
              <pre className="text-xs font-mono text-black/80 dark:text-white/80 overflow-x-auto whitespace-pre-wrap max-h-96 custom-scrollbar">
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
