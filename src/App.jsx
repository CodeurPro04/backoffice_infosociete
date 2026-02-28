import { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Requests from './pages/Requests.jsx'
import Resiliations from './pages/Resiliations.jsx'
import Clients from './pages/Clients.jsx'
import Settings from './pages/Settings.jsx'
import Claims from './pages/Claims.jsx'
import Contacts from './pages/Contacts.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import { fetchAdminSubmissions } from './api.js'

const navItems = [
  { label: 'Tableau de bord', to: '/' },
  { label: 'Demandes Kbis', to: '/demandes' },
  { label: 'Demandes résiliation', to: '/resiliations' },
  { label: 'Réclamations', to: '/reclamations' },
  { label: 'Contacts', to: '/contacts' },
  { label: 'Clients', to: '/clients' },
  //{ label: 'Profil', to: '/profil' },
  //{ label: 'Paramètres', to: '/parametres' },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [counts, setCounts] = useState({
    kbis_request: 0,
    cancellation: 0,
    claim: 0,
    contact: 0,
    signup: 0,
  })

  const isLoginPage = location.pathname === '/connexion'

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
    navigate('/connexion', { replace: true })
  }

  useEffect(() => {
    if (!token) return

    fetchAdminSubmissions(token)
      .then((data) => {
        const items = Array.isArray(data?.submissions) ? data.submissions : []
        const summary = items.reduce(
          (acc, item) => {
            const type = item?.type
            if (type && Object.prototype.hasOwnProperty.call(acc, type)) {
              acc[type] += 1
            }
            return acc
          },
          { kbis_request: 0, cancellation: 0, claim: 0, contact: 0, signup: 0 },
        )
        setCounts(summary)
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        setToken('')
      })
  }, [token, location.pathname])

  const navWithCounts = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        count:
          item.to === '/demandes'
            ? counts.kbis_request
            : item.to === '/resiliations'
            ? counts.cancellation
            : item.to === '/reclamations'
            ? counts.claim
            : item.to === '/contacts'
            ? counts.contact
            : item.to === '/clients'
            ? counts.signup
            : 0,
      })),
    [counts],
  )

  if (!token && !isLoginPage) {
    return <Navigate to="/connexion" replace />
  }

  if (isLoginPage) {
    return token ? <Navigate to="/" replace /> : <Login onLoginSuccess={setToken} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f3f6fb] to-[#e9f2fb] text-slate">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-8 px-6 py-8">
        <aside className="glass-card hidden w-72 flex-col gap-8 px-6 py-7 lg:flex">
          <div>
            <p className="chip">Back Office</p>
            <h1 className="mt-4 font-display text-2xl font-semibold text-ink">INFO-DOCSFLOW</h1>
            <p className="mt-2 text-sm text-slate/70">Pilotage des demandes, paiements et équipes.</p>
          </div>

          <nav className="flex flex-col gap-2 text-sm font-semibold">
            {navWithCounts.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                    isActive ? 'bg-ink text-white shadow-soft' : 'text-slate/70 hover:bg-white/70'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.count > 0 ? <span className="text-xs text-white/70">{item.count}</span> : null}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-rose-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-soft hover:bg-rose-600"
          >
            Déconnexion
          </button>
        </aside>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/demandes" element={<Requests token={token} />} />
            <Route path="/resiliations" element={<Resiliations token={token} />} />
            <Route path="/reclamations" element={<Claims token={token} />} />
            <Route path="/contacts" element={<Contacts token={token} />} />
            <Route path="/clients" element={<Clients token={token} />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="/connexion" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
