import { DownloadItem, PLATFORM_STYLES } from '@/types';

export default function DownloadQueue({ items }: { items: DownloadItem[] }) {
  if (!items.length) return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{ fontSize: 48, marginBottom: 12, opacity: .4 }}>⬇️</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--txt2)', marginBottom: 6 }}>Queue is empty</div>
      <div style={{ fontSize: 13, color: 'var(--txt3)' }}>Start a download and it'll appear here</div>
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
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2v10M5 8l5 5 5-5" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16h14" stroke={s.color} strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 5 }}>{item.title}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{item.platform}</span>
                  <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{item.format.toUpperCase()} {item.quality !== 'audio' ? item.quality + 'p' : ''}</span>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt2)', whiteSpace: 'nowrap' }}>{Math.round(item.progress)}%</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c6df0,#c084fc)', width: `${item.progress}%`, transition: 'width .25s', borderRadius: 99 }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}