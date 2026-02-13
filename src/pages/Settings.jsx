export default function Settings() {
  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Paramètres</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Configuration</h2>
          <p className="mt-1 text-sm text-slate/60">Ajustez les préférences et accès du back office.</p>
        </div>
        <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft" type="button">
          Sauvegarder
        </button>
      </header>

      <section className="glass-card grid gap-6 px-6 py-6 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Informations générales</h3>
          <div className="mt-4 space-y-3 text-sm">
            {['Nom de la société', 'Email support', 'Téléphone support'].map((label) => (
              <label key={label} className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-slate/50">{label}</span>
                <input className="mt-2 w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-2" />
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Notifications</h3>
          <div className="mt-4 space-y-3 text-sm text-slate/70">
            {['Alertes paiement', 'Alertes support', 'Synchronisation quotidienne'].map((label) => (
              <label key={label} className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                <span>{label}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#1e5b86]" />
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
