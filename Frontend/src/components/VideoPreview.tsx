import Image from 'next/image';
import FormatPicker from './FormatPicker';
import { VideoInfo, FormatOption } from '@/types';

interface Props {
  info: VideoInfo;
  selectedFormat: FormatOption;
  onSelectFormat: (f: FormatOption) => void;
  onDownload: () => void;
}

export default function VideoPreview({ info, selectedFormat, onSelectFormat, onDownload }: Props) {
  return (
    <div>
      <div style={{ width: '100%', minHeight: 200, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {info.thumbnail ? (
          <Image src={info.thumbnail} alt={info.title} fill style={{ objectFit: 'contain' }} unoptimized />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', minHeight: 200 }}>
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none"><path d="M6 3.5l12 6.5-12 6.5V3.5z" fill="#a78bfa"/></svg>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,.75)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600, backdropFilter: 'blur(4px)' }}>{info.durationStr}</div>
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.7)', borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 600, color: 'var(--p2)', backdropFilter: 'blur(4px)' }}>{info.platform}</div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, marginBottom: 5 }}>{info.title}</div>
      <div style={{ fontSize: 12, color: 'var(--txt2)', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>{info.channel}</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--txt3)', display: 'inline-block' }} />
        <span>{info.viewCount}</span>
        {info.uploadDate && <><span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--txt3)', display: 'inline-block' }} /><span>{info.uploadDate}</span></>}
      </div>

      <FormatPicker selected={selectedFormat} onSelect={onSelectFormat} />

      <button onClick={onDownload} style={{ width: '100%', padding: 16, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg,#7c6df0,#c084fc)', border: 'none', borderRadius: 14, color: '#fff', boxShadow: '0 6px 24px rgba(124,109,240,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2v12M5 9l5 6 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 18h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        Download — {selectedFormat.label} {selectedFormat.badge}
      </button>
    </div>
  );
}