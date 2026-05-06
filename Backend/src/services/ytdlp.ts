const youtubeDl = require('youtube-dl-exec');
import { Response } from 'express';

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

function fmtDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function fmtViews(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B views';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M views';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K views';
  return n + ' views';
}

function fmtDate(d: string): string {
  if (!d || d.length < 8) return '';
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const data = await youtubeDl(url, {
    dumpSingleJson: true,
    noPlaylist: true,
    noWarnings: true,
  }) as any;

  return {
    title: data.title ?? 'Unknown',
    thumbnail: data.thumbnail ?? '',
    duration: data.duration ?? 0,
    durationStr: fmtDuration(data.duration ?? 0),
    channel: data.uploader ?? data.channel ?? 'Unknown',
    viewCount: fmtViews(data.view_count ?? 0),
    uploadDate: fmtDate(data.upload_date ?? ''),
    platform: data.extractor_key ?? 'Web',
    webpage_url: data.webpage_url ?? url,
  };
}

export async function streamDownload(
  url: string,
  format: string,
  quality: string,
  res: Response
): Promise<void> {
  const { spawn } = await import('child_process');
  const ytdlpBin = require('youtube-dl-exec').raw;

  let ytFmt: string;
  let ext = 'mp4';
  let mime = 'video/mp4';

  if (format === 'mp3') {
    ytFmt = 'bestaudio/best';
    ext = 'mp3';
    mime = 'audio/mpeg';
  } else if (format === 'webm') {
    ytFmt = `bestvideo[ext=webm][height<=${quality}]+bestaudio[ext=webm]/best[ext=webm]`;
    ext = 'webm';
    mime = 'video/webm';
  } else {
    ytFmt = `bestvideo[ext=mp4][height<=${quality}]+bestaudio[ext=m4a]/best[ext=mp4][height<=${quality}]/best[height<=${quality}]`;
  }

  const args = [
    '-f', ytFmt,
    '--no-playlist',
    '--no-warnings',
    '--merge-output-format', ext,
    '-o', '-',
    url
  ];

  res.setHeader('Content-Disposition', `attachment; filename="igetam.${ext}"`);
  res.setHeader('Content-Type', mime);

  const proc = spawn(ytdlpBin, args);
  proc.stdout.pipe(res);

  return new Promise((resolve, reject) => {
    let errOut = '';
    proc.stderr.on('data', (d: Buffer) => (errOut += d.toString()));
    proc.on('error', reject);
    proc.on('close', (code: number) => {
      if (code !== 0 && !res.headersSent) reject(new Error(errOut || 'Download failed'));
      else resolve();
    });
  });
}