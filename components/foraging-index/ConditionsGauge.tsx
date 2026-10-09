import type { ConditionBand, ForagingConditions } from "@/lib/foraging-index/types";

const BAND_FILL: Record<ConditionBand, string> = {
  Skip: "bg-coral",
  Marginal: "bg-[#e8a317]",
  "Worth a look": "bg-azure",
  "Strong window": "bg-lime",
};

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

export function ConditionsGauge({
  conditions,
}: {
  conditions: ForagingConditions;
}) {
  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Conditions
          </h2>
          <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {conditions.band}
          </p>
        </div>
        <p className="rounded-full bg-ink px-3 py-1 text-sm font-medium text-cream">
          {conditions.season}
        </p>
      </div>

      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-ink/8"
        role="meter"
        aria-label="Foraging weather score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={conditions.score}
        aria-valuetext={`${conditions.band}, ${conditions.score} of 100, ${conditions.season}`}
      >
        <div
          className={`h-full rounded-full ${BAND_FILL[conditions.band]}`}
          style={{ width: `${conditions.score}%` }}
        />
      </div>
      <p className="mt-2 text-sm tabular-nums text-muted">
        {conditions.score} / 100 · weather and season only
      </p>

      <p className="mt-4 text-sm leading-6 text-ink/80">{conditions.summary}</p>

      <div className="mt-6 space-y-4">
        {conditions.factors.map((factor) => (
          <FactorRow
            key={factor.id}
            label={factor.label}
            score={factor.score}
            note={factor.note}
          />
        ))}
      </div>

      <p className="mt-6 text-xs leading-5 text-muted">
        Season is taken from the lookback dates. Local knowledge still decides
        whether a walk is worthwhile.
      </p>
    </section>
  );
}
