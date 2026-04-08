import { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import ProfesorDashboard from './pages/ProfesorDashboard.jsx'
import EstudianteDashboard from './pages/EstudianteDashboard.jsx'
import { escucharTestActivo } from './firebase.js'

export default function App() {
  const [user, setUser] = useState(null)
  const [testActivo, setTestActivo] = useState(null)

  useEffect(() => {
    const unsub = escucharTestActivo((test) => {
      setTestActivo(test)
    })
    return () => unsub()
  }, [])

  if (!user) return <Login onLogin={setUser} />

  if (user.rol === 'profesor') return (
    <ProfesorDashboard
      onLogout={() => setUser(null)}
      testActivo={testActivo}
    />
  )

  return (
    <EstudianteDashboard
      user={user}
      onLogout={() => setUser(null)}
      testActivo={testActivo}
    />
  )
}
