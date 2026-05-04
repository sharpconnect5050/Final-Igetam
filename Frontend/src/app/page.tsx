'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import UrlInput from '@/components/UrlInput';
import VideoPreview from '@/components/VideoPreview';
import DownloadQueue from '@/components/DownloadQueue';
import History from '@/components/History';
import { VideoInfo, DownloadItem, FormatOption, FORMATS } from '@/types';
import { fetchVideoInfo, buildDownloadUrl } from '@/lib/api';

type Tab = 'download' | 'queue' | 'history';

export default function Home() {
  const [tab, setTab] = useState<Tab>('download');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchStatus, setFetchStatus] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>(FORMATS[0]);
  const [queue, setQueue] = useState<DownloadItem[]>([]);
  const [history, setHistory] = useState<DownloadItem[]>([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleFetch = async () => {
    if (!url.trim()) { setError('Please paste a video URL first'); return; }
    setError('');
    setVideoInfo(null);
    setLoading(true);
    setFetchProgress(0);

    const statuses = ['Connecting…', 'Fetching video info…', 'Reading metadata…', 'Preparing preview…'];
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p > 90) p = 90;
      setFetchProgress(p);
      setFetchStatus(statuses[Math.min(3, Math.floor(p / 25))]);
    }, 200);

    try {
      const info = await fetchVideoInfo(url.trim());
      clearInterval(iv);
      setFetchProgress(100);
      setFetchStatus('Done!');
      setTimeout(() => { setVideoInfo(info); setLoading(false); }, 300);
    } catch (err: unknown) {
      clearInterval(iv);
      setLoading(false);
      setFetchProgress(0);
      const msg = err instanceof Error ? err.message : 'Failed to fetch video';
      setError(msg);
    }
  };

  const handleDownload = () => {
    if (!videoInfo) return;
    const id = crypto.randomUUID();
    const item: DownloadItem = {
      id,
      url: url.trim(),
      title: videoInfo.title,
      platform: videoInfo.platform,
      format: selectedFormat.format,
      quality: selectedFormat.quality,
      thumbnail: videoInfo.thumbnail,
      status: 'downloading',
      progress: 0,
    };
    setQueue(prev => [item, ...prev]);
    setTab('queue');

    const dlUrl = buildDownloadUrl(url.trim(), selectedFormat.format, selectedFormat.quality);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    let prog = 0;
    const dur = 5000 + Math.random() * 8000;
    const start = Date.now();
    const iv = setInterval(() => {
      prog = Math.min(99, ((Date.now() - start) / dur) * 100);
      setQueue(prev => prev.map(q => q.id === id ? { ...q, progress: prog } : q));
      if (prog >= 99) {
        clearInterval(iv);
        const done: DownloadItem = {
          ...item,
          status: 'done',
          progress: 100,
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setQueue(prev => prev.filter(q => q.id !== id));
        setHistory(prev => [done, ...prev]);
        showToast('✅ Download saved to your device!');
      }
    }, 300);

    setUrl('');
    setVideoInfo(null);
    showToast('🚀 Download started!');
  };

  const reDownload = (item: DownloadItem) => {
    const dlUrl = buildDownloadUrl(item.url, item.format, item.quality);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('🔄 Re-downloading…');
  };

  const qBadge = queue.length;
  const hBadge = history.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 18px 8px' }}>
        {[
          { name: '▶ YouTube', c: '#f87171', bg: '#1a0a0a', b: '#7f1d1d' },
          { name: '♪ TikTok', c: '#34d399', bg: '#091a14', b: '#065f46' },
          { name: '◎ Instagram', c: '#f472b6', bg: '#1a0910', b: '#831843' },
          { name: 'f Facebook', c: '#60a5fa', bg: '#080f1a', b: '#1e3a5f' },
          { name: '✕ X', c: '#94a3b8', bg: '#0d1117', b: '#334155' },
          { name: '▷ Vimeo', c: '#a09af0', bg: '#0d0b1f', b: '#4c3b9e' },
        ].map(p => (
          <span key={p.name} style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', color: p.c, background: p.bg, border: `1px solid ${p.b}`, flexShrink: 0 }}>{p.name}</span>
        ))}
      </div>

      <div style={{ display: 'flex', background: 'var(--bg2)', borderRadius: 14, margin: '0 18px 16px', padding: 4, border: '1px solid var(--border)' }}>
        {(['download', 'queue', 'history'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px 0', fontSize: 12, fontWeight: tab === t ? 700 : 500, border: 'none', background: tab === t ? 'var(--card)' : 'transparent', color: tab === t ? 'var(--txt)' : 'var(--txt2)', borderRadius: 10, transition: 'all .2s', position: 'relative', boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,.4)' : 'none' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'queue' && qBadge > 0 && <span style={{ position: 'absolute', top: 4, right: 8, background: 'var(--p)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 99, padding: '1px 5px' }}>{qBadge}</span>}
            {t === 'history' && hBadge > 0 && <span style={{ position: 'absolute', top: 4, right: 8, background: 'var(--p)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 99, padding: '1px 5px' }}>{hBadge}</span>}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '0 18px 32px', overflowY: 'auto' }}>
        {tab === 'download' && (
          <>
            <UrlInput url={url} onChange={setUrl} onFetch={handleFetch} loading={loading} fetchProgress={fetchProgress} fetchStatus={fetchStatus} error={error} />
            {videoInfo && (
              <VideoPreview info={videoInfo} selectedFormat={selectedFormat} onSelectFormat={setSelectedFormat} onDownload={handleDownload} />
            )}
          </>
        )}
        {tab === 'queue' && <DownloadQueue items={queue} />}
        {tab === 'history' && <History items={history} onReDownload={reDownload} onClear={() => setHistory([])} />}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 500, color: 'var(--txt)', boxShadow: '0 8px 32px rgba(0,0,0,.5)', zIndex: 999, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </div>
  );
}