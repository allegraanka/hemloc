import {
  ARCHIVE_START,
  FORECAST_LOOKBACK_DAYS,
} from "@/lib/historical-weather/constants";
import type { WeatherSource } from "@/lib/historical-weather/types";

export function parseIsoDate(
  iso: string,
): { year: number; month: number; day: number } | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toIsoDate(year: number, month: number, day: number): string {
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCMonth() !== month - 1) {
    const last = new Date(Date.UTC(year, month, 0));
    return `${last.getUTCFullYear()}-${pad(last.getUTCMonth() + 1)}-${pad(last.getUTCDate())}`;
  }
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function shiftYears(iso: string, years: number): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return toIsoDate(parsed.year + years, parsed.month, parsed.day);
}

export function shiftDays(iso: string, days: number): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  const utc = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

export function todayInTimeZone(timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function browserToday(): string {
  return todayInTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
}

export function isCompleteIsoDate(iso: string): boolean {
  return parseIsoDate(iso) !== null;
}

export function isSelectableDate(iso: string, today: string): boolean {
  return isCompleteIsoDate(iso) && iso >= ARCHIVE_START && iso <= today;
}

/** Clamp a known date onto the archive window. Do not use for live typing. */
export function clampDate(iso: string, today: string): string | null {
  if (!isCompleteIsoDate(iso)) return null;
  if (iso < ARCHIVE_START) return ARCHIVE_START;
  if (iso > today) return today;
  return iso;
}

export function weatherSource(iso: string, today: string): WeatherSource {
  return iso > shiftDays(today, -FORECAST_LOOKBACK_DAYS) ? "forecast" : "archive";
}

/** Newest (today / starting date) on the left; longest ago on the right. */
export function sortNewestFirst(dates: string[]): string[] {
  return [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
}

export function defaultDates(today: string): string[] {
  return sortNewestFirst([
    today,
    clampDate(shiftYears(today, -1), today) ?? today,
  ]);
}

const ANNIVERSARY_YEARS = [1, 2, 5, 10, 20];

export function nextSuggestedDate(existing: string[], today: string): string {
  for (const years of ANNIVERSARY_YEARS) {
    const candidate = clampDate(shiftYears(today, -years), today) ?? today;
    if (!existing.includes(candidate)) return candidate;
  }
  for (let offset = 1; offset < 4000; offset += 1) {
    const candidate = clampDate(shiftDays(today, -offset), today) ?? today;
    if (!existing.includes(candidate)) return candidate;
  }
  return today;
}
