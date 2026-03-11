import { C } from '../theme.js'

export const Logo = ({ size = 'md', overlay = false }) => {
  const s = {
    lg: { outer: 220, hett: 50, top: 9,  sub: 8 },
    md: { outer: 170, hett: 36, top: 8,  sub: 7 },
    sm: { outer: 140, hett: 26, top: 7,  sub: 6 },
  }[size]
  return (
    <div style={{
      background: overlay ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.96)',
      backdropFilter: overlay ? 'blur(14px)' : 'none',
      borderRadius: 14,
      padding: `9px ${Math.round(s.outer / 5.5)}px`,
      textAlign: 'center',
      minWidth: s.outer,
      boxShadow: overlay
        ? '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.28)'
        : '0 8px 32px rgba(0,0,0,0.5)',
      border: overlay
        ? '1px solid rgba(255,255,255,0.22)'
        : '2px solid rgba(200,85,32,0.18)',
    }}>
      <div style={{ fontSize: s.top, letterSpacing: 4, color: overlay ? 'rgba(255,240,220,0.8)' : '#666', textTransform: 'uppercase', fontFamily: C.font, marginBottom: 0, fontWeight: 600 }}>
        IUMP RECOLETA
      </div>
      <div style={{ fontSize: s.hett, fontWeight: 900, color: overlay ? 'rgba(255,248,238,0.96)' : '#111', letterSpacing: 6, lineHeight: 0.9, fontFamily: C.font }}>
        HETT
      </div>
      <div style={{ width: '88%', height: 1.5, background: overlay ? 'linear-gradient(90deg,transparent,rgba(255,200,140,0.65),transparent)' : 'linear-gradient(90deg,transparent,#c85520,transparent)', margin: '4px auto' }} />
      <div style={{ fontSize: s.sub, letterSpacing: 2, color: overlay ? 'rgba(255,220,180,0.75)' : '#b84820', fontFamily: C.font, fontWeight: 700, textTransform: 'uppercase' }}>
        Hoy Es Tu Tiempo · Ven a Jesús
      </div>
    </div>
  )
}

export const Btn = ({ children, onClick, variant = 'gold', full, small, disabled }) => {
  const vs = {
    gold:  { bg: `linear-gradient(135deg,${C.coral},#a04018)`, color: '#fff8f0', border: 'none', sh: `0 4px 20px rgba(200,85,32,0.5)` },
    ghost: { bg: 'rgba(255,255,255,0.09)', color: C.text, border: `1px solid ${C.cardBdr}` },
    teal:  { bg: 'rgba(22,88,100,0.8)', color: '#b0ffee', border: '1px solid rgba(60,200,180,0.3)' },
    green: { bg: C.green, color: '#a0ffcc', border: `1px solid ${C.greenBdr}` },
    red:   { bg: 'rgba(150,35,35,0.6)', color: '#ffb0b0', border: '1px solid rgba(220,60,60,0.4)' },
  }
  const v = vs[variant] || vs.gold
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      background: v.bg, color: v.color, border: v.border, boxShadow: v.sh,
      borderRadius: 30, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: C.font,
      padding: small ? '7px 16px' : full ? '13px 0' : '11px 22px',
      width: full ? '100%' : 'auto',
      opacity: disabled ? 0.5 : 1,
      fontSize: small ? 11 : 13,
      letterSpacing: '1.8px', fontWeight: 800,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      textTransform: 'uppercase',
    }}>
      {children}
    </button>
  )
}

export const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.cardBdr}`, borderRadius: 18,
    padding: '18px 20px', backdropFilter: 'blur(14px)',
    boxShadow: '0 4px 28px rgba(0,0,0,0.35)', ...style,
  }}>
    {children}
  </div>
)

export const Header = ({ children }) => (
  <header style={{
    background: 'rgba(6,24,32,0.94)', backdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${C.cardBdr}`, padding: '12px 20px',
    position: 'sticky', top: 0, zIndex: 20,
  }}>
    {children}
  </header>
)

export const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    background: 'rgba(6,24,32,0.86)', backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${C.cardBdr}`, padding: '0 12px',
    display: 'flex', justifyContent: 'center', gap: 2, overflowX: 'auto',
  }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: C.font, fontSize: 12, letterSpacing: 1.2, whiteSpace: 'nowrap',
        color: active === t.id ? C.gold : C.textMuted,
        borderBottom: active === t.id ? `2.5px solid ${C.coral}` : '2.5px solid transparent',
        fontWeight: active === t.id ? 800 : 400, transition: 'all 0.2s',
      }}>
        {t.label}
      </button>
    ))}
  </div>
)

export const SecTitle = ({ icon, children }) => (
  <div style={{
    color: C.gold, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7, fontWeight: 800,
  }}>
    {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
    {children}
  </div>
)

export const BackIcon = ({ onClick }) => (
  <button onClick={onClick} title="Volver" style={{
    background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.cardBdr}`,
    borderRadius: '50%', width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: C.textMuted, flexShrink: 0,
  }}>
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 2L1 6.5L5 11M1 6.5H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
)
