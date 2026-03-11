import { C } from '../theme.js'

export const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 18,
    padding: '20px 22px', backdropFilter: 'blur(14px)',
    boxShadow: '0 4px 28px rgba(0,0,0,0.32)', ...style,
  }}>{children}</div>
)

export const Btn = ({ children, onClick, variant = 'gold', small, full, disabled, style = {} }) => {
  const variants = {
    gold:  { background: disabled ? 'rgba(100,70,10,0.4)' : `linear-gradient(135deg,${C.gold},#a06018)`, color: '#fff8e8', border: 'none', boxShadow: disabled ? 'none' : '0 4px 16px rgba(200,144,26,0.35)' },
    ghost: { background: 'rgba(255,255,255,0.07)', color: C.text, border: `1px solid ${C.cardBorder}` },
    green: { background: C.green, color: '#b0ffcc', border: `1px solid ${C.greenBorder}` },
    red:   { background: 'rgba(160,40,40,0.55)', color: '#ffb0b0', border: '1px solid rgba(220,60,60,0.4)' },
    teal:  { background: C.tealLight, color: C.text, border: `1px solid rgba(100,180,160,0.3)` },
  }
  const v = variants[variant] || variants.gold
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      ...v, borderRadius: 28, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: C.font,
      padding: small ? '7px 16px' : full ? '13px 0' : '11px 22px',
      width: full ? '100%' : 'auto', opacity: disabled ? 0.55 : 1,
      fontSize: small ? 11 : 13, letterSpacing: '1.5px', fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      textTransform: 'uppercase', transition: 'all 0.15s', ...style,
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'scale(1.02)' } }}
      onMouseLeave={e => { e.currentTarget.style.opacity = disabled ? '0.55' : '1'; e.currentTarget.style.transform = 'scale(1)' }}
    >{children}</button>
  )
}

// Icono sutil volver al login (esquina superior derecha del card/header)
export const BackIcon = ({ onClick }) => (
  <button onClick={onClick} title="Volver al inicio de sesión" style={{
    background: 'rgba(255,255,255,0.055)', border: `1px solid rgba(180,210,200,0.12)`,
    borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
    color: 'rgba(220,240,230,0.4)', flexShrink: 0,
  }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,144,26,0.15)'; e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = 'rgba(200,144,26,0.3)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.color = 'rgba(220,240,230,0.4)'; e.currentTarget.style.borderColor = 'rgba(180,210,200,0.12)' }}
  >
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 2L1 6.5L5 11M1 6.5H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
)

export const Header = ({ subtitle, badge, badgeColor, onLogout }) => (
  <header style={{
    background: 'rgba(8,28,28,0.90)', backdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${C.cardBorder}`, padding: '12px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 20,
  }}>
    {/* Logo HETT */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <div style={{ background: '#fff', borderRadius: 9, padding: '6px 15px', textAlign: 'center', boxShadow: '0 3px 14px rgba(0,0,0,0.45)' }}>
        <div style={{ fontSize: 7, letterSpacing: 2.5, color: '#555', marginBottom: 1 }}>JUMP RECOLETA</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#111', letterSpacing: 2, lineHeight: 1, fontFamily: C.font }}>HETT</div>
      </div>
      <div>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: C.gold, textTransform: 'uppercase', marginBottom: 2 }}>HOY ES TU TIEMPO</div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 7 }}>
          {subtitle}
          {badge && <span style={{ fontSize: 9, letterSpacing: 1.5, padding: '2px 9px', borderRadius: 8, background: badgeColor || C.goldLight, border: `1px solid rgba(200,144,26,0.3)`, color: C.gold }}>{badge}</span>}
        </div>
      </div>
    </div>
    {/* Salir + back sutil */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Btn variant="ghost" small onClick={onLogout}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 2H2a1 1 0 00-1 1v8a1 1 0 001 1h2M8 9l3-2L8 5M11 7H5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        Salir
      </Btn>
      <BackIcon onClick={onLogout} />
    </div>
  </header>
)

export const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ background: 'rgba(8,28,28,0.78)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.cardBorder}`, padding: '0 16px', display: 'flex', gap: 2, overflowX: 'auto' }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: '11px 15px', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: C.font, fontSize: 12, letterSpacing: 1, whiteSpace: 'nowrap',
        color: active === t.id ? C.gold : C.textMuted,
        borderBottom: active === t.id ? `2.5px solid ${C.gold}` : '2.5px solid transparent',
        fontWeight: active === t.id ? 800 : 400, transition: 'all 0.2s',
      }}>{t.label}</button>
    ))}
  </div>
)

// Título de sección bold y consistente
export const SecTitle = ({ icon, children }) => (
  <div style={{ color: C.gold, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7, fontWeight: 800, fontFamily: C.font }}>
    {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
    {children}
  </div>
)
