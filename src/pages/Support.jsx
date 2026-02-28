const tickets = [
  { id: 'SUP-204', subject: 'Remboursement demandÃ©', status: 'Ouvert', owner: 'Noreen K.' },
  { id: 'SUP-205', subject: 'Erreur de facturation', status: 'En cours', owner: 'Alex P.' },
  { id: 'SUP-206', subject: 'Kbis non reÃ§u', status: 'Ouvert', owner: 'Dana L.' },
]

export default function Support() {
  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Support</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Centre de support</h2>
          <p className="mt-1 text-sm text-slate/60">Gestion des tickets et prioritÃ©s.</p>
        </div>
        <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft" type="button">
          Nouveau ticket
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card px-6 py-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">Tickets actifs</h3>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">3 ouverts</span>
          </div>
          <div className="mt-5 space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-white/60 bg-white/70 px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{ticket.subject}</p>
                  <span className="text-xs text-slate/60">{ticket.id}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate/60">
                  <span>AssignÃ© Ã  {ticket.owner}</span>
                  <span>{ticket.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card px-6 py-6">
          <h3 className="font-display text-lg font-semibold text-ink">Vue Ã©quipe</h3>
          <div className="mt-4 space-y-4 text-sm text-slate/70">
            <div className="flex items-center justify-between">
              <span>Noreen K.</span>
              <span className="font-semibold text-ink">4 tickets</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Alex P.</span>
              <span className="font-semibold text-ink">2 tickets</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dana L.</span>
              <span className="font-semibold text-ink">1 ticket</span>
            </div>
          </div>
          <button className="mt-6 w-full rounded-2xl bg-wave px-4 py-2 text-sm font-semibold text-white" type="button">
            Ouvrir la boÃ®te de rÃ©ception
          </button>
        </div>
      </section>
    </div>
  )
}
