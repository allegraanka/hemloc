"use client";

import { DateField } from "@/components/historical-weather/DateField";
import { DayStat } from "@/components/historical-weather/DayStat";
import { formatAirMaxMin, formatTemp } from "@/lib/foraging-index/format";
import { FROST_C } from "@/lib/historical-weather/constants";
import {
  formatClock,
  formatLongDate,
  formatPrecip,
  formatSignedF,
  formatSignedInches,
  formatSnowCm,
  formatSunshine,
  formatWindKmh,
} from "@/lib/historical-weather/format";
import { weatherCodeLabel } from "@/lib/historical-weather/weather-code";
import type { DayDelta, HistoricalDay } from "@/lib/historical-weather/types";

type DayColumnProps = {
  date: string;
  day: HistoricalDay | null;
  today: string;
  isBaseline: boolean;
  delta: DayDelta | null;
  baselineLabel: string;
  canRemove: boolean;
  disabled?: boolean;
  onChangeDate: (iso: string) => void;
  onRemove: () => void;
};

function frost(day: HistoricalDay): boolean {
  return day.tempMinC !== null && day.tempMinC <= FROST_C;
}

export function DayColumn({
  date,
  day,
  today,
  isBaseline,
  delta,
  baselineLabel,
  canRemove,
  disabled = false,
  onChangeDate,
  onRemove,
}: DayColumnProps) {
  const vs = isBaseline ? null : baselineLabel;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white/80 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Date
          <DateField
            value={date}
            max={today}
            disabled={disabled}
            onCommit={onChangeDate}
            className="mt-1 w-full rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink disabled:opacity-60"
          />
        </label>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="mt-5 shrink-0 rounded-full px-2 py-1 text-xs font-medium text-muted hover:text-ink disabled:opacity-50"
          >
            Remove
          </button>
        ) : null}
      </div>

      <p className="font-display mt-3 text-lg font-bold tracking-tight text-ink">
        {formatLongDate(date)}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {date === today ? (
          <span className="rounded-full bg-azure px-2 py-0.5 text-xs font-semibold text-cream">
            Today
          </span>
        ) : null}
        {isBaseline ? (
          <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-semibold text-ink">
            Comparison base
          </span>
        ) : null}
        {day && frost(day) ? (
          <span className="rounded-full bg-coral/15 px-2 py-0.5 text-xs font-semibold text-ink">
            Frost
          </span>
        ) : null}
        {day ? (
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-muted">
            {day.source === "forecast" ? "Recent / forecast" : "Archive"}
          </span>
        ) : null}
      </div>

      {!day ? (
        <p className="mt-6 text-sm text-muted" role="status">
          Loading this date…
        </p>
      ) : day.missing ? (
        <p className="mt-6 text-sm text-muted">No daily values for this date.</p>
      ) : (
        <dl className="mt-5 grid gap-4">
          <DayStat label="Sky" value={weatherCodeLabel(day.weatherCode)} />
          <DayStat
            label="High / low"
            value={formatAirMaxMin(day.tempMaxC, day.tempMinC)}
            hint={
              delta?.highF != null
                ? `High ${formatSignedF(delta.highF)} vs ${vs}`
                : null
            }
          />
          <DayStat
            label="Feels like"
            value={formatAirMaxMin(day.apparentMaxC, day.apparentMinC)}
          />
          <DayStat
            label="Precipitation"
            value={formatPrecip(day.precipitationMm)}
            hint={
              delta?.precipMm != null
                ? `${formatSignedInches(delta.precipMm)} vs ${vs}`
                : null
            }
          />
          <DayStat label="Snow" value={formatSnowCm(day.snowfallCm)} />
          <DayStat label="Wind (max)" value={formatWindKmh(day.windMaxKmh)} />
          <DayStat label="Gusts" value={formatWindKmh(day.windGustsKmh)} />
          <DayStat
            label="Sunshine"
            value={formatSunshine(day.sunshineSeconds)}
          />
          <DayStat
            label="Sunrise / sunset"
            value={`${formatClock(day.sunrise)} · ${formatClock(day.sunset)}`}
          />
          {delta?.lowF != null ? (
            <DayStat
              label="Low vs comparison"
              value={formatSignedF(delta.lowF)}
              hint={`Overnight ${formatTemp(day.tempMinC)}`}
            />
          ) : null}
        </dl>
      )}
    </article>
  );
}
