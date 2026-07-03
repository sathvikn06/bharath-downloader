import { useState, useEffect } from 'react';
import { DownloadItem } from '../types';

const STORAGE_KEY = 'bharat_downloads_history';
const THEME_KEY = 'bharat_theme';

export function useHistory() {
  const [history, setHistory] = useState<DownloadItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addDownload = (item: DownloadItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const updateDownload = (id: string, updates: Partial<DownloadItem>) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const clearHistory = () => setHistory([]);

  return { history, addDownload, updateDownload, clearHistory, setHistory };
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}
