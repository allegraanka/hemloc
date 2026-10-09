import { BAND_FILL } from "@/lib/dark-sky-window/bands";
import type { DarkSkySnapshot } from "@/lib/dark-sky-window/types";

function FactorRow({
  label,
  score,
  note,
}: {
  label: string;
  score: number;
  note: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-sm tabular-nums text-muted">{score}</p>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full bg-ink/45"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs leading-5 text-muted">{note}</p>
    </div>
  );
}

export function NightGauge({ sky }: { sky: DarkSkySnapshot }) {
  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Conditions
          </h2>
          <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {sky.overallBand}
          </p>
        </div>
      </div>
      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-ink/8"
        role="meter"
        aria-label="Dark sky window score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={sky.overallScore}
        aria-valuetext={`${sky.overallBand}, ${sky.overallScore} of 100`}
      >
        <div
          className={`h-full rounded-full ${BAND_FILL[sky.overallBand]}`}
          style={{ width: `${sky.overallScore}%` }}
        />
      </div>
      <p className="mt-2 text-sm tabular-nums text-muted">
        {sky.overallScore} / 100 · next night window
      </p>
      <div className="mt-6 space-y-4">
        {sky.factors.map((factor) => (
          <FactorRow
            key={factor.id}
            label={factor.label}
            score={factor.score}
            note={factor.note}
          />
        ))}
      </div>
    </section>
  );
}
