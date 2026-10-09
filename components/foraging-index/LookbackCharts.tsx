import { formatDayNumber } from "@/lib/foraging-index/format";
import {
  isRainDay,
  rainBarPercent,
  soilBarPercent,
} from "@/lib/foraging-index/lookback";
import type { DailyWeatherRow } from "@/lib/foraging-index/types";

type LookbackChartsProps = {
  days: DailyWeatherRow[];
  peakRainMm: number;
  latestRainDate: string | null;
};

function rainFill(day: DailyWeatherRow, latestRainDate: string | null): string {
  if (day.date === latestRainDate) return "bg-lime";
  if (isRainDay(day)) return "bg-azure";
  return "bg-ink/15";
}

export function LookbackCharts({
  days,
  peakRainMm,
  latestRainDate,
}: LookbackChartsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Rain
        </p>
        <div
          className="mt-2 flex h-20 items-end gap-0.5 sm:h-24 sm:gap-1"
          role="img"
          aria-label="Daily rainfall for the lookback"
        >
          {days.map((day) => (
            <div
              key={`rain-${day.date}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <div className="flex h-14 w-full items-end justify-center sm:h-16">
                <div
                  className={`w-full max-w-6 rounded-t-sm sm:max-w-8 ${rainFill(day, latestRainDate)}`}
                  style={{
                    height: `${rainBarPercent(day.precipitationMm, peakRainMm)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] tabular-nums text-muted">
                {formatDayNumber(day.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Soil 0–10 cm
        </p>
        <div
          className="mt-2 flex h-16 items-end gap-0.5 sm:h-20 sm:gap-1"
          role="img"
          aria-label="Daily soil temperature for the lookback"
        >
          {days.map((day) => (
            <div
              key={`soil-${day.date}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <div className="flex h-10 w-full items-end justify-center sm:h-12">
                <div
                  className="w-full max-w-6 rounded-t-sm bg-mint sm:max-w-8"
                  style={{ height: `${soilBarPercent(day.soilTempC)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
