import { useState, useEffect, useRef } from 'react'

const font = "'Georgia','Times New Roman',serif"

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Enter') handleIngresar() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [rol, pass, nombre, apellido])

  const handleIngresar = () => {
    setError('')
    if (!rol) { setError('Selecciona un perfil primero'); return }
    if (rol === 'profesor') {
      if (pass !== '439union') { setError('Contraseña incorrecta'); return }
      onLogin({ rol: 'profesor', nombre: 'Profesor' })
    } else {
      if (!nombre.trim() || !apellido.trim()) { setError('Ingresa tu nombre y apellido'); return }
      onLogin({ rol: 'estudiante', nombre: nombre.trim(), apellido: apellido.trim() })
    }
  }

  const handleRol = (r) => { setRol(r); setError('') }

  const rolActive = {
    background: 'linear-gradient(155deg,#fffef5,#f5e8c5)',
    border: '2px solid rgba(210,165,45,0.90)',
    boxShadow: '0 8px 22px rgba(140,85,10,0.22), inset 0 1px 0 rgba(255,255,255,1)',
    transform: 'translateY(-2px) scale(1.03)',
  }
  const rolInactive = {
    background: 'rgba(248,238,210,0.55)',
    border: '1.5px solid rgba(190,150,65,0.28)',
  }

  const ProfesorIcon = () => (
    <svg width="46" height="42" viewBox="0 0 64 56" fill="none">
      <rect x="6" y="2" width="52" height="30" rx="4" fill="#2d4a1e"/>
      <rect x="9" y="5" width="46" height="24" rx="3" fill="#3a6028"/>
      <rect x="6" y="2" width="52" height="30" rx="4" fill="none" stroke="#8B6020" strokeWidth="2"/>
      <rect x="6" y="30" width="52" height="3" rx="1" fill="#7a4e18"/>
      <line x1="16" y1="13" x2="32" y2="13" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="17" x2="40" y2="17" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="21" x2="36" y2="21" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="12" y="31" width="8" height="2" rx="1" fill="#e8e0d0"/>
      <rect x="4" y="38" width="56" height="5" rx="2" fill="#9B6830"/>
      <rect x="4" y="38" width="56" height="2.5" rx="2" fill="#b8814a"/>
      <rect x="10" y="43" width="4" height="13" rx="1.5" fill="#8a5a22"/>
      <rect x="50" y="43" width="4" height="13" rx="1.5" fill="#8a5a22"/>
      <ellipse cx="32" cy="57" rx="22" ry="2" fill="rgba(0,0,0,0.10)"/>
    </svg>
  )

  const EstudianteIcon = () => (
    <svg width="46" height="40" viewBox="0 0 64 52" fill="none">
      <ellipse cx="32" cy="50" rx="24" ry="2.2" fill="rgba(0,0,0,0.12)"/>
      <path d="M6,7 Q6,3 10,3 L32,3 L32,45 L10,45 Q6,45 6,41Z" fill="#8B5E28"/>
      <path d="M58,7 Q58,3 54,3 L32,3 L32,45 L54,45 Q58,45 58,41Z" fill="#9B6A32"/>
      <path d="M10,6 L32,6 L32,42 L10,42 Q8,42 8,40 L8,8 Q8,6 10,6Z" fill="#fdf8f0"/>
      <path d="M54,6 L32,6 L32,42 L54,42 Q56,42 56,40 L56,8 Q56,6 54,6Z" fill="#faf4e8"/>
      <rect x="30.5" y="3" width="3" height="42" fill="#6a4218"/>
      <line x1="12" y1="13" x2="27" y2="13" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12" y1="16" x2="27" y2="16" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="25" y2="19" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12" y1="22" x2="27" y2="22" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12" y1="25" x2="24" y2="25" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36" y1="13" x2="51" y2="13" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36" y1="16" x2="51" y2="16" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36" y1="19" x2="50" y2="19" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36" y1="22" x2="51" y2="22" stroke="#d0b898" strokeWidth="1" strokeLinecap="round"/>
      <rect x="12" y="33" width="15" height="5" rx="1" fill="rgba(200,160,55,0.25)"/>
      <line x1="13" y1="35" x2="26" y2="35" stroke="#a08840" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="13" y1="37" x2="24" y2="37" stroke="#a08840" strokeWidth="1" strokeLinecap="round"/>
      <rect x="42" y="10" width="2.5" height="11" rx="0.8" fill="rgba(160,120,50,0.38)"/>
      <rect x="38" y="13.5" width="10" height="2.5" rx="0.8" fill="rgba(160,120,50,0.38)"/>
    </svg>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 16px', fontFamily: font, position: 'relative', overflow: 'hidden',
    }}>
      {/* Fondo: imagen con blur mínimo para que se note bien */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/bg-biblia.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(1.5px) brightness(1.18) saturate(0.82)',
        transform: 'scale(1.04)',
      }} />
      {/* Overlay cálido muy suave — deja ver la imagen */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(220,195,140,0.14)' }} />

      {/* CARD */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 400,
        background: 'linear-gradient(168deg,rgba(255,253,243,0.98) 0%,rgba(250,238,208,0.98) 100%)',
        borderRadius: 16,
        border: '1.5px solid rgba(200,158,50,0.45)',
        padding: '28px 26px 22px',
        boxShadow: '0 30px 80px rgba(20,10,0,0.45), 0 8px 24px rgba(100,60,0,0.22), inset 0 1px 0 rgba(255,248,200,0.90), inset 0 -2px 10px rgba(160,110,20,0.14)',
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: '#9a8060', textTransform: 'uppercase', marginBottom: 5 }}>
            — &nbsp; IUMP Recoleta &nbsp; —
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 3 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(160,118,35,0.58))' }} />
            <span style={{ fontSize: 12, color: 'rgba(175,130,40,0.72)' }}>✦</span>
            <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: 10, lineHeight: 0.9, color: '#3a2508', textIndent: 10, textShadow: '0 1px 4px rgba(60,30,5,0.18)' }}>HETT</div>
            <span style={{ fontSize: 12, color: 'rgba(175,130,40,0.72)' }}>✦</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(160,118,35,0.58),transparent)' }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 4.5, textTransform: 'uppercase', color: '#5a4018', marginBottom: 2 }}>Escuela Bíblica</div>
          <div style={{ fontSize: 9.5, letterSpacing: 1.8, color: '#9a8060' }}>Hoy es tu tiempo · Ven a Jesús</div>
        </div>

        {/* ROLES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { id: 'profesor', label: 'Profesor(a)', desc: 'Panel de clases', icon: <ProfesorIcon /> },
            { id: 'estudiante', label: 'Estudiante', desc: 'Mis tests y biblia', icon: <EstudianteIcon /> },
          ].map(({ id, label, desc, icon }) => (
            <div key={id} onClick={() => handleRol(id)} style={{
              padding: '14px 8px 12px', borderRadius: 8, textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              ...(rol === id ? rolActive : rolInactive),
            }}>
              {icon}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3a2a14', marginTop: 6, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 9, color: '#8a7250' }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* CAMPOS */}
        {rol === 'profesor' && (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña del profesor(a)"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{ width: '100%', padding: '12px 58px 12px 13px', borderRadius: 8, border: '1.5px solid rgba(190,150,55,0.40)', background: 'rgba(255,252,238,0.96)', boxShadow: 'inset 0 2px 5px rgba(100,60,0,0.07)', outline: 'none', fontSize: 13, fontFamily: font, color: '#3a2a14', boxSizing: 'border-box' }}
            />
            <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: '1px solid rgba(190,148,45,0.45)', borderRadius: 6, padding: '4px 10px', background: 'linear-gradient(145deg,#f5e098,#d4980c)', cursor: 'pointer', fontSize: 10, fontFamily: font, color: '#3a1c00', fontWeight: 800, boxShadow: '0 2px 0 #a87008' }}>
              {showPass ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        )}

        {rol === 'estudiante' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 12 }}>
            {[{ph:'Nombre',val:nombre,set:setNombre},{ph:'Apellido',val:apellido,set:setApellido}].map(({ph,val,set}) => (
              <input key={ph} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                style={{ padding: '12px 11px', borderRadius: 8, border: '1.5px solid rgba(190,150,55,0.40)', background: 'rgba(255,252,238,0.96)', boxShadow: 'inset 0 2px 5px rgba(100,60,0,0.07)', outline: 'none', fontSize: 13, fontFamily: font, color: '#3a2a14', width: '100%', boxSizing: 'border-box' }} />
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ background: 'rgba(160,40,40,0.12)', border: '1px solid rgba(160,40,40,0.22)', borderRadius: 8, padding: '7px 12px', marginBottom: 11, fontSize: 12, color: '#7a1f1f', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* BOTÓN */}
        <button onClick={handleIngresar} style={{
          width: '100%', padding: '14px', borderRadius: 40, border: '1px solid rgba(220,165,20,0.60)',
          cursor: 'pointer', background: 'linear-gradient(145deg,#f8d858,#d49810,#a87408)',
          color: '#2a1400', fontFamily: font, fontSize: 13, fontWeight: 900,
          letterSpacing: '4px', textTransform: 'uppercase',
          boxShadow: '0 5px 0 #7a5004, 0 8px 26px rgba(150,80,0,0.32), inset 0 1px 0 rgba(255,248,150,0.55)',
          textShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}>
          ✦ &nbsp; Ingresar &nbsp; ✦
        </button>

        {/* VERSÍCULO */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(190,148,45,0.18)', textAlign: 'center', fontStyle: 'italic', fontSize: 12.5, color: '#6b5a38', lineHeight: 1.78 }}>
          "Lámpara es a mis pies tu palabra,<br />y lumbrera a mi camino."
          <div style={{ fontSize: 10, marginTop: 5, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9a8060', fontStyle: 'normal' }}>— Salmos 119:105</div>
        </div>
      </div>

      <style>{`input::placeholder{color:rgba(110,80,35,0.40)} button:active{transform:translateY(2px)}`}</style>
    </div>
  )
}
