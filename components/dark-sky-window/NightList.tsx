import {
  formatNightDate,
  formatWindowRange,
} from "@/lib/dark-sky-window/format";
import type { NightWindow } from "@/lib/dark-sky-window/types";

export function NightList({ nights }: { nights: NightWindow[] }) {
  if (nights.length === 0) {
    return (
      <p className="text-sm text-muted">No night hours in this forecast yet.</p>
    );
  }

  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Nights
      </h2>
      <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Best stretch
      </p>
      <ul className="mt-4 grid gap-3">
        {nights.map((night) => (
          <li key={night.nightOf}>
            <a
              href={`#night-${night.nightOf}`}
              className="block rounded-2xl border border-ink/8 bg-white px-4 py-3 transition-colors hover:border-ink/20"
            >
              <p className="text-sm font-medium text-ink">
                {formatNightDate(night.nightOf)} ·{" "}
                {formatWindowRange(night.start, night.end)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {night.band} · {night.meanScore} / 100 · {night.hourCount} hours
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
