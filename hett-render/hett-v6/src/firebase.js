import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'

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

// ── Colecciones ──
// tests/{codigo}         → datos del test activo
// respuestas/{codigo}/alumnos/{nombre_apellido}  → respuestas de cada alumno

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

// Escuchar test activo en tiempo real (para estudiantes)
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

// Escuchar respuestas en tiempo real (para el profesor)
export function escucharRespuestas(codigo, callback) {
  return onSnapshot(collection(db, 'tests', codigo, 'respuestas'), (snap) => {
    const respuestas = snap.docs.map(d => d.data())
    callback(respuestas)
  })
}
