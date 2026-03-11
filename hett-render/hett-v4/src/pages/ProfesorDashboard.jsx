import { useState, useRef } from 'react'
import { C } from '../theme.js'
import { Card, Btn, Header, TabBar, SecTitle } from '../components/UI.jsx'

const WAIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>

function TInput({ placeholder, value, onChange, onKeyDown }) {
  const [foc, setFoc] = useState(false)
  return (
    <input placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown}
      onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
      style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: `1.5px solid ${foc ? C.gold : 'rgba(180,220,210,0.2)'}`, borderRadius: 10, padding: '11px 14px', color: C.text, fontSize: 14, fontFamily: C.font, outline: 'none', boxSizing: 'border-box', caretColor: C.gold, transition: 'border-color 0.2s' }}
    />
  )
}

export default function ProfesorDashboard({ onLogout, activeTest, setActiveTest, sesion, setSesion, respuestas }) {
  const [tab, setTab]             = useState('crear')
  const [tituloSesion, setTituloSesion] = useState('')
  const [tema, setTema]           = useState('')
  const [numQ, setNumQ]           = useState(5)
  const [file, setFile]           = useState(null)
  const [fileText, setFileText]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [expandQ, setExpandQ]     = useState(null)
  const [copied, setCopied]       = useState(false)
  const [codigoSesion]            = useState(() => Math.random().toString(36).substring(2,8).toUpperCase())
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setFileText((ev.target.result || '').substring(0, 4000))
    reader.readAsText(f)
  }

  const generateTest = async () => {
    if (!tema.trim()) return alert('Ingresa el tema bíblico o carga un archivo')
    if (!tituloSesion.trim()) return alert('Ingresa el nombre de la sesión/clase')
    setLoading(true); setActiveTest(null)
    const ctx = fileText ? `\nMaterial de apoyo:\n${fileText}` : ''
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 2000,
          messages: [{ role: 'user', content:
            `Eres experto en la Biblia Reina Valera 1960. Genera exactamente ${numQ} preguntas de opción múltiple sobre: "${tema}".${ctx}
Preguntas claras, educativas, basadas en RVR 1960. Responde SOLO JSON puro sin backticks:
{"preguntas":[{"pregunta":"texto","opciones":["A. texto","B. texto","C. texto","D. texto"],"correcta":"A","explicacion":"breve explicación bíblica de la respuesta correcta"}]}`
          }],
        }),
      })
      const data = await res.json()
      const raw  = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim())
      if (parsed.preguntas?.length) {
        setSesion({ titulo: tituloSesion, tema, codigo: codigoSesion, fecha: new Date().toLocaleDateString('es-CL'), generadoTs: Date.now() })
        setActiveTest(parsed)
      } else throw new Error()
    } catch {
      setSesion({ titulo: tituloSesion, tema, codigo: codigoSesion, fecha: new Date().toLocaleDateString('es-CL'), generadoTs: Date.now() })
      setActiveTest({
        preguntas: Array.from({ length: numQ }, (_, i) => ({
          pregunta: `Pregunta ${i+1}: ¿Cuál es la enseñanza bíblica sobre "${tema}" según Reina Valera 1960?`,
          opciones: ['A. Primera respuesta','B. Segunda respuesta','C. Tercera respuesta','D. Cuarta respuesta'],
          correcta: 'A',
          explicacion: `Según la Biblia Reina Valera 1960, este tema se desarrolla en el contexto de ${tema}.`,
        }))
      })
    }
    setLoading(false)
  }

  const waMsg = sesion ? encodeURIComponent(
    `✦ *Test Bíblico HETT*\n📖 Sesión: *${sesion.titulo}*\n✝️ Tema: ${sesion.tema}\n🔑 Código: *${sesion.codigo}*\n\n¡Ingresa con tu nombre y apellido!\n🔗 hett-app.onrender.com`
  ) : ''

  const downloadCSV = () => {
    if (!respuestas.length) return alert('Aún no hay respuestas registradas')
    const header = 'Nombre,Apellido,Sesión,Fecha,Respondió Test,Preguntas Correctas,Preguntas Incorrectas,% Correcto,% Incorrecto'
    const rows = respuestas.map(r => {
      const correctas   = r.detalle?.filter(d => d.correcto).length || 0
      const total       = r.detalle?.length || numQ
      const incorrectas = total - correctas
      return `"${r.nombre}","${r.apellido}","${r.sesion}","${r.fecha}","Sí","${correctas}","${incorrectas}","${Math.round((correctas/total)*100)}%","${Math.round((incorrectas/total)*100)}%"`
    })
    const blob = new Blob(['\uFEFF' + [header,...rows].join('\n')], { type:'text/csv;charset=utf-8' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `HETT_${tituloSesion||'sesion'}_${new Date().toLocaleDateString('es-CL').replace(/\//g,'-')}.csv` })
    a.click()
  }

  const tabs = [
    { id:'crear',     label:'✏️ Crear Test' },
    { id:'participar',label:`👥 Participar (${respuestas.length})` },
    { id:'datos',     label:'📊 Base de Datos' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.bgGrad, fontFamily:C.font, paddingBottom:48 }}>
      <Header subtitle="Panel Profesor" badge="PROFESOR" onLogout={onLogout} />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 16px 0' }}>

        {/* ── CREAR TEST ── */}
        {tab==='crear' && <>
          <Card style={{ marginBottom:14 }}>
            <SecTitle icon="①">Nombre de la Sesión / Clase</SecTitle>
            <TInput placeholder="Ej: Clase 3 — Las Bienaventuranzas" value={tituloSesion} onChange={e=>setTituloSesion(e.target.value)} />
          </Card>

          <Card style={{ marginBottom:14 }}>
            <SecTitle icon="②">Tema Bíblico (Reina Valera 1960)</SecTitle>
            <TInput placeholder="Ej: El Sermón del Monte, El Éxodo, Los Salmos..." value={tema} onChange={e=>setTema(e.target.value)} />
          </Card>

          <Card style={{ marginBottom:14 }}>
            <SecTitle icon="③">Cargar Material de Apoyo — Opcional</SecTitle>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} style={{ display:'none' }} />
            <div onClick={()=>fileRef.current.click()}
              style={{ border:'2px dashed rgba(200,144,26,0.3)', borderRadius:12, padding:'20px 16px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', background:file?'rgba(60,110,100,0.2)':'transparent' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(200,144,26,0.07)'}
              onMouseLeave={e=>e.currentTarget.style.background=file?'rgba(60,110,100,0.2)':'transparent'}>
              <div style={{ color:file?C.goldBright:C.textMuted, fontSize:14 }}>
                {file ? `✓ ${file.name}` : '📎 Haz clic para subir PDF o Word'}
              </div>
              <div style={{ color:C.textMuted, fontSize:11, marginTop:4 }}>PDF · DOC · DOCX · TXT</div>
            </div>
          </Card>

          <Card style={{ marginBottom:20 }}>
            <SecTitle icon="④">Número de Preguntas</SecTitle>
            <div style={{ display:'flex', gap:12 }}>
              {[5,8].map(n=>(
                <button key={n} onClick={()=>setNumQ(n)} style={{ flex:1, padding:'14px', borderRadius:12, cursor:'pointer', fontFamily:C.font, background:numQ===n?'rgba(200,144,26,0.2)':'rgba(255,255,255,0.05)', border:numQ===n?`2px solid ${C.gold}`:`1px solid ${C.cardBorder}`, color:numQ===n?C.goldBright:C.textMuted, fontSize:22, fontWeight:900, transition:'all 0.2s' }}>
                  {n}<br/><span style={{ fontSize:10, letterSpacing:2, fontWeight:400 }}>PREGUNTAS</span>
                </button>
              ))}
            </div>
          </Card>

          <Btn onClick={generateTest} full disabled={loading} style={{ marginBottom:24 }}>
            {loading ? '⏳ Generando test...' : '✦ Generar Test Bíblico'}
          </Btn>

          {activeTest?.preguntas && sesion && (
            <Card style={{ background:'rgba(12,48,35,0.72)', border:'1px solid rgba(60,180,100,0.3)' }}>
              {/* Código WA */}
              <div style={{ background:'rgba(0,0,0,0.25)', borderRadius:12, padding:'14px 16px', marginBottom:18 }}>
                <SecTitle icon="📲">Compartir con Estudiantes</SecTitle>
                <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ color:'#80e6a8', fontFamily:'monospace', fontSize:20, fontWeight:900, letterSpacing:4 }}>🔑 {sesion.codigo}</span>
                  <span style={{ color:C.textMuted, fontSize:11 }}>Código de sesión</span>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <Btn variant="green" small onClick={()=>window.open(`https://wa.me/?text=${waMsg}`,'_blank')}><WAIcon/> Enviar por WhatsApp</Btn>
                  <Btn variant="ghost" small onClick={()=>{ navigator.clipboard?.writeText(`hett-app.onrender.com — Código: ${sesion.codigo}`); setCopied(true); setTimeout(()=>setCopied(false),2000) }}>
                    {copied?'✓ Copiado':'⎘ Copiar Link'}
                  </Btn>
                </div>
              </div>

              <div style={{ color:'#80e6a8', fontWeight:800, fontSize:14, marginBottom:4 }}>✅ {sesion.titulo} — {sesion.tema}</div>
              <div style={{ color:C.textMuted, fontSize:12, marginBottom:14 }}>{activeTest.preguntas.length} preguntas · {sesion.fecha}</div>

              {activeTest.preguntas.map((p,i)=>(
                <div key={i} style={{ marginBottom:8 }}>
                  <div onClick={()=>setExpandQ(expandQ===i?null:i)} style={{ background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'11px 14px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start', border:`1px solid ${expandQ===i?C.gold:C.cardBorder}`, transition:'all 0.2s' }}>
                    <span style={{ color:C.text, fontSize:13, flex:1, lineHeight:1.5, paddingRight:8 }}>
                      <strong style={{ color:C.gold }}>{i+1}. </strong>{p.pregunta}
                    </span>
                    <span style={{ color:C.textMuted, transform:expandQ===i?'rotate(180deg)':'none', transition:'transform 0.2s', flexShrink:0 }}>▾</span>
                  </div>
                  {expandQ===i && (
                    <div style={{ background:'rgba(0,0,0,0.25)', borderRadius:'0 0 10px 10px', padding:'10px 16px', border:`1px solid ${C.cardBorder}`, borderTop:'none' }}>
                      {p.opciones.map((o,j)=>(
                        <div key={j} style={{ padding:'5px 0', fontSize:13, color:o.startsWith(p.correcta)?'#80e6a8':C.textMuted, fontWeight:o.startsWith(p.correcta)?800:400, display:'flex', gap:6 }}>
                          {o.startsWith(p.correcta)&&'✓ '}{o}
                        </div>
                      ))}
                      {p.explicacion && (
                        <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(200,144,26,0.1)', borderRadius:8, color:'rgba(220,180,80,0.9)', fontSize:12, lineHeight:1.5, borderLeft:`3px solid ${C.gold}` }}>
                          📖 {p.explicacion}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}
        </>}

        {/* ── PARTICIPAR ── */}
        {tab==='participar' && <>
          {!activeTest ? (
            <Card style={{ textAlign:'center', padding:'44px 20px' }}>
              <div style={{ fontSize:38, marginBottom:12 }}>📝</div>
              <div style={{ color:C.text, fontSize:16, fontWeight:700 }}>Sin test activo</div>
              <div style={{ color:C.textMuted, fontSize:13, marginTop:6 }}>Genera un test en la pestaña "Crear Test" primero.</div>
            </Card>
          ) : <>
            <Card style={{ marginBottom:16, background:'rgba(20,60,45,0.65)', border:'1px solid rgba(60,180,100,0.25)' }}>
              <div style={{ color:'#80e6a8', fontWeight:800, fontSize:13, marginBottom:4 }}>📋 Sesión Activa: {sesion?.titulo}</div>
              <div style={{ color:C.textMuted, fontSize:12 }}>Tema: {sesion?.tema} · Código: <strong style={{ color:C.gold }}>{sesion?.codigo}</strong> · {activeTest.preguntas.length} preguntas</div>
            </Card>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:18 }}>
              {[
                { label:'Respondieron', value:respuestas.length,                                                           icon:'✅' },
                { label:'Promedio',     value:respuestas.length ? Math.round(respuestas.reduce((a,r)=>a+(r.puntaje||0),0)/respuestas.length)+'%' : '—', icon:'⭐' },
                { label:'Aprobados',    value:respuestas.filter(r=>(r.puntaje||0)>=60).length,                             icon:'🏆' },
              ].map(s=>(
                <Card key={s.label} style={{ textAlign:'center', padding:'14px 8px' }}>
                  <div style={{ fontSize:20 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.gold }}>{s.value}</div>
                  <div style={{ fontSize:10, color:C.textMuted, letterSpacing:1.5, textTransform:'uppercase', fontWeight:700 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {respuestas.length===0 ? (
              <Card style={{ textAlign:'center', padding:'28px 20px' }}>
                <div style={{ color:C.textMuted, fontSize:14 }}>⏳ Esperando respuestas...</div>
                <div style={{ color:C.textMuted, fontSize:12, marginTop:6 }}>Comparte el código <strong style={{ color:C.gold }}>{sesion?.codigo}</strong></div>
              </Card>
            ) : respuestas.map((r,i)=>(
              <Card key={i} style={{ marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ color:C.text, fontWeight:800, fontSize:14 }}>{r.nombre} {r.apellido}</div>
                  <div style={{ color:C.textMuted, fontSize:11, marginTop:2 }}>{r.sesion} · {r.fecha}</div>
                  <div style={{ display:'flex', gap:10, marginTop:5 }}>
                    <span style={{ color:'#80e6a8', fontSize:11 }}>✓ {r.detalle?.filter(d=>d.correcto).length||0} correctas</span>
                    <span style={{ color:'#ff9980', fontSize:11 }}>✗ {(r.detalle?.length||activeTest.preguntas.length)-(r.detalle?.filter(d=>d.correcto).length||0)} incorrectas</span>
                  </div>
                </div>
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:(r.puntaje||0)>=60?C.gold:'#ff9980', lineHeight:1 }}>{r.puntaje||0}%</div>
                  <div style={{ fontSize:9, color:C.textMuted, letterSpacing:1, marginTop:2, fontWeight:700 }}>{(r.puntaje||0)>=60?'APROBADO':'REPASO'}</div>
                </div>
              </Card>
            ))}

            {respuestas.length>=1 && (
              <Card style={{ marginTop:16, background:'rgba(28,45,75,0.65)', border:'1px solid rgba(100,150,220,0.22)' }}>
                <SecTitle icon="🎓">Análisis Pedagógico</SecTitle>
                {activeTest.preguntas.map((p,i)=>{
                  const total = respuestas.length
                  const correctas = respuestas.filter(r=>r.detalle?.[i]?.correcto).length
                  const pct = total ? Math.round((correctas/total)*100) : 0
                  return (
                    <div key={i} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ color:C.text, fontSize:12, flex:1, lineHeight:1.4 }}>P{i+1}: {p.pregunta.substring(0,60)}...</span>
                        <span style={{ color:pct>=70?'#80e6a8':pct>=40?C.gold:'#ff9980', fontWeight:800, fontSize:13, flexShrink:0, marginLeft:8 }}>{pct}%</span>
                      </div>
                      <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.1)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, borderRadius:2, background:pct>=70?'linear-gradient(90deg,#40c070,#60e090)':pct>=40?`linear-gradient(90deg,${C.gold},${C.goldBright})`:'linear-gradient(90deg,#c04040,#e06060)', transition:'width 0.6s' }} />
                      </div>
                      <div style={{ color:C.textMuted, fontSize:11, marginTop:3 }}>
                        {pct<50?'⚠️ Requiere refuerzo en este contenido':pct<70?'📚 Buen progreso, continuar practicando':'✅ Dominio demostrado por el grupo'}
                      </div>
                    </div>
                  )
                })}
              </Card>
            )}
          </>}
        </>}

        {/* ── BASE DE DATOS ── */}
        {tab==='datos' && <>
          <Card style={{ marginBottom:16 }}>
            <SecTitle icon="📊">Base de Datos — Registros de Estudiantes</SecTitle>
            <div style={{ color:C.textMuted, fontSize:13, marginBottom:16 }}>Exporta el listado completo en formato CSV para usar en Excel o Google Sheets.</div>
            <Btn onClick={downloadCSV} variant="teal">⬇️ Descargar CSV</Btn>
          </Card>

          {respuestas.length===0 ? (
            <Card style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
              <div style={{ color:C.textMuted, fontSize:14 }}>Aún no hay registros de estudiantes.</div>
            </Card>
          ) : (
            <Card style={{ overflowX:'auto', padding:'16px 14px' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, fontFamily:C.font }}>
                <thead>
                  <tr>
                    {['Nombre','Apellido','Sesión','Fecha','Correctas','Incorrectas','% Logro'].map(h=>(
                      <th key={h} style={{ color:C.gold, textAlign:'left', padding:'8px 10px', borderBottom:`1px solid ${C.cardBorder}`, letterSpacing:1, fontWeight:800, whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {respuestas.map((r,i)=>{
                    const correctas   = r.detalle?.filter(d=>d.correcto).length||0
                    const total       = r.detalle?.length||(activeTest?.preguntas?.length||5)
                    const incorrectas = total-correctas
                    return (
                      <tr key={i} style={{ borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
                        <td style={{ padding:'9px 10px', color:C.text, fontWeight:700 }}>{r.nombre}</td>
                        <td style={{ padding:'9px 10px', color:C.text, fontWeight:700 }}>{r.apellido}</td>
                        <td style={{ padding:'9px 10px', color:C.textMuted }}>{r.sesion}</td>
                        <td style={{ padding:'9px 10px', color:C.textMuted }}>{r.fecha}</td>
                        <td style={{ padding:'9px 10px', color:'#80e6a8', fontWeight:800 }}>{correctas}</td>
                        <td style={{ padding:'9px 10px', color:'#ff9980', fontWeight:800 }}>{incorrectas}</td>
                        <td style={{ padding:'9px 10px' }}><span style={{ color:(r.puntaje||0)>=60?C.gold:'#ff9980', fontWeight:800 }}>{r.puntaje||0}%</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </>}
      </div>
      <style>{`input::placeholder{color:rgba(220,240,230,0.35)}`}</style>
    </div>
  )
}
