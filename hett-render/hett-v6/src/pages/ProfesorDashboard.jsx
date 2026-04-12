import { useState, useEffect, useRef } from 'react'
import { guardarTest, escucharRespuestas, obtenerTodasLasSesiones } from '../firebase.js'

const font = "'Georgia','Times New Roman',serif"

// ── Paleta dorada ──────────────────────────────────────
const C = {
  bg: 'linear-gradient(135deg,#1a0e00 0%,#2a1800 25%,#3a2400 50%,#2a1800 75%,#1a0e00 100%)',
  card: 'rgba(255,240,180,0.09)',
  cardBdr: 'rgba(220,175,60,0.28)',
  gold: '#ffe870',
  goldDim: 'rgba(255,220,100,0.70)',
  goldFaint: 'rgba(220,175,60,0.35)',
  text: 'rgba(255,245,215,0.95)',
  textMuted: 'rgba(220,190,120,0.65)',
  textFaint: 'rgba(200,165,90,0.42)',
  inp: 'rgba(255,235,150,0.09)',
  inpBdr: 'rgba(220,175,60,0.30)',
}

// ── Logo vidrio ────────────────────────────────────────
const LogoGlass = ({ small }) => (
  <div style={{
    background: 'linear-gradient(155deg,rgba(255,245,190,0.26),rgba(210,160,35,0.16))',
    border: `1.5px solid rgba(230,185,65,0.60)`,
    borderRadius: small ? 11 : 14,
    padding: small ? '8px 14px' : '13px 14px 11px',
    textAlign: 'center',
    boxShadow: '0 4px 18px rgba(0,0,0,0.25),inset 0 1.5px 0 rgba(255,235,130,0.38)',
  }}>
    {!small && <div style={{ fontSize: 9, letterSpacing: 3, color: C.goldDim, marginBottom: 5, fontWeight: 700 }}>✦ &nbsp;IUMP Recoleta&nbsp; ✦</div>}
    <div style={{
      fontSize: small ? 18 : 26, fontWeight: 900, letterSpacing: small ? 4 : 6,
      background: 'linear-gradient(180deg,#fffbe0 0%,#ffd84a 50%,#c88a08 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 7px rgba(255,200,30,0.55))',
      lineHeight: 1, textIndent: small ? 4 : 6,
    }}>HETT</div>
    <div style={{ width: '80%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(230,185,65,0.65),transparent)', margin: small ? '4px auto' : '7px auto' }} />
    <div style={{ fontSize: small ? 7 : 9.5, letterSpacing: 3, color: 'rgba(255,232,140,0.88)', textTransform: 'uppercase', fontWeight: 800 }}>
      {small ? '— IUMP Recoleta —' : 'Escuela Bíblica'}
    </div>
    {!small && <div style={{ fontSize: 7.5, letterSpacing: 2, color: 'rgba(255,215,110,0.60)', textTransform: 'uppercase', marginTop: 2 }}>Hoy Es Tu Tiempo</div>}
  </div>
)

// ── Card ───────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, backdropFilter: 'blur(18px)',
    border: `1px solid ${C.cardBdr}`, borderRadius: 14,
    padding: '16px 18px', marginBottom: 14,
    boxShadow: '0 4px 20px rgba(0,0,0,0.18),inset 0 1px 0 rgba(220,175,60,0.10)',
    ...style,
  }}>{children}</div>
)

const CardTitle = ({ num, children }) => (
  <div style={{ fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,225,120,0.92)', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 9 }}>
    {num && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(220,175,60,0.22)', border: '1.5px solid rgba(220,175,60,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.gold, flexShrink: 0, fontWeight: 900 }}>{num}</div>}
    {children}
  </div>
)

const Inp = ({ placeholder, value, onChange, style = {} }) => (
  <input placeholder={placeholder} value={value} onChange={onChange}
    style={{ width: '100%', background: C.inp, border: `1.5px solid ${C.inpBdr}`, borderRadius: 10, padding: '12px 14px', color: C.text, fontSize: 13, fontFamily: font, outline: 'none', ...style }} />
)

// ── Editor de preguntas ────────────────────────────────
function EditorPreguntas({ preguntas, setPreguntas }) {
  const letters = ['A', 'B', 'C', 'D']
  const addP = () => setPreguntas(prev => [...prev, { id: Date.now(), texto: '', opciones: ['', '', '', ''], correcta: null, explicacion: '', numOpciones: 4 }])
  const upd = (idx, f, v) => setPreguntas(prev => prev.map((p, i) => i === idx ? { ...p, [f]: v } : p))
  const updO = (idx, oi, v) => setPreguntas(prev => prev.map((p, i) => { if (i !== idx) return p; const o = [...p.opciones]; o[oi] = v; return { ...p, opciones: o } }))
  const del = (idx) => setPreguntas(prev => prev.filter((_, i) => i !== idx))
  return (
    <div>
      <Card style={{ marginBottom: 12, padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
            La respuesta correcta que marques aquí <strong style={{ color: '#7fff90' }}>solo la ve el profesor(a)</strong>. Los estudiantes nunca la ven durante el test.
          </span>
        </div>
      </Card>
      {preguntas.map((p, idx) => (
        <div key={p.id} style={{ background: 'rgba(255,235,150,0.06)', border: `1px solid ${C.cardBdr}`, borderRadius: 13, padding: '14px 16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2, color: C.goldDim, textTransform: 'uppercase' }}>Pregunta {idx + 1}</span>
            <button onClick={() => del(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.65)', fontSize: 11, fontFamily: font }}>✕ Eliminar</button>
          </div>
          <Inp placeholder="Escribe la pregunta aquí..." value={p.texto} onChange={e => upd(idx, 'texto', e.target.value)} style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 9.5, color: C.textFaint, letterSpacing: 1.5, textTransform: 'uppercase', alignSelf: 'center' }}>Opciones:</span>
            {[3, 4].map(n => (
              <button key={n} onClick={() => upd(idx, 'numOpciones', n)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${p.numOpciones === n ? C.goldFaint : 'rgba(255,255,255,0.15)'}`, background: p.numOpciones === n ? 'rgba(220,175,60,0.18)' : 'transparent', color: p.numOpciones === n ? C.gold : C.textFaint, fontSize: 11, cursor: 'pointer', fontFamily: font, fontWeight: 700 }}>{n}</button>
            ))}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9.5, color: C.textFaint, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7, fontWeight: 700 }}>Marca la respuesta correcta 🔒</div>
            {letters.slice(0, p.numOpciones).map((letter, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.goldDim, width: 16, textAlign: 'center', flexShrink: 0 }}>{letter}</span>
                <div onClick={() => upd(idx, 'correcta', oi)} style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${p.correcta === oi ? '#7fff90' : 'rgba(255,255,255,0.28)'}`, background: p.correcta === oi ? 'rgba(127,255,144,0.18)' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  {p.correcta === oi && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7fff90' }} />}
                </div>
                <input placeholder={`Opción ${letter}`} value={p.opciones[oi]} onChange={e => updO(idx, oi, e.target.value)}
                  style={{ flex: 1, background: p.correcta === oi ? 'rgba(127,255,144,0.07)' : C.inp, border: `1px solid ${p.correcta === oi ? 'rgba(127,255,144,0.35)' : C.inpBdr}`, borderRadius: 9, padding: '9px 12px', color: C.text, fontSize: 12, fontFamily: font, outline: 'none' }} />
                {p.correcta === oi && <span style={{ fontSize: 10, color: 'rgba(127,255,144,0.85)', flexShrink: 0, fontWeight: 800 }}>✓ Correcta</span>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9.5, color: C.textFaint, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>📖 Explicación bíblica (RVR1960)</div>
          <textarea placeholder="Ej: Según Mateo 5:3 RVR1960..." value={p.explicacion} onChange={e => upd(idx, 'explicacion', e.target.value)}
            style={{ width: '100%', background: 'rgba(220,175,60,0.07)', border: `1px solid rgba(220,175,60,0.20)`, borderRadius: 9, padding: '9px 12px', color: 'rgba(255,235,170,0.85)', fontSize: 12, fontFamily: font, outline: 'none', resize: 'none', height: 54 }} />
        </div>
      ))}
      <button onClick={addP} style={{ width: '100%', padding: 11, borderRadius: 12, border: `1.5px dashed ${C.goldFaint}`, background: 'transparent', color: C.textFaint, fontFamily: font, fontSize: 12, cursor: 'pointer', marginBottom: 14 }}>+ Agregar pregunta</button>
    </div>
  )
}

// ── Métricas ───────────────────────────────────────────
function Metricas({ respuestas, preguntas }) {
  if (!respuestas.length) return (
    <Card style={{ textAlign: 'center', padding: '44px 20px' }}>
      <div style={{ fontSize: 38, marginBottom: 10 }}>📋</div>
      <div style={{ color: C.goldDim, fontSize: 15, fontWeight: 700, marginBottom: 5 }}>Sin respuestas aún</div>
      <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>Los resultados aparecerán aquí en tiempo real cuando los estudiantes respondan.</div>
    </Card>
  )
  const total = preguntas.length || 5
  const promedio = Math.round(respuestas.reduce((a, r) => a + ((r.correctas || 0) / total) * 100, 0) / respuestas.length)
  const aprobados = respuestas.filter(r => ((r.correctas || 0) / total) >= 0.6).length
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
        {[{ n: respuestas.length, l: 'Respondieron' }, { n: `${promedio}%`, l: 'Promedio' }, { n: aprobados, l: 'Aprobados' }].map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.cardBdr}`, borderRadius: 13, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.gold }}>{s.n}</div>
            <div style={{ fontSize: 9.5, letterSpacing: 1.5, color: C.textMuted, textTransform: 'uppercase', marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardTitle>🗂 Resultados por alumno</CardTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.cardBdr}` }}>
                <th style={{ color: C.textMuted, fontWeight: 700, padding: '6px 8px', textAlign: 'left' }}>Alumno</th>
                {preguntas.slice(0, 5).map((_, i) => <th key={i} style={{ color: C.textMuted, fontWeight: 700, padding: '6px 8px', textAlign: 'center' }}>P{i + 1}</th>)}
                <th style={{ color: C.textMuted, fontWeight: 700, padding: '6px 8px', textAlign: 'center' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {respuestas.map((r, i) => {
                const pct = Math.round(((r.correctas || 0) / total) * 100)
                return (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(220,175,60,0.10)` }}>
                    <td style={{ color: C.text, padding: '7px 8px', fontWeight: 600 }}>{r.nombre} {r.apellido}</td>
                    {(r.detalles || []).slice(0, 5).map((ok, j) => (
                      <td key={j} style={{ padding: '7px 8px', textAlign: 'center' }}>
                        <span style={{ background: ok ? 'rgba(60,200,80,0.25)' : 'rgba(220,60,60,0.20)', borderRadius: 6, color: ok ? '#90ffaa' : '#ffaaaa', fontWeight: 800, padding: '3px 7px', fontSize: 10 }}>{ok ? '✓' : '✗'}</span>
                      </td>
                    ))}
                    <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 900, fontSize: 13, color: pct >= 60 ? '#7fff90' : '#ffaaaa' }}>{pct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardTitle>📈 Dificultad por pregunta</CardTitle>
        {preguntas.slice(0, 5).map((p, i) => {
          const aciertos = respuestas.filter(r => r.detalles && r.detalles[i]).length
          const pct = respuestas.length ? Math.round((aciertos / respuestas.length) * 100) : 0
          const color = pct >= 70 ? '#25d366' : pct >= 40 ? '#ffb020' : '#e83030'
          return (
            <div key={i} style={{ marginBottom: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                <span>P{i + 1} — {p.texto ? p.texto.substring(0, 40) + (p.texto.length > 40 ? '...' : '') : `Pregunta ${i + 1}`}</span>
                <span style={{ color, fontWeight: 800 }}>{pct}%</span>
              </div>
              <div style={{ height: 7, background: 'rgba(255,255,255,0.10)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
              </div>
            </div>
          )
        })}
        {preguntas.length > 0 && (() => {
          const worst = preguntas.reduce((w, p, i) => {
            const pct = respuestas.length ? respuestas.filter(r => r.detalles && r.detalles[i]).length / respuestas.length * 100 : 100
            return pct < w.pct ? { idx: i, pct } : w
          }, { idx: 0, pct: 100 })
          return worst.pct < 70 ? (
            <div style={{ marginTop: 12, padding: '10px 13px', background: 'rgba(220,175,60,0.10)', borderRadius: 10, borderLeft: `3px solid rgba(220,175,60,0.45)` }}>
              <div style={{ fontSize: 10.5, color: C.goldDim, fontWeight: 800, marginBottom: 3 }}>💡 Recomendación pedagógica</div>
              <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>La pregunta {worst.idx + 1} tuvo solo {Math.round(worst.pct)}% de acierto. Se sugiere reforzar este tema en la próxima clase.</div>
            </div>
          ) : null
        })()}
      </Card>
    </>
  )
}

// ── Dashboard principal ────────────────────────────────
export default function ProfesorDashboard({ onLogout, testActivo }) {
  const [tab, setTab] = useState('crear')
  const [subTab, setSubTab] = useState('info')
  const [titulo, setTitulo] = useState('')
  const [tema, setTema] = useState('')
  const [numQ, setNumQ] = useState(5)
  const [preguntas, setPreguntas] = useState([])
  const [generando, setGenerando] = useState(false)
  const [codigoActual, setCodigoActual] = useState('')
  const [respuestas, setRespuestas] = useState([])
  const [waVisible, setWaVisible] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    if (!codigoActual) return
    const unsub = escucharRespuestas(codigoActual, setRespuestas)
    return () => unsub()
  }, [codigoActual])

  const fecha = (() => {
    const d = new Date()
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]} ${d.getFullYear()}`
  })()

  const generarTest = async () => {
    if (!titulo.trim()) return
    setGenerando(true)
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
    try {
      await guardarTest(codigo, { titulo, tema, numQ, preguntas: preguntas.map(p => ({ texto: p.texto, opciones: p.opciones.slice(0, p.numOpciones), correcta: p.correcta, explicacion: p.explicacion })), fecha: new Date().toLocaleDateString('es-CL'), generadoTs: Date.now(), codigo })
      setCodigoActual(codigo); setWaVisible(true); setTab('participar')
    } catch (e) { console.error(e) }
    setGenerando(false)
  }

  const [descargando, setDescargando] = useState(false)

  const descargarCSV = async () => {
    setDescargando(true)
    try {
      const sesiones = await obtenerTodasLasSesiones()
      if (!sesiones.length) { alert('No hay sesiones guardadas aún.'); setDescargando(false); return }

      const filas = []
      // Encabezado
      filas.push([
        'Fecha', 'Hora', 'Código Sesión', 'Nombre Clase', 'Tema Bíblico',
        'Estudiante', 'Total Preguntas', 'Correctas', 'Incorrectas',
        '% Correcto', '% Incorrecto', 'Resultado'
      ].join(','))

      for (const { test, respuestas } of sesiones) {
        const fecha = test.fecha || ''
        const hora = test.creadoEn?.toDate
          ? test.creadoEn.toDate().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
          : ''
        const codigo = test.codigo || test.id || ''
        const clase = `"${(test.titulo || '').replace(/"/g, "'")}"` 
        const tema  = `"${(test.tema   || '').replace(/"/g, "'")}"` 
        const total = test.numQ || (test.preguntas?.length) || 0

        if (!respuestas.length) {
          filas.push([fecha, hora, codigo, clase, tema,
            'Sin respuestas', total, 0, 0, '0%', '100%', 'Sin datos'
          ].join(','))
          continue
        }

        for (const r of respuestas) {
          const nombre = `"${r.nombre || ''} ${r.apellido || ''}"` 
          const correctas  = r.correctas  ?? 0
          const incorrectas = total - correctas
          const pctOk  = total ? Math.round((correctas  / total) * 100) : 0
          const pctErr = total ? Math.round((incorrectas / total) * 100) : 0
          const resultado = pctOk >= 60 ? 'Aprobado' : 'Reprobado'
          filas.push([
            fecha, hora, codigo, clase, tema,
            nombre, total, correctas, incorrectas,
            `${pctOk}%`, `${pctErr}%`, resultado
          ].join(','))
        }
      }

      const csv = '\uFEFF' + filas.join('\n') // BOM para Excel con tildes
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `HETT_Resultados_${new Date().toLocaleDateString('es-CL').replace(/\//g,'-')}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('Error al descargar. Revisa la conexión.')
    }
    setDescargando(false)
  }
    const msg = `📖 *HETT — Escuela Bíblica IUMP Recoleta*\n\n📚 Clase: ${titulo}\n📖 Tema: ${tema}\n\n🔑 Código: *${codigoActual}*\n🌐 Ingresa en: https://hett.onrender.com\n\n_Hoy Es Tu Tiempo · Ven a Jesús_`
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank')
  }

  const BtnMain = ({ children, onClick, disabled }) => (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      width: '100%', padding: 14, borderRadius: 40, border: '1px solid rgba(220,165,20,0.55)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'rgba(220,175,60,0.20)' : 'linear-gradient(145deg,#f8d858,#d49810,#a87408)',
      color: disabled ? C.textFaint : '#2a1400', fontFamily: font, fontSize: 13, fontWeight: 900,
      letterSpacing: '3px', textTransform: 'uppercase', opacity: disabled ? 0.6 : 1,
      boxShadow: disabled ? 'none' : '0 4px 0 #7a5004,0 6px 20px rgba(150,80,0,0.28),inset 0 1px 0 rgba(255,248,150,0.52)',
      marginBottom: 14, transition: 'all 0.15s',
    }}>{children}</button>
  )

  const profesores = [
    { i: 'JS', n: 'Javiera Sepúlveda', r: 'Profesora', c: 'rgba(180,80,200,0.80),rgba(100,30,150,0.80)' },
    { i: 'CC', n: 'Carlos Camberes',   r: 'Profesor',  c: 'rgba(40,140,220,0.80),rgba(20,70,170,0.80)' },
    { i: 'FV', n: 'Felipe Vera',        r: 'Profesor',  c: 'rgba(30,170,90,0.80),rgba(15,90,50,0.80)' },
    { i: 'LR', n: 'Luis Retamal',       r: 'Profesor',  c: 'rgba(220,130,20,0.80),rgba(150,70,10,0.80)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font, display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* Fondo imagen biblia */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(/bg-biblia.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(5px) brightness(0.72) saturate(0.75)', transform: 'scale(1.04)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(12,6,0,0.48)' }} />

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(5,2,0,0.82)', backdropFilter: 'blur(22px)', borderBottom: `1.5px solid ${C.goldFaint}`, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, flexShrink: 0, gap: 14 }}>
        <LogoGlass small />
        {/* Título central con decoración */}
        <div style={{ background: 'linear-gradient(155deg,rgba(255,245,190,0.16),rgba(160,110,10,0.12))', border: `1.5px solid rgba(220,175,60,0.45)`, borderRadius: 14, padding: '9px 22px', textAlign: 'center', flex: 1, boxShadow: 'inset 0 1px 0 rgba(255,235,130,0.20)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 3 }}>
            <div style={{ flex: 1, maxWidth: 45, height: 1, background: 'linear-gradient(90deg,transparent,rgba(220,175,60,0.75))' }} />
            <span style={{ fontSize: 11, color: 'rgba(230,185,65,0.85)' }}>✦</span>
            <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 2, background: 'linear-gradient(180deg,#fffbe0,#ffd84a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Panel del Profesor(a)</div>
            <span style={{ fontSize: 11, color: 'rgba(230,185,65,0.85)' }}>✦</span>
            <div style={{ flex: 1, maxWidth: 45, height: 1, background: 'linear-gradient(90deg,rgba(220,175,60,0.75),transparent)' }} />
          </div>
          <div style={{ fontSize: 10.5, color: C.textMuted }}>{fecha}</div>
          {codigoActual && <div style={{ fontSize: 10, color: C.gold, fontWeight: 800, letterSpacing: 2, marginTop: 2 }}>Código activo: {codigoActual}</div>}
        </div>
        <button onClick={onLogout} style={{ background: 'rgba(220,175,60,0.15)', border: `1.5px solid rgba(220,175,60,0.38)`, borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'rgba(255,215,100,0.80)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>←</button>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 2 }}>

        {/* SIDEBAR */}
        <nav style={{ width: 210, flexShrink: 0, background: 'rgba(6,3,0,0.82)', backdropFilter: 'blur(24px)', borderRight: `1.5px solid ${C.goldFaint}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 12px 12px' }}>
            <LogoGlass />
          </div>

          <div style={{ padding: '8px 14px 4px', fontSize: 9.5, letterSpacing: 2, color: 'rgba(220,180,80,0.60)', textTransform: 'uppercase', fontWeight: 700 }}>— Profesores 2026 —</div>
          {profesores.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 13px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${p.c})`, border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{p.i}</div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,245,215,0.92)' }}>{p.n}</div>
                <div style={{ fontSize: 9, color: 'rgba(220,175,80,0.60)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 1 }}>{p.r}</div>
              </div>
            </div>
          ))}

          <div style={{ padding: '10px 10px 4px' }}>
            <div style={{ fontSize: 9.5, letterSpacing: 2, color: 'rgba(220,180,80,0.55)', textTransform: 'uppercase', fontWeight: 700, padding: '6px 8px 4px' }}>— Gestión —</div>
            {[
              { id: 'crear', label: 'Crear Test', ico: '✏️' },
              { id: 'participar', label: 'Resultados', ico: '📊', badge: respuestas.length || null },
              { id: 'datos', label: 'Base de Datos', ico: '📋' },
            ].map(item => (
              <div key={item.id} onClick={() => setTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 11px', borderRadius: 10, cursor: 'pointer', marginBottom: 3, background: tab === item.id ? 'rgba(220,175,60,0.22)' : 'transparent', border: `1px solid ${tab === item.id ? 'rgba(220,175,60,0.42)' : 'transparent'}`, color: tab === item.id ? 'rgba(255,235,120,1)' : C.textFaint, fontWeight: tab === item.id ? 800 : 400, fontSize: 13 }}>
                <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.ico}</span>{item.label}
                {item.badge ? <span style={{ marginLeft: 'auto', background: 'rgba(220,175,60,0.22)', borderRadius: 8, padding: '2px 6px', fontSize: 9, color: C.goldDim }}>{item.badge}</span> : null}
              </div>
            ))}
            <div style={{ fontSize: 9.5, letterSpacing: 2, color: 'rgba(220,180,80,0.55)', textTransform: 'uppercase', fontWeight: 700, padding: '8px 8px 4px' }}>— Recursos —</div>
            <div onClick={() => window.open('https://drive.google.com/drive/folders/1wUYNbgBrehAnzefjRcO8uPU2hdxUkCF5?usp=sharing', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 11px', borderRadius: 10, cursor: 'pointer', color: C.textFaint, fontSize: 13 }}>
              <span style={{ fontSize: 14 }}>📁</span>Drive Compartido
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: `1px solid rgba(220,175,60,0.15)`, fontSize: 9, fontStyle: 'italic', color: 'rgba(220,180,80,0.40)', lineHeight: 1.7, textAlign: 'center' }}>
            "La enseñanza del sabio<br />es fuente de vida."<br />— Proverbios 13:14
          </div>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* ── CREAR TEST ── */}
          {tab === 'crear' && (
            <>
              <div style={{ display: 'flex', gap: 3, background: 'rgba(0,0,0,0.22)', borderRadius: 12, padding: 4, marginBottom: 18, border: `1px solid rgba(220,175,60,0.15)` }}>
                {[{ id: 'info', label: '① Clase' }, { id: 'preguntas', label: '② Preguntas' }, { id: 'enviar', label: '③ Enviar' }].map(st => (
                  <button key={st.id} onClick={() => setSubTab(st.id)} style={{ flex: 1, padding: 10, borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: subTab === st.id ? 'rgba(255,235,120,1)' : C.textFaint, background: subTab === st.id ? 'rgba(220,175,60,0.24)' : 'transparent', border: subTab === st.id ? `1px solid rgba(220,175,60,0.42)` : 'none', fontFamily: font }}>{st.label}</button>
                ))}
              </div>

              {subTab === 'info' && (
                <>
                  <Card><CardTitle num="1">Nombre de la Sesión</CardTitle><Inp placeholder="Ej: Clase 3 — Las Bienaventuranzas" value={titulo} onChange={e => setTitulo(e.target.value)} /></Card>
                  <Card><CardTitle num="2">Tema Bíblico — RVR1960</CardTitle><Inp placeholder="Ej: El Sermón del Monte, Los Salmos..." value={tema} onChange={e => setTema(e.target.value)} /></Card>
                  <Card>
                    <CardTitle num="3">Material de Apoyo</CardTitle>
                    <a href="https://drive.google.com/drive/folders/1wUYNbgBrehAnzefjRcO8uPU2hdxUkCF5?usp=sharing" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(66,133,244,0.15)', border: '1.5px solid rgba(120,175,255,0.32)', borderRadius: 12, padding: '13px 16px', textDecoration: 'none', marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>📂</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#90c0ff' }}>CLASSROOM ESCUELA BÍBLICA 2026</div>
                        <div style={{ fontSize: 10, color: 'rgba(150,195,255,0.60)', marginTop: 2 }}>Carpeta compartida entre los 4 profesores · Google Drive</div>
                      </div>
                      <span style={{ color: 'rgba(150,195,255,0.55)', fontSize: 14 }}>↗</span>
                    </a>
                    <div onClick={() => fileRef.current?.click()} style={{ border: `1.5px dashed ${C.goldFaint}`, borderRadius: 11, padding: 14, textAlign: 'center', cursor: 'pointer', color: C.textFaint, fontSize: 12 }}>
                      📎 O sube un archivo desde tu equipo
                      <div style={{ fontSize: 10, color: 'rgba(200,165,90,0.38)', marginTop: 3 }}>PDF · DOC · DOCX · TXT</div>
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
                  </Card>
                  <Card>
                    <CardTitle num="4">Número de Preguntas</CardTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[5, 8].map(n => (
                        <div key={n} onClick={() => setNumQ(n)} style={{ padding: '16px 8px', borderRadius: 11, cursor: 'pointer', textAlign: 'center', border: `1.5px solid ${numQ === n ? 'rgba(220,175,60,0.65)' : C.cardBdr}`, background: numQ === n ? 'rgba(220,175,60,0.20)' : C.inp, color: numQ === n ? C.gold : C.textFaint, fontSize: 26, fontWeight: 900 }}>
                          {n}<span style={{ fontSize: 10, letterSpacing: 1.5, display: 'block', marginTop: 4, fontWeight: 400 }}>preguntas</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <BtnMain onClick={() => setSubTab('preguntas')}>Continuar — Crear Preguntas →</BtnMain>
                </>
              )}

              {subTab === 'preguntas' && (
                <>
                  <EditorPreguntas preguntas={preguntas} setPreguntas={setPreguntas} />
                  <BtnMain onClick={() => setSubTab('enviar')}>Continuar — Revisar y Enviar →</BtnMain>
                </>
              )}

              {subTab === 'enviar' && (
                <>
                  <Card>
                    <CardTitle>📋 Resumen del Test</CardTitle>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
                      <div><span style={{ color: C.gold, fontWeight: 700 }}>Clase:</span> {titulo || '(sin título)'}</div>
                      <div><span style={{ color: C.gold, fontWeight: 700 }}>Tema:</span> {tema || '(sin tema)'}</div>
                      <div><span style={{ color: C.gold, fontWeight: 700 }}>Preguntas:</span> {preguntas.length} creadas</div>
                      <div><span style={{ color: '#7fff90', fontWeight: 700 }}>Respuestas correctas:</span> guardadas solo para el profesor(a) ✓</div>
                    </div>
                  </Card>
                  <BtnMain onClick={generarTest} disabled={generando || !titulo.trim()}>
                    {generando ? '⏳ Guardando en Firebase...' : '✦ Generar y Compartir Test'}
                  </BtnMain>
                  {waVisible && codigoActual && (
                    <div style={{ background: 'rgba(18,140,60,0.20)', border: '1.5px solid rgba(37,211,102,0.35)', borderRadius: 14, padding: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(150,255,180,0.88)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>📲 Test guardado — Compartir con estudiantes</div>
                      <div style={{ background: 'rgba(0,0,0,0.20)', borderRadius: 10, padding: '12px 14px', marginBottom: 10, borderLeft: '3px solid rgba(37,211,102,0.50)', fontSize: 12, color: 'rgba(220,255,235,0.80)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                        {`📖 HETT — Escuela Bíblica IUMP Recoleta\n\nClase: ${titulo}\nTema: ${tema}\n\nCódigo: ${codigoActual}\nIngresa en: hett.onrender.com`}
                      </div>
                      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 9, color: C.gold, textAlign: 'center', padding: 10, background: 'rgba(0,0,0,0.18)', borderRadius: 10, marginBottom: 12 }}>{codigoActual}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={compartirWA} style={{ flex: 2, padding: 12, borderRadius: 30, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#25d366,#128c7e)', color: '#fff', fontFamily: font, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>📲 Enviar por WhatsApp</button>
                        <button onClick={() => navigator.clipboard.writeText('https://hett.onrender.com')} style={{ flex: 1, padding: 12, borderRadius: 30, border: `1.5px solid rgba(37,211,102,0.30)`, background: 'rgba(37,211,102,0.10)', color: 'rgba(150,255,180,0.80)', fontFamily: font, fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>📋 Copiar link</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ── RESULTADOS ── */}
          {tab === 'participar' && (
            <>
              {testActivo && (
                <Card style={{ marginBottom: 14, background: 'rgba(20,80,30,0.42)', border: '1px solid rgba(40,200,90,0.28)' }}>
                  <div style={{ color: '#80ffaa', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>✅ Test activo en Firebase</div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{testActivo.titulo}</div>
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>Código: <strong style={{ color: C.gold, letterSpacing: 3 }}>{testActivo.codigo}</strong></div>
                </Card>
              )}
              <Metricas respuestas={respuestas} preguntas={preguntas} />
            </>
          )}

          {tab === 'datos' && (
            <>
              <Card>
                <CardTitle>📋 Base de Datos — Historial de Sesiones</CardTitle>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.75, marginBottom: 16 }}>
                  Descarga el archivo CSV con el historial completo de todas las clases. Incluye fecha, hora, estudiante, preguntas correctas e incorrectas y porcentaje final. Compatible con Excel y Google Sheets.
                </div>

                {/* Tabla ejemplo de columnas */}
                <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.cardBdr}` }}>
                        {['Fecha','Hora','Clase','Tema','Estudiante','Total P.','✓ Correctas','✗ Incorrectas','% Correcto','Resultado'].map((h,i) => (
                          <th key={i} style={{ color: C.goldDim, fontWeight: 800, padding: '7px 8px', textAlign: 'left', whiteSpace: 'nowrap', fontSize: 9.5, letterSpacing: 1 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {respuestas.length > 0 ? respuestas.map((r, i) => {
                        const total = preguntas.length || 5
                        const ok    = r.correctas ?? 0
                        const err   = total - ok
                        const pct   = Math.round((ok / total) * 100)
                        return (
                          <tr key={i} style={{ borderBottom: `1px solid rgba(220,175,60,0.08)` }}>
                            <td style={{ padding: '7px 8px', color: C.textMuted, whiteSpace: 'nowrap' }}>{new Date().toLocaleDateString('es-CL')}</td>
                            <td style={{ padding: '7px 8px', color: C.textMuted }}>{new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})}</td>
                            <td style={{ padding: '7px 8px', color: C.text, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{titulo || '—'}</td>
                            <td style={{ padding: '7px 8px', color: C.textMuted, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tema || '—'}</td>
                            <td style={{ padding: '7px 8px', color: C.text, fontWeight: 600 }}>{r.nombre} {r.apellido}</td>
                            <td style={{ padding: '7px 8px', color: C.textMuted, textAlign: 'center' }}>{total}</td>
                            <td style={{ padding: '7px 8px', textAlign: 'center' }}><span style={{ color: '#7fff90', fontWeight: 800 }}>{ok}</span></td>
                            <td style={{ padding: '7px 8px', textAlign: 'center' }}><span style={{ color: '#ffaaaa', fontWeight: 800 }}>{err}</span></td>
                            <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 900, color: pct >= 60 ? '#7fff90' : '#ffaaaa' }}>{pct}%</td>
                            <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                              <span style={{ background: pct >= 60 ? 'rgba(60,200,80,0.22)' : 'rgba(220,60,60,0.20)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 800, color: pct >= 60 ? '#7fff90' : '#ffaaaa' }}>
                                {pct >= 60 ? 'Aprobado' : 'Reprobado'}
                              </span>
                            </td>
                          </tr>
                        )
                      }) : (
                        <tr>
                          <td colSpan={10} style={{ textAlign: 'center', padding: '28px', color: C.textFaint, fontSize: 12 }}>
                            Los datos aparecerán aquí cuando los estudiantes respondan un test activo.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Info columnas CSV */}
                <div style={{ background: 'rgba(220,175,60,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, borderLeft: `3px solid rgba(220,175,60,0.40)` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: C.goldDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>📄 El CSV incluye todas las sesiones históricas</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                    {['Fecha y hora de la clase', 'Código de sesión', 'Nombre de la clase', 'Tema bíblico (RVR1960)', 'Nombre del estudiante', 'Total de preguntas', 'Preguntas correctas', 'Preguntas incorrectas', '% Correcto · % Incorrecto', 'Resultado: Aprobado/Reprobado'].map((col, i) => (
                      <div key={i} style={{ fontSize: 11, color: C.textMuted, padding: '2px 0' }}>✦ {col}</div>
                    ))}
                  </div>
                </div>

                <BtnMain onClick={descargarCSV} disabled={descargando}>
                  {descargando ? '⏳ Descargando desde Firebase...' : '⬇️ Descargar CSV Completo'}
                </BtnMain>
              </Card>
            </>
          )}
        </main>
      </div>
      <style>{`input::placeholder,textarea::placeholder{color:rgba(200,165,90,0.35)}`}</style>
    </div>
  )
}
