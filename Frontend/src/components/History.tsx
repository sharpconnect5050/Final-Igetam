import { DownloadItem, PLATFORM_STYLES } from '@/types';

interface Props {
  items: DownloadItem[];
  onReDownload: (item: DownloadItem) => void;
  onClear: () => void;
}

export default function History({ items, onReDownload, onClear }: Props) {
  if (!items.length) return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{ fontSize: 48, marginBottom: 12, opacity: .4 }}>📂</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--txt2)', marginBottom: 6 }}>No history yet</div>
      <div style={{ fontSize: 13, color: 'var(--txt3)' }}>Completed downloads will appear here</div>
    </div>
  );
  return (
    <div>
      {items.map(item => {
        const s = PLATFORM_STYLES[item.platform] ?? PLATFORM_STYLES['Web'];
        return (
          <div key={item.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={s.color} strokeWidth="1.5"/><path d="M7 10.5l2.5 2.5L14 8" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 5 }}>{item.title}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{item.platform}</span>
                  <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{item.format.toUpperCase()}</span>
                  {item.completedAt && <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{item.completedAt}</span>}
                </div>
              </div>
              <button onClick={() => onReDownload(item)} style={{ fontSize: 11, padding: '6px 12px', background: 'transparent', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--txt2)', whiteSpace: 'nowrap', transition: 'all .2s' }}>↓ Re-dl</button>
            </div>
          </div>
        );
      })}
      <button onClick={onClear} style={{ width: '100%', padding: 14, border: '1px solid #7f1d1d', background: '#1a0909', borderRadius: 12, color: 'var(--red)', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
        🗑 Clear all history
      </button>
    </div>
  );
}