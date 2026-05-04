export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  durationStr: string;
  channel: string;
  viewCount: string;
  uploadDate: string;
  platform: string;
  webpage_url: string;
}

export interface FormatOption {
  id: string;
  label: string;
  format: string;
  quality: string;
  badge: string;
}

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  platform: string;
  format: string;
  quality: string;
  thumbnail: string;
  status: 'pending' | 'downloading' | 'done' | 'error';
  progress: number;
  error?: string;
  completedAt?: string;
}

export const FORMATS: FormatOption[] = [
  { id: 'mp4-1080', label: 'MP4', format: 'mp4', quality: '1080', badge: '1080p HD' },
  { id: 'mp4-720', label: 'MP4', format: 'mp4', quality: '720', badge: '720p' },
  { id: 'mp4-4k', label: 'MP4', format: 'mp4', quality: '2160', badge: '4K UHD' },
  { id: 'mp4-480', label: 'MP4', format: 'mp4', quality: '480', badge: '480p' },
  { id: 'mp3', label: 'MP3', format: 'mp3', quality: 'audio', badge: 'Audio only' },
  { id: 'webm', label: 'WEBM', format: 'webm', quality: '1080', badge: 'Web' },
];

export const PLATFORM_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Youtube:    { color: '#f87171', bg: '#1a0a0a', border: '#7f1d1d' },
  TikTok:     { color: '#34d399', bg: '#091a14', border: '#065f46' },
  Instagram:  { color: '#f472b6', bg: '#1a0910', border: '#831843' },
  Facebook:   { color: '#60a5fa', bg: '#080f1a', border: '#1e3a5f' },
  Twitter:    { color: '#94a3b8', bg: '#0d1117', border: '#334155' },
  Vimeo:      { color: '#a09af0', bg: '#0d0b1f', border: '#4c3b9e' },
  Web:        { color: '#94a3b8', bg: '#111', border: '#333' },
};