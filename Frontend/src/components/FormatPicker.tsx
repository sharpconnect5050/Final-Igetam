import { FORMATS, FormatOption } from '@/types';

interface Props {
  selected: FormatOption;
  onSelect: (f: FormatOption) => void;
}

export default function FormatPicker({ selected, onSelect }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--txt2)', marginBottom: 8 }}>Format & Quality</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
        {FORMATS.map(f => (
          <button key={f.id} onClick={() => onSelect(f)} style={{ padding: '10px 6px', borderRadius: 10, border: `1px solid ${selected.id === f.id ? 'var(--p)' : 'var(--border2)'}`, background: selected.id === f.id ? 'rgba(124,109,240,.12)' : 'var(--bg2)', color: selected.id === f.id ? 'var(--p2)' : 'var(--txt2)', fontSize: 12, fontWeight: selected.id === f.id ? 700 : 500, textAlign: 'center', lineHeight: 1.3, transition: 'all .15s' }}>
            {f.label}
            <span style={{ display: 'block', fontSize: 9, color: selected.id === f.id ? 'var(--p2)' : 'var(--txt3)', marginTop: 2, fontWeight: 400 }}>{f.badge}</span>
          </button>
        ))}
      </div>
    </div>
  );
}