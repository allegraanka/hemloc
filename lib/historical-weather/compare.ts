import { celsiusToFahrenheit } from "@/lib/foraging-index/format";
import type { DayDelta, HistoricalDay } from "@/lib/historical-weather/types";

export function pickBaseline(
  days: HistoricalDay[],
  today: string,
): HistoricalDay | null {
  if (days.length === 0) return null;
  return days.find((day) => day.date === today) ?? days[0];
}

function subtract(
  value: number | null,
  baseline: number | null,
): number | null {
  if (value === null || baseline === null) return null;
  return value - baseline;
}

export function dayDelta(
  day: HistoricalDay,
  baseline: HistoricalDay,
): DayDelta | null {
  if (day.date === baseline.date) return null;
  return {
    highF:
      day.tempMaxC === null || baseline.tempMaxC === null
        ? null
        : celsiusToFahrenheit(day.tempMaxC) -
          celsiusToFahrenheit(baseline.tempMaxC),
    lowF:
      day.tempMinC === null || baseline.tempMinC === null
        ? null
        : celsiusToFahrenheit(day.tempMinC) -
          celsiusToFahrenheit(baseline.tempMinC),
    precipMm: subtract(day.precipitationMm, baseline.precipitationMm),
  };
}
