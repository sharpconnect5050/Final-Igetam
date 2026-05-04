export default function Header() {
  return (
    <div style={{ padding: '16px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c6df0,#c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(124,109,240,.4)' }}>
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <rect x="11" y="2" width="6" height="14" rx="3" fill="#fff"/>
            <path d="M5 13L14 23L23 13Z" fill="#fff"/>
            <rect x="4" y="24" width="20" height="3" rx="1.5" fill="rgba(255,255,255,.6)"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -1 }}>
            I<span style={{ background: 'linear-gradient(135deg,#7c6df0,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>G</span>ETAM
          </div>
          <div style={{ fontSize: 10, color: 'var(--txt3)', letterSpacing: .5 }}>by Qelliot</div>
        </div>
      </div>
      <span style={{ background: '#031a0d', border: '1px solid #14532d', color: '#4ade80', fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }}>● No login</span>
    </div>
  );
}