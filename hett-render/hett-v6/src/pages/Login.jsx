import { useState, useEffect } from 'react'

const fontTitle = "'Georgia','Times New Roman',serif"
const fontBody = "'Inter', system-ui, sans-serif"

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ENTER para ingresar
  useEffect(() => {
    const handleKey = (e) => e.key === 'Enter' && handleIngresar()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [rol, nombre, apellido, pass])

  const handleIngresar = () => {
    setError('')

    if (!rol) {
      setError('Selecciona un perfil')
      return
    }

    if (rol === 'profesor') {
      if (pass !== '439union') {
        setError('Contraseña incorrecta')
        return
      }
    } else {
      if (!nombre.trim() || !apellido.trim()) {
        setError('Completa nombre y apellido')
        return
      }
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin({
        rol,
        nombre: rol === 'profesor' ? 'Profesor' : nombre,
        apellido
      })
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'linear-gradient(180deg,#f5f1e6,#e8dfcf)',
      fontFamily: fontBody
    }}>

      {/* CONTENEDOR */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(120,90,40,0.2)',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, letterSpacing: 3, color: '#7a6a4f' }}>
            IUMP RECOLETA
          </div>

          <div style={{
            fontFamily: fontTitle,
            fontSize: 42,
            fontWeight: 700,
            color: '#3a2b1a',
            letterSpacing: 6
          }}>
            HETT
          </div>

          <div style={{
            fontSize: 14,
            letterSpacing: 2,
            color: '#6b5a3a'
          }}>
            ESCUELA BÍBLICA
          </div>

          <div style={{
            fontSize: 11,
            color: '#9a8762',
            marginTop: 4
          }}>
            Hoy es tu tiempo · Ven a Jesús
          </div>
        </div>

        {/* ROLES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginBottom: 16
        }}>
          {[
            { id: 'profesor', label: 'Profesor' },
            { id: 'estudiante', label: 'Estudiante' }
          ].map(r => (
            <div
              key={r.id}
              onClick={() => setRol(r.id)}
              style={{
                padding: 14,
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'center',
                transition: '0.25s',
                border: rol === r.id
                  ? '2px solid #c8a24a'
                  : '1px solid rgba(120,90,40,0.2)',
                background: rol === r.id
                  ? 'rgba(200,160,70,0.15)'
                  : 'transparent'
              }}
            >
              <div style={{
                fontWeight: 600,
                color: '#3a2b1a'
              }}>
                {r.label}
              </div>
            </div>
          ))}
        </div>

        {/* INPUTS */}
        {rol === 'profesor' && (
          <div style={{ marginBottom: 12 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña del profesor"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={() => setShowPass(s => !s)}
              style={showBtn}
            >
              {showPass ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        )}

        {rol === 'estudiante' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 12
          }}>
            <input
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Apellido"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{
            background: 'rgba(180,50,50,0.15)',
            border: '1px solid rgba(180,50,50,0.4)',
            padding: 8,
            borderRadius: 8,
            fontSize: 12,
            color: '#7a1f1f',
            marginBottom: 10,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* BOTÓN */}
        <button onClick={handleIngresar} style={btnStyle}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {/* VERSÍCULO */}
        <div style={{
          marginTop: 18,
          textAlign: 'center',
          fontSize: 13,
          color: '#6b5a3a',
          fontStyle: 'italic'
        }}>
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

// 🎨 estilos
const inputStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid rgba(120,90,40,0.3)',
  background: 'rgba(255,255,255,0.7)',
  outline: 'none'
}

const btnStyle = {
  width: '100%',
  padding: 12,
  borderRadius: 30,
  border: 'none',
  background: 'linear-gradient(145deg,#d4a017,#a87400)',
  color: '#2a1a00',
  fontWeight: 700,
  cursor: 'pointer',
  transition: '0.2s'
}

const showBtn = {
  position: 'absolute',
  right: 10,
  marginTop: -32,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  color: '#7a6a4f'
}
