import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBAOLtKoXstkSRmcUxrwjkWvSivR3BJwm0",
  authDomain: "hett-app.firebaseapp.com",
  projectId: "hett-app",
  storageBucket: "hett-app.firebasestorage.app",
  messagingSenderId: "968156207463",
  appId: "1:968156207463:web:d5e3e2f3d57d4029dbf7c2",
  measurementId: "G-HQLH86YJWB"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Guardar test activo
export async function guardarTest(codigo, datos) {
  await setDoc(doc(db, 'tests', codigo), {
    ...datos,
    creadoEn: serverTimestamp(),
    activo: true
  })
}

// Obtener test por código
export async function obtenerTest(codigo) {
  const snap = await getDoc(doc(db, 'tests', codigo))
  return snap.exists() ? snap.data() : null
}

// Escuchar test activo en tiempo real
export function escucharTestActivo(callback) {
  return onSnapshot(collection(db, 'tests'), (snap) => {
    const tests = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const activo = tests.find(t => t.activo)
    callback(activo || null)
  })
}

// Guardar respuestas de un alumno
export async function guardarRespuestas(codigo, nombre, apellido, datos) {
  const id = `${nombre}_${apellido}`.toLowerCase().replace(/\s+/g, '_')
  await setDoc(doc(db, 'tests', codigo, 'respuestas', id), {
    nombre,
    apellido,
    ...datos,
    respondidoEn: serverTimestamp()
  })
}

// Escuchar respuestas en tiempo real
export function escucharRespuestas(codigo, callback) {
  return onSnapshot(collection(db, 'tests', codigo, 'respuestas'), (snap) => {
    const respuestas = snap.docs.map(d => d.data())
    callback(respuestas)
  })
}

// Guardar pregunta de un estudiante
export async function guardarPregunta(datos) {
  await addDoc(collection(db, 'preguntas'), {
    ...datos,
    fecha: new Date().toLocaleDateString('es-CL'),
    creadoEn: serverTimestamp(),
    estado: 'pendiente',
    respuesta: ''
  })
}

// Escuchar mis preguntas en tiempo real
export function escucharMisPreguntas(nombre, apellido, callback) {
  return onSnapshot(collection(db, 'preguntas'), (snap) => {
    const todas = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const mias = todas.filter(p => p.nombre === nombre && p.apellido === apellido)
    callback(mias.sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0)))
  })
}

// Obtener TODAS las sesiones con sus respuestas (para CSV)
export async function obtenerTodasLasSesiones() {
  const testsSnap = await getDocs(collection(db, 'tests'))
  const sesiones = []
  for (const testDoc of testsSnap.docs) {
    const test = { id: testDoc.id, ...testDoc.data() }
    const respSnap = await getDocs(collection(db, 'tests', testDoc.id, 'respuestas'))
    const respuestas = respSnap.docs.map(d => d.data())
    sesiones.push({ test, respuestas })
  }
  return sesiones
}
