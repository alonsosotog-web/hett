import { useState, useRef } from 'react'
import { C } from '../theme.js'
import { Logo, Btn, Card, Header, TabBar, SecTitle, BackIcon } from '../components/UI.jsx'

function FocusInput({ placeholder, value, onChange, id, focusId, setFocusId }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocusId(id)}
      onBlur={() => setFocusId(null)}
      style={{
        width: '100%', background: 'rgba(255,255,255,0.08)',
        border: `1.5px solid ${focusId === id ? C.coral : C.cardBdr}`,
        borderRadius: 10, padding: '11px 14px', color: C.text,
        fontSize: 14, fontFamily: C.font, outline: 'none',
        boxSizing: 'border-box', caretColor: C.coral, transition: 'border-color 0.2s',
      }}
    />
  )
}

export default function ProfesorDashboard({ onLogout, activeTest, setActiveTest, sesion, setSesion, respuestas }) {
  const [tab, setTab] = useState('crear')
  const [titulo, setTitulo] = useState('')
  const [tema, setTema] = useState('')
  const [numQ, setNumQ] = useState(5)
  const [focusId, setFocusId] = useState(null)
  const [generando, setGenerando] = useState(false)
  const [archivoNombre, setArchivoNombre] = useState('')
  const [archivoTexto, setArchivoTexto] = useState('')
  const [expandido, setExpandido] = useState(null)
  const fileRef = useRef()

  const tabs = [
    { id: 'crear', label: '✏️ Crear Test' },
    { id: 'participar', label: `👥 Participar (${respuestas.length})` },
    { id: 'datos', label: '📊 Base de Datos' },
  ]

  const handleArchivo = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setArchivoNombre(file.name)
    const text = await file.text()
    setArchivoTexto(text.slice(0, 3000))
  }

  const generarTest = async () => {
    if (!titulo.trim() || !tema.trim()) return
    setGenerando(true)
    const codigoSesion = Math.random().toString(36).substring(2, 8).toUpperCase()
    const promptBase = `Eres un pastor bíblico experto en la Biblia Reina Valera 1960.
Genera exactamente ${numQ} preguntas de opción múltiple sobre: "${tema}".
Título de la clase: "${titulo}".
${archivoTexto ? `Material de apoyo del profesor:\n${archivoTexto}\n` : ''}
RESPONDE SOLO CON JSON PURO (sin markdown, sin bloques de código).
Formato exacto:
[
  {
    "pregunta": "¿Texto de la pregunta?",
    "opciones": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correcta": "A",
    "explicacion": "Explicación bíblica con referencia RVR1960."
  }
]`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: promptBase }],
        }),
      })
      const data = await response.json()
      let texto = data.content?.[0]?.text || ''
      texto = texto.replace(/```json|```/g, '').trim()
      const preguntas = JSON.parse(texto)
      const ts = Date.now()
      setActiveTest(preguntas)
      setSesion({ titulo, tema, codigo: codigoSesion, fecha: new Date().toLocaleDateString('es-CL'), generadoTs: ts })
    } catch {
      // Demo fallback
      const demo = Array.from({ length: numQ }, (_, i) => ({
        pregunta: `Pregunta ${i + 1} sobre ${tema}: ¿Cuál es la respuesta correcta?`,
        opciones: { A: 'Primera opción', B: 'Segunda opción', C: 'Tercera opción', D: 'Cuarta opción' },
        correcta: 'A',
        explicacion: `Explicación bíblica sobre ${tema} según Reina Valera 1960.`,
      }))
      setActiveTest(demo)
      setSesion({ titulo, tema, codigo: codigoSesion, fecha: new Date().toLocaleDateString('es-CL'), generadoTs: Date.now() })
    }
    setGenerando(false)
    setTab('participar')
  }

  const descargarCSV = () => {
    const encabezado = 'Nombre,Apellido,Sesión,Fecha,Correctas,Incorrectas,% Logro\n'
    const filas = respuestas.map(r => {
      const total = activeTest?.length || numQ
      const correctas = r.correctas || 0
      const incorrectas = total - correctas
      const logro = Math.round((correctas / total) * 100)
      return `${r.nombre},${r.apellido},"${sesion?.titulo || ''}",${sesion?.fecha || ''},${correctas},${incorrectas},${logro}%`
    }).join('\n')
    const blob = new Blob([encabezado + filas], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `hett-resultados-${sesion?.codigo || 'test'}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const compartirWhatsApp = () => {
    const link = `${window.location.origin}?codigo=${sesion?.codigo}`
    const msg = encodeURIComponent(`📖 *HETT — ${sesion?.titulo}*\nTema: ${sesion?.tema}\nCódigo: *${sesion?.codigo}*\nIngresá en: ${link}`)
    window.open(`https://wa.me/?text=${msg}`)
  }

  const pageStyle = { minHeight: '100vh', background: C.bg, fontFamily: C.font, paddingBottom: 48 }
  const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(4,16,22,0.50)', pointerEvents: 'none', zIndex: 0 }

  return (
    <div style={pageStyle}>
      <div style={overlayStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div />
            <Logo size="sm" overlay />
            <BackIcon onClick={onLogout} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: C.coralB, fontSize: 17, fontWeight: 800, letterSpacing: 2 }}>Panel del Profesor</div>
            <div style={{ color: C.goldB, fontSize: 12, fontStyle: 'italic', opacity: 0.75 }}>Hoy Es Tu Tiempo</div>
          </div>
        </Header>

        <TabBar tabs={tabs} active={tab} onChange={setTab} />

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '22px 16px 0' }}>

          {/* ── CREAR TEST ── */}
          {tab === 'crear' && (
            <>
              <Card style={{ marginBottom: 14 }}>
                <SecTitle icon="①">Nombre de la Sesión / Clase</SecTitle>
                <FocusInput placeholder="Ej: Clase 3 — Las Bienaventuranzas" value={titulo} onChange={e => setTitulo(e.target.value)} id={1} focusId={focusId} setFocusId={setFocusId} />
              </Card>

              <Card style={{ marginBottom: 14 }}>
                <SecTitle icon="②">Tema Bíblico — Reina Valera 1960</SecTitle>
                <FocusInput placeholder="Ej: El Sermón del Monte, Los Salmos..." value={tema} onChange={e => setTema(e.target.value)} id={2} focusId={focusId} setFocusId={setFocusId} />
              </Card>

              <Card style={{ marginBottom: 14 }}>
                <SecTitle icon="③">Cargar Material de Apoyo — Opcional</SecTitle>
                <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed rgba(240,140,80,0.3)`, borderRadius: 12, padding: '20px', textAlign: 'center', color: C.textMuted, fontSize: 14, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  {archivoNombre ? `📄 ${archivoNombre}` : '📎 Haz clic para subir PDF o Word'}
                  <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(240,140,80,0.38)' }}>PDF · DOC · DOCX · TXT</div>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={handleArchivo} />
              </Card>

              <Card style={{ marginBottom: 20 }}>
                <SecTitle icon="④">Número de Preguntas</SecTitle>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[5, 8].map(n => (
                    <button key={n} onClick={() => setNumQ(n)} style={{
                      flex: 1, padding: '16px', borderRadius: 12, cursor: 'pointer',
                      fontFamily: C.font,
                      background: numQ === n ? 'linear-gradient(135deg,rgba(180,65,20,0.4),rgba(100,30,10,0.4))' : 'rgba(255,255,255,0.06)',
                      border: numQ === n ? `2px solid ${C.coral}` : `1px solid ${C.cardBdr}`,
                      color: numQ === n ? C.coralB : C.textMuted,
                      fontSize: 24, fontWeight: 900, transition: 'all 0.2s',
                    }}>
                      {n}<br /><span style={{ fontSize: 10, letterSpacing: 2, fontWeight: 400 }}>PREGUNTAS</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Btn full onClick={generarTest} disabled={generando || !titulo.trim() || !tema.trim()}>
                {generando ? '⏳ Generando...' : '✦ Generar Test Bíblico'}
              </Btn>
              {(!titulo.trim() || !tema.trim()) && (
                <p style={{ color: C.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 }}>Completá el nombre de sesión y el tema primero</p>
              )}
            </>
          )}

          {/* ── PARTICIPAR ── */}
          {tab === 'participar' && (
            <>
              {!activeTest ? (
                <Card style={{ textAlign: 'center', padding: '50px 20px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                  <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Sin test activo aún</div>
                  <div style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>Genera un test en "Crear Test" primero.</div>
                </Card>
              ) : (
                <>
                  {/* Info sesión */}
                  <Card style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ color: C.goldB, fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{sesion?.titulo}</div>
                        <div style={{ color: C.textMuted, fontSize: 12 }}>📖 {sesion?.tema} · {sesion?.fecha}</div>
                        <div style={{ color: C.coral, fontSize: 14, fontWeight: 800, marginTop: 6 }}>Código: <span style={{ color: C.gold, letterSpacing: 3 }}>{sesion?.codigo}</span></div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn small variant="teal" onClick={compartirWhatsApp}>📲 WhatsApp</Btn>
                        <Btn small variant="ghost" onClick={() => navigator.clipboard.writeText(sesion?.codigo)}>📋 Copiar</Btn>
                      </div>
                    </div>
                  </Card>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
                    {[
                      { label: 'Respondieron', val: respuestas.length, icon: '👥' },
                      { label: 'Promedio', val: respuestas.length ? `${Math.round(respuestas.reduce((a, r) => a + (r.correctas / activeTest.length) * 100, 0) / respuestas.length)}%` : '—', icon: '📊' },
                      { label: 'Aprobados', val: respuestas.filter(r => (r.correctas / activeTest.length) >= 0.6).length, icon: '✅' },
                    ].map((s, i) => (
                      <Card key={i} style={{ textAlign: 'center', padding: '14px 10px' }}>
                        <div style={{ fontSize: 22 }}>{s.icon}</div>
                        <div style={{ color: C.goldB, fontSize: 22, fontWeight: 900 }}>{s.val}</div>
                        <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                      </Card>
                    ))}
                  </div>

                  {/* Lista estudiantes */}
                  <Card style={{ marginBottom: 14 }}>
                    <SecTitle icon="👥">Estudiantes</SecTitle>
                    {respuestas.length === 0 ? (
                      <div style={{ color: C.textMuted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Esperando que los estudiantes respondan...</div>
                    ) : (
                      respuestas.map((r, i) => {
                        const pct = Math.round((r.correctas / activeTest.length) * 100)
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < respuestas.length - 1 ? `1px solid rgba(240,160,80,0.12)` : 'none' }}>
                            <div>
                              <div style={{ color: C.text, fontWeight: 700 }}>{r.nombre} {r.apellido}</div>
                              <div style={{ color: C.textMuted, fontSize: 11 }}>{r.correctas}/{activeTest.length} correctas</div>
                            </div>
                            <div style={{ color: pct >= 60 ? '#80ffaa' : '#ffaaaa', fontSize: 18, fontWeight: 900 }}>{pct}%</div>
                          </div>
                        )
                      })
                    )}
                  </Card>

                  {/* Preguntas expandibles */}
                  <Card>
                    <SecTitle icon="📋">Preguntas del Test</SecTitle>
                    {activeTest.map((p, i) => (
                      <div key={i} style={{ marginBottom: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.cardBdr}` }}>
                        <div onClick={() => setExpandido(expandido === i ? null : i)} style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{i + 1}. {p.pregunta}</span>
                          <span style={{ color: C.textMuted, fontSize: 12, flexShrink: 0 }}>{expandido === i ? '▲' : '▼'}</span>
                        </div>
                        {expandido === i && (
                          <div style={{ padding: '0 14px 14px', borderTop: `1px solid rgba(240,160,80,0.15)`, paddingTop: 12 }}>
                            {Object.entries(p.opciones).map(([k, v]) => (
                              <div key={k} style={{ padding: '7px 10px', borderRadius: 8, marginBottom: 6, background: k === p.correcta ? 'rgba(20,140,70,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${k === p.correcta ? 'rgba(40,200,90,0.4)' : 'transparent'}` }}>
                                <span style={{ color: k === p.correcta ? '#60ffaa' : C.textMuted, fontWeight: k === p.correcta ? 800 : 400 }}>{k}. {v} {k === p.correcta && '✓'}</span>
                              </div>
                            ))}
                            <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(240,150,40,0.1)', borderRadius: 10, borderLeft: `3px solid ${C.coral}` }}>
                              <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>EXPLICACIÓN</div>
                              <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{p.explicacion}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </Card>
                </>
              )}
            </>
          )}

          {/* ── BASE DE DATOS ── */}
          {tab === 'datos' && (
            <Card>
              <SecTitle icon="📊">Base de Datos — Registros</SecTitle>
              {respuestas.length === 0 ? (
                <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 16, textAlign: 'center', padding: '20px 0' }}>No hay registros aún.</div>
              ) : (
                <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.cardBdr}` }}>
                        {['Nombre', 'Apellido', 'Sesión', 'Fecha', 'Correctas', '%'].map(h => (
                          <th key={h} style={{ color: C.gold, padding: '8px 10px', textAlign: 'left', letterSpacing: 1, fontWeight: 800 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {respuestas.map((r, i) => {
                        const pct = Math.round((r.correctas / (activeTest?.length || 5)) * 100)
                        return (
                          <tr key={i} style={{ borderBottom: `1px solid rgba(240,160,80,0.08)` }}>
                            <td style={{ color: C.text, padding: '8px 10px' }}>{r.nombre}</td>
                            <td style={{ color: C.text, padding: '8px 10px' }}>{r.apellido}</td>
                            <td style={{ color: C.textMuted, padding: '8px 10px' }}>{sesion?.titulo || '—'}</td>
                            <td style={{ color: C.textMuted, padding: '8px 10px' }}>{sesion?.fecha || '—'}</td>
                            <td style={{ color: C.text, padding: '8px 10px' }}>{r.correctas}/{activeTest?.length || 5}</td>
                            <td style={{ color: pct >= 60 ? '#80ffaa' : '#ffaaaa', padding: '8px 10px', fontWeight: 800 }}>{pct}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <Btn variant="teal" onClick={descargarCSV}>⬇️ Descargar CSV</Btn>
            </Card>
          )}

          <div style={{ textAlign: 'center', marginTop: 32, color: C.textMuted, fontSize: 11, letterSpacing: 2 }}>✦ HOY ES TU TIEMPO — VEN A JESÚS ✦</div>
        </div>
      </div>
      <style>{`input::placeholder{color:rgba(255,200,150,0.3)}`}</style>
    </div>
  )
}
