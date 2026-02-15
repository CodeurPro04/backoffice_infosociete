import { useEffect, useState } from 'react'
import { fetchAdminSubmissions } from '../api.js'
import { formatDateTime } from '../utils.js'

function getStripeStatusMeta(status) {
  const normalized = String(status || 'received').toLowerCase()

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return {
      label: 'Abonnement annulé',
      raw: normalized,
      className: 'bg-emerald-100 text-emerald-700',
    }
  }

  if (normalized === 'scheduled_cancellation') {
    return {
      label: 'Annulation programmée',
      raw: normalized,
      className: 'bg-emerald-100 text-emerald-700',
    }
  }

  if (normalized === 'no_customer') {
    return {
      label: 'Aucun client Stripe',
      raw: normalized,
      className: 'bg-slate-100 text-slate-700',
    }
  }

  if (normalized === 'no_cancellable_subscription') {
    return {
      label: 'Rien à résilier',
      raw: normalized,
      className: 'bg-blue-100 text-blue-700',
    }
  }

  if (normalized === 'no_subscription_linked') {
    return {
      label: 'Aucun abonnement lié',
      raw: normalized,
      className: 'bg-slate-100 text-slate-700',
    }
  }

  if (normalized === 'stripe_not_configured') {
    return {
      label: 'Stripe non configuré',
      raw: normalized,
      className: 'bg-amber-100 text-amber-700',
    }
  }

  if (normalized === 'partial_error') {
    return {
      label: 'Résiliation partielle',
      raw: normalized,
      className: 'bg-orange-100 text-orange-700',
    }
  }

  if (normalized.includes('failed') || normalized.includes('error')) {
    return {
      label: 'Erreur Stripe',
      raw: normalized,
      className: 'bg-rose-100 text-rose-700',
    }
  }

  return {
    label: 'Demande reçue',
    raw: normalized,
    className: 'bg-amber-100 text-amber-700',
  }
}

export default function Resiliations({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [activeRequest, setActiveRequest] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetchAdminSubmissions(token)
      .then((data) => {
        if (!mounted) return
        const submissions = Array.isArray(data?.submissions) ? data.submissions : []
        const signups = submissions.filter((item) => item.type === 'signup')
        const cancellations = submissions.filter((item) => item.type === 'cancellation')

        setRows(
          cancellations.map((item) => {
            const payload = item.payload || {}
            const signup = signups.find((s) => (s.payload?.email || '').toLowerCase() === (payload.email || '').toLowerCase())
            const sp = signup?.payload || {}

            return {
              id: item.id || `RES-${Math.random()}`,
              email: payload.email || '-',
              stripeStatus: payload.stripe_status || 'received',
              cancelledCount: Number(payload.stripe_cancelled_count || 0),
              date: formatDateTime(item.created_at),
              source: payload.source_path || '-',
              stripeDetails: payload.stripe_details || null,
              applicant: {
                firstName: sp.first_name || '-',
                lastName: sp.last_name || '-',
                phone: sp.phone || '-',
              },
            }
          }),
        )
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Impossible de charger les demandes de résiliation.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [token])

  const closeModal = () => setActiveRequest(null)

  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Résiliations</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Demandes de résiliation</h2>
          <p className="mt-1 text-sm text-slate/60">Suivi des résiliations envoyées depuis le site public.</p>
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
                  <th className="px-4 py-3">Référence</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Statut Stripe</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate/60" colSpan={5}>
                      Aucune demande de résiliation.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const statusMeta = getStripeStatusMeta(row.stripeStatus)
                    return (
                      <tr key={row.id} className="border-t border-white/60">
                        <td className="px-4 py-3 font-semibold text-ink">{row.id}</td>
                        <td className="px-4 py-3">{row.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                            title={`stripe_status: ${statusMeta.raw}`}
                          >
                            {statusMeta.label}
                          </span>
                          {row.cancelledCount > 0 ? (
                            <span className="ml-2 text-xs font-semibold text-emerald-700">({row.cancelledCount})</span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-slate/60">{row.date}</td>
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
                    )
                  })
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
                <p className="chip">Demande</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">Référence {activeRequest.id}</h3>
                <p className="mt-1 text-sm text-slate/60">{activeRequest.email}</p>
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
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Statut Stripe</p>
                <p className="mt-1 font-semibold text-ink">{getStripeStatusMeta(activeRequest.stripeStatus).label}</p>
                <p className="mt-1 text-xs text-slate/60">Code: {getStripeStatusMeta(activeRequest.stripeStatus).raw}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Abonnements annulés</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.cancelledCount}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Nom</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.lastName}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Prénom</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.firstName}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Téléphone</p>
                <p className="mt-1 font-semibold text-ink">{activeRequest.applicant.phone}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Source</p>
                <p className="mt-1 text-slate/70">{activeRequest.source}</p>
              </div>
              {activeRequest.stripeDetails?.errors?.length ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-rose-500">Erreurs Stripe</p>
                  <ul className="mt-2 list-disc pl-5 text-xs text-rose-700">
                    {activeRequest.stripeDetails.errors.map((e, i) => (
                      <li key={`${activeRequest.id}-err-${i}`}>{e}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
