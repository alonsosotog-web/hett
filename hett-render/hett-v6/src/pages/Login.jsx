import { useState, useEffect } from 'react'

const fontTitle = "'Georgia','Times New Roman',serif"
const fontBody = "'Inter', sans-serif"

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKey = (e) => e.key === 'Enter' && handleIngresar()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [rol, pass])

  const handleIngresar = () => {
    setError('')
    if (!rol) return setError('Selecciona un perfil')

    if (rol === 'profesor') {
      if (pass !== '439union') return setError('Contraseña incorrecta')
      onLogin({ rol: 'profesor', nombre: 'Profesor' })
    } else {
      onLogin({ rol: 'estudiante' })
    }
  }

  return (
    <div style={bg}>

      {/* OVERLAY */}
      <div style={overlay} />

      {/* CARD */}
      <div style={card}>

        {/* HEADER */}
        <div style={{ textAlign: 'center' }}>
          <div style={top}>IUMP RECOLETA</div>
          <div style={title}>HETT</div>
          <div style={subtitle}>ESCUELA BÍBLICA</div>
          <div style={mini}>Hoy es tu tiempo · Ven a Jesús</div>
        </div>

        {/* ROLES */}
        <div style={roles}>
          <RoleCard
            active={rol === 'profesor'}
            onClick={() => setRol('profesor')}
            title="Profesor"
            desc="Panel de clases"
          />
          <RoleCard
            active={rol === 'estudiante'}
            onClick={() => setRol('estudiante')}
            title="Estudiante"
            desc="Mis tests y biblia"
          />
        </div>

        {/* INPUT */}
        {rol === 'profesor' && (
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña del profesor"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={input}
            />
            <button onClick={() => setShowPass(s => !s)} style={verBtn}>
              Ver
            </button>
          </div>
        )}

        {/* ERROR */}
        {error && <div style={errorBox}>{error}</div>}

        {/* BOTÓN */}
        <button onClick={handleIngresar} style={btn}>
          INGRESAR
        </button>

        {/* VERSÍCULO */}
        <div style={verse}>
          “Lámpara es a mis pies tu palabra,
          y lumbrera a mi camino.”
          <div style={{ fontSize: 10, marginTop: 4 }}>
            — Salmos 119:105
          </div>
        </div>

      </div>
    </div>
  )
}

///////////////////////////////////////////////////////////
// 🎨 ESTILOS
///////////////////////////////////////////////////////////

const bg = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  backgroundImage: 'url(/bg-biblia.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',

  position: 'relative',
  fontFamily: fontBody
}

const overlay = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(245,235,215,0.75)',
  backdropFilter: 'blur(3px)'
}

const card = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: 420,
  padding: 28,
  borderRadius: 24,

  background: 'linear-gradient(180deg,#f8f4ea,#efe6d3)',

  border: '1px solid rgba(140,100,40,0.25)',

  boxShadow: `
    0 40px 100px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.8),
    inset 0 -3px 12px rgba(120,80,20,0.25)
  `,

  transform: 'translateY(-10px)'
}

const top = {
  fontSize: 12,
  letterSpacing: 4,
  color: '#8a7a5a'
}

const title = {
  fontFamily: fontTitle,
  fontSize: 46,
  color: '#3a2b1a',
  letterSpacing: 10,
  margin: '6px 0'
}

const subtitle = {
  fontSize: 14,
  letterSpacing: 3,
  color: '#6b5a3a'
}

const mini = {
  fontSize: 11,
  color: '#9a8762',
  marginBottom: 20
}

const roles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 14,
  marginBottom: 18
}

const input = {
  width: '100%',
  padding: 12,
  borderRadius: 10,
  border: '1px solid rgba(120,90,40,0.3)',
  background: '#fff',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
  outline: 'none'
}

const verBtn = {
  position: 'absolute',
  right: 10,
  top: 10,
  border: '1px solid rgba(120,90,40,0.3)',
  borderRadius: 6,
  padding: '3px 8px',
  background: '#efe6d3',
  cursor: 'pointer'
}

const btn = {
  width: '100%',
  padding: 14,
  borderRadius: 40,
  border: 'none',

  background: 'linear-gradient(145deg,#f5d06f,#c58b10)',

  color: '#3a2b1a',
  fontWeight: 800,
  letterSpacing: 2,

  boxShadow: `
    0 6px 0 #9c6f05,
    0 12px 30px rgba(0,0,0,0.35)
  `,

  cursor: 'pointer',
  transition: '0.2s'
}

const verse = {
  marginTop: 18,
  textAlign: 'center',
  fontStyle: 'italic',
  fontSize: 12,
  color: '#6b5a3a'
}

const errorBox = {
  background: 'rgba(180,50,50,0.15)',
  padding: 8,
  borderRadius: 8,
  marginBottom: 10,
  fontSize: 12,
  color: '#7a1f1f',
  textAlign: 'center'
}

function RoleCard({ active, onClick, title, desc }) {
  return (
    <div onClick={onClick} style={{
      padding: 18,
      borderRadius: 16,
      textAlign: 'center',
      cursor: 'pointer',

      background: active
        ? 'linear-gradient(145deg,#ffffff,#e8dcc8)'
        : '#f8f4ea',

      border: active
        ? '2px solid #c8a24a'
        : '1px solid rgba(120,90,40,0.2)',

      boxShadow: active
        ? '0 12px 30px rgba(0,0,0,0.25)'
        : '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontFamily: fontTitle,
        fontSize: 18,
        color: '#3a2b1a'
      }}>
        {title}
      </div>

      <div style={{
        fontSize: 11,
        color: '#7a6a4f'
      }}>
        {desc}
      </div>
    </div>
  )
}
