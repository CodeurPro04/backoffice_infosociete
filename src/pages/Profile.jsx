export default function Profile() {
  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="chip">Profil</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Profil administrateur</h2>
          <p className="mt-1 text-sm text-slate/60">Informations personnelles et accÃ¨s.</p>
        </div>
        <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft" type="button">
          Sauvegarder
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card px-6 py-6">
          <h3 className="font-display text-lg font-semibold text-ink">Informations gÃ©nÃ©rales</h3>
          <div className="mt-5 space-y-4 text-sm">
            {['Nom', 'PrÃ©nom', 'Email', 'TÃ©lÃ©phone'].map((label) => (
              <label key={label} className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-slate/50">{label}</span>
                <input className="mt-2 w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-2" />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-card px-6 py-6">
            <h3 className="font-display text-lg font-semibold text-ink">SÃ©curitÃ©</h3>
            <div className="mt-4 space-y-3 text-sm text-slate/70">
              {['Mot de passe', 'Double authentification', 'Appareils connectÃ©s'].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3"
                >
                  <span>{label}</span>
                  <button className="rounded-full bg-wave px-3 py-1 text-xs font-semibold text-white" type="button">
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card px-6 py-6">
            <h3 className="font-display text-lg font-semibold text-ink">PrÃ©fÃ©rences</h3>
            <p className="mt-2 text-sm text-slate/60">
              GÃ©rez vos accÃ¨s et prÃ©fÃ©rences personnelles depuis cet espace.
            </p>
            <button className="mt-5 w-full rounded-2xl bg-wave px-4 py-2 text-sm font-semibold text-white" type="button">
              Mettre Ã  jour
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
