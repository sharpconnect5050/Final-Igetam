import { VideoInfo } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch(`${API}/info?url=${encodeURIComponent(url)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch video info');
  return json.data as VideoInfo;
}

export function buildDownloadUrl(url: string, format: string, quality: string): string {
  return `${API}/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`;
}