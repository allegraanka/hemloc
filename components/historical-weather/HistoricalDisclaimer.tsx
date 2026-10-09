export function HistoricalDisclaimer() {
  return (
    <aside
      className="rounded-3xl border border-coral/40 bg-coral/10 px-4 py-4 text-sm leading-6 text-ink sm:px-5"
      role="note"
    >
      <p className="font-semibold text-ink">Modeled daily weather</p>
      <p className="mt-2 text-ink/80">
        Values come from Open-Meteo’s archive (roughly 1940 through a few days
        ago) and forecast (today and the last few days) endpoints. This is
        reanalysis and model data, not a substitute for a local station or
        National Weather Service records. A frost badge means the overnight low
        was at or below freezing.
      </p>
    </aside>
  );
}
