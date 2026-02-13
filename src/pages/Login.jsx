import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api.js'

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await adminLogin({ email, password })
      const token = data?.token || ''

      if (!token) {
        throw new Error('Token de connexion manquant.')
      }

      localStorage.setItem('admin_token', token)
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(token)
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f3f6fb] to-[#e9f2fb] px-6 py-10 text-slate">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">
        <div className="glass-card grid w-full max-w-4xl gap-8 px-8 py-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="chip">Connexion</p>
            <h1 className="font-display text-3xl font-semibold text-ink">Back Office Infogref.goentrypro</h1>
            <p className="text-sm text-slate/60">
              Accès sécurisé pour l'équipe administrative. Veuillez renseigner vos identifiants.
            </p>

            <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-slate/50">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-slate/50">Mot de passe</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3"
                  required
                />
              </label>

              {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

              <button
                className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-ink px-6 py-8 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accès</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">Pilotez en temps réel</h2>
              <p className="mt-3 text-sm text-white/70">
                Suivez les demandes, les résiliations, les réclamations et les contacts depuis un seul espace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
