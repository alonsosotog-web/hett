import { useState } from 'react'
import { C } from '../theme.js'
import { Logo, Btn } from '../components/UI.jsx'

const CrossIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="11" y="2" width="4" height="22" rx="2" fill="currentColor" />
    <rect x="2" y="9" width="22" height="4" rx="2" fill="currentColor" />
  </svg>
)
const BookIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M3 5C3 3.9 3.9 3 5 3H13V22H5C3.9 22 3 22.9 3 24V5Z" fill="currentColor" opacity="0.75" />
    <path d="M13 3H21C22.1 3 23 3.9 23 5V24C23 22.9 22.1 22 21 22H13V3Z" fill="currentColor" />
  </svg>
)

function FocusInput({ placeholder, value, onChange, type = 'text', extra }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.09)',
          border: `1.5px solid ${focused ? C.gold : C.cardBdr}`,
          borderRadius: 11, padding: '12px 14px', color: C.text,
          fontSize: 14, fontFamily: C.font, outline: 'none',
          boxSizing: 'border-box', caretColor: C.gold,
          transition: 'border-color 0.2s',
        }}
      />
      {extra}
    </div>
  )
}

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleIngresar = () => {
    setError('')
    if (!rol) { setError('Seleccioná tu perfil primero'); return }
    if (rol === 'profesor') {
      if (pass !== '439union') { setError('Contraseña incorrecta'); return }
      onLogin({ rol: 'profesor', nombre: 'Profesor' })
    } else {
      if (!nombre.trim() || !apellido.trim()) { setError('Ingresá tu nombre y apellido'); return }
      onLogin({ rol: 'estudiante', nombre: nombre.trim(), apellido: apellido.trim() })
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: C.font, padding: 20, position: 'relative', overflow: 'hidden',
      background: C.bg,
    }}>
      {/* Destellos de luz */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 28% 15%,rgba(255,160,80,0.22),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 40% at 72% 8%,rgba(255,220,130,0.13),transparent 55%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%', background: 'linear-gradient(0deg,rgba(4,14,20,0.55),transparent)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(6,28,38,0.88)', backdropFilter: 'blur(28px)',
        borderRadius: 28, border: '1px solid rgba(240,150,80,0.22)',
        padding: '42px 34px 38px',
        boxShadow: '0 20px 70px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,200,120,0.08)',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Logo size="lg" overlay />
        </div>

        {/* Selector de rol */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { id: 'profesor', label: 'Profesor', Icon: CrossIcon },
            { id: 'estudiante', label: 'Estudiante', Icon: BookIcon },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setRol(id); setError('') }} style={{
              padding: '22px 10px', borderRadius: 16, cursor: 'pointer',
              fontFamily: C.font,
              border: rol === id ? `2px solid ${C.coral}` : `1.5px solid ${C.cardBdr}`,
              background: rol === id
                ? 'linear-gradient(135deg,rgba(180,65,20,0.65),rgba(100,30,10,0.65))'
                : 'rgba(255,255,255,0.08)',
              color: rol === id ? '#fff' : C.textMuted,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              boxShadow: rol === id ? `0 4px 20px rgba(200,85,32,0.4)` : 'none',
              transition: 'all 0.2s',
            }}>
              <Icon />
              <span style={{ fontSize: 11, letterSpacing: 2.5, fontWeight: 800, textTransform: 'uppercase' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Campos */}
        {rol === 'estudiante' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <FocusInput placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
            <FocusInput placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />
          </div>
        )}
        {rol === 'profesor' && (
          <div style={{ marginBottom: 14 }}>
            <FocusInput
              placeholder="Contraseña"
              type={showPass ? 'text' : 'password'}
              value={pass}
              onChange={e => setPass(e.target.value)}
              extra={
                <button onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.textMuted, fontSize: 10, letterSpacing: 1, fontFamily: C.font,
                }}>
                  {showPass ? 'OCULTAR' : 'VER'}
                </button>
              }
            />
          </div>
        )}

        {error && (
          <div style={{ color: '#ffaaaa', fontSize: 12, marginBottom: 12, textAlign: 'center', background: 'rgba(200,0,0,0.18)', borderRadius: 8, padding: '7px 12px' }}>
            {error}
          </div>
        )}

        <Btn full onClick={handleIngresar}>✦ Ingresar</Btn>

        {rol === 'estudiante' && (
          <p style={{ color: C.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 1.7 }}>
            💡 Ingresa con tu nombre y apellido<br />
            <span style={{ color: 'rgba(240,140,80,0.55)' }}>No se requiere contraseña adicional</span>
          </p>
        )}
      </div>
      <style>{`input::placeholder{color:rgba(255,210,170,0.32)}`}</style>
    </div>
  )
}
