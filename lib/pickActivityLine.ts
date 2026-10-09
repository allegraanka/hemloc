import type { ActivityLine } from "@/lib/perfect-day/activity-lines";
import { linesForTime } from "@/lib/perfect-day/lines";
import {
  blockedActivities,
  oldestActivity,
  readSeen,
  recordSeen,
  writeSeen,
} from "@/lib/perfect-day/seen";
import {
  ACTIVITY_PREFIX,
  type TimeOfDay,
} from "@/lib/perfect-day/timeOfDay";

const STRICT_MODE_MS = 2000;

let lastPick: { key: string; line: string; at: number } | null = null;

function pickKey(
  scenarioId: string,
  timeOfDay: TimeOfDay,
  isDay: boolean,
): string {
  return `${scenarioId}:${timeOfDay}:${isDay ? "day" : "dark"}`;
}

function chooseLine(
  lines: ActivityLine[],
  blocked: Set<string>,
): ActivityLine | null {
  const open = lines.filter((line) => !blocked.has(line.activity));
  if (open.length === 0) return null;
  return open[Math.floor(Math.random() * open.length)] ?? null;
}

export function pickActivityLine(
  scenarioId: string,
  timeOfDay: TimeOfDay,
  isDay: boolean,
): string {
  const prefix = ACTIVITY_PREFIX[timeOfDay];
  const fallback =
    `${prefix}whatever you already wanted to do — the weather will keep you company.`;
  const lines = linesForTime(scenarioId, timeOfDay, isDay);
  const backup = linesForTime("fallback", timeOfDay, isDay);
  const pool = lines.length > 0 ? lines : backup;
  if (pool.length === 0) return fallback;

  const key = pickKey(scenarioId, timeOfDay, isDay);
  const now = Date.now();
  if (lastPick && lastPick.key === key && now - lastPick.at < STRICT_MODE_MS) {
    return lastPick.line;
  }

  const seen = readSeen(now);
  const blocked = blockedActivities(seen, now);
  const picked =
    chooseLine(pool, blocked) ??
    (pool === backup ? null : chooseLine(backup, blocked));
  const activity =
    picked?.activity ??
    oldestActivity(
      pool.map((line) => line.activity),
      seen,
    );

  const line = activity ? `${prefix}${activity}` : fallback;
  if (activity) writeSeen(recordSeen(seen, activity, now), now);
  lastPick = { key, line, at: now };
  return line;
}
