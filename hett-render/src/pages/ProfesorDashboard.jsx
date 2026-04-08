import { useState, useEffect, useRef } from 'react'
import { guardarTest, escucharRespuestas } from '../firebase.js'

const font = "'Georgia','Times New Roman',serif"

const Logo = () => (
  <div style={{display:'flex',flexDirection:'column'}}>
    <span style={{fontSize:22,fontWeight:900,letterSpacing:6,color:'#fff',textShadow:'0 0 20px rgba(255,220,100,0.50)',lineHeight:1}}>HETT</span>
    <span style={{fontSize:8,letterSpacing:3,color:'rgba(255,235,180,0.70)',textTransform:'uppercase',fontWeight:700,marginTop:2}}>IUMP Recoleta</span>
    <span style={{fontSize:7,letterSpacing:2,color:'rgba(255,210,130,0.45)',textTransform:'uppercase',marginTop:1}}>Escuela Bíblica</span>
  </div>
)

const Card = ({children,style={}}) => (
  <div style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:16,padding:'16px 18px',marginBottom:14,boxShadow:'0 4px 20px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.12)',...style}}>{children}</div>
)

const CardTitle = ({num,children}) => (
  <div style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,235,180,0.90)',fontWeight:800,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
    {num&&<div style={{width:22,height:22,borderRadius:'50%',background:'rgba(255,200,80,0.22)',border:'1px solid rgba(255,200,80,0.45)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#ffdd70',flexShrink:0,fontWeight:900}}>{num}</div>}
    {children}
  </div>
)

const Inp = ({placeholder,value,onChange,style={}}) => (
  <input placeholder={placeholder} value={value} onChange={onChange}
    style={{width:'100%',background:'rgba(255,255,255,0.12)',border:'1.5px solid rgba(255,255,255,0.22)',borderRadius:11,padding:'11px 14px',color:'#fff',fontSize:12,fontFamily:font,outline:'none',...style}}/>
)

function EditorPreguntas({preguntas,setPreguntas}) {
  const letters=['A','B','C','D']
  const addP=()=>setPreguntas(prev=>[...prev,{id:Date.now(),texto:'',opciones:['','','',''],correcta:null,explicacion:'',numOpciones:4}])
  const upd=(idx,f,v)=>setPreguntas(prev=>prev.map((p,i)=>i===idx?{...p,[f]:v}:p))
  const updO=(idx,oi,v)=>setPreguntas(prev=>prev.map((p,i)=>{if(i!==idx)return p;const o=[...p.opciones];o[oi]=v;return{...p,opciones:o}}))
  const del=(idx)=>setPreguntas(prev=>prev.filter((_,i)=>i!==idx))
  return (
    <div>
      <Card style={{marginBottom:12,padding:'12px 16px'}}>
        <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
          <span style={{fontSize:16}}>🔒</span>
          <span style={{fontSize:11,color:'rgba(255,235,170,0.75)',lineHeight:1.6}}>
            La respuesta correcta que marques aquí <strong style={{color:'#7fff90'}}>solo la ve el profesor</strong>. Los estudiantes nunca la ven durante el test. El resultado se desbloquea 12 horas después.
          </span>
        </div>
      </Card>
      {preguntas.map((p,idx)=>(
        <div key={p.id} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:14,padding:'14px 16px',marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <span style={{fontSize:10,fontWeight:800,letterSpacing:2,color:'rgba(255,220,150,0.75)',textTransform:'uppercase'}}>Pregunta {idx+1}</span>
            <button onClick={()=>del(idx)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,100,100,0.60)',fontSize:11,fontFamily:font}}>✕ Eliminar</button>
          </div>
          <Inp placeholder="Escribe la pregunta aquí..." value={p.texto} onChange={e=>upd(idx,'texto',e.target.value)} style={{marginBottom:12}}/>
          <div style={{display:'flex',gap:6,marginBottom:10}}>
            <span style={{fontSize:9,color:'rgba(255,200,100,0.60)',letterSpacing:1.5,textTransform:'uppercase',alignSelf:'center'}}>Opciones:</span>
            {[3,4].map(n=>(
              <button key={n} onClick={()=>upd(idx,'numOpciones',n)} style={{padding:'4px 12px',borderRadius:20,border:`1px solid ${p.numOpciones===n?'rgba(255,200,80,0.55)':'rgba(255,255,255,0.18)'}`,background:p.numOpciones===n?'rgba(255,200,80,0.20)':'transparent',color:p.numOpciones===n?'#ffdd70':'rgba(255,255,255,0.45)',fontSize:11,cursor:'pointer',fontFamily:font,fontWeight:700}}>{n}</button>
            ))}
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:'rgba(255,200,100,0.60)',letterSpacing:2,textTransform:'uppercase',marginBottom:7,fontWeight:700}}>Marca la respuesta correcta 🔒</div>
            {letters.slice(0,p.numOpciones).map((letter,oi)=>(
              <div key={oi} style={{display:'flex',alignItems:'center',gap:9,marginBottom:7}}>
                <span style={{fontSize:11,fontWeight:800,color:'rgba(255,200,80,0.65)',width:16,textAlign:'center',flexShrink:0}}>{letter}</span>
                <div onClick={()=>upd(idx,'correcta',oi)} style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${p.correcta===oi?'#7fff90':'rgba(255,255,255,0.30)'}`,background:p.correcta===oi?'rgba(127,255,144,0.20)':'transparent',cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
                  {p.correcta===oi&&<div style={{width:8,height:8,borderRadius:'50%',background:'#7fff90'}}/>}
                </div>
                <input placeholder={`Opción ${letter}`} value={p.opciones[oi]} onChange={e=>updO(idx,oi,e.target.value)}
                  style={{flex:1,background:p.correcta===oi?'rgba(127,255,144,0.08)':'rgba(255,255,255,0.08)',border:`1px solid ${p.correcta===oi?'rgba(127,255,144,0.35)':'rgba(255,255,255,0.18)'}`,borderRadius:9,padding:'8px 12px',color:'#fff',fontSize:12,fontFamily:font,outline:'none'}}/>
                {p.correcta===oi&&<span style={{fontSize:10,color:'rgba(127,255,144,0.85)',flexShrink:0,fontWeight:800}}>✓ Correcta</span>}
              </div>
            ))}
          </div>
          <div style={{fontSize:9,color:'rgba(255,200,80,0.55)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:5}}>📖 Explicación bíblica (solo visible al revisar)</div>
          <textarea placeholder="Ej: Según Mateo 5:3 RVR1960..." value={p.explicacion} onChange={e=>upd(idx,'explicacion',e.target.value)}
            style={{width:'100%',background:'rgba(255,200,80,0.07)',border:'1px solid rgba(255,200,80,0.20)',borderRadius:9,padding:'9px 12px',color:'rgba(255,235,170,0.85)',fontSize:11,fontFamily:font,outline:'none',resize:'none',height:54}}/>
        </div>
      ))}
      <button onClick={addP} style={{width:'100%',padding:11,borderRadius:12,border:'1.5px dashed rgba(255,255,255,0.22)',background:'transparent',color:'rgba(255,255,255,0.50)',fontFamily:font,fontSize:11,cursor:'pointer',marginBottom:14}}>+ Agregar pregunta</button>
    </div>
  )
}

function Metricas({respuestas,preguntas}) {
  if(!respuestas.length) return (
    <Card style={{textAlign:'center',padding:'40px 20px'}}>
      <div style={{fontSize:36,marginBottom:10}}>📋</div>
      <div style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:5}}>Sin respuestas aún</div>
      <div style={{color:'rgba(255,255,255,0.50)',fontSize:12}}>Los resultados aparecerán aquí en tiempo real cuando los estudiantes respondan.</div>
    </Card>
  )
  const total=preguntas.length||5
  const promedio=Math.round(respuestas.reduce((a,r)=>a+((r.correctas||0)/total)*100,0)/respuestas.length)
  const aprobados=respuestas.filter(r=>((r.correctas||0)/total)>=0.6).length
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
        {[{n:respuestas.length,l:'Respondieron'},{n:`${promedio}%`,l:'Promedio'},{n:aprobados,l:'Aprobados'}].map((s,i)=>(
          <div key={i} style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:13,padding:'14px 10px',textAlign:'center'}}>
            <div style={{fontSize:24,fontWeight:900,color:'#fff'}}>{s.n}</div>
            <div style={{fontSize:9,letterSpacing:1.5,color:'rgba(255,255,255,0.52)',textTransform:'uppercase',marginTop:3}}>{s.l}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardTitle>🗂 Resultados por alumno</CardTitle>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.12)'}}>
                <th style={{color:'rgba(255,255,255,0.55)',fontWeight:700,padding:'6px 8px',textAlign:'left'}}>Alumno</th>
                {preguntas.slice(0,5).map((_,i)=><th key={i} style={{color:'rgba(255,255,255,0.55)',fontWeight:700,padding:'6px 8px',textAlign:'center'}}>P{i+1}</th>)}
                <th style={{color:'rgba(255,255,255,0.55)',fontWeight:700,padding:'6px 8px',textAlign:'center'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {respuestas.map((r,i)=>{
                const pct=Math.round(((r.correctas||0)/total)*100)
                return (
                  <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <td style={{color:'rgba(255,255,255,0.82)',padding:'7px 8px',fontWeight:600}}>{r.nombre} {r.apellido}</td>
                    {(r.detalles||[]).slice(0,5).map((ok,j)=>(
                      <td key={j} style={{padding:'7px 8px',textAlign:'center'}}>
                        <span style={{background:ok?'rgba(60,200,80,0.28)':'rgba(220,60,60,0.22)',borderRadius:6,color:ok?'#90ffaa':'#ffaaaa',fontWeight:800,padding:'3px 6px',fontSize:10}}>{ok?'✓':'✗'}</span>
                      </td>
                    ))}
                    <td style={{padding:'7px 8px',textAlign:'center',fontWeight:900,fontSize:13,color:pct>=60?'#7fff90':'#ffaaaa'}}>{pct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardTitle>📈 Dificultad por pregunta</CardTitle>
        {preguntas.slice(0,5).map((p,i)=>{
          const aciertos=respuestas.filter(r=>r.detalles&&r.detalles[i]).length
          const pct=respuestas.length?Math.round((aciertos/respuestas.length)*100):0
          const color=pct>=70?'#25d366':pct>=40?'#ffb020':'#e83030'
          return (
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'rgba(255,255,255,0.65)',marginBottom:4}}>
                <span>P{i+1} — {p.texto?p.texto.substring(0,38)+(p.texto.length>38?'...':''):`Pregunta ${i+1}`}</span>
                <span style={{color,fontWeight:800}}>{pct}%</span>
              </div>
              <div style={{height:7,background:'rgba(255,255,255,0.10)',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:4}}/>
              </div>
            </div>
          )
        })}
      </Card>
    </>
  )
}

export default function ProfesorDashboard({onLogout,testActivo}) {
  const [tab,setTab]=useState('crear')
  const [subTab,setSubTab]=useState('info')
  const [titulo,setTitulo]=useState('')
  const [tema,setTema]=useState('')
  const [numQ,setNumQ]=useState(5)
  const [preguntas,setPreguntas]=useState([])
  const [generando,setGenerando]=useState(false)
  const [codigoActual,setCodigoActual]=useState('')
  const [respuestas,setRespuestas]=useState([])
  const [waVisible,setWaVisible]=useState(false)
  const fileRef=useRef()

  useEffect(()=>{
    if(!codigoActual)return
    const unsub=escucharRespuestas(codigoActual,setRespuestas)
    return()=>unsub()
  },[codigoActual])

  const fecha=(()=>{const d=new Date();const dias=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];const meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]} ${d.getFullYear()}`})()

  const generarTest=async()=>{
    if(!titulo.trim())return
    setGenerando(true)
    const codigo=Math.random().toString(36).substring(2,8).toUpperCase()
    try{
      await guardarTest(codigo,{titulo,tema,numQ,preguntas:preguntas.map(p=>({texto:p.texto,opciones:p.opciones.slice(0,p.numOpciones),correcta:p.correcta,explicacion:p.explicacion})),fecha:new Date().toLocaleDateString('es-CL'),generadoTs:Date.now(),codigo})
      setCodigoActual(codigo);setWaVisible(true);setTab('participar')
    }catch(e){console.error(e)}
    setGenerando(false)
  }

  const compartirWA=()=>{
    const msg=`📖 *HETT — Escuela Bíblica IUMP Recoleta*\n\n📚 Clase: ${titulo}\n📖 Tema: ${tema}\n\n🔑 Código: *${codigoActual}*\n🌐 Ingresa en: https://hett.onrender.com\n\n_Hoy Es Tu Tiempo · Ven a Jesús_`
    window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank')
  }

  const bg='linear-gradient(150deg,#0d2a3a 0%,#1a4a5a 20%,#2a7a7a 42%,#3a9090 58%,#c85520 76%,#e07030 88%,#f09050 100%)'

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:font,display:'flex',flexDirection:'column'}}>
      <header style={{background:'rgba(8,28,38,0.72)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.12)',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:62,flexShrink:0,position:'sticky',top:0,zIndex:20}}>
        <Logo/>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:2,color:'#fff'}}>Panel del Profesor</div>
          <div style={{fontSize:10,color:'rgba(255,235,200,0.55)',marginTop:2}}>{fecha}</div>
        </div>
        <button onClick={onLogout} style={{background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:'50%',width:32,height:32,cursor:'pointer',color:'rgba(255,255,255,0.65)',fontSize:14}}>←</button>
      </header>

      <div style={{display:'flex',flex:1}}>
        <nav style={{width:195,flexShrink:0,background:'rgba(8,28,38,0.55)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(255,255,255,0.10)',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'14px 14px 10px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{fontSize:8,letterSpacing:2.5,color:'rgba(255,255,255,0.30)',textTransform:'uppercase',marginBottom:9}}>Profesores 2026</div>
            {[{i:'JS',n:'Javiera Sepúlveda',c:'rgba(180,80,200,0.6),rgba(100,30,150,0.6)'},{i:'CC',n:'Carlos Camberes',c:'rgba(40,140,220,0.6),rgba(20,70,170,0.6)'},{i:'FV',n:'Felipe Vera',c:'rgba(30,170,90,0.6),rgba(15,90,50,0.6)'},{i:'LR',n:'Luis Retamal',c:'rgba(220,130,20,0.6),rgba(150,70,10,0.6)'}].map((p,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0'}}>
                <div style={{width:30,height:30,borderRadius:'50%',background:`linear-gradient(135deg,${p.c})`,border:'1.5px solid rgba(255,255,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:'#fff',flexShrink:0}}>{p.i}</div>
                <div><div style={{fontSize:10.5,fontWeight:700,color:'rgba(255,255,255,0.82)'}}>{p.n}</div><div style={{fontSize:8,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:1}}>Profesor</div></div>
              </div>
            ))}
          </div>
          <div style={{padding:'8px 10px'}}>
            <div style={{fontSize:8,letterSpacing:2.5,color:'rgba(255,255,255,0.28)',textTransform:'uppercase',padding:'6px 8px 4px'}}>Gestión</div>
            {[{id:'crear',label:'Crear Test',ico:'✏️'},{id:'participar',label:'Resultados',ico:'📊',badge:respuestas.length||null},{id:'datos',label:'Base de Datos',ico:'📋'}].map(item=>(
              <div key={item.id} onClick={()=>setTab(item.id)} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 11px',borderRadius:11,cursor:'pointer',marginBottom:2,background:tab===item.id?'rgba(255,255,255,0.17)':'transparent',border:`1px solid ${tab===item.id?'rgba(255,255,255,0.25)':'transparent'}`,color:tab===item.id?'#fff':'rgba(255,255,255,0.42)',fontWeight:tab===item.id?800:600,fontSize:12}}>
                <span style={{fontSize:14,width:18,textAlign:'center'}}>{item.ico}</span>{item.label}
                {item.badge?<span style={{marginLeft:'auto',background:'rgba(255,200,80,0.22)',borderRadius:8,padding:'2px 6px',fontSize:9,color:'rgba(255,220,120,0.75)'}}>{item.badge}</span>:null}
              </div>
            ))}
            <div style={{fontSize:8,letterSpacing:2.5,color:'rgba(255,255,255,0.28)',textTransform:'uppercase',padding:'8px 8px 4px'}}>Recursos</div>
            <div onClick={()=>window.open('https://drive.google.com/drive/folders/1wUYNbgBrehAnzefjRcO8uPU2hdxUkCF5?usp=sharing','_blank')} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 11px',borderRadius:11,cursor:'pointer',color:'rgba(255,255,255,0.42)',fontSize:12}}>
              <span style={{fontSize:14}}>📁</span>Drive Compartido
            </div>
          </div>
          <div style={{marginTop:'auto',padding:'10px 14px',borderTop:'1px solid rgba(255,255,255,0.07)',fontSize:8.5,fontStyle:'italic',color:'rgba(255,230,180,0.30)',lineHeight:1.6,textAlign:'center'}}>
            "La enseñanza del sabio<br/>es fuente de vida." — Prov 13:14
          </div>
        </nav>

        <main style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>
          {tab==='crear'&&(
            <>
              <div style={{display:'flex',gap:3,background:'rgba(0,0,0,0.15)',borderRadius:12,padding:4,marginBottom:16}}>
                {[{id:'info',label:'① Clase'},{id:'preguntas',label:'② Preguntas'},{id:'enviar',label:'③ Enviar'}].map(st=>(
                  <button key={st.id} onClick={()=>setSubTab(st.id)} style={{flex:1,padding:9,borderRadius:9,cursor:'pointer',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:subTab===st.id?'#fff':'rgba(255,255,255,0.45)',background:subTab===st.id?'rgba(255,255,255,0.18)':'transparent',border:'none',fontFamily:font}}>{st.label}</button>
                ))}
              </div>
              {subTab==='info'&&(
                <>
                  <Card><CardTitle num="1">Nombre de la Sesión</CardTitle><Inp placeholder="Ej: Clase 3 — Las Bienaventuranzas" value={titulo} onChange={e=>setTitulo(e.target.value)}/></Card>
                  <Card><CardTitle num="2">Tema Bíblico — RVR1960</CardTitle><Inp placeholder="Ej: El Sermón del Monte, Los Salmos..." value={tema} onChange={e=>setTema(e.target.value)}/></Card>
                  <Card>
                    <CardTitle num="3">Material de Apoyo</CardTitle>
                    <a href="https://drive.google.com/drive/folders/1wUYNbgBrehAnzefjRcO8uPU2hdxUkCF5?usp=sharing" target="_blank" style={{display:'flex',alignItems:'center',gap:12,background:'rgba(66,133,244,0.18)',border:'1.5px solid rgba(120,180,255,0.38)',borderRadius:12,padding:'12px 16px',textDecoration:'none',marginBottom:10}}>
                      <span style={{fontSize:20}}>📂</span>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800,color:'#a8d4ff'}}>CLASSROOM ESCUELA BÍBLICA 2026</div><div style={{fontSize:10,color:'rgba(160,200,255,0.60)',marginTop:2}}>Carpeta compartida entre los 4 profesores · Google Drive</div></div>
                      <span style={{color:'rgba(160,200,255,0.60)',fontSize:16}}>↗</span>
                    </a>
                    <div onClick={()=>fileRef.current?.click()} style={{border:'1.5px dashed rgba(255,255,255,0.25)',borderRadius:11,padding:14,textAlign:'center',cursor:'pointer',color:'rgba(255,255,255,0.50)',fontSize:12}}>
                      📎 O sube un archivo desde tu equipo
                      <div style={{fontSize:10,color:'rgba(255,255,255,0.28)',marginTop:3}}>PDF · DOC · DOCX · TXT</div>
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:'none'}}/>
                  </Card>
                  <Card>
                    <CardTitle num="4">Número de Preguntas</CardTitle>
                    <div style={{display:'flex',gap:10}}>
                      {[5,8].map(n=>(
                        <div key={n} onClick={()=>setNumQ(n)} style={{flex:1,padding:'14px 8px',borderRadius:12,cursor:'pointer',textAlign:'center',border:`1.5px solid ${numQ===n?'rgba(255,200,80,0.55)':'rgba(255,255,255,0.18)'}`,background:numQ===n?'rgba(255,200,80,0.20)':'rgba(255,255,255,0.07)',color:numQ===n?'#ffdd70':'rgba(255,255,255,0.40)',fontSize:22,fontWeight:900}}>
                          {n}<span style={{fontSize:9,letterSpacing:1.5,display:'block',marginTop:3,fontWeight:400}}>preguntas</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <button style={{width:'100%',padding:14,borderRadius:40,border:'none',cursor:'pointer',background:'#fff',color:'#3a1a00',fontFamily:font,fontSize:13,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase',marginBottom:14}} onClick={()=>setSubTab('preguntas')}>Continuar — Crear Preguntas →</button>
                </>
              )}
              {subTab==='preguntas'&&(
                <>
                  <EditorPreguntas preguntas={preguntas} setPreguntas={setPreguntas}/>
                  <button style={{width:'100%',padding:14,borderRadius:40,border:'none',cursor:'pointer',background:'#fff',color:'#3a1a00',fontFamily:font,fontSize:13,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase',marginBottom:14}} onClick={()=>setSubTab('enviar')}>Continuar — Revisar y Enviar →</button>
                </>
              )}
              {subTab==='enviar'&&(
                <>
                  <Card>
                    <CardTitle>📋 Resumen del Test</CardTitle>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.80)',lineHeight:2}}>
                      <div><span style={{color:'#ffdd70',fontWeight:700}}>Clase:</span> {titulo||'(sin título)'}</div>
                      <div><span style={{color:'#ffdd70',fontWeight:700}}>Tema:</span> {tema||'(sin tema)'}</div>
                      <div><span style={{color:'#ffdd70',fontWeight:700}}>Preguntas:</span> {preguntas.length} creadas</div>
                      <div><span style={{color:'#7fff90',fontWeight:700}}>Respuestas correctas:</span> guardadas solo para el profesor ✓</div>
                    </div>
                  </Card>
                  <button disabled={generando||!titulo.trim()} onClick={generarTest} style={{width:'100%',padding:14,borderRadius:40,border:'none',cursor:generando||!titulo.trim()?'not-allowed':'pointer',background:'#fff',color:'#3a1a00',fontFamily:font,fontSize:13,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase',marginBottom:14,opacity:generando||!titulo.trim()?0.6:1}}>
                    {generando?'⏳ Guardando en Firebase...':'✦ Generar y Compartir Test'}
                  </button>
                  {waVisible&&codigoActual&&(
                    <div style={{background:'rgba(18,140,60,0.22)',border:'1.5px solid rgba(37,211,102,0.38)',borderRadius:14,padding:16}}>
                      <div style={{fontSize:11,fontWeight:800,color:'rgba(150,255,180,0.88)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:10}}>📲 Test guardado — Compartir con estudiantes</div>
                      <div style={{background:'rgba(0,0,0,0.20)',borderRadius:10,padding:'12px 14px',marginBottom:10,borderLeft:'3px solid rgba(37,211,102,0.55)',fontSize:11,color:'rgba(220,255,235,0.80)',lineHeight:1.75,whiteSpace:'pre-line'}}>
                        {`📖 HETT — Escuela Bíblica IUMP Recoleta\n\nClase: ${titulo}\nTema: ${tema}\n\nCódigo: ${codigoActual}\nIngresa en: hett.onrender.com`}
                      </div>
                      <div style={{fontSize:28,fontWeight:900,letterSpacing:8,color:'#fff',textAlign:'center',padding:9,background:'rgba(0,0,0,0.18)',borderRadius:9,marginBottom:12}}>{codigoActual}</div>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={compartirWA} style={{flex:2,padding:12,borderRadius:30,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#25d366,#128c7e)',color:'#fff',fontFamily:font,fontSize:11,fontWeight:800,letterSpacing:1.5,textTransform:'uppercase'}}>📲 Enviar por WhatsApp</button>
                        <button onClick={()=>navigator.clipboard.writeText('https://hett.onrender.com')} style={{flex:1,padding:12,borderRadius:30,border:'1.5px solid rgba(37,211,102,0.32)',background:'rgba(37,211,102,0.10)',color:'rgba(150,255,180,0.80)',fontFamily:font,fontSize:10,cursor:'pointer',fontWeight:700}}>📋 Copiar link</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {tab==='participar'&&(
            <>
              {testActivo&&(
                <Card style={{marginBottom:14,background:'rgba(20,80,30,0.45)',border:'1px solid rgba(40,200,90,0.28)'}}>
                  <div style={{color:'#80ffaa',fontSize:11,fontWeight:800,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>✅ Test activo en Firebase</div>
                  <div style={{color:'rgba(255,255,255,0.80)',fontSize:13,fontWeight:700}}>{testActivo.titulo}</div>
                  <div style={{color:'rgba(255,255,255,0.50)',fontSize:11,marginTop:3}}>Código: <strong style={{color:'#ffdd70',letterSpacing:3}}>{testActivo.codigo}</strong></div>
                </Card>
              )}
              <Metricas respuestas={respuestas} preguntas={preguntas}/>
            </>
          )}
          {tab==='datos'&&(
            <Card>
              <CardTitle>📋 Base de Datos — Firebase</CardTitle>
              <div style={{textAlign:'center',padding:'30px 20px',color:'rgba(255,255,255,0.45)'}}>
                <div style={{fontSize:30,marginBottom:9}}>🔥</div>
                <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.65)',marginBottom:5}}>Todos los tests se guardan en Firebase</div>
                <div style={{fontSize:11,lineHeight:1.65}}>Los resultados quedan guardados automáticamente en la nube.</div>
              </div>
              <button style={{width:'100%',padding:14,borderRadius:40,border:'none',cursor:'pointer',background:'rgba(22,90,110,0.7)',color:'#b0ffee',fontFamily:font,fontSize:13,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase'}}>⬇️ Descargar CSV</button>
            </Card>
          )}
        </main>
      </div>
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.28)}`}</style>
    </div>
  )
}
