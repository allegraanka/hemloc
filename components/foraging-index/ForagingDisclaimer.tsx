export function ForagingDisclaimer() {
  return (
    <aside
      className="rounded-3xl border border-coral/40 bg-coral/10 px-4 py-4 text-sm leading-6 text-ink sm:px-5"
      role="note"
    >
      <p className="font-semibold text-ink">Weather only</p>
      <p className="mt-2 text-ink/80">
        This tool scores recent weather and seasonality. It does not tell you what is
        out there or what is safe to pick. Use it with your own knowledge of the environment and
        what you forage, take only what you need, and follow local guidelines.
      </p>
    </aside>
  );
}
