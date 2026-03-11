import { useState } from 'react'
import Login from './pages/Login.jsx'
import ProfesorDashboard from './pages/ProfesorDashboard.jsx'
import EstudianteDashboard from './pages/EstudianteDashboard.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [activeTest, setActiveTest] = useState(null)
  const [sesion, setSesion] = useState(null)
  const [respuestas, setRespuestas] = useState([])

  const handleSubmitRespuestas = (datos) => {
    setRespuestas(prev => {
      const existe = prev.findIndex(r => r.nombre === datos.nombre && r.apellido === datos.apellido)
      if (existe >= 0) { const u = [...prev]; u[existe] = datos; return u }
      return [...prev, datos]
    })
  }

  if (!user) return <Login onLogin={setUser} />

  if (user.rol === 'profesor') return (
    <ProfesorDashboard
      onLogout={() => setUser(null)}
      activeTest={activeTest} setActiveTest={setActiveTest}
      sesion={sesion} setSesion={setSesion}
      respuestas={respuestas}
    />
  )

  return (
    <EstudianteDashboard
      user={user}
      onLogout={() => setUser(null)}
      activeTest={activeTest}
      sesion={sesion}
      onSubmitRespuestas={handleSubmitRespuestas}
    />
  )
}
