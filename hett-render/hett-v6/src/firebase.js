import { initializeApp } from 'firebase/app'
import { initializeFirestore, collection, doc, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBAOLtKoXstkSRmcUxrwjkWvSivR3BJwm0",
  authDomain: "hett-app.firebaseapp.com",
  projectId: "hett-app",
  storageBucket: "hett-app.firebasestorage.app",
  messagingSenderId: "968156207463",
  appId: "1:968156207463:web:d5e3e2f3d57d4029dbf7c2",
}

const app = initializeApp(firebaseConfig)
export const db = initializeFirestore(app, { experimentalForceLongPolling: true })

const PROJECT = 'hett-app'
const API_KEY = 'AIzaSyBAOLtKoXstkSRmcUxrwjkWvSivR3BJwm0'
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/hett-app/documents`

// ── Convierte JS → formato Firestore REST ──────────────────────────────────
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
  const fields = {}
  for (const k in obj) fields[k] = toFS(obj[k])
  return fields
}

// ── Convierte Firestore REST → JS ──────────────────────────────────────────
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

function docToObj(doc) {
  const obj = {}
  for (const k in doc.fields) obj[k] = fromFS(doc.fields[k])
  return obj
}

// ── Escritura via REST (evita problema gRPC de Render) ────────────────────
async function restSet(path, data) {
  const url = `${BASE}/${path}?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(data) })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `HTTP ${res.status}`)
  }
  return res.json()
}

async function restAdd(collection_path, data) {
  const url = `${BASE}/${collection_path}?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(data) })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `HTTP ${res.status}`)
  }
  return res.json()
}

async function restList(collection_path) {
  const url = `${BASE}/${collection_path}?key=${API_KEY}&pageSize=200`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return (data.documents || []).map(d => ({ id: d.name.split('/').pop(), ...docToObj(d) }))
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
  return onSnapshot(collection(db, 'tests'), (snap) => {
    const tests = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const activo = tests.find(t => t.activo)
    callback(activo || null)
  })
}

export async function guardarRespuestas(codigo, nombre, apellido, datos) {
  const id = `${nombre}_${apellido}`.toLowerCase().replace(/\s+/g, '_')
  await restSet(`tests/${codigo}/respuestas/${id}`, {
    nombre, apellido, ...datos, respondidoEn: Date.now()
  })
}

export function escucharRespuestas(codigo, callback) {
  return onSnapshot(collection(db, 'tests', codigo, 'respuestas'), (snap) => {
    callback(snap.docs.map(d => d.data()))
  })
}

export async function guardarPregunta(datos) {
  await restAdd('preguntas', {
    ...datos, fecha: new Date().toLocaleDateString('es-CL'),
    creadoEn: Date.now(), estado: 'pendiente', respuesta: ''
  })
}

export function escucharMisPreguntas(nombre, apellido, callback) {
  return onSnapshot(collection(db, 'preguntas'), (snap) => {
    const mias = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.nombre === nombre && p.apellido === apellido)
      .sort((a, b) => (b.creadoEn || 0) - (a.creadoEn || 0))
    callback(mias)
  })
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
