"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BAND_FILL, bandFor } from "@/lib/dark-sky-window/bands";
import {
  formatHour,
  formatHourCompact,
  formatNightDate,
  formatPercent,
  formatWindowRange,
} from "@/lib/dark-sky-window/format";
import { hourInWindow } from "@/lib/dark-sky-window/windows";
import type { HourlySkyRow, NightWindow } from "@/lib/dark-sky-window/types";

type NightHourGroupProps = {
  nightOf: string;
  label: string;
  hours: HourlySkyRow[];
  stretch?: NightWindow;
  defaultOpen: boolean;
};

function hourDetail(hour: HourlySkyRow): string {
  const clouds = `${formatPercent(hour.cloudCover)} clouds`;
  if (hour.precipitationMm > 0.05) return `${clouds} · rain`;
  return clouds;
}

export function NightHourGroup({
  nightOf,
  label,
  hours,
  stretch,
  defaultOpen,
}: NightHourGroupProps) {
  const headingId = `night-${nightOf}`;
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const openFromHash = () => {
      if (globalThis.location.hash === `#${headingId}`) setOpen(true);
    };
    openFromHash();
    globalThis.addEventListener("hashchange", openFromHash);
    return () => globalThis.removeEventListener("hashchange", openFromHash);
  }, [headingId]);

  return (
    <details
      id={headingId}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group scroll-mt-24 border-t border-ink/8 first:border-t-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <div>
          <p className="font-medium text-ink">
            {label}
            <span className="text-muted"> · {formatNightDate(nightOf)}</span>
          </p>
          {stretch ? (
            <p className="mt-0.5 text-xs text-muted">
              Best {formatWindowRange(stretch.start, stretch.end)} · {stretch.band}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted">
              {hours.length} night hours
            </p>
          )}
        </div>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <div className="px-5 pb-5 sm:px-6">
        <div
          className="flex h-20 items-end gap-0.5 sm:h-24 sm:gap-1"
          role="img"
          aria-label={`Score shape for ${label}, ${formatNightDate(nightOf)}`}
        >
          {hours.map((hour) => {
            const band = bandFor(hour.score);
            const best = hourInWindow(hour.time, stretch);
            return (
              <div
                key={hour.time}
                className="flex min-w-0 flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-14 w-full items-end justify-center sm:h-16">
                  <div
                    className={`w-full max-w-6 rounded-t-sm sm:max-w-8 ${BAND_FILL[band]} ${best ? "ring-1 ring-ink/40" : "opacity-80"}`}
                    style={{ height: `${Math.max(hour.score, 8)}%` }}
                  />
                </div>
                <span className="text-[10px] tabular-nums text-muted">
                  {formatHourCompact(hour.time)}
                </span>
              </div>
            );
          })}
        </div>

        <ol className="mt-4 space-y-1.5">
          {hours.map((hour) => {
            const band = bandFor(hour.score);
            const best = hourInWindow(hour.time, stretch);
            return (
              <li
                key={hour.time}
                className={`rounded-2xl px-3 py-2.5 ${best ? "bg-lime/20" : "bg-white"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-ink">
                    <time dateTime={hour.time}>{formatHour(hour.time)}</time>
                    <span className="ml-2 text-xs font-normal text-muted">
                      {band}
                    </span>
                  </p>
                  <p className="text-sm tabular-nums font-medium text-ink">
                    {hour.score}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/8">
                  <div
                    className={`h-full rounded-full ${BAND_FILL[band]}`}
                    style={{ width: `${hour.score}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{hourDetail(hour)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </details>
  );
}
