import {
  RAIN_DAY_MM,
  SOIL_CHART_MAX_C,
} from "@/lib/foraging-index/constants";
import type { DailyWeatherRow } from "@/lib/foraging-index/types";

export type LookbackWeekGroup = {
  id: string;
  label: string;
  days: DailyWeatherRow[];
};

export function isRainDay(day: DailyWeatherRow): boolean {
  return day.precipitationMm >= RAIN_DAY_MM;
}

export function lastRainDate(days: DailyWeatherRow[]): string | null {
  for (let i = days.length - 1; i >= 0; i -= 1) {
    const day = days[i];
    if (day && isRainDay(day)) return day.date;
  }
  return null;
}

export function maxRainMm(days: DailyWeatherRow[]): number {
  return Math.max(...days.map((day) => day.precipitationMm), 1);
}

export function rainBarPercent(mm: number, peakMm: number): number {
  if (peakMm <= 0) return 8;
  return Math.max((mm / peakMm) * 100, mm > 0 ? 12 : 8);
}

export function soilBarPercent(tempC: number | null): number {
  if (tempC === null) return 8;
  return Math.min(100, Math.max((tempC / SOIL_CHART_MAX_C) * 100, 8));
}

export function splitLookbackWeeks(days: DailyWeatherRow[]): LookbackWeekGroup[] {
  if (days.length === 0) return [];
  const latest = days.slice(-7);
  const earlier = days.slice(0, Math.max(0, days.length - 7));
  const groups: LookbackWeekGroup[] = [];
  const firstLatest = latest[0];
  if (firstLatest) {
    groups.push({
      id: `lookback-${firstLatest.date}-latest`,
      label: "Latest 7 days",
      days: latest,
    });
  }
  const firstEarlier = earlier[0];
  if (firstEarlier) {
    groups.push({
      id: `lookback-${firstEarlier.date}-earlier`,
      label: "Earlier in the window",
      days: earlier,
    });
  }
  return groups;
}
