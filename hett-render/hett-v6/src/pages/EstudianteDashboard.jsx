import { useState, useEffect } from 'react'
import { VERSICULOS, CURIOSIDADES, TEMAS, TEMAS_DETALLE, ALABANZAS_SUGERIDAS } from '../theme.js'
import { guardarRespuestas } from '../firebase.js'

const font = "'Georgia','Times New Roman',serif"
const BG = 'linear-gradient(150deg,#0d2a3a 0%,#1a4a5a 20%,#2a7a7a 42%,#3a9090 58%,#c85520 76%,#e07030 88%,#f09050 100%)'

const Logo = () => (
  <div style={{display:'flex',flexDirection:'column'}}>
    <span style={{fontSize:20,fontWeight:900,letterSpacing:5,color:'#fff',textShadow:'0 0 16px rgba(255,220,100,0.50)',lineHeight:1}}>HETT</span>
    <span style={{fontSize:7.5,letterSpacing:3,color:'rgba(255,235,180,0.65)',textTransform:'uppercase',fontWeight:700,marginTop:2}}>IUMP Recoleta</span>
  </div>
)

const Card = ({children,style={}}) => (
  <div style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:16,padding:'16px 18px',marginBottom:14,boxShadow:'0 4px 20px rgba(0,0,0,0.12)',...style}}>{children}</div>
)

export default function EstudianteDashboard({user,onLogout,testActivo}) {
  const [tab,setTab]=useState('inicio')
  const [respuestas,setRespuestas]=useState({})
  const [confirmadas,setConfirmadas]=useState({})
  const [terminado,setTerminado]=useState(false)
  const [tiempoRestante,setTiempoRestante]=useState(null)
  const [curIdx,setCurIdx]=useState(0)

  useEffect(()=>{
    if(!testActivo?.generadoTs)return
    const actualizar=()=>{const diff=testActivo.generadoTs+12*3600*1000-Date.now();setTiempoRestante(diff>0?diff:0)}
    actualizar()
    const iv=setInterval(actualizar,1000)
    return()=>clearInterval(iv)
  },[testActivo])

  const feedbackOk = tiempoRestante===0

  const formatTiempo=(ms)=>{
    if(!ms)return ''
    const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000)
    return `${h}h ${m}m ${s}s`
  }

  const confirmar=(idx)=>{
    if(!respuestas[idx])return
    setConfirmadas(c=>({...c,[idx]:true}))
  }

  const finalizar=async()=>{
    if(!testActivo)return
    const preguntas=testActivo.preguntas||[]
    const correctas=preguntas.filter((p,i)=>respuestas[i]===p.correcta).length
    const detalles=preguntas.map((p,i)=>respuestas[i]===p.correcta)
    try{
      await guardarRespuestas(testActivo.codigo,user.nombre,user.apellido||'',{correctas,detalles,total:preguntas.length})
    }catch(e){console.error(e)}
    setTerminado(true)
  }

  const todasConfirmadas = testActivo?.preguntas?.every((_,i)=>confirmadas[i])
  const preguntas = testActivo?.preguntas||[]
  const correctas = preguntas.filter((p,i)=>respuestas[i]===p.correcta).length

  const versiculo=VERSICULOS[new Date().getDate()%VERSICULOS.length]

  const tabs=[{id:'inicio',label:'🏠 Inicio'},{id:'test',label:'📝 Mi Test'},{id:'alabanzas',label:'🎵 Alabanzas'},{id:'explorar',label:'🗺️ Explorar'}]

  return (
    <div style={{minHeight:'100vh',background:BG,fontFamily:font,display:'flex',flexDirection:'column'}}>
      <header style={{background:'rgba(8,28,38,0.72)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.12)',padding:'0 18px',display:'flex',alignItems:'center',justifyContent:'space-between',height:58,flexShrink:0,position:'sticky',top:0,zIndex:20}}>
        <Logo/>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:13,fontWeight:800,color:'rgba(255,200,100,0.90)'}}>Hola, {user.nombre} {user.apellido||''}</div>
          <div style={{fontSize:9,fontStyle:'italic',color:'rgba(255,220,150,0.50)',marginTop:1}}>Hoy Es Tu Tiempo</div>
        </div>
        <button onClick={onLogout} style={{background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:'50%',width:30,height:30,cursor:'pointer',color:'rgba(255,255,255,0.65)',fontSize:13}}>←</button>
      </header>

      <div style={{background:'rgba(8,28,38,0.60)',backdropFilter:'blur(10px)',borderBottom:'1px solid rgba(255,255,255,0.10)',display:'flex',justifyContent:'center',gap:2,overflowX:'auto',flexShrink:0}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'11px 16px',background:'none',border:'none',cursor:'pointer',fontFamily:font,fontSize:11,letterSpacing:1.2,whiteSpace:'nowrap',color:tab===t.id?'rgba(255,220,100,0.90)':'rgba(255,255,255,0.42)',borderBottom:tab===t.id?'2.5px solid rgba(220,150,40,0.80)':'2.5px solid transparent',fontWeight:tab===t.id?800:400}}>{t.label}</button>
        ))}
      </div>

      <main style={{flex:1,overflowY:'auto',maxWidth:700,margin:'0 auto',padding:'18px 16px',width:'100%'}}>

        {/* INICIO */}
        {tab==='inicio'&&(
          <>
            <Card style={{marginBottom:14,background:testActivo?'rgba(12,50,22,0.88)':'rgba(10,38,52,0.88)',border:`1px solid ${testActivo?'rgba(40,200,90,0.28)':'rgba(255,255,255,0.18)'}`}}>
              {testActivo?(
                <>
                  <div style={{color:'#80ffaa',fontSize:11,fontWeight:800,letterSpacing:2,marginBottom:5}}>✅ TEST DISPONIBLE</div>
                  <div style={{color:'#fff',fontSize:15,fontWeight:800,marginBottom:3}}>{testActivo.titulo}</div>
                  <div style={{color:'rgba(255,255,255,0.55)',fontSize:11}}>📖 {testActivo.tema} · Código: {testActivo.codigo}</div>
                  <button onClick={()=>setTab('test')} style={{marginTop:12,padding:'10px 22px',borderRadius:30,border:'none',cursor:'pointer',background:'#fff',color:'#3a1a00',fontFamily:font,fontSize:11,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Ir al Test →</button>
                </>
              ):(
                <>
                  <div style={{color:'rgba(255,255,255,0.55)',fontSize:11,fontWeight:800,letterSpacing:2,marginBottom:5}}>⏳ SIN TEST ACTIVO</div>
                  <div style={{color:'rgba(255,255,255,0.70)',fontSize:13}}>El profesor aún no ha iniciado ningún test.</div>
                </>
              )}
            </Card>
            <Card>
              <div style={{fontSize:9,letterSpacing:2.5,textTransform:'uppercase',color:'rgba(255,235,180,0.80)',fontWeight:800,marginBottom:10}}>📖 Versículo del Día — RVR1960</div>
              <blockquote style={{margin:0,borderLeft:'3px solid rgba(220,150,40,0.70)',paddingLeft:14}}>
                <p style={{color:'#fff',fontSize:13,lineHeight:1.75,fontStyle:'italic',margin:'0 0 7px'}}>"{versiculo.text}"</p>
                <footer style={{color:'rgba(255,200,80,0.80)',fontSize:11,fontWeight:800}}>— {versiculo.ref}</footer>
              </blockquote>
            </Card>
            <Card>
              <div style={{fontSize:9,letterSpacing:2.5,textTransform:'uppercase',color:'rgba(255,235,180,0.80)',fontWeight:800,marginBottom:10}}>💡 Curiosidades Bíblicas</div>
              <p style={{color:'rgba(255,255,255,0.80)',fontSize:13,lineHeight:1.7,marginBottom:12}}>{CURIOSIDADES[curIdx]}</p>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <button onClick={()=>setCurIdx(i=>(i-1+CURIOSIDADES.length)%CURIOSIDADES.length)} style={{padding:'7px 14px',borderRadius:20,border:'1px solid rgba(255,255,255,0.20)',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.70)',cursor:'pointer',fontFamily:font,fontSize:11}}>‹</button>
                <div style={{flex:1,display:'flex',justifyContent:'center',gap:5}}>
                  {[0,1,2,3,4].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:curIdx%5===i?'rgba(220,150,40,0.90)':'rgba(255,255,255,0.20)'}}/>)}
                </div>
                <button onClick={()=>setCurIdx(i=>(i+1)%CURIOSIDADES.length)} style={{padding:'7px 14px',borderRadius:20,border:'1px solid rgba(255,255,255,0.20)',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.70)',cursor:'pointer',fontFamily:font,fontSize:11}}>›</button>
              </div>
            </Card>
          </>
        )}

        {/* TEST */}
        {tab==='test'&&(
          <>
            {!testActivo?(
              <Card style={{textAlign:'center',padding:'44px 20px'}}>
                <div style={{fontSize:36,marginBottom:10}}>📋</div>
                <div style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:5}}>No hay test disponible</div>
                <div style={{color:'rgba(255,255,255,0.50)',fontSize:12}}>El profesor debe generar un test primero.</div>
              </Card>
            ):(
              <>
                <Card style={{marginBottom:14}}>
                  <div style={{color:'rgba(255,220,100,0.90)',fontSize:14,fontWeight:800,marginBottom:4}}>{testActivo.titulo}</div>
                  <div style={{color:'rgba(255,255,255,0.55)',fontSize:11}}>📖 {testActivo.tema} · {testActivo.fecha}</div>
                  {tiempoRestante>0&&(
                    <div style={{marginTop:10,padding:'8px 12px',background:'rgba(200,85,32,0.15)',borderRadius:10,color:'rgba(255,150,80,0.90)',fontSize:11,fontWeight:700}}>
                      🔒 Respuestas correctas disponibles en: {formatTiempo(tiempoRestante)}
                    </div>
                  )}
                  {feedbackOk&&!terminado&&todasConfirmadas&&(
                    <div style={{marginTop:10,padding:'8px 12px',background:'rgba(20,140,70,0.20)',borderRadius:10,color:'#80ffaa',fontSize:11,fontWeight:700}}>✅ Ya puedes ver las respuestas correctas</div>
                  )}
                </Card>

                {terminado?(
                  <Card style={{textAlign:'center',padding:'40px 20px'}}>
                    <div style={{fontSize:50,marginBottom:12}}>🎉</div>
                    <div style={{color:'rgba(255,220,100,0.90)',fontSize:22,fontWeight:900}}>{Math.round((correctas/preguntas.length)*100)}%</div>
                    <div style={{color:'rgba(255,255,255,0.80)',fontSize:14,marginTop:6}}>{correctas} de {preguntas.length} respuestas correctas</div>
                    {feedbackOk&&<div style={{color:'rgba(255,255,255,0.50)',fontSize:11,marginTop:8}}>Puedes ver las explicaciones abajo ↓</div>}
                  </Card>
                ):(
                  <>
                    {preguntas.map((p,i)=>(
                      <Card key={i}>
                        <div style={{color:'rgba(255,200,80,0.80)',fontSize:10,fontWeight:800,letterSpacing:2,marginBottom:8,textTransform:'uppercase'}}>Pregunta {i+1}</div>
                        <div style={{color:'#fff',fontSize:14,fontWeight:700,marginBottom:14,lineHeight:1.5}}>{p.texto}</div>
                        {(p.opciones||[]).map((op,j)=>{
                          const sel=respuestas[i]===j
                          const conf=confirmadas[i]
                          const esCorrecta=j===p.correcta
                          let bg='rgba(255,255,255,0.06)',bdr='1px solid rgba(255,255,255,0.15)'
                          if(sel&&!conf){bg='rgba(200,85,32,0.22)';bdr='1.5px solid rgba(220,130,50,0.55)'}
                          if(conf&&feedbackOk&&esCorrecta){bg='rgba(20,140,70,0.28)';bdr='1.5px solid rgba(40,200,90,0.45)'}
                          if(conf&&feedbackOk&&sel&&!esCorrecta){bg='rgba(150,30,30,0.28)';bdr='1.5px solid rgba(220,60,60,0.45)'}
                          return (
                            <div key={j} onClick={()=>!conf&&setRespuestas(r=>({...r,[i]:j}))}
                              style={{padding:'10px 14px',borderRadius:11,marginBottom:7,cursor:conf?'default':'pointer',background:bg,border:bdr,transition:'all 0.2s'}}>
                              <span style={{color:sel?'#fff':'rgba(255,255,255,0.60)',fontWeight:sel?700:400}}>
                                {['A','B','C','D'][j]}. {op}
                              </span>
                              {conf&&feedbackOk&&esCorrecta&&<span style={{color:'#7fff90',marginLeft:8}}>✓</span>}
                            </div>
                          )
                        })}
                        {conf&&feedbackOk&&p.explicacion&&(
                          <div style={{marginTop:10,padding:'10px 12px',background:'rgba(255,200,80,0.08)',borderRadius:10,borderLeft:'3px solid rgba(220,150,40,0.55)'}}>
                            <div style={{color:'rgba(255,200,80,0.85)',fontSize:10,fontWeight:800,marginBottom:4}}>EXPLICACIÓN</div>
                            <div style={{color:'rgba(255,255,255,0.75)',fontSize:12,lineHeight:1.6}}>{p.explicacion}</div>
                          </div>
                        )}
                        {conf&&!feedbackOk&&(
                          <div style={{color:'rgba(255,255,255,0.40)',fontSize:10,marginTop:8}}>✓ Respuesta guardada · Explicación disponible en {formatTiempo(tiempoRestante)}</div>
                        )}
                        {!conf&&(
                          <button onClick={()=>confirmar(i)} disabled={respuestas[i]===undefined} style={{marginTop:8,padding:'8px 18px',borderRadius:20,border:'none',cursor:respuestas[i]===undefined?'not-allowed':'pointer',background:respuestas[i]===undefined?'rgba(255,255,255,0.10)':'rgba(255,255,255,0.20)',color:'#fff',fontFamily:font,fontSize:11,fontWeight:700,opacity:respuestas[i]===undefined?0.5:1}}>
                            Confirmar respuesta
                          </button>
                        )}
                      </Card>
                    ))}
                    {todasConfirmadas&&!terminado&&(
                      <button onClick={finalizar} style={{width:'100%',padding:14,borderRadius:40,border:'none',cursor:'pointer',background:'#fff',color:'#3a1a00',fontFamily:font,fontSize:13,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase',marginBottom:14}}>✦ Finalizar y Enviar Resultados</button>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ALABANZAS */}
        {tab==='alabanzas'&&(
          <Card>
            <div style={{fontSize:9,letterSpacing:2.5,textTransform:'uppercase',color:'rgba(255,235,180,0.80)',fontWeight:800,marginBottom:12}}>🎵 Alabanzas Sugeridas</div>
            {(ALABANZAS_SUGERIDAS||[]).slice(0,8).map((a,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                <div>
                  <div style={{color:'rgba(255,255,255,0.88)',fontWeight:700,fontSize:12}}>{a.titulo}</div>
                  <div style={{color:'rgba(255,255,255,0.45)',fontSize:10}}>{a.artista}</div>
                </div>
                <button onClick={()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(a.query)}`, '_blank')} style={{padding:'6px 12px',borderRadius:20,border:'1px solid rgba(255,255,255,0.20)',background:'rgba(22,90,110,0.7)',color:'#b0ffee',fontFamily:font,fontSize:10,cursor:'pointer',fontWeight:700}}>▶ YouTube</button>
              </div>
            ))}
          </Card>
        )}

        {/* EXPLORAR */}
        {tab==='explorar'&&(
          <>
            <div style={{color:'rgba(255,255,255,0.88)',fontSize:15,fontWeight:800,marginBottom:14}}>🗺️ Explorar la Biblia — RVR1960</div>
            {(TEMAS||[]).map((t,i)=>(
              <Card key={i} style={{padding:'14px 16px',cursor:'pointer'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:20}}>{t.icon}</span>
                  <div>
                    <div style={{color:'rgba(255,255,255,0.88)',fontWeight:800,fontSize:13}}>{t.label}</div>
                    <div style={{color:'rgba(255,255,255,0.45)',fontSize:10}}>{(TEMAS_DETALLE&&TEMAS_DETALLE[t.label])?TEMAS_DETALLE[t.label].length+' temas':'Ver más'}</div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        <div style={{textAlign:'center',marginTop:24,color:'rgba(255,255,255,0.25)',fontSize:10,letterSpacing:2}}>✦ HOY ES TU TIEMPO — VEN A JESÚS ✦</div>
      </main>
      <style>{`input::placeholder{color:rgba(255,255,255,0.28)}`}</style>
    </div>
  )
}
