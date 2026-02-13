const payments = [
  { id: 'TRX-10941', company: 'TotalEnergies SE', method: 'CB', status: 'Validé', amount: '1,49 €', date: '11/02/2026' },
  { id: 'TRX-10942', company: 'VINCI', method: 'CB', status: 'En attente', amount: '1,49 €', date: '11/02/2026' },
  { id: 'TRX-10943', company: 'AXA', method: 'CB', status: 'Refusé', amount: '1,49 €', date: '10/02/2026' },
]

export default function Payments() {
  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Paiements</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Transactions</h2>
          <p className="mt-1 text-sm text-slate/60">Suivi des encaissements et des anomalies.</p>
        </div>
        <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft" type="button">
          Exporter
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total encaissé', value: '6 120 €' },
          { label: 'En attente', value: '8 paiements' },
          { label: 'Refusés', value: '2 paiements' },
        ].map((card) => (
          <div key={card.label} className="glass-card px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate/50">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="glass-card px-6 py-6">
        <div className="mt-2 overflow-hidden rounded-2xl border border-white/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/80 text-xs uppercase tracking-[0.18em] text-slate/50">
              <tr>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Entreprise</th>
                <th className="px-4 py-3">Méthode</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white/60">
              {payments.map((row) => (
                <tr key={row.id} className="border-t border-white/60">
                  <td className="px-4 py-3 font-semibold text-ink">{row.id}</td>
                  <td className="px-4 py-3">{row.company}</td>
                  <td className="px-4 py-3">{row.method}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === 'Validé'
                          ? 'bg-mint/15 text-mint'
                          : row.status === 'Refusé'
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
