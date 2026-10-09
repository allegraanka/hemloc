import type { TimeOfDay } from "@/lib/perfect-day/timeOfDay";
import { TIME_OF_DAY } from "@/lib/perfect-day/timeOfDay";

export type ActivityLine = {
  activity: string;
  times: readonly TimeOfDay[];
  /** True when the activity needs daylight, not just an evening clock hour. */
  daylight?: boolean;
};

export const ALL_TIMES: TimeOfDay[] = [...TIME_OF_DAY];
export const DAYTIME: TimeOfDay[] = ["morning", "afternoon"];
export const WAKING: TimeOfDay[] = ["morning", "afternoon", "evening"];
export const AFTER_DARK: TimeOfDay[] = ["evening", "night"];

export function L(
  activity: string,
  times: readonly TimeOfDay[] = ALL_TIMES,
  daylight = false,
): ActivityLine {
  return { activity, times, daylight: daylight || undefined };
}
