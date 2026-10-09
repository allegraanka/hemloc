import { PRIME_SCORE } from "@/lib/dark-sky-window/constants";
import { bandFor } from "@/lib/dark-sky-window/bands";
import type { HourlySkyRow, NightWindow } from "@/lib/dark-sky-window/types";

function previousDate(isoDate: string): string {
  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const utc = Date.UTC(year, month - 1, day);
  return new Date(utc - 86400000).toISOString().slice(0, 10);
}

export function nightKey(iso: string): string {
  const hour = Number(iso.slice(11, 13));
  const date = iso.slice(0, 10);
  if (hour >= 12) return date;
  return previousDate(date);
}

function meanScore(hours: HourlySkyRow[]): number {
  if (hours.length === 0) return 0;
  return hours.reduce((sum, hour) => sum + hour.score, 0) / hours.length;
}

function topStretch(hours: HourlySkyRow[], length: number): HourlySkyRow[] {
  if (hours.length === 0) return [];
  const size = Math.min(length, hours.length);
  let best = hours.slice(0, size);
  let bestMean = meanScore(best);
  for (let i = 1; i <= hours.length - size; i += 1) {
    const slice = hours.slice(i, i + size);
    const mean = meanScore(slice);
    if (mean > bestMean) {
      best = slice;
      bestMean = mean;
    }
  }
  return best;
}

export function windowsForNight(hours: HourlySkyRow[]): NightWindow[] {
  const nights = new Map<string, HourlySkyRow[]>();
  for (const hour of hours) {
    if (hour.isDay) continue;
    const key = nightKey(hour.time);
    const list = nights.get(key) ?? [];
    list.push(hour);
    nights.set(key, list);
  }

  const windows: NightWindow[] = [];
  for (const [nightOf, list] of nights) {
    let best: HourlySkyRow[] = [];
    let current: HourlySkyRow[] = [];
    for (const hour of list) {
      if (hour.score >= PRIME_SCORE) {
        current.push(hour);
        if (
          current.length > best.length ||
          (current.length === best.length && meanScore(current) > meanScore(best))
        ) {
          best = current;
        }
      } else {
        current = [];
      }
    }
    const stretch = best.length >= 2 ? best : topStretch(list, 2);
    const start = stretch[0];
    const end = stretch[stretch.length - 1];
    if (!start || !end) continue;
    const mean = meanScore(stretch);
    windows.push({
      nightOf,
      start: start.time,
      end: end.time,
      meanScore: Math.round(mean),
      band: bandFor(mean),
      hourCount: stretch.length,
    });
  }
  return windows;
}

function localIsoToUtcMs(iso: string, utcOffsetSeconds: number): number {
  const withSeconds = iso.length === 16 ? `${iso}:00` : iso;
  const asUtc = Date.parse(`${withSeconds}Z`);
  if (Number.isNaN(asUtc)) return Date.parse(iso);
  return asUtc - utcOffsetSeconds * 1000;
}

export function nextWindow(
  windows: NightWindow[],
  utcOffsetSeconds: number,
): NightWindow | null {
  return upcomingWindows(windows, utcOffsetSeconds)[0] ?? windows[0] ?? null;
}

export function upcomingWindows(
  windows: NightWindow[],
  utcOffsetSeconds: number,
): NightWindow[] {
  const now = Date.now();
  return windows.filter(
    (window) => localIsoToUtcMs(window.end, utcOffsetSeconds) >= now,
  );
}

export function groupNightHours(
  hours: HourlySkyRow[],
): Array<{ nightOf: string; hours: HourlySkyRow[] }> {
  const nights = new Map<string, HourlySkyRow[]>();
  for (const hour of hours) {
    if (hour.isDay) continue;
    const key = nightKey(hour.time);
    const list = nights.get(key) ?? [];
    list.push(hour);
    nights.set(key, list);
  }
  return [...nights.entries()].map(([nightOf, nightHours]) => ({
    nightOf,
    hours: nightHours,
  }));
}

export function hourInWindow(
  time: string,
  window: NightWindow | undefined,
): boolean {
  if (!window) return false;
  return time >= window.start && time <= window.end;
}
