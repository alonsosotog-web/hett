import { useState, useEffect } from 'react'
import { C, VERSICULOS, CURIOSIDADES, TEMAS, TEMAS_DETALLE, ALABANZAS_SUGERIDAS } from '../theme.js'
import { Logo, Btn, Card, Header, TabBar, SecTitle, BackIcon } from '../components/UI.jsx'

export default function EstudianteDashboard({ user, onLogout, activeTest, sesion, onSubmitRespuestas }) {
  const [tab, setTab] = useState('inicio')

  const tabs = [
    { id: 'inicio', label: '🏠 Inicio' },
    { id: 'test', label: '📝 Mi Test' },
    { id: 'alabanzas', label: '🎵 Alabanzas' },
    { id: 'explorar', label: '🗺️ Explorar' },
  ]

  const pageStyle = { minHeight: '100vh', background: C.bg, fontFamily: C.font, paddingBottom: 48 }
  const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(4,16,22,0.50)', pointerEvents: 'none', zIndex: 0 }

  return (
    <div style={pageStyle}>
      <div style={overlayStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Logo size="sm" overlay />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: C.coralB, fontSize: 14, fontWeight: 800 }}>Hola, {user.nombre} {user.apellido || ''}</div>
              <div style={{ color: C.goldB, fontSize: 10, fontStyle: 'italic' }}>Hoy Es Tu Tiempo</div>
            </div>
            <BackIcon onClick={onLogout} />
          </div>
        </Header>

        <TabBar tabs={tabs} active={tab} onChange={setTab} />

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '22px 16px 0' }}>

          {tab === 'inicio' && <InicioTab activeTest={activeTest} sesion={sesion} user={user} />}
          {tab === 'test' && <TestTab activeTest={activeTest} sesion={sesion} user={user} onSubmit={onSubmitRespuestas} />}
          {tab === 'alabanzas' && <AlabanzasTab />}
          {tab === 'explorar' && <ExplorarTab />}

          <div style={{ textAlign: 'center', marginTop: 32, color: C.textMuted, fontSize: 11, letterSpacing: 2 }}>✦ HOY ES TU TIEMPO — VEN A JESÚS ✦</div>
        </div>
      </div>
    </div>
  )
}

// ── INICIO ─────────────────────────────────────────────
function InicioTab({ activeTest, sesion, user }) {
  const [curIdx, setCurIdx] = useState(0)
  const versiculo = VERSICULOS[new Date().getDate() % VERSICULOS.length]

  return (
    <>
      {/* Banner test */}
      <Card style={{ marginBottom: 14, background: activeTest ? 'rgba(12,50,22,0.88)' : 'rgba(10,38,52,0.88)', border: `1px solid ${activeTest ? 'rgba(40,200,90,0.3)' : C.cardBdr}` }}>
        {activeTest ? (
          <>
            <div style={{ color: '#80ffaa', fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>✅ TEST DISPONIBLE</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{sesion?.titulo}</div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>📖 {sesion?.tema} · Código: {sesion?.codigo}</div>
          </>
        ) : (
          <>
            <div style={{ color: C.textMuted, fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>⏳ SIN TEST ACTIVO</div>
            <div style={{ color: C.text, fontSize: 14 }}>El profesor aún no ha iniciado ningún test.</div>
          </>
        )}
      </Card>

      {/* Versículo */}
      <Card style={{ marginBottom: 14 }}>
        <SecTitle icon="📖">Versículo del Día — RVR1960</SecTitle>
        <blockquote style={{ margin: 0, borderLeft: `3px solid ${C.coral}`, paddingLeft: 14 }}>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.75, fontStyle: 'italic', margin: '0 0 8px' }}>"{versiculo.text}"</p>
          <footer style={{ color: C.gold, fontSize: 12, fontWeight: 800 }}>— {versiculo.ref}</footer>
        </blockquote>
      </Card>

      {/* Curiosidades */}
      <Card>
        <SecTitle icon="💡">Curiosidades Bíblicas</SecTitle>
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>{CURIOSIDADES[curIdx]}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Btn small variant="ghost" onClick={() => setCurIdx(i => (i - 1 + CURIOSIDADES.length) % CURIOSIDADES.length)}>‹ Anterior</Btn>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: curIdx % 5 === i ? C.coral : C.cardBdr }} />)}
          </div>
          <Btn small variant="ghost" onClick={() => setCurIdx(i => (i + 1) % CURIOSIDADES.length)}>Siguiente ›</Btn>
        </div>
      </Card>
    </>
  )
}

// ── TEST ───────────────────────────────────────────────
function TestTab({ activeTest, sesion, user, onSubmit }) {
  const [respuestas, setRespuestas] = useState({})
  const [confirmadas, setConfirmadas] = useState({})
  const [terminado, setTerminado] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(null)

  useEffect(() => {
    if (!sesion?.generadoTs) return
    const actualizar = () => {
      const diff = sesion.generadoTs + 12 * 3600 * 1000 - Date.now()
      setTiempoRestante(diff > 0 ? diff : 0)
    }
    actualizar()
    const iv = setInterval(actualizar, 1000)
    return () => clearInterval(iv)
  }, [sesion])

  const feedbackDisponible = tiempoRestante === 0

  if (!activeTest) return (
    <Card style={{ textAlign: 'center', padding: '50px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
      <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>No hay test disponible</div>
      <div style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>El profesor debe generar un test primero.</div>
    </Card>
  )

  const formatTiempo = (ms) => {
    if (!ms) return ''
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${h}h ${m}m ${s}s`
  }

  const handleConfirmar = (idx) => {
    if (!respuestas[idx]) return
    setConfirmadas(c => ({ ...c, [idx]: true }))
  }

  const handleTerminar = () => {
    const correctas = activeTest.filter((p, i) => respuestas[i] === p.correcta).length
    onSubmit({ nombre: user.nombre, apellido: user.apellido || '', correctas, respuestas: Object.values(respuestas) })
    setTerminado(true)
  }

  const todasConfirmadas = activeTest.every((_, i) => confirmadas[i])
  const correctas = activeTest.filter((p, i) => respuestas[i] === p.correcta).length

  return (
    <>
      {/* Info sesión */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ color: C.goldB, fontSize: 15, fontWeight: 800 }}>{sesion?.titulo}</div>
        <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>📖 {sesion?.tema} · {sesion?.fecha}</div>
        {tiempoRestante > 0 && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(200,85,32,0.15)', borderRadius: 10, color: C.coralB, fontSize: 12, fontWeight: 700 }}>
            🔒 Respuestas correctas disponibles en: {formatTiempo(tiempoRestante)}
          </div>
        )}
        {feedbackDisponible && !terminado && todasConfirmadas && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(20,140,70,0.2)', borderRadius: 10, color: '#80ffaa', fontSize: 12, fontWeight: 700 }}>
            ✅ Ya podés ver las respuestas correctas
          </div>
        )}
      </Card>

      {terminado ? (
        <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 50, marginBottom: 12 }}>🎉</div>
          <div style={{ color: C.goldB, fontSize: 22, fontWeight: 900 }}>{Math.round((correctas / activeTest.length) * 100)}%</div>
          <div style={{ color: C.text, fontSize: 15, marginTop: 6 }}>{correctas} de {activeTest.length} respuestas correctas</div>
          {feedbackDisponible && (
            <div style={{ marginTop: 16, color: C.textMuted, fontSize: 12 }}>Podés ver las explicaciones abajo ↓</div>
          )}
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeTest.map((p, i) => (
            <Card key={i}>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>PREGUNTA {i + 1}</div>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 14, lineHeight: 1.5 }}>{p.pregunta}</div>
              {Object.entries(p.opciones).map(([k, v]) => {
                const seleccionada = respuestas[i] === k
                const confirmada = confirmadas[i]
                const esCorrecta = k === p.correcta
                let bg = 'rgba(255,255,255,0.05)'
                let border = `1px solid ${C.cardBdr}`
                if (seleccionada && !confirmada) { bg = 'rgba(200,85,32,0.2)'; border = `1.5px solid ${C.coral}` }
                if (confirmada && feedbackDisponible && esCorrecta) { bg = 'rgba(20,140,70,0.25)'; border = '1.5px solid rgba(40,200,90,0.4)' }
                if (confirmada && feedbackDisponible && seleccionada && !esCorrecta) { bg = 'rgba(150,30,30,0.25)'; border = '1.5px solid rgba(220,60,60,0.4)' }
                return (
                  <div key={k} onClick={() => !confirmada && setRespuestas(r => ({ ...r, [i]: k }))}
                    style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 7, cursor: confirmada ? 'default' : 'pointer', background: bg, border, transition: 'all 0.2s' }}>
                    <span style={{ color: seleccionada ? C.text : C.textMuted, fontWeight: seleccionada ? 700 : 400 }}>{k}. {v}</span>
                    {confirmada && feedbackDisponible && esCorrecta && <span style={{ color: '#80ffaa', marginLeft: 8 }}>✓</span>}
                  </div>
                )
              })}
              {confirmadas[i] && feedbackDisponible && (
                <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(240,150,40,0.1)', borderRadius: 10, borderLeft: `3px solid ${C.coral}` }}>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>EXPLICACIÓN</div>
                  <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{p.explicacion}</div>
                </div>
              )}
              {!confirmadas[i] && (
                <Btn small onClick={() => handleConfirmar(i)} disabled={!respuestas[i]}>Confirmar</Btn>
              )}
              {confirmadas[i] && !feedbackDisponible && (
                <div style={{ color: C.textMuted, fontSize: 11, marginTop: 8 }}>✓ Respuesta confirmada · Explicación disponible en {formatTiempo(tiempoRestante)}</div>
              )}
            </Card>
          ))}
          {todasConfirmadas && !terminado && (
            <Btn full onClick={handleTerminar}>✦ Finalizar y enviar resultados</Btn>
          )}
        </div>
      )}
    </>
  )
}

// ── ALABANZAS ──────────────────────────────────────────
function AlabanzasTab() {
  const [busqueda, setBusqueda] = useState('')
  const [playlist, setPlaylist] = useState([])

  const filtradas = ALABANZAS_SUGERIDAS.filter(a =>
    a.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.artista.toLowerCase().includes(busqueda.toLowerCase())
  )

  const togglePlaylist = (a) => {
    setPlaylist(pl => pl.find(x => x.titulo === a.titulo) ? pl.filter(x => x.titulo !== a.titulo) : [...pl, a])
  }

  return (
    <>
      <Card style={{ marginBottom: 14 }}>
        <SecTitle icon="🎵">Alabanzas Sugeridas</SecTitle>
        <input placeholder="Buscar alabanza o artista..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: `1px solid ${C.cardBdr}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 13, fontFamily: C.font, outline: 'none', boxSizing: 'border-box', marginBottom: 14, caretColor: C.gold }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtradas.map((a, i) => {
            const enPlaylist = playlist.find(x => x.titulo === a.titulo)
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: `1px solid ${enPlaylist ? C.coral : C.cardBdr}`, transition: 'all 0.2s' }}>
                <div>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{a.titulo}</div>
                  <div style={{ color: C.textMuted, fontSize: 11 }}>{a.artista}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn small variant="teal" onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(a.query)}`, '_blank')}>▶ YouTube</Btn>
                  <Btn small variant={enPlaylist ? 'red' : 'ghost'} onClick={() => togglePlaylist(a)}>{enPlaylist ? '−' : '+'}</Btn>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {playlist.length > 0 && (
        <Card>
          <SecTitle icon="🎶">Mi Playlist ({playlist.length})</SecTitle>
          {playlist.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < playlist.length - 1 ? `1px solid rgba(240,160,80,0.12)` : 'none' }}>
              <div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{a.titulo}</div>
                <div style={{ color: C.textMuted, fontSize: 11 }}>{a.artista}</div>
              </div>
              <Btn small variant="teal" onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(a.query)}`, '_blank')}>▶</Btn>
            </div>
          ))}
        </Card>
      )}
    </>
  )
}

// ── EXPLORAR ───────────────────────────────────────────
function ExplorarTab() {
  const [temaAbierto, setTemaAbierto] = useState(null)
  const [itemAbierto, setItemAbierto] = useState(null)

  const abrirTema = (i) => {
    setTemaAbierto(temaAbierto === i ? null : i)
    setItemAbierto(null)
  }

  return (
    <>
      <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginBottom: 16 }}>🗺️ Explorar la Biblia — RVR1960</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TEMAS.map((t, i) => {
          const detalle = TEMAS_DETALLE[t.label] || []
          const abierto = temaAbierto === i
          return (
            <Card key={i} style={{
              cursor: 'pointer', padding: '14px 16px',
              transition: 'all 0.25s',
              background: abierto ? 'rgba(12,50,60,0.92)' : C.card,
              border: `1px solid ${abierto ? C.coral : C.cardBdr}`,
            }}>
              <div onClick={() => abrirTema(i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <div>
                    <div style={{ color: abierto ? C.goldB : C.text, fontWeight: 800, fontSize: 14 }}>{t.label}</div>
                    <div style={{ color: C.textMuted, fontSize: 11 }}>{detalle.length} temas</div>
                  </div>
                </div>
                <span style={{ color: C.textMuted, transform: abierto ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', display: 'inline-block', fontSize: 16 }}>▾</span>
              </div>

              {abierto && (
                <div style={{ marginTop: 14, borderTop: `1px solid rgba(240,160,80,0.18)`, paddingTop: 14 }} onClick={e => e.stopPropagation()}>
                  {/* Grilla de sub-temas */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8, marginBottom: itemAbierto !== null ? 14 : 0 }}>
                    {detalle.map((d, j) => (
                      <div key={j} onClick={() => setItemAbierto(itemAbierto === j ? null : j)}
                        style={{
                          background: itemAbierto === j ? 'rgba(200,85,32,0.25)' : 'rgba(255,255,255,0.07)',
                          border: `1px solid ${itemAbierto === j ? C.coral : C.cardBdr}`,
                          borderRadius: 10, padding: '10px 12px', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        <div style={{ color: itemAbierto === j ? C.coralB : C.gold, fontSize: 12, fontWeight: 800, marginBottom: 2 }}>{d.nombre}</div>
                        <div style={{ color: C.textMuted, fontSize: 10 }}>{d.ref}</div>
                      </div>
                    ))}
                  </div>

                  {/* Detalle del item */}
                  {itemAbierto !== null && detalle[itemAbierto] && (
                    <div style={{ background: 'rgba(0,0,0,0.28)', borderRadius: 14, padding: '16px 18px', border: `1px solid ${C.cardBdr}` }}>
                      <div style={{ color: C.goldB, fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                        {detalle[itemAbierto].nombre}
                      </div>
                      <blockquote style={{ margin: '0 0 10px', borderLeft: `3px solid ${C.coral}`, paddingLeft: 12 }}>
                        <p style={{ color: C.text, fontSize: 13, lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
                          "{detalle[itemAbierto].txt}"
                        </p>
                      </blockquote>
                      <div style={{ color: C.gold, fontSize: 11, marginBottom: 10, fontWeight: 700 }}>
                        — {detalle[itemAbierto].ref}
                      </div>
                      <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.65 }}>
                        {detalle[itemAbierto].desc}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </>
  )
}
