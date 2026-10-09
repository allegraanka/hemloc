import { LookbackCharts } from "@/components/foraging-index/LookbackCharts";
import { LookbackWeek } from "@/components/foraging-index/LookbackWeek";
import { RECENT_DAY_COUNT } from "@/lib/foraging-index/constants";
import { formatMmIn } from "@/lib/foraging-index/format";
import {
  lastRainDate,
  maxRainMm,
  splitLookbackWeeks,
} from "@/lib/foraging-index/lookback";
import type { DailyWeatherRow } from "@/lib/foraging-index/types";

export function DailyTable({ days }: { days: DailyWeatherRow[] }) {
  const totalRainfallMm = days.reduce((sum, day) => sum + day.precipitationMm, 0);
  const peakRainMm = maxRainMm(days);
  const latestRain = lastRainDate(days);
  const weeks = splitLookbackWeeks(days);

  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Day by day
        </h2>
        <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {RECENT_DAY_COUNT}-day lookback
        </p>
        <p className="mt-1 text-sm text-muted">
          Total rain {formatMmIn(totalRainfallMm)}. Highlighted days had
          measurable rain; lime is the most recent rainfall.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-lime" />
            Latest rain
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-azure" />
            Rain day
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-ink/20" />
            Dry
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-mint" />
            Soil warmth
          </li>
        </ul>
        <div className="mt-5">
          <LookbackCharts
            days={days}
            peakRainMm={peakRainMm}
            latestRainDate={latestRain}
          />
        </div>
      </div>

      {weeks.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted sm:px-6">
          No daily weather in this lookback yet.
        </p>
      ) : (
        <div className="mt-4">
          {weeks.map((week, index) => (
            <LookbackWeek
              key={week.id}
              id={week.id}
              label={week.label}
              days={week.days}
              peakRainMm={peakRainMm}
              latestRainDate={latestRain}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
