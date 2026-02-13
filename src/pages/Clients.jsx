import { useEffect, useMemo, useState } from 'react'
import { fetchAdminSubmissions } from '../api.js'

export default function Clients({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('Tous')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetchAdminSubmissions(token)
      .then((data) => {
        if (!mounted) return
        const items = Array.isArray(data?.submissions) ? data.submissions : []
        const signups = items.filter((item) => item.type === 'signup')
        const payments = items.filter((item) => item.type === 'payment')

        const paymentLabel = (status) => {
          const s = (status || '').toLowerCase()
          if (s === 'succeeded') return 'Validé'
          if (s === 'processing' || s === 'requires_action') return 'En attente'
          if (s === 'failed' || s === 'canceled' || s === 'cancelled') return 'Refusé'
          return 'Sans paiement'
        }

        setClients(
          signups.map((item) => {
            const p = item.payload || {}
            const linkedPayment = payments.find((payment) => {
              const pp = payment.payload || {}
              return (
                (pp.email || '').toLowerCase() === (p.email || '').toLowerCase() &&
                (pp.siret_or_siren || '') === (p.siret_or_siren || '')
              )
            })

            return {
              id: item.id,
              name: p.company_name || '-',
              email: p.email || '-',
              plan: 'Essai',
              status: 'Actif',
              paymentStatus: paymentLabel(linkedPayment?.payload?.status),
              profile: p.profile || '-',
              siret: p.siret_or_siren || '-',
              firstName: p.first_name || '-',
              lastName: p.last_name || '-',
            }
          }),
        )
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Impossible de charger les clients.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [token])

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase()
    let result = clients

    if (paymentFilter !== 'Tous') {
      result = result.filter((c) => c.paymentStatus === paymentFilter)
    }

    if (!q) return result
    return result.filter((c) =>
      [c.name, c.email, c.siret, c.firstName, c.lastName].some((value) => (value || '').toLowerCase().includes(q)),
    )
  }, [clients, search, paymentFilter])

  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Clients</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Comptes clients</h2>
          <p className="mt-1 text-sm text-slate/60">Données réelles des inscriptions reçues.</p>
        </div>
      </header>

      <section className="glass-card px-6 py-6">
        <div className="flex flex-wrap gap-3">
          <input
            className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm outline-none md:w-80"
            placeholder="Rechercher un client"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Tous', 'Validé', 'En attente', 'Refusé', 'Sans paiement'].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setPaymentFilter(label)}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                paymentFilter === label ? 'bg-ink text-white' : 'bg-white/70 text-slate/70 hover:bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? <p className="mt-4 text-sm text-slate/60">Chargement...</p> : null}
        {error ? <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/80 text-xs uppercase tracking-[0.18em] text-slate/50">
                <tr>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Paiement</th>
                  <th className="px-4 py-3">SIREN</th>
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate/60" colSpan={6}>
                      Aucun client.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((row) => (
                    <tr key={row.id} className="border-t border-white/60">
                      <td className="px-4 py-3 font-semibold text-ink">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.plan}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-mint">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            row.paymentStatus === 'Validé'
                              ? 'bg-mint/15 text-mint'
                              : row.paymentStatus === 'En attente'
                              ? 'bg-amber-100 text-amber-600'
                              : row.paymentStatus === 'Refusé'
                              ? 'bg-rose-100 text-rose-500'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.siret}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  )
}
