import { useState } from 'react'
import { C, VERSICULOS, CURIOSIDADES, TEMAS, ALABANZAS_SUGERIDAS } from '../theme.js'
import { Card, Btn, Header, TabBar, SecTitle } from '../components/UI.jsx'

// ── QUIZ ──────────────────────────────────────────────────
function QuizView({ quiz, sesion, onTerminar }) {
  const [qIdx, setQIdx]         = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [confirmado, setConfirmado] = useState(false)
  const [historial, setHistorial] = useState([])
  const [resultado, setResultado] = useState(null)

  const p     = quiz.preguntas[qIdx]
  const total = quiz.preguntas.length

  const confirmar = () => {
    if (!seleccion || confirmado) return
    const correcto = seleccion === p.correcta
    setConfirmado(true)
    const nuevo = [...historial, { seleccion, correcto }]
    setTimeout(() => {
      if (qIdx + 1 < total) {
        setQIdx(qIdx + 1); setSeleccion(null); setConfirmado(false); setHistorial(nuevo)
      } else {
        const puntaje = Math.round((nuevo.filter(r => r.correcto).length / total) * 100)
        setResultado({ puntaje, detalle: nuevo })
        onTerminar({ puntaje, detalle: nuevo })
      }
    }, 1300)
  }

  if (resultado) {
    const pct = resultado.puntaje
    return (
      <div style={{ minHeight:'100vh', background:C.bgGrad, fontFamily:C.font, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <Card style={{ maxWidth:460, width:'100%', textAlign:'center', padding:'36px 28px' }}>
          <div style={{ fontSize:52, marginBottom:10 }}>{pct>=80?'🏆':pct>=60?'✨':'📖'}</div>
          <div style={{ color:C.text, fontSize:18, fontWeight:800, fontFamily:C.font }}>¡Test Completado!</div>
          <div style={{ color:C.gold, fontSize:50, fontWeight:900, lineHeight:1, margin:'10px 0' }}>{pct}%</div>
          <div style={{ color:C.textMuted, fontSize:13, marginBottom:20 }}>{resultado.detalle.filter(d=>d.correcto).length} de {total} correctas</div>
          <div style={{ height:8, borderRadius:4, background:'rgba(255,255,255,0.1)', marginBottom:20, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, borderRadius:4, background:pct>=60?`linear-gradient(90deg,${C.gold},${C.goldBright})`:'linear-gradient(90deg,#c04040,#e06060)', transition:'width 0.8s' }} />
          </div>
          <div style={{ padding:'12px 14px', background:'rgba(200,144,26,0.1)', borderRadius:10, color:C.textMuted, fontSize:13, fontStyle:'italic', marginBottom:20, borderLeft:`3px solid ${C.gold}` }}>
            🕐 Las respuestas correctas estarán disponibles 12 horas después del test.
          </div>
          <Btn onClick={()=>window.location.reload()} full variant="ghost">← Volver al Inicio</Btn>
        </Card>
      </div>
    )
  }

  const colorOp = (op) => {
    const letra = op.split('.')[0]
    // Antes de confirmar: solo muestra seleccionado
    if (!confirmado) return seleccion===letra
      ? { bg:C.goldLight, border:`1.5px solid ${C.gold}`, color:C.gold }
      : { bg:'rgba(255,255,255,0.06)', border:`1px solid ${C.cardBorder}`, color:C.text }
    // Después de confirmar: NO muestra cuál era la correcta (el feedback es en 12h)
    if (letra===seleccion && seleccion===p.correcta) return { bg:'rgba(50,160,80,0.22)', border:'1.5px solid rgba(70,200,100,0.5)', color:'#80e6a8' }
    if (letra===seleccion && seleccion!==p.correcta) return { bg:'rgba(180,50,50,0.22)', border:'1.5px solid rgba(220,80,80,0.45)', color:'#ffb0a0' }
    return { bg:'rgba(255,255,255,0.04)', border:`1px solid ${C.cardBorder}`, color:C.textMuted }
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bgGrad, fontFamily:C.font, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:500 }}>
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ color:C.gold, fontSize:12, fontWeight:800 }}>📝 {sesion?.titulo||'Test Bíblico'}</div>
            <div style={{ color:C.textMuted, fontSize:12 }}>{qIdx+1}/{total}</div>
          </div>
          <div style={{ height:5, borderRadius:3, background:'rgba(255,255,255,0.1)', marginBottom:16, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(qIdx/total)*100}%`, background:`linear-gradient(90deg,${C.gold},${C.goldBright})`, transition:'width 0.4s' }} />
          </div>
          <p style={{ color:C.text, fontSize:16, lineHeight:1.65, marginBottom:18, fontWeight:600 }}>{p.pregunta}</p>
          {p.opciones.map((op,j)=>{
            const s = colorOp(op)
            return (
              <div key={j} onClick={()=>!confirmado&&setSeleccion(op.split('.')[0])}
                style={{ background:s.bg, border:s.border, color:s.color, padding:'12px 16px', borderRadius:11, marginBottom:8, cursor:confirmado?'default':'pointer', fontSize:14, transition:'all 0.2s', lineHeight:1.4 }}>
                {op}
              </div>
            )
          })}
          {/* En el test NO se muestra la respuesta correcta ni la explicación */}
          {confirmado && (
            <div style={{ margin:'10px 0', padding:'10px 14px', background:'rgba(0,0,0,0.2)', borderRadius:10, color:C.textMuted, fontSize:12, borderLeft:`2px solid rgba(200,144,26,0.3)` }}>
              🕐 El feedback detallado estará disponible 12 horas después de este test.
            </div>
          )}
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <Btn variant="ghost" small onClick={()=>window.location.reload()}>← Salir</Btn>
            <Btn full onClick={confirmar} disabled={!seleccion||confirmado}>
              {confirmado?'⏳ Siguiente...':'Confirmar'}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── DASHBOARD ESTUDIANTE ─────────────────────────────────
export default function EstudianteDashboard({ user, onLogout, activeTest, sesion, onSubmitRespuestas }) {
  const [tab, setTab]           = useState('inicio')
  const [enQuiz, setEnQuiz]     = useState(false)
  const [yaRespondio, setYaRespondio] = useState(false)
  const [miPuntaje, setMiPuntaje]     = useState(null)
  const [versIdx]               = useState(()=>(new Date().getDate()+new Date().getMonth()*2)%VERSICULOS.length)
  const [curPage, setCurPage]   = useState(0)
  const [temaAbierto, setTemaAbierto] = useState(null)
  const [playlist, setPlaylist] = useState([])
  const [busqueda, setBusqueda] = useState('')

  // Verificar si han pasado 12 horas desde que se generó el test
  const feedbackDisponible = () => {
    if (!sesion?.generadoTs) return false
    const horasTranscurridas = (Date.now() - sesion.generadoTs) / (1000 * 60 * 60)
    return horasTranscurridas >= 12
  }

  const tiempoRestante = () => {
    if (!sesion?.generadoTs) return null
    const ms = sesion.generadoTs + 12*60*60*1000 - Date.now()
    if (ms <= 0) return null
    const h = Math.floor(ms / (1000*60*60))
    const m = Math.floor((ms % (1000*60*60)) / (1000*60))
    return `${h}h ${m}min`
  }

  const handleTerminarQuiz = ({ puntaje, detalle }) => {
    onSubmitRespuestas({ nombre:user.nombre, apellido:user.apellido, sesion:sesion?.titulo||'—', fecha:new Date().toLocaleDateString('es-CL'), puntaje, detalle })
    setMiPuntaje(puntaje); setYaRespondio(true); setEnQuiz(false); setTab('inicio')
  }

  if (enQuiz && activeTest) return <QuizView quiz={activeTest} sesion={sesion} onTerminar={handleTerminarQuiz} />

  const alabanzasFiltradas = ALABANZAS_SUGERIDAS.filter(a =>
    !busqueda || a.titulo.toLowerCase().includes(busqueda.toLowerCase()) || a.artista.toLowerCase().includes(busqueda.toLowerCase())
  )

  const tabs = [
    { id:'inicio',    label:'🏠 Inicio' },
    { id:'test',      label:activeTest?'📝 Mi Test ●':'📝 Mi Test' },
    { id:'alabanzas', label:'🎵 Alabanzas' },
    { id:'explorar',  label:'🗺️ Explorar' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.bgGrad, fontFamily:C.font, paddingBottom:60 }}>
      <Header subtitle={`Hola, ${user.nombre}`} badge="ESTUDIANTE" badgeColor="rgba(50,110,80,0.5)" onLogout={onLogout} />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      <div style={{ maxWidth:700, margin:'0 auto', padding:'22px 16px 0' }}>

        {/* ── INICIO ── */}
        {tab==='inicio' && <>
          {/* Banner test disponible */}
          {activeTest && (
            <Card style={{ marginBottom:16, background:yaRespondio?'rgba(20,60,40,0.72)':'rgba(60,30,10,0.72)', border:`1px solid ${yaRespondio?'rgba(60,180,100,0.35)':'rgba(200,144,26,0.45)'}` }}>
              <div style={{ color:yaRespondio?'#80e6a8':C.goldBright, fontWeight:800, fontSize:14, marginBottom:4 }}>
                {yaRespondio?'✅ Test completado':'🔔 Test disponible: '+sesion?.titulo}
              </div>
              {yaRespondio ? (
                <div>
                  <div style={{ color:C.textMuted, fontSize:13, marginBottom:8 }}>Tu puntaje: <strong style={{ color:C.gold, fontSize:18 }}>{miPuntaje}%</strong></div>
                  {feedbackDisponible() ? (
                    <div style={{ color:'#80e6a8', fontSize:12 }}>✅ El feedback con respuestas correctas ya está disponible en "Mi Test".</div>
                  ) : (
                    <div style={{ color:C.textMuted, fontSize:12 }}>🕐 Feedback disponible en: <strong style={{ color:C.gold }}>{tiempoRestante()}</strong></div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ color:C.textMuted, fontSize:13, marginBottom:10 }}>Tema: {sesion?.tema} · {activeTest.preguntas.length} preguntas</div>
                  <Btn small onClick={()=>setEnQuiz(true)}>Responder Test →</Btn>
                </div>
              )}
            </Card>
          )}

          {/* Versículo */}
          <Card style={{ marginBottom:16, background:'rgba(10,50,45,0.72)', border:'1px solid rgba(80,180,150,0.22)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, background:'radial-gradient(circle,rgba(200,144,26,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <SecTitle icon="📖">Versículo del Día — Reina Valera 1960</SecTitle>
            <blockquote style={{ margin:'0 0 12px', borderLeft:`3px solid ${C.gold}`, paddingLeft:16 }}>
              <p style={{ color:C.text, fontSize:15, lineHeight:1.8, fontStyle:'italic', margin:0 }}>"{VERSICULOS[versIdx].text}"</p>
            </blockquote>
            <div style={{ color:C.gold, fontSize:12, letterSpacing:2, textAlign:'right', fontWeight:700 }}>— {VERSICULOS[versIdx].ref}</div>
            <div style={{ display:'flex', gap:4, marginTop:10, justifyContent:'center', flexWrap:'wrap' }}>
              {VERSICULOS.map((_,i)=><div key={i} style={{ width:5, height:5, borderRadius:'50%', background:i===versIdx?C.gold:'rgba(200,144,26,0.2)' }}/>)}
            </div>
          </Card>

          {/* Curiosidades */}
          <Card style={{ background:'rgba(45,28,8,0.68)', border:`1px solid rgba(200,144,26,0.2)` }}>
            <SecTitle icon="💡">Dato Curioso Bíblico</SecTitle>
            <p style={{ color:C.text, fontSize:14, lineHeight:1.75, margin:'0 0 14px', minHeight:54 }}>{CURIOSIDADES[curPage]}</p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {CURIOSIDADES.map((_,i)=><div key={i} onClick={()=>setCurPage(i)} style={{ width:6, height:6, borderRadius:'50%', cursor:'pointer', background:i===curPage?C.gold:'rgba(200,144,26,0.2)', transition:'all 0.2s' }}/>)}
              </div>
              <Btn small variant="ghost" onClick={()=>setCurPage(p=>(p+1)%CURIOSIDADES.length)}>Siguiente →</Btn>
            </div>
          </Card>
        </>}

        {/* ── MI TEST ── */}
        {tab==='test' && <>
          {!activeTest ? (
            <Card style={{ textAlign:'center', padding:'50px 20px' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
              <div style={{ color:C.text, fontSize:16, fontWeight:800, marginBottom:6 }}>Sin test disponible aún</div>
              <div style={{ color:C.textMuted, fontSize:13 }}>El profesor publicará el test pronto. Revisa los temas bíblicos mientras esperas.</div>
            </Card>
          ) : yaRespondio ? (
            <Card>
              <SecTitle icon="📋">Resultado del Test</SecTitle>
              <div style={{ textAlign:'center', padding:'10px 0 20px' }}>
                <div style={{ color:C.gold, fontSize:48, fontWeight:900 }}>{miPuntaje}%</div>
                <div style={{ color:C.textMuted, fontSize:13 }}>Sesión: {sesion?.titulo}</div>
              </div>
              {feedbackDisponible() ? (
                // Feedback completo disponible después de 12h
                <div>
                  <div style={{ background:'rgba(20,60,40,0.5)', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
                    <div style={{ color:'#80e6a8', fontWeight:800, fontSize:13, marginBottom:6 }}>✅ Feedback disponible</div>
                    <div style={{ color:C.textMuted, fontSize:12 }}>Han pasado más de 12 horas desde el test. Aquí están las respuestas correctas:</div>
                  </div>
                  {activeTest.preguntas.map((p,i)=>(
                    <Card key={i} style={{ marginBottom:10, padding:'14px 16px' }}>
                      <div style={{ color:C.text, fontSize:13, fontWeight:700, marginBottom:8 }}>
                        <span style={{ color:C.gold }}>P{i+1}.</span> {p.pregunta}
                      </div>
                      {p.opciones.map((o,j)=>(
                        <div key={j} style={{ padding:'5px 8px', fontSize:12, borderRadius:7, marginBottom:4,
                          background:o.startsWith(p.correcta)?'rgba(50,160,80,0.18)':'transparent',
                          color:o.startsWith(p.correcta)?'#80e6a8':C.textMuted,
                          fontWeight:o.startsWith(p.correcta)?800:400, border:o.startsWith(p.correcta)?'1px solid rgba(70,200,100,0.3)':'1px solid transparent' }}>
                          {o.startsWith(p.correcta)?'✓ ':''}{o}
                        </div>
                      ))}
                      {p.explicacion && (
                        <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(200,144,26,0.1)', borderRadius:8, color:'rgba(220,180,80,0.9)', fontSize:12, lineHeight:1.5, borderLeft:`3px solid ${C.gold}` }}>
                          📖 {p.explicacion}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                // Aún no han pasado 12 horas
                <div style={{ background:'rgba(60,40,10,0.5)', borderRadius:12, padding:'20px 18px', textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>🕐</div>
                  <div style={{ color:C.goldBright, fontWeight:800, fontSize:15, marginBottom:6 }}>Feedback en proceso</div>
                  <div style={{ color:C.textMuted, fontSize:13, lineHeight:1.7, marginBottom:12 }}>
                    Las respuestas correctas y explicaciones estarán disponibles<br/>
                    <strong style={{ color:C.gold }}>12 horas después</strong> de haberse generado el test.
                  </div>
                  <div style={{ background:'rgba(0,0,0,0.25)', borderRadius:10, padding:'12px 16px', display:'inline-block' }}>
                    <div style={{ color:C.textMuted, fontSize:11, letterSpacing:1, marginBottom:4 }}>TIEMPO RESTANTE</div>
                    <div style={{ color:C.gold, fontSize:24, fontWeight:900, letterSpacing:2 }}>{tiempoRestante()}</div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <SecTitle icon="📝">Test Disponible</SecTitle>
              <div style={{ color:C.text, fontSize:17, fontWeight:800, marginBottom:4, fontFamily:C.font }}>{sesion?.titulo}</div>
              <div style={{ color:C.textMuted, fontSize:13, marginBottom:6 }}>Tema: {sesion?.tema}</div>
              <div style={{ color:C.textMuted, fontSize:13, marginBottom:20 }}>{activeTest.preguntas.length} preguntas · Responde con calma</div>
              <div style={{ background:'rgba(60,40,10,0.4)', borderRadius:10, padding:'12px 14px', marginBottom:20, color:C.textMuted, fontSize:12, borderLeft:`3px solid rgba(200,144,26,0.4)` }}>
                🕐 Las respuestas correctas serán visibles 12 horas después del test.
              </div>
              <Btn full onClick={()=>setEnQuiz(true)}>🚀 Comenzar Test</Btn>
            </Card>
          )}
        </>}

        {/* ── ALABANZAS ── */}
        {tab==='alabanzas' && <>
          <Card style={{ marginBottom:16 }}>
            <SecTitle icon="🎵">Mi Playlist de Alabanzas</SecTitle>
            {playlist.length===0 ? (
              <div style={{ color:C.textMuted, fontSize:13, textAlign:'center', padding:'14px 0' }}>
                Agrega canciones desde la lista de abajo ↓
              </div>
            ) : playlist.map((a,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<playlist.length-1?`1px solid rgba(255,255,255,0.06)`:'none' }}>
                <div>
                  <div style={{ color:C.text, fontSize:13, fontWeight:700 }}>🎵 {a.titulo}</div>
                  <div style={{ color:C.textMuted, fontSize:11 }}>{a.artista}</div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn small variant="green" onClick={()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(a.query)}`,'_blank')}>▶ YT</Btn>
                  <Btn small variant="red" onClick={()=>setPlaylist(p=>p.filter((_,j)=>j!==i))}>✕</Btn>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <SecTitle icon="🔍">Buscar Alabanzas Cristianas</SecTitle>
            <input placeholder="Buscar por título o artista..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
              style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:`1px solid ${C.cardBorder}`, borderRadius:10, padding:'10px 14px', color:C.text, fontSize:14, fontFamily:C.font, outline:'none', boxSizing:'border-box', marginBottom:14, caretColor:C.gold }} />
            {alabanzasFiltradas.map((a,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:i<alabanzasFiltradas.length-1?`1px solid rgba(255,255,255,0.06)`:'none' }}>
                <div>
                  <div style={{ color:C.text, fontSize:13, fontWeight:600 }}>{a.titulo}</div>
                  <div style={{ color:C.textMuted, fontSize:11 }}>{a.artista}</div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn small variant="ghost" onClick={()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(a.query)}`,'_blank')}>▶ Ver</Btn>
                  {!playlist.find(p=>p.titulo===a.titulo) && <Btn small onClick={()=>setPlaylist(p=>[...p,a])}>+ Lista</Btn>}
                </div>
              </div>
            ))}
          </Card>
        </>}

        {/* ── EXPLORAR ── */}
        {tab==='explorar' && <>
          <div style={{ color:C.text, fontSize:16, fontWeight:800, marginBottom:16, fontFamily:C.font }}>🗺️ Explorar la Biblia</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
            {TEMAS.map((t,i)=>(
              <Card key={i} style={{ cursor:'pointer', padding:'14px 16px', transition:'all 0.2s', background:temaAbierto===i?'rgba(200,144,26,0.15)':C.card, border:`1px solid ${temaAbierto===i?C.gold:C.cardBorder}` }}
                onClick={()=>setTemaAbierto(temaAbierto===i?null:i)}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:20 }}>{t.icon}</span>
                    <span style={{ color:temaAbierto===i?C.goldBright:C.text, fontWeight:800, fontSize:13 }}>{t.label}</span>
                  </div>
                  <span style={{ color:C.textMuted, transform:temaAbierto===i?'rotate(180deg)':'none', transition:'transform 0.25s', display:'inline-block' }}>▾</span>
                </div>
                {temaAbierto===i && (
                  <div style={{ marginTop:10, borderTop:`1px solid rgba(200,144,26,0.18)`, paddingTop:10 }}>
                    {t.items.map((item,j)=>(
                      <div key={j} style={{ padding:'6px 4px', fontSize:12, color:C.text, lineHeight:1.4, borderBottom:j<t.items.length-1?'1px solid rgba(255,255,255,0.05)':'none', display:'flex', gap:6 }}>
                        <span style={{ color:C.gold, fontSize:10 }}>✦</span>{item}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>}

        <div style={{ textAlign:'center', marginTop:36, color:C.textMuted, fontSize:11, letterSpacing:2 }}>✦ HOY ES TU TIEMPO — VEN A JESÚS ✦</div>
      </div>
      <style>{`input::placeholder{color:rgba(220,240,230,0.32)}`}</style>
    </div>
  )
}
