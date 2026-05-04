'use client';
interface Props {
  url: string;
  onChange: (v: string) => void;
  onFetch: () => void;
  loading: boolean;
  fetchProgress: number;
  fetchStatus: string;
  error: string;
}
export default function UrlInput({ url, onChange, onFetch, loading, fetchProgress, fetchStatus, error }: Props) {
  const smartPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith('http')) { onChange(text); }
    } catch { alert('Allow clipboard access to use Smart Paste'); }
  };

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--txt2)', marginBottom: 8 }}>Video URL</div>
      <div style={{ background: 'var(--bg2)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`, borderRadius: 16, padding: '12px 14px', marginBottom: 10, transition: 'border-color .2s' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="url"
            value={url}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onFetch()}
            placeholder="Paste a link from YouTube, TikTok, Instagram…"
            style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 14, color: 'var(--txt)', outline: 'none', minWidth: 0 }}
            autoComplete="off"
          />
          {url && <button onClick={() => onChange('')} style={{ background: 'transparent', border: 'none', color: 'var(--txt3)', fontSize: 14, padding: 4 }}>✕</button>}
          <button onClick={onFetch} disabled={loading} style={{ background: 'linear-gradient(135deg,#7c6df0,#a78bfa)', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', opacity: loading ? .6 : 1 }}>
            {loading ? '…' : 'Fetch'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12, padding: '10px 14px', background: '#1a0909', border: '1px solid #7f1d1d', borderRadius: 10 }}>⚠️ {error}</div>}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: 14, color: 'var(--txt2)', marginBottom: 12 }}>{fetchStatus}</div>
          <div style={{ height: 3, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', maxWidth: 180, margin: '0 auto' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c6df0,#c084fc)', width: `${fetchProgress}%`, transition: 'width .25s', borderRadius: 99 }} />
          </div>
        </div>
      )}

      {!loading && (
        <button onClick={smartPaste} style={{ width: '100%', padding: 12, border: '1px dashed var(--border2)', borderRadius: 12, background: 'transparent', color: 'var(--txt2)', fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .2s' }}>
          📋 Smart paste from clipboard
        </button>
      )}
    </div>
  );
}