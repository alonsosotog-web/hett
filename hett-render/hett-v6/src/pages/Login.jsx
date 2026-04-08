import { useState, useEffect, useRef } from 'react'
import { guardarTest, escucharTestActivo } from '../firebase.js'

const font = "'Georgia','Times New Roman',serif"

export default function Login({ onLogin }) {
  const [rol, setRol] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const c1Ref = useRef(), c2Ref = useRef(), c3Ref = useRef()
  const sceneRef = useRef()
  const rafRef = useRef()

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const W = scene.offsetWidth, H = scene.offsetHeight

    const c1 = c1Ref.current, c2 = c2Ref.current, c3 = c3Ref.current
    c1.width = W; c1.height = H
    c2.width = W; c2.height = H
    c3.width = W; c3.height = H

    const x1 = c1.getContext('2d')
    const x2 = c2.getContext('2d')
    const x3 = c3.getContext('2d')

    // Fondo
    const g = x1.createLinearGradient(0, 0, W * 0.3, H)
    g.addColorStop(0, '#02040f')
    g.addColorStop(0.22, '#050e28')
    g.addColorStop(0.45, '#0a1840')
    g.addColorStop(0.65, '#152260')
    g.addColorStop(0.80, '#c87010')
    g.addColorStop(0.92, '#e89030')
    g.addColorStop(1, '#f0b040')
    x1.fillStyle = g; x1.fillRect(0, 0, W, H)

    const n1 = x1.createRadialGradient(W * 0.08, H * 0.32, 0, W * 0.08, H * 0.32, W * 0.45)
    n1.addColorStop(0, 'rgba(40,60,180,0.16)'); n1.addColorStop(1, 'transparent')
    x1.fillStyle = n1; x1.fillRect(0, 0, W, H)

    const n3 = x1.createRadialGradient(W * 0.5, H * 0.84, 0, W * 0.5, H * 0.84, W * 0.6)
    n3.addColorStop(0, 'rgba(240,150,30,0.32)'); n3.addColorStop(0.5, 'rgba(200,90,10,0.12)'); n3.addColorStop(1, 'transparent')
    x1.fillStyle = n3; x1.fillRect(0, 0, W, H)

    // Estrellas
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random() * 0.75,
      r: 0.25 + Math.random() * 1.35,
      a: 0.18 + Math.random() * 0.78,
      ts: 0.0007 + Math.random() * 0.0019,
      to: Math.random() * Math.PI * 2,
      col: ['#ffffff', '#ffffff', '#ffe8c0', '#ffd8a0', '#ddeeff'][Math.floor(Math.random() * 5)],
    }))

    const dust = Array.from({ length: 50 }, () => ({
      x: Math.random(), y: 0.5 + Math.random() * 0.5,
      vy: -(0.00012 + Math.random() * 0.00032), vx: (Math.random() - 0.5) * 0.00007,
      r: 0.4 + Math.random() * 1.3, a: 0.12 + Math.random() * 0.42, life: Math.random(),
      col: Math.random() > 0.4 ? 'rgba(255,210,80,1)' : 'rgba(255,180,40,1)',
    }))

    const shooters = []
    const launch = () => shooters.push({
      x: 0.05 + Math.random() * 0.58, y: 0.02 + Math.random() * 0.35,
      vx: 0.0028 + Math.random() * 0.0042, vy: 0.0018 + Math.random() * 0.003,
      len: 0.07 + Math.random() * 0.12, life: 0, maxLife: 58 + Math.random() * 38,
      w: 0.9 + Math.random() * 1.5,
    })
    const iv1 = setInterval(launch, 2300)
    setTimeout(launch, 400); setTimeout(launch, 1300)

    const loop = (t) => {
      // FX layer
      x2.clearRect(0, 0, W, H)
      const cx = W / 2, cy = -8, pulse = 0.5 + 0.5 * Math.sin(t * 0.0012)
      const h = x2.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45)
      h.addColorStop(0, `rgba(255,210,70,${0.14 + pulse * 0.10})`)
      h.addColorStop(0.35, `rgba(255,150,30,${0.05 + pulse * 0.04})`)
      h.addColorStop(1, 'transparent')
      x2.fillStyle = h; x2.fillRect(0, 0, W, H)

      const angles = [-0.68, -0.40, -0.20, 0, 0.20, 0.40, 0.68]
      const ops = [0.034, 0.046, 0.060, 0.078, 0.060, 0.046, 0.034]
      angles.forEach((a, i) => {
        const fl = 0.68 + 0.32 * Math.sin(t * 0.0008 + i * 1.35)
        const rg = x2.createLinearGradient(cx, cy, cx + Math.sin(a) * H, cy + H)
        rg.addColorStop(0, `rgba(255,210,70,${(ops[i] + 0.03 * pulse) * fl})`)
        rg.addColorStop(0.55, `rgba(240,140,30,${ops[i] * 0.38 * fl})`)
        rg.addColorStop(1, 'transparent')
        x2.beginPath(); x2.moveTo(cx, cy)
        x2.lineTo(cx + Math.sin(a - 0.055) * H * 1.5, cy + H * 1.5)
        x2.lineTo(cx + Math.sin(a + 0.055) * H * 1.5, cy + H * 1.5)
        x2.closePath(); x2.fillStyle = rg; x2.fill()
      })

      // Estrella de Belén
      const sx = W * 0.84, sy = H * 0.08, sp = 0.5 + 0.5 * Math.sin(t * 0.0015 + 1), sr = 5.5 + sp * 3.5
      const sH = x2.createRadialGradient(sx, sy, 0, sx, sy, sr * 5.5)
      sH.addColorStop(0, `rgba(255,240,150,${0.38 + sp * 0.22})`)
      sH.addColorStop(0.4, `rgba(255,180,40,${0.10 + sp * 0.06})`)
      sH.addColorStop(1, 'transparent')
      x2.fillStyle = sH; x2.fillRect(sx - sr * 7, sy - sr * 7, sr * 14, sr * 14)
      x2.save(); x2.translate(sx, sy)
      x2.fillStyle = `rgba(255,248,180,${0.88 + sp * 0.12})`
      for (let p = 0; p < 8; p++) {
        x2.save(); x2.rotate(p * Math.PI / 4)
        const len = p % 2 === 0 ? sr : sr * 0.42
        x2.beginPath(); x2.moveTo(0, -len); x2.lineTo(1.2, -1.2); x2.lineTo(len, 0)
        x2.lineTo(1.2, 1.2); x2.lineTo(0, len); x2.lineTo(-1.2, 1.2)
        x2.lineTo(-len, 0); x2.lineTo(-1.2, -1.2)
        x2.closePath(); x2.fill(); x2.restore()
      }
      x2.beginPath(); x2.arc(0, 0, 2.2 + sp, 0, Math.PI * 2); x2.fillStyle = '#fff'; x2.fill()
      x2.restore()

      // Partículas
      x3.clearRect(0, 0, W, H)
      stars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.ts + s.to)
        x3.beginPath(); x3.arc(s.x * W, s.y * H, s.r * (0.65 + tw * 0.5), 0, Math.PI * 2)
        x3.fillStyle = s.col; x3.globalAlpha = s.a * (0.38 + tw * 0.62); x3.fill()
      })
      dust.forEach(d => {
        d.x += d.vx; d.y += d.vy; d.life += 0.0032
        if (d.y < -0.02 || d.life > 1) { d.x = Math.random(); d.y = 0.93 + Math.random() * 0.1; d.life = 0 }
        const f = d.life < 0.12 ? d.life / 0.12 : d.life > 0.85 ? 1 - (d.life - 0.85) / 0.15 : 1
        x3.beginPath(); x3.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2)
        x3.fillStyle = d.col; x3.globalAlpha = d.a * f; x3.fill()
      })
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]; s.x += s.vx; s.y += s.vy; s.life++
        if (s.life > s.maxLife) { shooters.splice(i, 1); continue }
        const p = s.life / s.maxLife, f = p < 0.2 ? p / 0.2 : p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1
        const mg = Math.hypot(s.vx, s.vy), tx = s.x - s.vx / mg * s.len, ty = s.y - s.vy / mg * s.len
        const sg = x3.createLinearGradient(s.x * W, s.y * H, tx * W, ty * H)
        sg.addColorStop(0, `rgba(255,255,255,${0.96 * f})`)
        sg.addColorStop(0.25, `rgba(255,235,160,${0.62 * f})`)
        sg.addColorStop(1, 'rgba(255,190,60,0)')
        x3.beginPath(); x3.moveTo(s.x * W, s.y * H); x3.lineTo(tx * W, ty * H)
        x3.strokeStyle = sg; x3.lineWidth = s.w * f; x3.globalAlpha = 1; x3.stroke()
        x3.beginPath(); x3.arc(s.x * W, s.y * H, s.w * 1.4 * f, 0, Math.PI * 2)
        x3.fillStyle = `rgba(255,255,255,${0.9 * f})`; x3.fill()
      }
      x3.globalAlpha = 1
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(iv1) }
  }, [])

  const handleRol = (r) => {
    setRol(r); setError(''); setFormOpen(true)
  }

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

  return (
    <div ref={sceneRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#02040f', fontFamily: font }}>
      <canvas ref={c1Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <canvas ref={c2Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }} />
      <canvas ref={c3Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3 }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '38px 24px 30px' }}>

        {/* TOP — Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeDown 1s both' }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(255,210,140,0.55)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>IUMP Recoleta</div>
          <div style={{ fontSize: 76, fontWeight: 900, letterSpacing: 14, lineHeight: 1, textIndent: 14, background: 'linear-gradient(180deg,#ffffff 0%,#fff0c0 40%,#ffb830 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 28px rgba(255,180,40,0.50))' }}>HETT</div>
          <div style={{ width: 220, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,180,40,0.6),transparent)', margin: '10px 0' }} />
          <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', background: 'linear-gradient(90deg,#f0d060,#e8a030,#f0d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4 }}>Escuela Bíblica</div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,210,130,0.55)', textTransform: 'uppercase' }}>Hoy Es Tu Tiempo · Ven a Jesús</div>
        </div>

        {/* CENTRO — Versículo */}
        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <div style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,228,170,0.70)', lineHeight: 1.80 }}>"Lámpara es a mis pies tu palabra,<br />y lumbrera a mi camino."</div>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: 'rgba(255,195,90,0.50)', marginTop: 8, textTransform: 'uppercase' }}>— Salmos 119:105</div>
        </div>

        {/* BOTTOM — Botones y formulario */}
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {[
              { id: 'profesor', label: 'Profesor', desc: 'Panel de clases', path: <><rect x="11" y="2" width="4" height="22" rx="2" fill="currentColor" /><rect x="2" y="9" width="22" height="4" rx="2" fill="currentColor" /></> },
              { id: 'estudiante', label: 'Estudiante', desc: 'Mis tests y biblia', path: <><path d="M3 5C3 3.9 3.9 3 5 3H13V22H5C3.9 22 3 22.9 3 24V5Z" fill="currentColor" opacity="0.75" /><path d="M13 3H21C22.1 3 23 3.9 23 5V24C23 22.9 22.1 22 21 22H13V3Z" fill="currentColor" /></> },
            ].map(({ id, label, desc, path }) => (
              <div key={id} onClick={() => handleRol(id)} style={{
                padding: '20px 12px', borderRadius: 20, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                border: `1.5px solid ${rol === id ? 'rgba(240,170,50,0.65)' : 'rgba(200,144,26,0.22)'}`,
                background: rol === id ? 'linear-gradient(145deg,rgba(180,90,10,0.50),rgba(100,45,5,0.55))' : 'rgba(10,16,40,0.55)',
                backdropFilter: 'blur(16px)',
                color: rol === id ? '#f0c860' : 'rgba(220,170,90,0.42)',
                boxShadow: rol === id ? '0 8px 28px rgba(180,90,10,0.40)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                <svg width="30" height="30" viewBox="0 0 26 26" fill="none">{path}</svg>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Formulario deslizante */}
          <div style={{ overflow: 'hidden', maxHeight: formOpen ? 200 : 0, opacity: formOpen ? 1 : 0, transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.35s' }}>
            <div style={{ background: 'rgba(6,10,28,0.72)', backdropFilter: 'blur(22px)', border: '1px solid rgba(200,144,26,0.28)', borderRadius: 20, padding: 18, boxShadow: '0 20px 50px rgba(0,0,0,0.65)' }}>
              {rol === 'profesor' && (
                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Contraseña del profesor" value={pass} onChange={e => setPass(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(200,144,26,0.28)', borderRadius: 12, padding: '13px 46px 13px 16px', color: 'rgba(255,248,220,0.95)', fontSize: 13, fontFamily: font, outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,200,100,0.55)', fontSize: 10, fontFamily: font, fontWeight: 700 }}>{showPass ? 'OCULTAR' : 'VER'}</button>
                </div>
              )}
              {rol === 'estudiante' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(200,144,26,0.28)', borderRadius: 12, padding: '13px 14px', color: 'rgba(255,248,220,0.95)', fontSize: 13, fontFamily: font, outline: 'none' }} />
                  <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(200,144,26,0.28)', borderRadius: 12, padding: '13px 14px', color: 'rgba(255,248,220,0.95)', fontSize: 13, fontFamily: font, outline: 'none' }} />
                </div>
              )}
              {error && <div style={{ color: '#ffaaaa', fontSize: 11, marginBottom: 10, textAlign: 'center', background: 'rgba(200,0,0,0.18)', borderRadius: 8, padding: '6px 12px' }}>{error}</div>}
              <button onClick={handleIngresar} style={{ width: '100%', padding: 14, borderRadius: 40, border: 'none', cursor: 'pointer', background: '#ffffff', color: '#3a1a00', fontFamily: font, fontSize: 13, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', boxShadow: '0 4px 20px rgba(255,255,255,0.20)' }}>
                ✦ &nbsp; Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`input::placeholder{color:rgba(255,200,100,0.25)} @keyframes fadeDown{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
