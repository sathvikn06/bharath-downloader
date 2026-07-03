import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Mic, Wand2, Loader2, Upload, Music } from 'lucide-react';

export function StudioView() {
  const [activeTab, setActiveTab] = useState<'trim' | 'vocals' | 'clone' | 'music'>('trim');

  return (
    <div className="w-full">
      <div className="flex gap-4 border-b border-black/10 dark:border-white/10 mb-8 pb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('trim')}
          className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[17px] ${
            activeTab === 'trim' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span className="font-dot tracking-widest uppercase">Trim Media</span>
        </button>
        <button
          onClick={() => setActiveTab('vocals')}
          className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[17px] ${
            activeTab === 'vocals' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span className="font-dot tracking-widest uppercase">Vocal Extractor</span>
        </button>
        <button
          onClick={() => setActiveTab('clone')}
          className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[17px] ${
            activeTab === 'clone' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span className="font-dot tracking-widest uppercase">Voice Clone</span>
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[17px] ${
            activeTab === 'music' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="font-dot tracking-widest uppercase">Music Gen</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'trim' && <TrimTool />}
          {activeTab === 'vocals' && <VocalTool />}
          {activeTab === 'clone' && <CloneTool />}
          {activeTab === 'music' && <MusicTool />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TrimTool() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    if (start) formData.append('startTime', start);
    if (end) formData.append('endTime', end);

    try {
      const res = await fetch('/api/studio/trim', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        let errMessage = 'Failed to trim media';
        try {
          const data = await res.json();
          errMessage = data.error || errMessage;
        } catch (e) {
          errMessage = await res.text();
        }
        throw new Error(errMessage);
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed_${file.name}`;
      a.click();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleProcess} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">Upload Media</label>
        <div className="relative border border-dashed border-black/20 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <input 
            type="file" 
            accept="video/*,audio/*" 
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          <Upload className="w-8 h-8 mb-4 text-black/40 dark:text-white/40" />
          <p className="text-sm font-medium">{file ? file.name : 'Drag & drop or click to upload'}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">Start Time (HH:MM:SS)</label>
          <input 
            type="text" 
            placeholder="00:00" 
            value={start}
            onChange={e => setStart(e.target.value)}
            className="bg-transparent border-b-2 border-black/20 dark:border-white/20 px-4 py-3 text-lg focus:border-black dark:focus:border-white outline-none transition-all font-sans"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">End Time (HH:MM:SS)</label>
          <input 
            type="text" 
            placeholder="00:10" 
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="bg-transparent border-b-2 border-black/20 dark:border-white/20 px-4 py-3 text-lg focus:border-black dark:focus:border-white outline-none transition-all font-sans"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={processing || !file}
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
        <span>TRIM MEDIA</span>
      </button>
    </form>
  );
}

function VocalTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/studio/extract-vocals', {
        method: 'POST',
        body: formData
      });
      
      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.slice(0, 100)}...`);
      }
      
      if (!res.ok) throw new Error(data?.error || 'Failed to extract vocals');
      alert('Vocals extracted successfully (not fully implemented)');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleProcess} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">Upload Audio/Video</label>
        <div className="relative border border-dashed border-black/20 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <input 
            type="file" 
            accept="audio/*,video/*" 
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          <Upload className="w-8 h-8 mb-4 text-black/40 dark:text-white/40" />
          <p className="text-sm font-medium">{file ? file.name : 'Drag & drop or click to upload'}</p>
        </div>
      </div>

      <div className="bg-[#e5e7eb]/50 dark:bg-[#111]/50 border border-black/10 dark:border-white/10 p-4 rounded-xl">
        <p className="text-xs text-black/60 dark:text-white/60 font-medium">
          Requires <code className="font-dot">REPLICATE_API_TOKEN</code> in your environment to run Spleeter models.
        </p>
      </div>

      <button
        type="submit"
        disabled={processing || !file}
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
        <span>EXTRACT VOCALS</span>
      </button>
    </form>
  );
}

function CloneTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !text) return;
    
    setProcessing(true);
    const formData = new FormData();
    formData.append('sample', file);
    formData.append('text', text);

    try {
      const res = await fetch('/api/studio/clone-voice', {
        method: 'POST',
        body: formData
      });
      
      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.slice(0, 100)}...`);
      }
      
      if (!res.ok) throw new Error(data?.error || 'Failed to clone voice');
      alert('Voice cloned successfully (not fully implemented)');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleProcess} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">Upload Voice Sample</label>
        <div className="relative border border-dashed border-black/20 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <input 
            type="file" 
            accept="audio/*" 
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          <Upload className="w-8 h-8 mb-4 text-black/40 dark:text-white/40" />
          <p className="text-sm font-medium">{file ? file.name : 'Upload clean 1-2 min voice sample'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">Text to Speak</label>
        <textarea 
          placeholder="Enter the text you want the cloned voice to say..." 
          value={text}
          onChange={e => setText(e.target.value)}
          className="bg-transparent border border-black/20 dark:border-white/20 rounded-xl px-4 py-3 text-base focus:border-black dark:focus:border-white outline-none transition-all font-sans min-h-[120px] resize-y"
          required
        />
      </div>

      <div className="bg-[#e5e7eb]/50 dark:bg-[#111]/50 border border-black/10 dark:border-white/10 p-4 rounded-xl">
        <p className="text-xs text-black/60 dark:text-white/60 font-medium">
          Requires <code className="font-dot">ELEVENLABS_API_KEY</code> in your environment to run cloning API.
        </p>
      </div>

      <button
        type="submit"
        disabled={processing || !file || !text}
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
        <span>GENERATE SPEECH</span>
      </button>
    </form>
  );
}

function MusicTool() {
  const [prompt, setPrompt] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setProcessing(true);
    try {
      const res = await fetch('/api/studio/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) {
        let errMessage = 'Failed to generate music';
        try {
          const data = await res.json();
          errMessage = data.error || errMessage;
        } catch (e) {
          errMessage = await res.text();
        }
        throw new Error(errMessage);
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated_music.wav`;
      a.click();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleProcess} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-widest font-dot text-black/60 dark:text-white/60">Music Prompt</label>
        <textarea 
          placeholder="Describe the music you want to generate (e.g. A 30-second cinematic orchestral track...)" 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="bg-transparent border border-black/20 dark:border-white/20 rounded-xl px-4 py-3 text-base focus:border-black dark:focus:border-white outline-none transition-all font-sans min-h-[120px] resize-y"
          required
        />
      </div>

      <div className="bg-[#e5e7eb]/50 dark:bg-[#111]/50 border border-black/10 dark:border-white/10 p-4 rounded-xl">
        <p className="text-xs text-black/60 dark:text-white/60 font-medium">
          Requires <code className="font-dot">MUSIC_API_KEY</code> or <code className="font-dot">GEMINI_API_KEY</code> in your environment.
        </p>
      </div>

      <button
        type="submit"
        disabled={processing || !prompt}
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5" />}
        <span>GENERATE MUSIC</span>
      </button>
    </form>
  );
}
