"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  formatAirMaxMin,
  formatMmIn,
  formatShortDate,
  formatTemp,
  formatWeekdayShort,
} from "@/lib/foraging-index/format";
import { isRainDay, rainBarPercent } from "@/lib/foraging-index/lookback";
import type { DailyWeatherRow } from "@/lib/foraging-index/types";

type LookbackWeekProps = {
  id: string;
  label: string;
  days: DailyWeatherRow[];
  peakRainMm: number;
  latestRainDate: string | null;
  defaultOpen: boolean;
};

function dayCardClass(day: DailyWeatherRow, latestRainDate: string | null): string {
  if (day.date === latestRainDate) return "bg-lime/20";
  if (isRainDay(day)) return "bg-azure/10";
  return "bg-white";
}

function rainFill(day: DailyWeatherRow, latestRainDate: string | null): string {
  if (day.date === latestRainDate) return "bg-lime";
  if (isRainDay(day)) return "bg-azure";
  return "bg-ink/20";
}

export function LookbackWeek({
  id,
  label,
  days,
  peakRainMm,
  latestRainDate,
  defaultOpen,
}: LookbackWeekProps) {
  const [open, setOpen] = useState(defaultOpen);
  const first = days[0];
  const last = days[days.length - 1];
  const weekRain = days.reduce((sum, day) => sum + day.precipitationMm, 0);
  const range =
    first && last
      ? `${formatShortDate(first.date)} – ${formatShortDate(last.date)}`
      : "";

  return (
    <details
      id={id}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group border-t border-ink/8 first:border-t-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <div>
          <p className="font-medium text-ink">
            {label}
            {range ? <span className="text-muted"> · {range}</span> : null}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {formatMmIn(weekRain)} rain
          </p>
        </div>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <ol className="space-y-1.5 px-5 pb-5 sm:px-6">
        {days.map((day) => (
          <li
            key={day.date}
            className={`rounded-2xl px-3 py-2.5 ${dayCardClass(day, latestRainDate)}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-ink">
                <time dateTime={day.date}>
                  {formatWeekdayShort(day.date)} · {formatShortDate(day.date)}
                </time>
              </p>
              <p className="text-sm tabular-nums font-medium text-ink">
                {formatMmIn(day.precipitationMm)}
              </p>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/8">
              <div
                className={`h-full rounded-full ${rainFill(day, latestRainDate)}`}
                style={{
                  width: `${rainBarPercent(day.precipitationMm, peakRainMm)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              Soil {formatTemp(day.soilTempC)} · Air{" "}
              {formatAirMaxMin(day.tempMaxC, day.tempMinC)}
            </p>
          </li>
        ))}
      </ol>
    </details>
  );
}
