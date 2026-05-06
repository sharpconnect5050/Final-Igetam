import { spawn } from 'child_process';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

export function getVideoInfo(url: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    const args = ['--dump-json', '--no-playlist', '--no-warnings', url];
    let out = '';
    let err = '';

    const proc = spawn('yt-dlp', args);
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.stderr.on('data', (d) => (err += d.toString()));

    proc.on('error', () =>
      reject(new Error('yt-dlp not found. Install it: https://github.com/yt-dlp/yt-dlp'))
    );

    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(err || 'Failed to fetch video info'));
      try {
        const data = JSON.parse(out);
        resolve({
          title: data.title ?? 'Unknown',
          thumbnail: data.thumbnail ?? '',
          duration: data.duration ?? 0,
          durationStr: fmtDuration(data.duration ?? 0),
          channel: data.uploader ?? data.channel ?? 'Unknown',
          viewCount: fmtViews(data.view_count ?? 0),
          uploadDate: fmtDate(data.upload_date ?? ''),
          platform: data.extractor_key ?? 'Web',
          webpage_url: data.webpage_url ?? url,
        });
      } catch {
        reject(new Error('Failed to parse video data'));
      }
    });
  });
}

export function streamDownload(
  url: string,
  format: string,
  quality: string,
  res: Response
): Promise<void> {
  return new Promise((resolve, reject) => {
    let ytFmt: string;
    let ext = 'mp4';
    let mime = 'video/mp4';
    let audioArgs: string[] = [];

    if (format === 'mp3') {
      ytFmt = 'bestaudio/best';
      ext = 'mp3';
      mime = 'audio/mpeg';
      audioArgs = ['--extract-audio', '--audio-format', 'mp3', '--audio-quality', '192K'];
    } else if (format === 'webm') {
      ytFmt = `bestvideo[ext=webm][height<=${quality}]+bestaudio[ext=webm]/bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`;
      ext = 'webm';
      mime = 'video/webm';
    } else {
      ytFmt = `bestvideo[ext=mp4][height<=${quality}]+bestaudio[ext=m4a]/bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`;
    }

    const tmpDir = os.tmpdir();
    const tmpFile = path.join(tmpDir, `igetam-${Date.now()}.${ext}`);

    const args = [
      '-f', ytFmt,
      '--no-playlist',
      '--no-warnings',
      '--no-part',
      ...audioArgs,
      ...(format === 'mp3' ? [] : ['--merge-output-format', ext]),
      '-o', tmpFile,
      url
    ];

    const proc = spawn('/usr/local/bin/yt-dlp', args);
    let errOut = '';

    proc.stderr.on('data', (d) => (errOut += d.toString()));

    proc.on('error', () => {
      fs.rmSync(tmpFile, { force: true });
      reject(new Error('yt-dlp not found'));
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        fs.rmSync(tmpFile, { force: true });
        return reject(new Error(errOut || 'Download failed'));
      }

      fs.stat(tmpFile, (statErr, stats) => {
        if (statErr) {
          fs.rmSync(tmpFile, { force: true });
          return reject(new Error('Downloaded file not found'));
        }

        res.setHeader('Content-Disposition', `attachment; filename="igetam.${ext}"`);
        res.setHeader('Content-Type', mime);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Length', stats.size.toString());

        const fileStream = fs.createReadStream(tmpFile);
        fileStream.pipe(res);

        fileStream.on('error', () => {
          fs.rmSync(tmpFile, { force: true });
          if (!res.headersSent) reject(new Error('File read error'));
        });

        fileStream.on('end', () => {
          fs.rmSync(tmpFile, { force: true });
          resolve();
        });
      });
    });
  });
}
