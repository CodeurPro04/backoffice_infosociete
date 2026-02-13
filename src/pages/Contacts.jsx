import { useEffect, useState } from 'react'
import { fetchAdminSubmissionsByType } from '../api.js'
import { formatDateTime } from '../utils.js'

export default function Contacts({ token }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetchAdminSubmissionsByType(token, 'contact')
      .then((data) => {
        if (!mounted) return
        const items = Array.isArray(data?.submissions) ? data.submissions : []
        setContacts(
          items.map((item) => {
            const p = item.payload || {}
            return {
              id: item.id,
              name: p.name || '-',
              email: p.email || '-',
              subject: p.subject || '-',
              date: formatDateTime(item.created_at),
              message: p.message || '-',
              company: p.company || '-',
            }
          }),
        )
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Impossible de charger les contacts.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [token])

  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Contacts</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Messages de contact</h2>
          <p className="mt-1 text-sm text-slate/60">Suivi des messages envoyés via le formulaire de contact.</p>
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
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Objet</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {contacts.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate/60" colSpan={6}>
                      Aucun contact.
                    </td>
                  </tr>
                ) : (
                  contacts.map((row) => (
                    <tr key={row.id} className="border-t border-white/60">
                      <td className="px-4 py-3 font-semibold text-ink">{row.id}</td>
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.subject}</td>
                      <td className="px-4 py-3 text-slate/60">{row.date}</td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded-xl bg-wave px-3 py-1 text-xs font-semibold text-white"
                          type="button"
                          onClick={() => setActiveContact(row)}
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

      {activeContact ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/40 px-4 py-8">
          <div className="glass-card w-full max-w-md px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="chip">Contact</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{activeContact.subject}</h3>
                <p className="mt-1 text-sm text-slate/60">{activeContact.email}</p>
              </div>
              <button
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-sm font-semibold text-slate/70"
                type="button"
                onClick={() => setActiveContact(null)}
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Nom</p>
                <p className="mt-1 font-semibold text-ink">{activeContact.name}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Entreprise</p>
                <p className="mt-1 font-semibold text-ink">{activeContact.company}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate/50">Message</p>
                <p className="mt-1 text-slate/70">{activeContact.message}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
