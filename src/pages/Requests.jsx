import { useEffect, useMemo, useState } from 'react'
import { fetchAdminSubmissions } from '../api.js'
import { formatDateTime, mapKbisStatusFromPayment } from '../utils.js'

export default function Requests({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requests, setRequests] = useState([])
  const [activeRequest, setActiveRequest] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetchAdminSubmissions(token)
      .then((data) => {
        if (!mounted) return
        const submissions = Array.isArray(data?.submissions) ? data.submissions : []
        const payments = submissions.filter((item) => item.type === 'payment')
        const kbis = submissions.filter((item) => item.type === 'kbis_request')
        const makeKey = (siret, email) => `${(siret || '').toString().trim()}::${(email || '').toString().trim().toLowerCase()}`

        const rows = []
        const seen = new Set()

        kbis.forEach((item) => {
          const p = item.payload || {}
          const payment = payments.find((row) => {
            const pp = row.payload || {}
            return pp.siret_or_siren === p.siret_or_siren && pp.email === p.email
          })
          const key = makeKey(p.siret_or_siren, p.email)
          seen.add(key)

          rows.push({
            ref: `KBIS-${item.id}`,
            id: p.siret_or_siren || '-',
            company: p.company_name || '-',
            status: mapKbisStatusFromPayment(payment?.payload?.status),
            date: formatDateTime(item.created_at),
            createdAtRaw: item.created_at || '',
            amount: payment?.payload?.amount ? `${payment.payload.amount} €` : '1,49 €',
            applicant: {
              firstName: p.first_name || '-',
              lastName: p.last_name || '-',
              email: p.email || '-',
              phone: p.phone || '-',
              profile: p.profile || '-',
              address: p.address || '-',
            },
          })
        })

        payments.forEach((item) => {
          const p = item.payload || {}
          const key = makeKey(p.siret_or_siren, p.email)

          // Ajoute aussi les paiements (validés ou en attente) sans ligne kbis existante
          if (seen.has(key)) return

          rows.push({
            ref: `PAY-${item.id}`,
            id: p.siret_or_siren || '-',
            company: p.company_name || '-',
            status: mapKbisStatusFromPayment(p.status),
            date: formatDateTime(item.created_at),
            createdAtRaw: item.created_at || '',
            amount: p.amount ? `${p.amount} €` : '1,49 €',
            applicant: {
              firstName: p.first_name || '-',
              lastName: p.last_name || '-',
              email: p.email || '-',
              phone: p.phone || '-',
              profile: p.profile || '-',
              address: p.address || '-',
            },
          })
        })

        rows.sort((a, b) => {
          const da = Date.parse(a.createdAtRaw || '')
          const db = Date.parse(b.createdAtRaw || '')
          if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da
          return 0
        })

        setRequests(rows)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Impossible de charger les demandes.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [token])

  const stats = useMemo(() => ({
    total: requests.length,
    done: requests.filter((r) => r.status === 'Validée').length,
    waiting: requests.filter((r) => r.status === 'En attente').length,
  }), [requests])

  const closeModal = () => setActiveRequest(null)

  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Demandes</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Demandes Kbis</h2>
          <p className="mt-1 text-sm text-slate/60">Suivi et validation des demandes reçues.</p>
        </div>
        <div className="text-sm text-slate/70">
          Total: <strong>{stats.total}</strong> · Validées: <strong>{stats.done}</strong> · En attente:{' '}
          <strong>{stats.waiting}</strong>
        </div>
      </header>

      <section className="glass-card px-6 py-6">
        {loading ? <p className="text-sm text-slate/60">Chargement...</p> : null}
        {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-2 overflow-hidden rounded-2xl border border-white/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/80 text-xs uppercase tracking-[0.18em] text-slate/50">
                <tr>
                  <th className="px-4 py-3">SIREN</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {requests.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate/60" colSpan={6}>
                      Aucune demande Kbis.
                    </td>
                  </tr>
                ) : (
                  requests.map((row) => (
                    <tr key={`${row.ref}-${row.date}`} className="border-t border-white/60">
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
                      <td className="px-4 py-3 text-slate/60">{row.date}</td>
                      <td className="px-4 py-3">{row.amount}</td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded-xl bg-wave px-3 py-1 text-xs font-semibold text-white"
                          type="button"
                          onClick={() => setActiveRequest(row)}
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {activeRequest ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/40 px-4 py-8">
          <div className="glass-card w-full max-w-md px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="chip">Demandeur</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{activeRequest.company}</h3>
                <p className="mt-1 text-sm text-slate/60">SIREN : {activeRequest.id}</p>
              </div>
              <button
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-sm font-semibold text-slate/70"
                type="button"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Nom</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.lastName}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Prénom</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.firstName}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Email</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.email}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Téléphone</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.phone}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Adresse</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.address}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
