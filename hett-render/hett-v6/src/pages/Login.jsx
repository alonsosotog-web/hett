import { useState, useEffect, useRef } from 'react'

const font = "'Georgia','Times New Roman',serif"

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const sceneRef = useRef()
  const c1Ref = useRef(), c2Ref = useRef()
  const rafRef = useRef()

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const W = scene.offsetWidth, H = scene.offsetHeight
    const c1 = c1Ref.current, c2 = c2Ref.current
    c1.width = W; c1.height = H
    c2.width = W; c2.height = H
    const x1 = c1.getContext('2d')
    const x2 = c2.getContext('2d')

    // Fondo — fusión Lino + Pentecostés equilibrado
    const g = x1.createLinearGradient(0, 0, W * 0.2, H)
    g.addColorStop(0,    '#0a0805')
    g.addColorStop(0.22, '#2a1c08')
    g.addColorStop(0.42, '#3a2000')
    g.addColorStop(0.62, '#7a5010')
    g.addColorStop(0.80, '#c89030')
    g.addColorStop(1,    '#e8b420')
    x1.fillStyle = g; x1.fillRect(0, 0, W, H)

    // Polvo dorado sutil
    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vy: -(0.10 + Math.random() * 0.22),
      vx: (Math.random() - 0.5) * 0.08,
      r:  0.5 + Math.random() * 1.2,
      a:  0.12 + Math.random() * 0.28,
      life: Math.random(),
      warm: Math.random() > 0.45,
    }))

    const loop = () => {
      x2.clearRect(0, 0, W, H)
      dust.forEach(d => {
        d.x += d.vx; d.y += d.vy; d.life += 0.003
        if (d.y < -4 || d.life > 1) { d.x = Math.random() * W; d.y = H + 4; d.life = 0 }
        const f = d.life < 0.12 ? d.life / 0.12 : d.life > 0.85 ? 1 - (d.life - 0.85) / 0.15 : 1
        x2.beginPath()
        x2.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        x2.fillStyle = d.warm ? 'rgba(255,215,75,1)' : 'rgba(255,175,38,1)'
        x2.globalAlpha = d.a * f
        x2.fill()
      })
      x2.globalAlpha = 1
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleRol = (r) => { setRol(r); setError(''); setFormOpen(true) }

  const handleIngresar = () => {
    setError('')
    if (!rol) { setError('Selecciona tu perfil primero'); return }
    if (rol === 'profesor') {
      if (pass !== '439union') { setError('Contraseña incorrecta'); return }
      onLogin({ rol: 'profesor', nombre: 'Profesor' })
    } else {
      if (!nombre.trim() || !apellido.trim()) { setError('Ingresa tu nombre y apellido'); return }
      onLogin({ rol: 'estudiante', nombre: nombre.trim(), apellido: apellido.trim() })
    }
  }

  const ac = 'rgba(200,144,20,VAR)'
  const btnActive = {
    background: 'linear-gradient(145deg,rgba(160,90,0,0.55),rgba(90,45,0,0.55))',
    border: '1.5px solid rgba(200,140,20,0.65)',
    color: 'rgba(255,228,140,0.97)',
    boxShadow: '0 6px 22px rgba(160,90,0,0.35)',
    transform: 'scale(1.04)',
  }
  const btnInactive = {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(160,100,0,0.26)',
    color: 'rgba(200,145,40,0.48)',
  }

  return (
    <div ref={sceneRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0805', fontFamily: font }}>
      <canvas ref={c1Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <canvas ref={c2Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '34px 22px 26px' }}>

        {/* TOP */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700, color: 'rgba(220,175,80,0.82)', marginBottom: 7 }}>IUMP Recoleta</div>
          <div style={{ fontSize: 62, fontWeight: 900, letterSpacing: 10, lineHeight: 0.95, textIndent: 10, color: '#fff8f0', textShadow: '0 0 30px rgba(200,144,10,0.45)' }}>HETT</div>
          <div style={{ width: 200, height: 1, background: 'linear-gradient(90deg,transparent,rgba(200,144,10,0.65),transparent)', margin: '9px auto' }} />
          <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', background: 'linear-gradient(90deg,rgba(255,218,95,1),rgba(255,175,35,0.9))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 3 }}>Escuela Bíblica</div>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(210,155,45,0.50)' }}>Hoy Es Tu Tiempo · Ven a Jesús</div>
        </div>

        {/* CENTRO — roles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 320, width: '100%' }}>
          {[
            { id: 'profesor', label: 'Profesor', desc: 'Panel de clases', icon: <><rect x="11" y="2" width="4" height="22" rx="2" fill="currentColor"/><rect x="2" y="9" width="22" height="4" rx="2" fill="currentColor"/></> },
            { id: 'estudiante', label: 'Estudiante', desc: 'Mis tests y biblia', icon: <><path d="M3 5C3 3.9 3.9 3 5 3H13V22H5C3.9 22 3 22.9 3 24V5Z" fill="currentColor" opacity="0.75"/><path d="M13 3H21C22.1 3 23 3.9 23 5V24C23 22.9 22.1 22 21 22H13V3Z" fill="currentColor"/></> },
          ].map(({ id, label, desc, icon }) => (
            <div key={id} onClick={() => handleRol(id)} style={{ padding: '18px 10px', borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s', ...(rol === id ? btnActive : btnInactive) }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">{icon}</svg>
              {label}
              <div style={{ fontSize: 9, letterSpacing: 1, opacity: 0.65 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div style={{ width: '100%' }}>
          {/* Formulario compacto */}
          <div style={{ overflow: 'hidden', maxHeight: formOpen ? 130 : 0, opacity: formOpen ? 1 : 0, transition: 'max-height 0.45s, opacity 0.3s' }}>
            <div style={{ background: 'rgba(8,4,1,0.72)', backdropFilter: 'blur(20px)', border: '1px solid rgba(190,130,20,0.25)', borderRadius: 14, padding: '13px 14px 12px', marginBottom: 10, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>
              {rol === 'profesor' && (
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Contraseña del profesor" value={pass} onChange={e => setPass(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(190,130,20,0.28)', borderRadius: 10, padding: '11px 46px 11px 13px', fontSize: 12, fontFamily: font, outline: 'none', color: 'rgba(255,248,220,0.92)' }} />
                  <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,170,70,0.55)', fontSize: 10, fontFamily: font, fontWeight: 700 }}>{showPass ? 'OCULTAR' : 'VER'}</button>
                </div>
              )}
              {rol === 'estudiante' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(190,130,20,0.28)', borderRadius: 10, padding: '11px 12px', fontSize: 12, fontFamily: font, outline: 'none', color: 'rgba(255,248,220,0.92)' }} />
                  <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(190,130,20,0.28)', borderRadius: 10, padding: '11px 12px', fontSize: 12, fontFamily: font, outline: 'none', color: 'rgba(255,248,220,0.92)' }} />
                </div>
              )}
            </div>
          </div>
          {error && <div style={{ color: '#ffaaaa', fontSize: 11, marginBottom: 10, textAlign: 'center', background: 'rgba(200,0,0,0.18)', borderRadius: 8, padding: '6px 12px', maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>{error}</div>}
          <button onClick={handleIngresar} style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'block', padding: 13, borderRadius: 40, border: 'none', cursor: 'pointer', background: '#ffffff', color: '#5a2e00', fontFamily: font, fontSize: 12, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', boxShadow: '0 4px 18px rgba(255,255,255,0.20)' }}>
            ✦ &nbsp; Ingresar
          </button>

          {/* Versículo */}
          <div style={{ textAlign: 'center', marginTop: 15 }}>
            <div style={{ fontStyle: 'italic', fontSize: 14, lineHeight: 1.80, color: 'rgba(255,255,255,0.88)', marginBottom: 4 }}>"Lámpara es a mis pies tu palabra,<br />y lumbrera a mi camino."</div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>— Salmos 119:105</div>
          </div>
        </div>
      </div>
      <style>{`input::placeholder{color:rgba(255,200,100,0.30)}`}</style>
    </div>
  )
}
