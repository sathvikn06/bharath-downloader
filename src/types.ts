export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'youtube' | 'pinterest' | 'unknown';

export type DownloadFormat = 'video/mp4' | 'audio/mp3' | 'image/jpeg';
export type DownloadQuality = 'highest' | 'high' | 'medium' | 'low';

export type DownloadStatus = 'idle' | 'downloading' | 'syncing' | 'completed' | 'failed';

export interface DownloadItem {
  id: string;
  url: string;
  platform: Platform;
  format: DownloadFormat;
  quality: DownloadQuality;
  status: DownloadStatus;
  progress: number; // 0 to 100
  title?: string;
  thumbnail?: string;
  createdAt: number;
  completedAt?: number;
  error?: string;
}

export interface AnalyticsData {
  date: string;
  downloads: number;
  successRate: number;
}
