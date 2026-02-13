import { useEffect, useMemo, useState } from 'react'
import { fetchAdminSubmissions } from '../api.js'
import { formatDateTime, mapKbisStatusFromPayment } from '../utils.js'

export default function Dashboard({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetchAdminSubmissions(token)
      .then((data) => {
        if (!mounted) return
        setItems(Array.isArray(data?.submissions) ? data.submissions : [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Impossible de charger les données.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [token])

  const stats = useMemo(() => {
    const totalKbis = items.filter((item) => item.type === 'kbis_request').length
    const totalPayments = items.filter((item) => item.type === 'payment' && (item.payload?.status || '').toLowerCase() === 'succeeded').length
    return [
      { label: 'Demandes Kbis', value: totalKbis.toString() },
      { label: 'Paiements validés', value: totalPayments.toString() },
    ]
  }, [items])

  const recentRows = useMemo(() => {
    const payments = items.filter((item) => item.type === 'payment')
    const kbis = items.filter((item) => item.type === 'kbis_request').slice(0, 8)

    return kbis.map((request) => {
      const payload = request.payload || {}
      const linkedPayment = payments.find((payment) => {
        const pp = payment.payload || {}
        return pp.siret_or_siren === payload.siret_or_siren && pp.email === payload.email
      })

      return {
        id: payload.siret_or_siren || '-',
        company: payload.company_name || '-',
        status: mapKbisStatusFromPayment(linkedPayment?.payload?.status),
        amount: linkedPayment?.payload?.amount ? `${linkedPayment.payload.amount} €` : '1,49 €',
        date: formatDateTime(request.created_at),
      }
    })
  }, [items])

  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Vue globale</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Tableau de bord</h2>
          <p className="mt-1 text-sm text-slate/60">Suivi en temps réel des opérations principales.</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {stats.map((item) => (
          <div key={item.label} className="glass-card px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate/50">{item.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-semibold text-ink">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6">
        <div className="glass-card px-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">Demandes récentes</h3>
          </div>

          {loading ? <p className="mt-4 text-sm text-slate/60">Chargement...</p> : null}
          {error ? <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p> : null}

          {!loading && !error ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/60">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.18em] text-slate/50">
                  <tr>
                    <th className="px-4 py-3">SIREN</th>
                    <th className="px-4 py-3">Entreprise</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Montant</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white/60">
                  {recentRows.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-slate/60" colSpan={5}>
                        Aucune demande.
                      </td>
                    </tr>
                  ) : (
                    recentRows.map((row) => (
                      <tr key={`${row.id}-${row.date}`} className="border-t border-white/60">
                        <td className="px-4 py-3 font-semibold text-ink">{row.id}</td>
                        <td className="px-4 py-3">{row.company}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              row.status === 'Validée'
                                ? 'bg-mint/15 text-mint'
                                : row.status === 'Refusée'
                                ? 'bg-rose-100 text-rose-500'
                                : 'bg-amber-100 text-amber-600'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{row.amount}</td>
                        <td className="px-4 py-3 text-slate/60">{row.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
