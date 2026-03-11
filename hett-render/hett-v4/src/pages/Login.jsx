import { useState } from 'react'
import { C } from '../theme.js'
import { Btn } from '../components/UI.jsx'

const CrossIcon = () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="11" y="2" width="4" height="22" rx="1.5" fill="currentColor"/><rect x="2" y="9" width="22" height="4" rx="1.5" fill="currentColor"/></svg>
const BookIcon  = () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M3 5C3 3.9 3.9 3 5 3H13V20H5C3.9 20 3 20.9 3 22V5Z" fill="currentColor" opacity="0.7"/><path d="M13 3H21C22.1 3 23 3.9 23 5V22C23 20.9 22.1 20 21 20H13V3Z" fill="currentColor"/><path d="M3 22C3 20.9 3.9 20 5 20H21C22.1 20 23 20.9 23 22V24H3V22Z" fill="currentColor" opacity="0.5"/></svg>

function FocusInput({ placeholder, value, onChange, onKeyDown, type = 'text' }) {
  const [foc, setFoc] = useState(false)
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown}
      onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
      style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: `1.5px solid ${foc ? C.gold : 'rgba(180,220,210,0.2)'}`, borderRadius: 10, padding: '11px 14px', color: C.text, fontSize: 14, fontFamily: C.font, outline: 'none', boxSizing: 'border-box', caretColor: C.gold, transition: 'border-color 0.2s' }}
    />
  )
}

export default function Login({ onLogin }) {
  const [rol, setRol]         = useState(null)
  const [nombre, setNombre]   = useState('')
  const [apellido, setApellido] = useState('')
  const [pass, setPass]       = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [err, setErr]         = useState('')
  const [intentos, setIntentos] = useState(0)

  const handleLogin = () => {
    if (!rol) return setErr('Selecciona tu perfil primero')
    if (rol === 'profesor') {
      if (pass === '439union') {
        onLogin({ rol: 'profesor', nombre: 'Profesor', apellido: 'HETT' })
      } else {
        const n = intentos + 1; setIntentos(n); setPass('')
        setErr(n >= 3 ? 'Contraseña incorrecta. Contacta al administrador.' : `Contraseña incorrecta (intento ${n}/3)`)
      }
    } else {
      if (!nombre.trim() || !apellido.trim()) return setErr('Ingresa tu nombre y apellido completos')
      onLogin({ rol: 'estudiante', nombre: nombre.trim(), apellido: apellido.trim() })
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bgGrad, fontFamily: C.font, padding: 20, position: 'relative', overflow: 'hidden' }}>
      {/* Blobs de fondo */}
      <div style={{ position: 'absolute', top: '4%', left: '4%', width: '50%', height: '50%', background: 'radial-gradient(circle,rgba(60,120,110,0.22) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '4%', right: '4%', width: '55%', height: '55%', background: 'radial-gradient(circle,rgba(180,100,40,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, background: C.card, backdropFilter: 'blur(24px)', borderRadius: 26, border: `1px solid ${C.cardBorder}`, padding: '46px 38px 42px', boxShadow: '0 16px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(180,220,200,0.1)' }}>

        {/* ── LOGO HETT grande y bold ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '13px 30px', textAlign: 'center', boxShadow: '0 6px 32px rgba(0,0,0,0.45)', minWidth: 170 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: '#666', marginBottom: 3, textTransform: 'uppercase' }}>Jump Recoleta</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#111', letterSpacing: 3, lineHeight: 1, fontFamily: C.font }}>HETT</div>
            <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#888', marginTop: 4, textTransform: 'uppercase' }}>Hoy Es Tu Tiempo</div>
          </div>
        </div>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: 4, color: C.text, textTransform: 'uppercase', fontFamily: C.font }}>
            Hoy Es Tu Tiempo
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 9 }}>
            <div style={{ height: 1, width: 44, background: 'rgba(200,144,26,0.5)' }} />
            <em style={{ color: C.gold, fontSize: 15 }}>Ven a Jesús</em>
            <div style={{ height: 1, width: 44, background: 'rgba(200,144,26,0.5)' }} />
          </div>
          <div style={{ color: 'rgba(200,144,26,0.55)', marginTop: 5 }}>✦</div>
        </div>

        {/* Roles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
          {[{ id: 'profesor', label: 'Profesor', Icon: CrossIcon }, { id: 'estudiante', label: 'Estudiante', Icon: BookIcon }].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setRol(id); setErr(''); setPass(''); setNombre(''); setApellido('') }} style={{
              padding: '18px 10px', borderRadius: 14, cursor: 'pointer', fontFamily: C.font,
              border: rol === id ? `2px solid ${C.gold}` : '1.5px solid rgba(180,220,210,0.18)',
              background: rol === id ? 'rgba(60,110,100,0.48)' : 'rgba(255,255,255,0.05)',
              color: rol === id ? C.text : 'rgba(220,240,230,0.38)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              transition: 'all 0.2s', boxShadow: rol === id ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
            }}>
              <Icon />
              <span style={{ fontSize: 11, letterSpacing: 2, fontWeight: 800, textTransform: 'uppercase' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Estudiante: nombre + apellido */}
        {rol === 'estudiante' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <FocusInput placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
            <FocusInput placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
        )}

        {/* Profesor: contraseña */}
        {rol === 'profesor' && (
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <FocusInput placeholder="Contraseña" type={mostrar ? 'text' : 'password'} value={pass} onChange={e => { setPass(e.target.value); setErr('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button onClick={() => setMostrar(m => !m)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontFamily: C.font, fontSize: 10, letterSpacing: 1 }}>
              {mostrar ? 'OCULTAR' : 'VER'}
            </button>
          </div>
        )}

        {err && <p style={{ color: '#ff9980', fontSize: 12, margin: '0 0 12px', textAlign: 'center' }}>⚠️ {err}</p>}

        <Btn onClick={handleLogin} full disabled={!rol}>✦ Ingresar</Btn>

        {rol === 'estudiante' && (
          <p style={{ color: C.textMuted, fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 1.7 }}>
            💡 Ingresa con tu nombre y apellido<br />
            <span style={{ color: 'rgba(200,144,26,0.6)' }}>No se requiere contraseña adicional</span>
          </p>
        )}
      </div>
      <style>{`input::placeholder{color:rgba(220,240,230,0.32)}`}</style>
    </div>
  )
}
