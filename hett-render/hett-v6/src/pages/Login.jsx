import { useState } from 'react'

const fontTitle = "'Georgia','Times New Roman',serif"

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)

  return (
    <div style={bg}>

      {/* CARD PRINCIPAL */}
      <div style={card}>

        {/* HEADER */}
        <div style={{ textAlign: 'center' }}>
          <div style={top}>IUMP RECOLETA</div>

          <div style={title}>HETT</div>

          <div style={sub}>ESCUELA BÍBLICA</div>

          <div style={mini}>
            Hoy es tu tiempo · Ven a Jesús
          </div>
        </div>

        {/* ROLES */}
        <div style={roles}>
          <Role
            active={rol === 'profesor'}
            onClick={() => setRol('profesor')}
            title="Profesor"
            desc="Panel de clases"
          />
          <Role
            active={rol === 'estudiante'}
            onClick={() => setRol('estudiante')}
            title="Estudiante"
            desc="Mis tests y biblia"
          />
        </div>

        {/* INPUT */}
        {rol === 'profesor' && (
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña del profesor"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={input}
            />
            <button
              onClick={() => setShowPass(s => !s)}
              style={ver}
            >
              Ver
            </button>
          </div>
        )}

        {/* BOTÓN */}
        <button style={btn}>
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

const bg = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: 'url(/bg-biblia.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}

const card = {
  width: '100%',
  maxWidth: 420,
  padding: 26,
  borderRadius: 22,

  background: 'linear-gradient(180deg,#f8f4ea,#efe6d3)',

  border: '1px solid rgba(140,100,40,0.25)',

  boxShadow: `
    0 30px 80px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.7),
    inset 0 -2px 10px rgba(120,80,20,0.2)
  `
}

const top = {
  fontSize: 12,
  letterSpacing: 4,
  color: '#8a7a5a'
}

const title = {
  fontFamily: fontTitle,
  fontSize: 44,
  color: '#3a2b1a',
  letterSpacing: 8,
  margin: '6px 0'
}

const sub = {
  fontSize: 14,
  letterSpacing: 2,
  color: '#6b5a3a'
}

const mini = {
  fontSize: 11,
  color: '#9a8762',
  marginBottom: 18
}

const roles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginBottom: 14
}

const input = {
  width: '100%',
  padding: 12,
  borderRadius: 10,
  border: '1px solid rgba(120,90,40,0.3)',
  background: '#fff',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)'
}

const ver = {
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
  fontWeight: 700,
  letterSpacing: 2,

  boxShadow: `
    0 6px 0 #9c6f05,
    0 10px 25px rgba(0,0,0,0.3)
  `,

  cursor: 'pointer'
}

const verse = {
  marginTop: 16,
  textAlign: 'center',
  fontStyle: 'italic',
  fontSize: 12,
  color: '#6b5a3a'
}

function Role({ active, onClick, title, desc }) {
  return (
    <div onClick={onClick} style={{
      padding: 16,
      borderRadius: 14,
      textAlign: 'center',
      cursor: 'pointer',

      background: active
        ? 'linear-gradient(145deg,#fff,#e8dcc8)'
        : '#f8f4ea',

      border: active
        ? '2px solid #c8a24a'
        : '1px solid rgba(120,90,40,0.2)',

      boxShadow: active
        ? '0 10px 25px rgba(0,0,0,0.2)'
        : '0 3px 8px rgba(0,0,0,0.1)'
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
