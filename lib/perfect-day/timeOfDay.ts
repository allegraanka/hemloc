export const TIME_OF_DAY = [
  "morning",
  "afternoon",
  "evening",
  "night",
] as const;

export type TimeOfDay = (typeof TIME_OF_DAY)[number];

export const TIME_OF_DAY_LABEL: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export const ACTIVITY_PREFIX: Record<TimeOfDay, string> = {
  morning: "Perfect morning for ",
  afternoon: "Perfect afternoon for ",
  evening: "Perfect evening for ",
  night: "Perfect night for ",
};

export function hourFromLocalIso(iso: string): number | null {
  const hour = Number(iso.slice(11, 13));
  return Number.isNaN(hour) ? null : hour;
}

export function formatClock(iso: string): string {
  const hour = hourFromLocalIso(iso);
  if (hour === null) return "";
  const minute = iso.slice(14, 16);
  const mins = minute === "" || Number.isNaN(Number(minute)) ? "00" : minute;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${mins} ${suffix}`;
}

/**
 * Prefer Open-Meteo is_day for after-sunset evenings, then split the clock
 * so 10pm and 7pm are not the same bucket.
 */
export function resolveTimeOfDay(hour: number, isDay: boolean): TimeOfDay {
  if (!isDay) {
    if (hour >= 16 && hour < 21) return "evening";
    return "night";
  }
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
