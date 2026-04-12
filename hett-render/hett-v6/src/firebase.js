import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBAOLtKoXstkSRmcUxrwjkWvSivR3BJwm0",
  authDomain: "hett-app.firebaseapp.com",
  projectId: "hett-app",
  storageBucket: "hett-app.firebasestorage.app",
  messagingSenderId: "968156207463",
  appId: "1:968156207463:web:d5e3e2f3d57d4029dbf7c2",
}

initializeApp(firebaseConfig)

const PROJECT = 'hett-app'
const DB = 'hett-app'
const API_KEY = 'AIzaSyBAOLtKoXstkSRmcUxrwjkWvSivR3BJwm0'
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/${DB}/documents`

// ── JS → Firestore REST ───────────────────────────────────────────────────
function toFS(val) {
  if (val === null || val === undefined) return { nullValue: null }
  if (typeof val === 'boolean') return { booleanValue: val }
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val }
  if (typeof val === 'string') return { stringValue: val }
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFS) } }
  if (typeof val === 'object') {
    const fields = {}
    for (const k in val) fields[k] = toFS(val[k])
    return { mapValue: { fields } }
  }
  return { stringValue: String(val) }
}
function objToFields(obj) {
  const f = {}
  for (const k in obj) f[k] = toFS(obj[k])
  return f
}

// ── Firestore REST → JS ───────────────────────────────────────────────────
function fromFS(val) {
  if (!val) return null
  if ('nullValue' in val) return null
  if ('booleanValue' in val) return val.booleanValue
  if ('integerValue' in val) return parseInt(val.integerValue)
  if ('doubleValue' in val) return val.doubleValue
  if ('stringValue' in val) return val.stringValue
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(fromFS)
  if ('mapValue' in val) {
    const obj = {}
    for (const k in val.mapValue.fields) obj[k] = fromFS(val.mapValue.fields[k])
    return obj
  }
  return null
}
function docToObj(d) {
  const obj = { id: d.name.split('/').pop() }
  for (const k in d.fields) obj[k] = fromFS(d.fields[k])
  return obj
}

// ── REST helpers ──────────────────────────────────────────────────────────
async function restSet(path, data) {
  const res = await fetch(`${BASE}/${path}?key=${API_KEY}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(data) })
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `HTTP ${res.status}`) }
  return res.json()
}

async function restAdd(col, data) {
  const res = await fetch(`${BASE}/${col}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(data) })
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `HTTP ${res.status}`) }
  return res.json()
}

async function restList(col) {
  const res = await fetch(`${BASE}/${col}?key=${API_KEY}&pageSize=200`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return (data.documents || []).map(docToObj)
}

// ── Polling para tiempo real (reemplaza onSnapshot) ───────────────────────
function startPolling(colPath, callback, intervalMs = 3000) {
  let active = true
  const poll = async () => {
    if (!active) return
    try {
      const docs = await restList(colPath)
      callback(docs)
    } catch (e) { /* silencioso */ }
    if (active) setTimeout(poll, intervalMs)
  }
  poll()
  return () => { active = false }
}

// ── API pública ────────────────────────────────────────────────────────────

export async function guardarTest(codigo, datos) {
  await restSet(`tests/${codigo}`, { ...datos, creadoEn: Date.now(), activo: true })
}

export async function obtenerTest(codigo) {
  const docs = await restList('tests')
  return docs.find(d => d.id === codigo) || null
}

export function escucharTestActivo(callback) {
  return startPolling('tests', (docs) => {
    const activo = docs.find(t => t.activo)
    callback(activo || null)
  }, 4000)
}

export async function guardarRespuestas(codigo, nombre, apellido, datos) {
  const id = `${nombre}_${apellido}`.toLowerCase().replace(/\s+/g, '_')
  await restSet(`tests/${codigo}/respuestas/${id}`, {
    nombre, apellido, ...datos, respondidoEn: Date.now()
  })
}

export function escucharRespuestas(codigo, callback) {
  return startPolling(`tests/${codigo}/respuestas`, callback, 3000)
}

export async function guardarPregunta(datos) {
  await restAdd('preguntas', {
    ...datos,
    fecha: new Date().toLocaleDateString('es-CL'),
    creadoEn: Date.now(),
    estado: 'pendiente',
    respuesta: ''
  })
}

export function escucharMisPreguntas(nombre, apellido, callback) {
  return startPolling('preguntas', (docs) => {
    const mias = docs
      .filter(p => p.nombre === nombre && p.apellido === apellido)
      .sort((a, b) => (b.creadoEn || 0) - (a.creadoEn || 0))
    callback(mias)
  }, 5000)
}

export async function obtenerTodasLasSesiones() {
  const tests = await restList('tests')
  const sesiones = []
  for (const test of tests) {
    const respuestas = await restList(`tests/${test.id}/respuestas`)
    sesiones.push({ test, respuestas })
  }
  return sesiones
}
