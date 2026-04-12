import { useState, useEffect } from 'react'
import { VERSICULOS, CURIOSIDADES, ALABANZAS_SUGERIDAS } from '../theme.js'
import { guardarRespuestas, guardarPregunta, escucharMisPreguntas } from '../firebase.js'

const font = "'Georgia','Times New Roman',serif"

// ── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  sidebar:  'rgba(6,3,0,0.82)',
  card:     'rgba(255,240,180,0.15)',   // más opaco para mejor contraste
  cardBdr:  'rgba(220,175,60,0.30)',
  header:   'rgba(4,2,0,0.84)',
  gold:     '#ffe870',
  goldDim:  'rgba(255,220,100,0.75)',
  text:     'rgba(255,245,215,0.96)',
  textMuted:'rgba(220,190,115,0.75)',
  textFaint:'rgba(200,165,90,0.50)',
  inp:      'rgba(220,175,60,0.12)',
  inpBdr:   'rgba(220,175,60,0.32)',
}

// ── Logo sidebar ─────────────────────────────────────────────────────────────
const LogoGlass = () => (
  <div style={{margin:'12px 10px 10px',background:'linear-gradient(155deg,rgba(255,245,190,0.26),rgba(210,160,35,0.16))',border:'1.5px solid rgba(230,185,65,0.62)',borderRadius:14,padding:'12px 11px 10px',textAlign:'center',boxShadow:'0 6px 22px rgba(0,0,0,0.22),inset 0 1.5px 0 rgba(255,235,130,0.40)'}}>
    <div style={{fontSize:8.5,color:'rgba(255,225,110,0.85)',letterSpacing:3,marginBottom:5,fontWeight:700}}>✦ &nbsp;IUMP Recoleta&nbsp; ✦</div>
    <div style={{fontSize:24,fontWeight:900,letterSpacing:6,background:'linear-gradient(180deg,#fffbe0 0%,#ffd84a 50%,#c88a08 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',filter:'drop-shadow(0 0 8px rgba(255,200,30,0.55))',lineHeight:1,textIndent:6}}>HETT</div>
    <div style={{width:'80%',height:1,background:'linear-gradient(90deg,transparent,rgba(230,185,65,0.70),transparent)',margin:'6px auto'}}/>
    <div style={{fontSize:9.5,letterSpacing:3,color:'rgba(255,232,140,0.90)',textTransform:'uppercase',fontWeight:800}}>Escuela Bíblica</div>
  </div>
)

// ── Card ─────────────────────────────────────────────────────────────────────
const Card = ({children, style={}}) => (
  <div style={{background:C.card,backdropFilter:'blur(18px)',border:`1px solid ${C.cardBdr}`,borderRadius:14,padding:'16px 18px',marginBottom:14,boxShadow:'0 4px 20px rgba(0,0,0,0.22),inset 0 1px 0 rgba(220,175,60,0.12)',...style}}>
    {children}
  </div>
)

const CardTitle = ({children}) => (
  <div style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,215,100,0.92)',fontWeight:800,marginBottom:13,display:'flex',alignItems:'center',gap:8}}>{children}</div>
)

// ── Contenido Explorar ────────────────────────────────────────────────────────
const EXPLORAR = [
  {cat:'Profetas',ico:'📜',desc:'Mensajeros de Dios que anunciaron su Palabra.',items:[
    {n:'Isaías',v:[['Isaías 40:31','Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.'],['Isaías 53:5','Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él, y por su llaga fuimos nosotros curados.'],['Isaías 41:10','No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré.'],['Isaías 9:6','Porque un niño nos es nacido... se llamará su nombre Admirable, Consejero, Dios Fuerte, Padre Eterno, Príncipe de Paz.']]},
    {n:'Jeremías',v:[['Jeremías 29:11','Yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.'],['Jeremías 33:3','Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.']]},
    {n:'Ezequiel',v:[['Ezequiel 36:26','Os daré corazón nuevo, y pondré espíritu nuevo dentro de vosotros; quitaré el corazón de piedra y os daré un corazón de carne.']]},
    {n:'Daniel',v:[['Daniel 3:17','Nuestro Dios puede librarnos del horno de fuego ardiendo; y de tu mano, oh rey, nos librará.'],['Daniel 6:22','Mi Dios envió su ángel, el cual cerró la boca de los leones, para que no me hiciesen daño.']]},
    {n:'Jonás',v:[['Jonás 4:2','Sé que eres Dios clemente y piadoso, tardo en enojarte, y de grande misericordia.']]},
    {n:'Miqueas',v:[['Miqueas 5:2','Pero tú, Belén Efrata... de ti me saldrá el que será Señor en Israel.'],['Miqueas 6:8','Solamente hacer justicia, y amar misericordia, y humillarte ante tu Dios.']]},
    {n:'Habacuc',v:[['Habacuc 2:4','Mas el justo por su fe vivirá.']]},
    {n:'Zacarías',v:[['Zacarías 9:9','He aquí tu rey vendrá a ti, justo y salvador, humilde, y cabalgando sobre un asno.'],['Zacarías 12:10','Mirarán a mí, a quien traspasaron.']]},
    {n:'Malaquías',v:[['Malaquías 3:10','Traed todos los diezmos al alfolí... y probadme ahora en esto, dice Jehová.'],['Malaquías 4:2','A vosotros los que teméis mi nombre, nacerá el Sol de justicia.']]},
  ]},
  {cat:'Salmos',ico:'🎵',desc:'150 poemas de adoración, lamento y acción de gracias.',items:[
    {n:'Confianza en Dios',v:[['Salmo 23:1-4','Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.'],['Salmo 91:1','El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.'],['Salmo 27:1','Jehová es mi luz y mi salvación; ¿de quién temeré?']]},
    {n:'Alabanza y Adoración',v:[['Salmo 100:1-4','Cantad alegres a Dios, habitantes de toda la tierra. Servid a Jehová con alegría.'],['Salmo 150:6','Todo lo que respira alabe a JAH. Aleluya.']]},
    {n:'Salmos Mesiánicos',v:[['Salmo 22:1','Dios mío, Dios mío, ¿por qué me has abandonado? — Palabras de Jesús en la cruz.'],['Salmo 16:10','No dejarás mi alma en el Seol, ni permitirás que tu Santo vea corrupción.']]},
    {n:'Arrepentimiento',v:[['Salmo 51:1-2','Ten piedad de mí, oh Dios, conforme a tu misericordia; borra mis transgresiones.'],['Salmo 51:10','Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.']]},
    {n:'La Palabra de Dios (Salmo 119)',v:[['Salmo 119:9','¿Con qué limpiará el joven su camino? Con guardar tu palabra.'],['Salmo 119:11','En mi corazón he guardado tus dichos, para no pecar contra ti.'],['Salmo 119:105','Lámpara es a mis pies tu palabra, y lumbrera a mi camino.']]},
    {n:'Gratitud',v:[['Salmo 136:1','Alabad a Jehová, porque él es bueno; para siempre es su misericordia.'],['Salmo 30:5','Por la noche durará el lloro, y a la mañana vendrá la alegría.']]},
    {n:'Clamor en la Dificultad',v:[['Salmo 34:17-18','Claman los justos, y Jehová oye, y los libra de todas sus angustias. Cercano está Jehová a los quebrantados de corazón.'],['Salmo 55:22','Echa sobre Jehová tu carga, y él te sustentará.']]},
    {n:'Sabiduría',v:[['Salmo 1:1-2','Bienaventurado el varón que no anduvo en consejo de malos... en la ley de Jehová está su delicia.'],['Salmo 37:4','Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.']]},
  ]},
  {cat:'Milagros',ico:'⭐',desc:'Señales y maravillas del poder de Dios.',items:[
    {n:'La Creación',v:[['Génesis 1:1','En el principio creó Dios los cielos y la tierra.'],['Génesis 1:3','Y dijo Dios: Sea la luz; y fue la luz.']]},
    {n:'Las Plagas de Egipto',v:[['Éxodo 14:21-22','Jehová hizo retroceder el mar... y el mar se secó. Y los hijos de Israel entraron por en medio del mar a pie enjuta.']]},
    {n:'Elías y el Fuego del Cielo',v:[['1 Reyes 18:38','Entonces cayó fuego de Jehová, y consumió el holocausto, la leña, las piedras y el polvo.']]},
    {n:'Jesús y el Mar',v:[['Mateo 14:25-27','Jesús vino a ellos andando sobre el mar... ¡Tened ánimo; yo soy, no temáis!'],['Marcos 4:39','Reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento.']]},
    {n:'Sanidades de Jesús',v:[['Lucas 17:14','Id, mostraos a los sacerdotes. Y mientras iban, fueron limpios. [Los 10 leprosos]'],['Juan 9:7','Fue, y se lavó, y regresó viendo. [El ciego de nacimiento]']]},
    {n:'Resurrecciones',v:[['1 Reyes 17:22','El alma del niño volvió a él, y revivió.'],['Juan 11:43-44','Clamó a gran voz: ¡Lázaro, ven fuera! Y el que había muerto salió.'],['1 Corintios 15:20','Cristo ha resucitado de los muertos; primicias de los que durmieron.']]},
    {n:'Milagros en la Iglesia',v:[['Hechos 3:6-7','En el nombre de Jesucristo de Nazaret, levántate y anda.'],['Hechos 16:26','Sobrevino un gran terremoto... se abrieron todas las puertas.']]},
  ]},
  {cat:'Parábolas',ico:'🌾',desc:'Historias de Jesús que revelan verdades del Reino de Dios.',items:[
    {n:'El Hijo Pródigo (Lucas 15)',v:[['Lucas 15:20','Y cuando aún estaba lejos, lo vio su padre, fue movido a misericordia, corrió y se echó sobre su cuello.'],['Lucas 15:24','Este mi hijo muerto era, y ha revivido; se había perdido, y es hallado.']]},
    {n:'El Buen Samaritano (Lucas 10)',v:[['Lucas 10:33-34','Un samaritano, que iba de camino, lo vio y fue movido a misericordia; acercándose, vendó sus heridas.'],['Lucas 10:37','Ve, y haz tú lo mismo.']]},
    {n:'El Sembrador (Mateo 13)',v:[['Mateo 13:23','El que fue sembrado en buena tierra... oye y entiende la palabra, y da fruto a ciento, a sesenta, y a treinta por uno.']]},
    {n:'Los Talentos (Mateo 25)',v:[['Mateo 25:21','Bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré.']]},
    {n:'Las Diez Vírgenes (Mateo 25)',v:[['Mateo 25:10','Las que estaban preparadas entraron con él a las bodas; y se cerró la puerta.'],['Mateo 25:13','Velad, pues, porque no sabéis el día ni la hora.']]},
    {n:'La Oveja Perdida (Lucas 15)',v:[['Lucas 15:5-6','La pone sobre sus hombros gozoso... Gozaos conmigo, porque he encontrado mi oveja que se había perdido.'],['Lucas 15:7','Así habrá más gozo en el cielo por un pecador que se arrepiente.']]},
  ]},
  {cat:'Reyes',ico:'👑',desc:'Los reyes de Israel y Judá y su relación con Dios.',items:[
    {n:'Saúl — El Primer Rey',v:[['1 Samuel 15:22','El obedecer es mejor que los sacrificios.'],['1 Samuel 16:7','El hombre mira lo que está delante de sus ojos, pero Jehová mira el corazón.']]},
    {n:'David — Conforme al Corazón de Dios',v:[['1 Samuel 17:45','Yo vengo a ti en el nombre de Jehová de los ejércitos.'],['Salmo 51:10','Crea en mí, oh Dios, un corazón limpio.']]},
    {n:'Salomón — La Sabiduría',v:[['1 Reyes 3:9','Da a tu siervo corazón entendido para juzgar a tu pueblo.'],['Eclesiastés 12:13','Teme a Dios, y guarda sus mandamientos; porque esto es el todo del hombre.']]},
    {n:'Josafat — La Fe en Crisis',v:[['2 Crónicas 20:15','No temáis ni os amedrentéis... porque no es vuestra la guerra, sino de Dios.']]},
    {n:'Ezequías — Oración en Crisis',v:[['Isaías 37:15','Entonces Ezequías oró a Jehová.'],['2 Reyes 19:35','Y salió el ángel de Jehová, e hirió en el campamento asirio a ciento ochenta y cinco mil.']]},
    {n:'Josías — La Gran Reforma',v:[['2 Crónicas 34:31','El rey hizo pacto de caminar en pos de Jehová y de guardar sus mandamientos.']]},
  ]},
  {cat:'Evangelios',ico:'📖',desc:'La vida, muerte y resurrección de Jesucristo.',items:[
    {n:'Mateo — El Rey Prometido',v:[['Mateo 1:23','He aquí, una virgen concebirá y dará a luz un hijo, y llamarás su nombre Emanuel: Dios con nosotros.'],['Mateo 28:19-20','Id, y haced discípulos a todas las naciones... yo estoy con vosotros todos los días.']]},
    {n:'Marcos — El Siervo Activo',v:[['Marcos 10:45','El Hijo del Hombre no vino para ser servido, sino para servir, y para dar su vida en rescate por muchos.']]},
    {n:'Lucas — El Salvador de Todos',v:[['Lucas 4:18','El Espíritu del Señor está sobre mí, por cuanto me ha ungido para dar buenas nuevas a los pobres.'],['Lucas 19:10','El Hijo del Hombre vino a buscar y a salvar lo que se había perdido.']]},
    {n:'Juan — La Deidad de Cristo',v:[['Juan 1:1,14','En el principio era el Verbo... Y aquel Verbo fue hecho carne, y habitó entre nosotros.'],['Juan 3:16','De tal manera amó Dios al mundo que ha dado a su Hijo unigénito.']]},
    {n:'Los 7 Yo Soy de Jesús',v:[['Juan 6:35','Yo soy el pan de vida.'],['Juan 8:12','Yo soy la luz del mundo.'],['Juan 10:11','Yo soy el buen pastor.'],['Juan 11:25','Yo soy la resurrección y la vida.'],['Juan 14:6','Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.'],['Juan 15:1','Yo soy la vid verdadera.']]},
    {n:'La Pasión y Resurrección',v:[['Juan 19:30','Consumado es. Y habiendo inclinado la cabeza, entregó el espíritu.'],['Lucas 24:6','No está aquí, sino que ha resucitado.']]},
  ]},
  {cat:'Héroes',ico:'⚓',desc:'Hombres y mujeres que creyeron a Dios contra toda probabilidad.',items:[
    {n:'Abraham — Padre de la Fe',v:[['Génesis 12:1','Vete de tu tierra... a la tierra que te mostraré.'],['Romanos 4:20-21','No dudó de la promesa de Dios, sino que se fortaleció en fe.']]},
    {n:'Moisés — El Libertador',v:[['Éxodo 3:14','YO SOY EL QUE SOY.'],['Éxodo 14:13','No temáis; estad firmes, y ved la salvación que Jehová hará hoy.']]},
    {n:'José — De la Fosa al Palacio',v:[['Génesis 50:20','Vosotros pensasteis mal contra mí, mas Dios lo encaminó a bien.']]},
    {n:'Rut — Lealtad y Redención',v:[['Rut 1:16','A dondequiera que tú fueres, iré yo... Tu pueblo será mi pueblo, y tu Dios mi Dios.']]},
    {n:'Ester — Por un Tiempo Como Este',v:[['Ester 4:14','¿Y quién sabe si para esta hora has llegado al reino?'],['Ester 4:16','Si perezco, que perezca.']]},
    {n:'Pablo — El Apóstol Transformado',v:[['Hechos 9:4-5','Saulo, Saulo, ¿por qué me persigues? Yo soy Jesús, a quien tú persigues.'],['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.']]},
  ]},
  {cat:'Espíritu Santo',ico:'🕊️',desc:'La tercera persona de la Trinidad. Guía, consuela y da poder.',items:[
    {n:'¿Quién es el Espíritu Santo?',v:[['Juan 14:16-17','El Padre os dará otro Consolador... el Espíritu de verdad.'],['Juan 16:13','Cuando venga el Espíritu de verdad, él os guiará a toda la verdad.']]},
    {n:'El Espíritu en el Antiguo Testamento',v:[['Génesis 1:2','El Espíritu de Dios se movía sobre la faz de las aguas.'],['Joel 2:28','Derramaré mi Espíritu sobre toda carne, y profetizarán vuestros hijos y vuestras hijas.']]},
    {n:'Pentecostés — Nace la Iglesia',v:[['Hechos 2:2-4','Vino del cielo un estruendo como de viento recio... y fueron todos llenos del Espíritu Santo.'],['Hechos 2:41','Los que recibieron su palabra fueron bautizados; y se añadieron aquel día como tres mil personas.']]},
    {n:'Los Frutos del Espíritu',v:[['Gálatas 5:22-23','El fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.'],['Gálatas 5:16','Andad en el Espíritu, y no satisfagáis los deseos de la carne.']]},
    {n:'Los Dones del Espíritu',v:[['1 Corintios 12:7','A cada uno le es dada la manifestación del Espíritu para provecho.'],['1 Corintios 12:8-10','A éste, palabra de sabiduría; a otro, fe; a otro, dones de sanidades; a otro, el hacer milagros; a otro, profecía.']]},
  ]},
]

// ── Explorar componente ───────────────────────────────────────────────────────
function ExpItem({item}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{marginBottom:8,padding:'10px 14px',background:'rgba(255,235,150,0.07)',border:`1px solid rgba(220,175,60,0.18)`,borderRadius:10,cursor:'pointer'}} onClick={()=>setOpen(o=>!o)}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:12,fontWeight:700,color:'rgba(255,215,100,0.88)'}}>📌 {item.n}</div>
        <span style={{fontSize:12,color:'rgba(220,175,60,0.55)',transform:open?'rotate(90deg)':'none',transition:'transform 0.2s'}}>›</span>
      </div>
      {open && (
        <div style={{marginTop:10}}>
          {item.v.map(([ref,txt],i)=>(
            <div key={i} style={{padding:'10px 12px',background:'rgba(255,240,180,0.06)',border:`1px solid rgba(220,175,60,0.15)`,borderRadius:9,marginBottom:7}}>
              <div style={{fontSize:9,fontWeight:800,letterSpacing:1.5,color:'rgba(255,215,100,0.82)',textTransform:'uppercase',marginBottom:5}}>{ref}</div>
              <div style={{fontSize:12.5,color:'rgba(255,245,215,0.88)',lineHeight:1.80,fontStyle:'italic'}}>"{txt}"</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ExpCat({data, openCat, setOpenCat}) {
  const isOpen = openCat === data.cat
  return (
    <div style={{background:C.card,border:`1px solid ${C.cardBdr}`,borderRadius:13,overflow:'hidden',marginBottom:10}}>
      <div onClick={()=>setOpenCat(isOpen?null:data.cat)} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',cursor:'pointer'}}>
        <span style={{fontSize:22}}>{data.ico}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:800,color:'rgba(255,225,120,0.95)'}}>{data.cat}</div>
          <div style={{fontSize:10,color:C.textFaint,marginTop:2}}>{data.items.length} temas · {data.desc}</div>
        </div>
        <span style={{fontSize:14,color:'rgba(220,175,60,0.55)',transform:isOpen?'rotate(90deg)':'none',transition:'transform 0.2s'}}>›</span>
      </div>
      {isOpen && (
        <div style={{padding:'0 14px 14px',borderTop:`1px solid rgba(220,175,60,0.16)`}}>
          {data.items.map((item,i)=><ExpItem key={i} item={item}/>)}
        </div>
      )}
    </div>
  )
}

// ── Sección Preguntas ─────────────────────────────────────────────────────────
const DESTINATARIOS = [
  {cod:'JS',n:'Javiera Sepúlveda',r:'Profesora',color:'rgba(180,80,200,0.82),rgba(100,30,150,0.82)',tel:'+56999999991'},
  {cod:'CC',n:'Carlos Camberes',  r:'Profesor', color:'rgba(40,140,220,0.82),rgba(20,70,170,0.82)', tel:'+56999999992'},
  {cod:'FV',n:'Felipe Vera',      r:'Profesor', color:'rgba(30,170,90,0.82),rgba(15,90,50,0.82)',  tel:'+56999999993'},
  {cod:'LR',n:'Luis Retamal',     r:'Profesor', color:'rgba(220,130,20,0.82),rgba(150,70,10,0.82)',tel:'+56999999994'},
  {cod:'PR',n:'Pastor Ricardo',   r:'IUMP Recoleta',color:'rgba(180,130,20,0.88),rgba(120,80,5,0.88)',tel:'+56992959242',ico:'✝️'},
  {cod:'PJ',n:'Pastora Jacqueline',r:'IUMP Recoleta',color:'rgba(180,80,120,0.88),rgba(120,30,80,0.88)',tel:'+56992043203',ico:'✝️'},
]

const CATEGORIAS_Q = ['📖 Interpretación bíblica','🙏 Fe y vida cristiana','📚 Historia bíblica','✝️ Teología','🎵 Alabanza y adoración','❓ Otra consulta']

function PanelPreguntas({user}) {
  const [dest, setDest] = useState(DESTINATARIOS[0])
  const [categoria, setCategoria] = useState(CATEGORIAS_Q[0])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [misPreguntas, setMisPreguntas] = useState([])

  useEffect(()=>{
    if(!user?.nombre) return
    const unsub = escucharMisPreguntas(user.nombre, user.apellido||'', setMisPreguntas)
    return ()=>unsub()
  },[user])

  const enviarWA = () => {
    if(!texto.trim()){alert('Escribe tu pregunta primero.');return}
    const msg = `Hola ${dest.n}, te escribo desde HETT - Escuela Bíblica IUMP Recoleta.\n\nMi nombre es: ${user.nombre} ${user.apellido||''}\nCategoría: ${categoria}\nMi pregunta:\n\n${texto}\n\n_Enviado desde hett.onrender.com_`
    window.open('https://wa.me/'+dest.tel.replace('+','')+  '?text='+encodeURIComponent(msg),'_blank')
  }

  const guardar = async () => {
    if(!texto.trim()){alert('Escribe tu pregunta primero.');return}
    setEnviando(true)
    try{
      await guardarPregunta({nombre:user.nombre,apellido:user.apellido||'',destinatario:dest.n,destinatarioCod:dest.cod,categoria,texto})
      setTexto('')
      alert('Pregunta guardada correctamente.')
    }catch(e){alert('Error al guardar. Revisa la conexión.')}
    setEnviando(false)
  }

  const inpStyle={width:'100%',background:C.inp,border:`1.5px solid ${C.inpBdr}`,borderRadius:9,padding:'11px 14px',color:C.text,fontSize:13,fontFamily:font,outline:'none',marginBottom:10}

  return (
    <>
      <Card>
        <CardTitle>❓ Hacer una Pregunta</CardTitle>
        <div style={{fontSize:12,color:C.textMuted,marginBottom:14,lineHeight:1.65}}>Tu pregunta llegará por WhatsApp directamente al destinatario que elijas.</div>
        <div style={{fontSize:9.5,letterSpacing:2,color:'rgba(220,175,60,0.72)',textTransform:'uppercase',fontWeight:700,marginBottom:10}}>¿A quién va dirigida?</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:14}}>
          {DESTINATARIOS.map(d=>(
            <div key={d.cod} onClick={()=>setDest(d)} style={{padding:'12px 8px',borderRadius:11,textAlign:'center',cursor:'pointer',border:`1.5px solid ${dest.cod===d.cod?'rgba(220,175,60,0.65)':'rgba(220,175,60,0.22)'}`,background:dest.cod===d.cod?'rgba(220,175,60,0.22)':'rgba(220,175,60,0.08)',transform:dest.cod===d.cod?'translateY(-2px)':'none',transition:'all 0.2s',gridColumn:d.cod==='PR'||d.cod==='PJ'?'span 1':'span 1'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:`linear-gradient(135deg,${d.color})`,border:'1.5px solid rgba(255,255,255,0.24)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:d.ico?14:12,fontWeight:900,color:'#fff',margin:'0 auto 6px'}}>{d.ico||d.cod}</div>
              <div style={{fontSize:11,fontWeight:700,color:'rgba(255,245,215,0.90)'}}>{d.n}</div>
              <div style={{fontSize:8,color:'rgba(220,175,80,0.58)',textTransform:'uppercase',letterSpacing:1,marginTop:2}}>{d.r}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:9.5,letterSpacing:2,color:'rgba(220,175,60,0.72)',textTransform:'uppercase',fontWeight:700,marginBottom:8}}>Categoría</div>
        <select value={categoria} onChange={e=>setCategoria(e.target.value)} style={{...inpStyle,appearance:'none'}}>
          {CATEGORIAS_Q.map(c=><option key={c}>{c}</option>)}
        </select>
        <div style={{fontSize:9.5,letterSpacing:2,color:'rgba(220,175,60,0.72)',textTransform:'uppercase',fontWeight:700,marginBottom:8}}>Tu pregunta</div>
        <textarea value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Escribe tu duda bíblica aquí..."
          style={{...inpStyle,resize:'none',height:90,lineHeight:1.65,borderRadius:10,marginBottom:8}}/>
        <div style={{fontSize:10,color:C.textFaint,marginBottom:12}}>Tu nombre aparecerá: {user.nombre} {user.apellido||''}</div>
        <div onClick={enviarWA} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderRadius:11,border:'1px solid rgba(37,211,102,0.30)',background:'rgba(18,140,60,0.18)',cursor:'pointer',marginBottom:8}}>
          <span style={{fontSize:18}}>📲</span>
          <span style={{fontSize:12,color:'rgba(150,255,180,0.90)',fontWeight:700}}>Enviar por WhatsApp a: <strong>{dest.n}</strong></span>
        </div>
        <button onClick={guardar} disabled={enviando} style={{width:'100%',padding:13,borderRadius:40,border:'1px solid rgba(220,165,20,0.55)',cursor:enviando?'not-allowed':'pointer',background:'linear-gradient(145deg,#f8d858,#d49810,#a87408)',color:'#2a1400',fontFamily:font,fontSize:12,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase',boxShadow:'0 4px 0 #7a5004,inset 0 1px 0 rgba(255,248,150,0.52)',opacity:enviando?0.7:1}}>
          {enviando?'Guardando...':'✦ Guardar en la plataforma ✦'}
        </button>
      </Card>

      <Card>
        <CardTitle>📬 Mis preguntas enviadas</CardTitle>
        {misPreguntas.length===0?(
          <div style={{textAlign:'center',padding:'24px 0',color:C.textFaint,fontSize:12}}>Aún no has enviado preguntas.</div>
        ):misPreguntas.map((p,i)=>(
          <div key={i} style={{padding:'12px 0',borderBottom:i<misPreguntas.length-1?`1px solid rgba(220,175,60,0.12)`:'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <div style={{fontSize:10,color:C.textFaint,textTransform:'uppercase',letterSpacing:1}}>Para: {p.destinatario} · {p.fecha}</div>
              <span style={{fontSize:9,padding:'3px 9px',borderRadius:10,fontWeight:700,background:p.estado==='respondida'?'rgba(40,200,90,0.18)':'rgba(255,200,80,0.18)',color:p.estado==='respondida'?'rgba(100,220,130,0.92)':'rgba(255,200,80,0.90)'}}>{p.estado==='respondida'?'Respondida ✓':'Pendiente'}</span>
            </div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5,marginBottom:p.respuesta?7:0}}>{p.texto}</div>
            {p.respuesta&&(
              <div style={{padding:'9px 12px',background:'rgba(40,200,90,0.10)',borderRadius:9,borderLeft:'3px solid rgba(40,200,90,0.42)'}}>
                <div style={{fontSize:9,color:'rgba(100,220,130,0.72)',fontWeight:800,marginBottom:3,letterSpacing:1,textTransform:'uppercase'}}>Respuesta de {p.destinatario}</div>
                <div style={{fontSize:11.5,color:'rgba(220,255,230,0.85)',lineHeight:1.68}}>{p.respuesta}</div>
              </div>
            )}
          </div>
        ))}
      </Card>
    </>
  )
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export default function EstudianteDashboard({user, onLogout, testActivo}) {
  const [tab, setTab] = useState('inicio')
  const [respuestas, setRespuestas] = useState({})
  const [confirmadas, setConfirmadas] = useState({})
  const [terminado, setTerminado] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const [curIdx, setCurIdx] = useState(0)
  const [ytSearch, setYtSearch] = useState('')
  const [ytSrc, setYtSrc] = useState('')
  const [plSrc, setPlSrc] = useState('')
  const [openCat, setOpenCat] = useState(null)

  useEffect(()=>{
    if(!testActivo?.generadoTs)return
    const actualizar=()=>{const diff=testActivo.generadoTs+12*3600*1000-Date.now();setTiempoRestante(diff>0?diff:0)}
    actualizar()
    const iv=setInterval(actualizar,1000)
    return()=>clearInterval(iv)
  },[testActivo])

  const feedbackOk = tiempoRestante===0

  const fmt=(ms)=>{
    if(ms==null)return''
    const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000)
    return `${h}h ${m}m ${s}s`
  }

  const confirmar=(idx)=>{if(respuestas[idx]===undefined)return;setConfirmadas(c=>({...c,[idx]:true}))}

  const finalizar=async()=>{
    if(!testActivo)return
    const preguntas=testActivo.preguntas||[]
    const correctas=preguntas.filter((p,i)=>respuestas[i]===p.correcta).length
    const detalles=preguntas.map((p,i)=>respuestas[i]===p.correcta)
    try{await guardarRespuestas(testActivo.codigo,user.nombre,user.apellido||'',{correctas,detalles,total:preguntas.length})}
    catch(e){console.error(e)}
    setTerminado(true)
  }

  const todasConfirmadas = testActivo?.preguntas?.every((_,i)=>confirmadas[i])
  const preguntas = testActivo?.preguntas||[]
  const correctas = preguntas.filter((p,i)=>respuestas[i]===p.correcta).length
  const versiculo = VERSICULOS[new Date().getDate()%VERSICULOS.length]

  const sItems = [
    {id:'inicio',label:'🏠 Inicio'},
    {id:'test',  label:'📝 Mi Test'},
    {id:'preguntas',label:'❓ Preguntas'},
    {id:'alabanzas',label:'🎵 Alabanzas'},
    {id:'explorar', label:'🗺️ Explorar'},
  ]

  const buscarYT=()=>{
    if(!ytSearch.trim())return
    setYtSrc('https://www.youtube.com/embed?listType=search&list='+encodeURIComponent(ytSearch+' alabanza cristiana'))
  }
  const playYT=(vid)=>{setPlSrc('https://www.youtube.com/embed/'+vid+'?autoplay=1')}

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:'100vh',fontFamily:font,display:'flex',position:'relative'}}>

      {/* Fondo */}
      <div style={{position:'fixed',inset:0,zIndex:0,backgroundImage:'url(/bg-biblia.jpg)',backgroundSize:'cover',backgroundPosition:'center',filter:'blur(3.5px) brightness(1.0) saturate(0.76)',transform:'scale(1.04)'}}/>
      <div style={{position:'fixed',inset:0,zIndex:1,background:'rgba(10,4,0,0.30)'}}/>

      {/* SIDEBAR */}
      <nav style={{width:195,flexShrink:0,background:C.sidebar,backdropFilter:'blur(24px)',borderRight:`1.5px solid rgba(220,175,60,0.30)`,display:'flex',flexDirection:'column',minHeight:'100vh',position:'relative',zIndex:2}}>
        <LogoGlass/>
        <div style={{margin:'0 10px 10px',background:'rgba(255,240,180,0.10)',border:'1px solid rgba(220,175,60,0.22)',borderRadius:10,padding:'8px 11px',textAlign:'center'}}>
          <div style={{fontSize:12,fontWeight:800,color:'rgba(255,245,215,0.94)'}}>{user.nombre} {user.apellido||''}</div>
          <div style={{fontSize:8,fontStyle:'italic',color:'rgba(220,190,110,0.58)',marginTop:2}}>Estudiante · IUMP Recoleta</div>
        </div>
        <div style={{padding:'8px 12px 4px',fontSize:9,letterSpacing:2,color:'rgba(220,180,80,0.55)',textTransform:'uppercase',fontFamily:'sans-serif',fontWeight:700}}>— Menú —</div>
        {sItems.map(s=>(
          <div key={s.id} onClick={()=>setTab(s.id)} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 11px',borderRadius:10,cursor:'pointer',margin:'2px 8px',fontSize:13,color:tab===s.id?'rgba(255,235,120,1)':'rgba(200,165,90,0.55)',background:tab===s.id?'rgba(220,175,60,0.20)':'transparent',border:`1px solid ${tab===s.id?'rgba(220,175,60,0.42)':'transparent'}`,fontWeight:tab===s.id?700:400,transition:'all 0.2s'}}>
            {s.label}
          </div>
        ))}
        <div style={{marginTop:'auto',padding:'11px 12px',borderTop:'1px solid rgba(220,175,60,0.14)',fontSize:8.5,fontStyle:'italic',color:'rgba(220,180,80,0.35)',lineHeight:1.7,textAlign:'center'}}>
          "Lámpara es a mis pies tu palabra,<br/>y lumbrera a mi camino."<br/>— Salmos 119:105
        </div>
      </nav>

      {/* MAIN */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,position:'relative',zIndex:2}}>

        {/* HEADER — sin recuadro logo HETT, solo saludo */}
        <header style={{background:C.header,backdropFilter:'blur(22px)',borderBottom:`1.5px solid rgba(220,175,60,0.28)`,padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:62,flexShrink:0,position:'sticky',top:0,zIndex:20}}>
          <div style={{flex:1,textAlign:'center'}}>
            <div style={{fontSize:16,fontWeight:800,background:'linear-gradient(180deg,#fffbe0,#ffd84a)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:2}}>
              Hola, {user.nombre} {user.apellido||''} ✦
            </div>
            <div style={{fontSize:9.5,fontStyle:'italic',color:'rgba(220,190,110,0.65)'}}>Hoy Es Tu Tiempo · Ven a Jesús</div>
          </div>
          <button onClick={onLogout} style={{background:'rgba(220,175,60,0.14)',border:'1.5px solid rgba(220,175,60,0.36)',borderRadius:'50%',width:34,height:34,cursor:'pointer',color:'rgba(255,215,100,0.82)',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>←</button>
        </header>

        <main style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>

          {/* ═══ INICIO ═══ */}
          {tab==='inicio'&&(
            <>
              {testActivo?(
                <div style={{background:'rgba(10,60,20,0.52)',border:'1.5px solid rgba(40,200,90,0.35)',borderRadius:14,padding:'18px 20px',marginBottom:14}}>
                  <div style={{color:'#80ffaa',fontSize:11,fontWeight:800,letterSpacing:2,marginBottom:5}}>✅ TEST DISPONIBLE</div>
                  <div style={{color:C.text,fontSize:15,fontWeight:800,marginBottom:3}}>{testActivo.titulo}</div>
                  <div style={{color:'rgba(180,240,200,0.60)',fontSize:11,marginBottom:12}}>📖 {testActivo.tema} · {testActivo.fecha}</div>
                  <button onClick={()=>setTab('test')} style={{padding:'10px 22px',borderRadius:30,border:'none',cursor:'pointer',background:'linear-gradient(145deg,#f8d858,#d49810)',color:'#2a1400',fontFamily:font,fontSize:11,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Ir al Test →</button>
                </div>
              ):(
                <div style={{background:'rgba(220,175,60,0.10)',border:'1.5px solid rgba(220,175,60,0.26)',borderRadius:14,padding:'20px 18px',marginBottom:14,textAlign:'center'}}>
                  <div style={{fontSize:28,marginBottom:9}}>📖</div>
                  <div style={{fontSize:13,fontWeight:800,color:'rgba(255,215,100,0.90)',marginBottom:5}}>Sin test activo por ahora</div>
                  <div style={{fontSize:12,color:C.textMuted,lineHeight:1.6}}>El profesor(a) aún no ha iniciado ningún test. Mientras tanto, explora la Biblia o escucha alabanzas.</div>
                </div>
              )}

              {/* Versículo DEL DÍA — ARRIBA del calendario */}
              <Card>
                <CardTitle>📖 Versículo del Día — RVR1960</CardTitle>
                <div style={{borderLeft:'3px solid rgba(220,150,40,0.70)',paddingLeft:14}}>
                  <p style={{color:C.text,fontSize:13.5,lineHeight:1.82,fontStyle:'italic',marginBottom:8}}>"{versiculo.text}"</p>
                  <div style={{color:'rgba(255,200,80,0.90)',fontSize:12,fontWeight:800}}>— {versiculo.ref}</div>
                </div>
              </Card>

              {/* Relojes */}
              <Card>
                <CardTitle>🕐 Horarios en Tiempo Real</CardTitle>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[{id:'stgo',label:'🇨🇱 Santiago de Chile',tz:'America/Santiago'},{id:'isr',label:'🇮🇱 Jerusalén, Israel',tz:'Asia/Jerusalem'}].map(r=>(
                    <div key={r.id} style={{background:'rgba(255,240,180,0.08)',border:'1px solid rgba(220,175,60,0.20)',borderRadius:11,padding:'12px 14px',textAlign:'center'}}>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:C.textFaint,fontWeight:700,marginBottom:4}}>{r.label}</div>
                      <div id={'h-'+r.id} style={{fontSize:22,fontWeight:900,color:'rgba(255,225,120,0.95)',fontFamily:'monospace',letterSpacing:2}}>--:--:--</div>
                      <div id={'f-'+r.id} style={{fontSize:9,color:C.textFaint,marginTop:3}}>---</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Fiestas Judías */}
              <Card>
                <CardTitle>✡️ Calendario de Fiestas Judías 2025-2026</CardTitle>
                {[
                  {ico:'🎺',n:'Rosh Hashaná — Año Nuevo Judío',f:'22-24 Sep 2025',d:'Inicio del año judío 5786. Tiempo de reflexión y arrepentimiento. Se toca el shofar.'},
                  {ico:'🙏',n:'Yom Kipur — Día del Perdón',f:'1-2 Oct 2025',d:'El día más sagrado del año judío. 25 horas de ayuno y oración.'},
                  {ico:'🍂',n:'Sucot — Fiesta de los Tabernáculos',f:'6-13 Oct 2025',d:'Conmemora los 40 años en el desierto. Se construyen cabañas y se habita 7 días. Levítico 23:34.'},
                  {ico:'🕯️',n:'Janucá — Fiesta de las Luces',f:'14-22 Dic 2025',d:'8 noches encendiendo la menorá. Celebra el milagro del aceite en el Templo.'},
                  {ico:'📜',n:'Purim',f:'3 Mar 2026',d:'Celebración del libro de Ester. El pueblo fue librado de Amán. Alegría y regalos.'},
                  {ico:'🌾',n:'Pésaj — Pascua Judía',f:'1-9 Abr 2026',d:'Conmemora el éxodo de Egipto. Se come matzá. Jesús celebró la última cena en Pésaj.'},
                ].map((f,i,arr)=>(
                  <div key={i} style={{padding:'10px 0',borderBottom:i<arr.length-1?'1px solid rgba(220,175,60,0.10)':'none',display:'flex',alignItems:'flex-start',gap:12}}>
                    <div style={{fontSize:20,flexShrink:0,marginTop:2}}>{f.ico}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:C.text}}>{f.n}</div>
                      <div style={{fontSize:10,color:C.textFaint,marginTop:2}}>{f.f}</div>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:3,lineHeight:1.55}}>{f.d}</div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Curiosidades */}
              <Card>
                <CardTitle>💡 Curiosidades Bíblicas</CardTitle>
                <p style={{color:C.text,fontSize:13,lineHeight:1.75,marginBottom:14}}>{CURIOSIDADES[curIdx%CURIOSIDADES.length]}</p>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <button onClick={()=>setCurIdx(i=>(i-1+CURIOSIDADES.length)%CURIOSIDADES.length)} style={{padding:'7px 16px',borderRadius:20,border:'1px solid rgba(220,175,60,0.28)',background:'rgba(220,175,60,0.10)',color:'rgba(220,185,100,0.85)',cursor:'pointer',fontFamily:font,fontSize:11}}>‹</button>
                  <div style={{flex:1,display:'flex',justifyContent:'center',gap:5}}>
                    {[0,1,2,3,4].map(i=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:curIdx%5===i?'rgba(220,155,35,0.88)':'rgba(220,175,60,0.28)'}}/>)}
                  </div>
                  <button onClick={()=>setCurIdx(i=>(i+1)%CURIOSIDADES.length)} style={{padding:'7px 16px',borderRadius:20,border:'1px solid rgba(220,175,60,0.28)',background:'rgba(220,175,60,0.10)',color:'rgba(220,185,100,0.85)',cursor:'pointer',fontFamily:font,fontSize:11}}>›</button>
                </div>
              </Card>

              <div style={{textAlign:'center',marginTop:20,marginBottom:8,color:'rgba(220,175,60,0.28)',fontSize:10,letterSpacing:2}}>✦ HOY ES TU TIEMPO — VEN A JESÚS ✦</div>
            </>
          )}

          {/* ═══ MI TEST ═══ */}
          {tab==='test'&&(
            <>
              {!testActivo?(
                <Card style={{textAlign:'center',padding:'44px 20px'}}>
                  <div style={{fontSize:36,marginBottom:10}}>📋</div>
                  <div style={{color:C.goldDim,fontSize:15,fontWeight:700,marginBottom:5}}>No hay test disponible</div>
                  <div style={{color:C.textMuted,fontSize:12}}>El profesor(a) debe generar un test primero.</div>
                </Card>
              ):(
                <>
                  <Card>
                    <div style={{color:'rgba(255,220,100,0.92)',fontSize:15,fontWeight:800,marginBottom:4}}>{testActivo.titulo}</div>
                    <div style={{color:C.textMuted,fontSize:11,marginBottom:10}}>📖 {testActivo.tema} · {testActivo.fecha}</div>
                    {!feedbackOk&&tiempoRestante!=null&&tiempoRestante>0&&(
                      <div style={{padding:'12px 14px',background:'rgba(140,70,10,0.20)',border:'1.5px solid rgba(220,130,50,0.32)',borderRadius:11}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                          <span style={{fontSize:18}}>🔒</span>
                          <div style={{color:'rgba(255,185,90,0.95)',fontSize:12,fontWeight:800}}>Respuestas bloqueadas por 12 horas</div>
                        </div>
                        <div style={{color:'rgba(255,205,130,0.70)',fontSize:11,marginBottom:10}}>Podrás ver qué acertaste cuando pasen las 12 horas.</div>
                        <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                          {[{v:Math.floor(tiempoRestante/3600000),l:'horas'},{v:Math.floor((tiempoRestante%3600000)/60000),l:'minutos'},{v:Math.floor((tiempoRestante%60000)/1000),l:'segundos'}].map((u,i)=>(
                            <div key={i} style={{textAlign:'center',background:'rgba(0,0,0,0.22)',borderRadius:8,padding:'10px 14px',minWidth:62}}>
                              <div style={{fontSize:24,fontWeight:900,color:'rgba(255,205,110,0.95)',lineHeight:1,fontFamily:'monospace'}}>{String(u.v).padStart(2,'0')}</div>
                              <div style={{fontSize:8,color:'rgba(255,185,80,0.55)',textTransform:'uppercase',letterSpacing:1,marginTop:3}}>{u.l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {feedbackOk&&!terminado&&todasConfirmadas&&(
                      <div style={{padding:'10px 13px',background:'rgba(20,140,70,0.22)',border:'1.5px solid rgba(40,200,90,0.35)',borderRadius:11,color:'#7fff90',fontSize:12,fontWeight:800}}>✅ Ya puedes ver las respuestas correctas</div>
                    )}
                  </Card>

                  {terminado?(
                    <>
                      <Card style={{textAlign:'center',padding:'32px 20px'}}>
                        <div style={{fontSize:48,marginBottom:10}}>🎉</div>
                        <div style={{color:'rgba(255,220,100,0.92)',fontSize:28,fontWeight:900,marginBottom:4}}>{Math.round((correctas/preguntas.length)*100)}%</div>
                        <div style={{color:C.text,fontSize:14,marginBottom:6}}>{correctas} de {preguntas.length} respuestas correctas</div>
                        <div style={{color:correctas/preguntas.length>=0.6?'#7fff90':'rgba(255,150,100,0.85)',fontSize:12,fontWeight:700}}>{correctas/preguntas.length>=0.6?'¡Aprobado! Muy bien.':'Sigue estudiando, tú puedes.'}</div>
                      </Card>
                      {feedbackOk?preguntas.map((p,i)=>{
                        const acerte=respuestas[i]===p.correcta
                        return(
                          <Card key={i} style={{border:`1.5px solid ${acerte?'rgba(40,200,90,0.35)':'rgba(220,60,60,0.30)'}`,background:acerte?'rgba(10,60,20,0.52)':'rgba(60,10,10,0.52)'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                              <span style={{fontSize:10,fontWeight:800,letterSpacing:2,color:'rgba(255,200,80,0.70)',textTransform:'uppercase'}}>Pregunta {i+1}</span>
                              <span style={{fontSize:11,fontWeight:900,padding:'3px 10px',borderRadius:20,background:acerte?'rgba(40,200,90,0.22)':'rgba(220,60,60,0.22)',color:acerte?'#7fff90':'#ffaaaa'}}>{acerte?'✓ Correcto':'✗ Incorrecto'}</span>
                            </div>
                            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:12,lineHeight:1.5}}>{p.texto}</div>
                            {(p.opciones||[]).map((op,j)=>{
                              const esC=j===p.correcta,esMi=j===respuestas[i]
                              let bg='rgba(255,255,255,0.05)',bdr='1px solid rgba(255,255,255,0.12)',col='rgba(255,255,255,0.55)'
                              if(esC){bg='rgba(20,140,70,0.28)';bdr='1.5px solid rgba(40,200,90,0.50)';col='rgba(150,255,180,0.92)'}
                              if(esMi&&!esC){bg='rgba(150,30,30,0.28)';bdr='1.5px solid rgba(220,60,60,0.45)';col='rgba(255,150,150,0.88)'}
                              return(
                                <div key={j} style={{padding:'10px 14px',borderRadius:11,marginBottom:7,background:bg,border:bdr,display:'flex',alignItems:'center',gap:10}}>
                                  <span style={{fontSize:11,fontWeight:800,color:'rgba(255,200,80,0.60)',width:18,flexShrink:0}}>{['A','B','C','D'][j]}.</span>
                                  <span style={{flex:1,fontSize:12,color:col,fontWeight:esC||esMi?700:400}}>{op}</span>
                                  {esC&&<span style={{fontSize:13,color:'#7fff90'}}>✓</span>}
                                  {esMi&&!esC&&<span style={{fontSize:13,color:'#ffaaaa'}}>✗</span>}
                                </div>
                              )
                            })}
                            {!acerte&&(
                              <div style={{marginTop:10,padding:'9px 12px',background:'rgba(255,200,80,0.08)',borderRadius:9,display:'flex',gap:16,flexWrap:'wrap'}}>
                                <div><div style={{fontSize:9,color:'rgba(255,150,100,0.65)',fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Tu respuesta</div><div style={{fontSize:12,color:'rgba(255,150,150,0.85)',fontWeight:700}}>{respuestas[i]!==undefined?`${['A','B','C','D'][respuestas[i]]}. ${p.opciones[respuestas[i]]}`:'No respondiste'}</div></div>
                                <div><div style={{fontSize:9,color:'rgba(100,220,130,0.65)',fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Respuesta correcta</div><div style={{fontSize:12,color:'rgba(130,255,165,0.90)',fontWeight:700}}>{['A','B','C','D'][p.correcta]}. {p.opciones[p.correcta]}</div></div>
                              </div>
                            )}
                            {p.explicacion&&(
                              <div style={{marginTop:10,padding:'10px 13px',background:'rgba(255,200,80,0.07)',borderRadius:10,borderLeft:'3px solid rgba(220,150,40,0.55)'}}>
                                <div style={{color:'rgba(255,200,80,0.85)',fontSize:9.5,fontWeight:800,letterSpacing:1.5,textTransform:'uppercase',marginBottom:5}}>📖 Explicación bíblica — RVR1960</div>
                                <div style={{color:'rgba(255,245,200,0.80)',fontSize:12,lineHeight:1.7,fontStyle:'italic'}}>{p.explicacion}</div>
                              </div>
                            )}
                          </Card>
                        )
                      }):(
                        <Card style={{textAlign:'center',padding:'28px 20px',background:'rgba(140,70,10,0.18)',borderColor:'rgba(220,130,50,0.30)'}}>
                          <div style={{fontSize:28,marginBottom:10}}>🔒</div>
                          <div style={{color:'rgba(255,180,80,0.90)',fontSize:13,fontWeight:800,marginBottom:6}}>La revisión se desbloqueará en</div>
                          <div style={{color:C.textMuted,fontSize:11}}>{fmt(tiempoRestante)}</div>
                        </Card>
                      )}
                    </>
                  ):(
                    <>
                      {preguntas.map((p,i)=>(
                        <Card key={i}>
                          <div style={{color:'rgba(255,200,80,0.80)',fontSize:10,fontWeight:800,letterSpacing:2,marginBottom:8,textTransform:'uppercase'}}>Pregunta {i+1} de {preguntas.length}</div>
                          <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:14,lineHeight:1.5}}>{p.texto}</div>
                          {(p.opciones||[]).map((op,j)=>{
                            const sel=respuestas[i]===j,conf=confirmadas[i]
                            let bg='rgba(255,255,255,0.06)',bdr='1px solid rgba(255,255,255,0.15)'
                            if(sel&&!conf){bg='rgba(200,85,32,0.22)';bdr='1.5px solid rgba(220,130,50,0.55)'}
                            if(conf&&sel){bg='rgba(20,100,60,0.28)';bdr='1.5px solid rgba(40,180,90,0.40)'}
                            return(
                              <div key={j} onClick={()=>!conf&&setRespuestas(r=>({...r,[i]:j}))} style={{padding:'10px 14px',borderRadius:11,marginBottom:7,cursor:conf?'default':'pointer',background:bg,border:bdr,transition:'all 0.2s'}}>
                                <span style={{color:sel?C.text:'rgba(255,255,255,0.60)',fontWeight:sel?700:400}}>{['A','B','C','D'][j]}. {op}</span>
                              </div>
                            )
                          })}
                          {confirmadas[i]?(
                            <div style={{color:'rgba(100,220,130,0.70)',fontSize:11,marginTop:8,fontWeight:700}}>✓ Respuesta guardada · Revisión disponible en {fmt(tiempoRestante)}</div>
                          ):(
                            <button onClick={()=>confirmar(i)} disabled={respuestas[i]===undefined} style={{marginTop:8,padding:'8px 20px',borderRadius:20,border:'none',cursor:respuestas[i]===undefined?'not-allowed':'pointer',background:respuestas[i]===undefined?'rgba(255,255,255,0.10)':'rgba(255,255,255,0.22)',color:'#fff',fontFamily:font,fontSize:11,fontWeight:700,opacity:respuestas[i]===undefined?0.5:1}}>Confirmar respuesta</button>
                          )}
                        </Card>
                      ))}
                      {todasConfirmadas&&!terminado&&(
                        <button onClick={finalizar} style={{width:'100%',padding:14,borderRadius:40,border:'none',cursor:'pointer',background:'linear-gradient(145deg,#f8d858,#d49810,#a87408)',color:'#2a1400',fontFamily:font,fontSize:13,fontWeight:900,letterSpacing:'3px',textTransform:'uppercase',marginBottom:14,boxShadow:'0 4px 0 #7a5004'}}>✦ Finalizar y Enviar Resultados ✦</button>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* ═══ PREGUNTAS ═══ */}
          {tab==='preguntas'&&<PanelPreguntas user={user}/>}

          {/* ═══ ALABANZAS ═══ */}
          {tab==='alabanzas'&&(
            <>
              <Card>
                <CardTitle>🔍 Buscar en YouTube</CardTitle>
                <div style={{display:'flex',gap:8,marginBottom:14}}>
                  <input value={ytSearch} onChange={e=>setYtSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscarYT()} placeholder="Busca tu canción favorita... ej: Reckless Love" style={{flex:1,background:C.inp,border:`1.5px solid ${C.inpBdr}`,borderRadius:10,padding:'11px 14px',color:C.text,fontSize:13,fontFamily:font,outline:'none'}}/>
                  <button onClick={buscarYT} style={{padding:'11px 16px',borderRadius:10,border:'1px solid rgba(220,165,20,0.45)',background:'linear-gradient(145deg,#f8d858,#d49810)',color:'#2a1400',fontFamily:font,fontSize:11,fontWeight:900,cursor:'pointer',whiteSpace:'nowrap'}}>Buscar ▶</button>
                </div>
                {ytSrc&&(
                  <div style={{borderRadius:11,overflow:'hidden'}}>
                    <iframe src={ytSrc} width="100%" height="200" frameBorder="0" allowFullScreen allow="autoplay;encrypted-media" style={{borderRadius:11,display:'block'}}/>
                    <div style={{marginTop:8,display:'flex',gap:8}}>
                      <button onClick={()=>window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(ytSearch+' alabanza cristiana'),'_blank')} style={{flex:1,padding:'6px 12px',borderRadius:20,border:'1px solid rgba(220,175,60,0.28)',background:'rgba(220,175,60,0.12)',color:'rgba(220,185,100,0.88)',fontSize:10,cursor:'pointer',fontFamily:font,fontWeight:700}}>↗ Abrir en YouTube</button>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <CardTitle>📋 Mi Lista de Reproducción</CardTitle>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:12,lineHeight:1.6}}>Toca ▶ en cualquier canción. La música continúa aunque bloquees el celular.</div>
                {[{t:'Reckless Love',a:'Cory Asbury',v:'dGmHFaJSfhA'},{t:'Way Maker',a:'Sinach',v:'iJCV_2H9cI0'},{t:'Goodness of God',a:'Bethel Music',v:'svpDCEvuTpA'}].map((s,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:'rgba(220,175,60,0.07)',borderRadius:9,marginBottom:6}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(220,175,60,0.20)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:'rgba(255,215,100,0.85)',flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}><div style={{fontSize:12,color:C.text,fontWeight:600}}>{s.t}</div><div style={{fontSize:10,color:C.textFaint}}>{s.a}</div></div>
                    <button onClick={()=>playYT(s.v)} style={{padding:'6px 12px',borderRadius:20,border:'1px solid rgba(220,175,60,0.28)',background:'rgba(220,175,60,0.12)',color:'rgba(220,185,100,0.88)',fontSize:10,cursor:'pointer',fontFamily:font,fontWeight:700}}>▶</button>
                  </div>
                ))}
                <button onClick={()=>playYT('dGmHFaJSfhA')} style={{width:'100%',marginTop:10,padding:11,borderRadius:11,border:'1.5px solid rgba(220,175,60,0.35)',background:'rgba(220,175,60,0.12)',color:'rgba(255,225,120,0.92)',fontFamily:font,fontSize:12,fontWeight:700,cursor:'pointer'}}>▶ Reproducir toda la lista</button>
                {plSrc&&<div style={{marginTop:12,borderRadius:11,overflow:'hidden'}}><iframe src={plSrc} width="100%" height="200" frameBorder="0" allowFullScreen allow="autoplay;encrypted-media" style={{borderRadius:11,display:'block'}}/></div>}
              </Card>

              <Card>
                <CardTitle>🎵 Alabanzas Sugeridas</CardTitle>
                {(ALABANZAS_SUGERIDAS||[]).slice(0,10).map((a,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(220,175,60,0.10)'}}>
                    <div><div style={{color:C.text,fontWeight:700,fontSize:13}}>{a.titulo}</div><div style={{color:C.textFaint,fontSize:10.5,marginTop:2}}>{a.artista}</div></div>
                    <button onClick={()=>window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(a.query),'_blank')} style={{padding:'6px 12px',borderRadius:20,border:'1px solid rgba(220,175,60,0.28)',background:'rgba(220,175,60,0.12)',color:'rgba(220,185,100,0.88)',fontSize:10,cursor:'pointer',fontFamily:font,fontWeight:700}}>▶ YouTube</button>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ═══ EXPLORAR ═══ */}
          {tab==='explorar'&&(
            <>
              <div style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'rgba(220,175,60,0.65)',fontWeight:800,marginBottom:14,textAlign:'center'}}>✦ Material completo basado en Reina Valera 1960 ✦</div>
              {EXPLORAR.map((data,i)=><ExpCat key={i} data={data} openCat={openCat} setOpenCat={setOpenCat}/>)}
            </>
          )}

        </main>
      </div>

      {/* Relojes JS */}
      <style>{`input::placeholder,textarea::placeholder{color:rgba(200,165,90,0.35)}`}</style>
      <RelojesScript/>
    </div>
  )
}

// Relojes en tiempo real como componente
function RelojesScript() {
  useEffect(()=>{
    const update=()=>{
      try{
        const stgo=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Santiago'}))
        const isr=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Jerusalem'}))
        const t=(d)=>d.toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
        const fd=(d)=>d.toLocaleDateString('es-CL',{weekday:'short',day:'numeric',month:'short'})
        const hs=document.getElementById('h-stgo')
        const fs=document.getElementById('f-stgo')
        const hi=document.getElementById('h-isr')
        const fi=document.getElementById('f-isr')
        if(hs)hs.textContent=t(stgo)
        if(fs)fs.textContent=fd(stgo)
        if(hi)hi.textContent=t(isr)
        if(fi)fi.textContent=fd(isr)
      }catch(e){}
    }
    update()
    const iv=setInterval(update,1000)
    return()=>clearInterval(iv)
  },[])
  return null
}
