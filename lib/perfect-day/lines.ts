import type { ActivityLine } from "@/lib/perfect-day/activity-lines";
import { CLEAR_SCENARIO_LINES } from "@/lib/perfect-day/lines-clear";
import { INDOOR_SCENARIO_LINES } from "@/lib/perfect-day/lines-indoor";
import { MILD_SCENARIO_LINES } from "@/lib/perfect-day/lines-mild";
import type { TimeOfDay } from "@/lib/perfect-day/timeOfDay";

export const SCENARIO_LINES: Record<string, ActivityLine[]> = {
  ...INDOOR_SCENARIO_LINES,
  ...CLEAR_SCENARIO_LINES,
  ...MILD_SCENARIO_LINES,
};

export function linesForTime(
  scenarioId: string,
  timeOfDay: TimeOfDay,
  isDay: boolean,
): ActivityLine[] {
  const matchesClock = (line: ActivityLine) => {
    if (!line.times.includes(timeOfDay)) return false;
    if (line.daylight && !isDay) return false;
    return true;
  };
  const pool = SCENARIO_LINES[scenarioId] ?? SCENARIO_LINES.fallback ?? [];
  const matched = pool.filter(matchesClock);
  if (matched.length > 0) return matched;
  const fallback = SCENARIO_LINES.fallback ?? [];
  return fallback.filter(matchesClock);
}
