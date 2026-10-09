const STORAGE_KEY = "hemloc.perfect-day.seen";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 200;

export type SeenEntry = {
  activity: string;
  at: number;
};

type SeenStore = {
  seen: SeenEntry[];
};

function isSeenEntry(value: unknown): value is SeenEntry {
  if (typeof value !== "object" || value === null) return false;
  if (!("activity" in value) || !("at" in value)) return false;
  const activity = value.activity;
  const at = value.at;
  return typeof activity === "string" && typeof at === "number";
}

function isSeenStore(value: unknown): value is SeenStore {
  if (typeof value !== "object" || value === null) return false;
  if (!("seen" in value) || !Array.isArray(value.seen)) return false;
  return value.seen.every(isSeenEntry);
}

export function readSeen(now = Date.now()): SeenEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isSeenStore(parsed)) return [];
    return pruneSeen(parsed.seen, now);
  } catch {
    return [];
  }
}

export function writeSeen(seen: SeenEntry[], now = Date.now()): void {
  try {
    const next = pruneSeen(seen, now).slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ seen: next }));
  } catch {
    // Private mode or full storage — still return a line.
  }
}

function pruneSeen(seen: SeenEntry[], now = Date.now()): SeenEntry[] {
  const cutoff = now - WEEK_MS;
  return seen.filter((entry) => entry.at >= cutoff);
}

export function blockedActivities(
  seen: SeenEntry[],
  now = Date.now(),
): Set<string> {
  const cutoff = now - WEEK_MS;
  return new Set(
    seen.filter((entry) => entry.at >= cutoff).map((entry) => entry.activity),
  );
}

export function recordSeen(
  seen: SeenEntry[],
  activity: string,
  now = Date.now(),
): SeenEntry[] {
  const without = seen.filter((entry) => entry.activity !== activity);
  return pruneSeen([...without, { activity, at: now }], now);
}

export function oldestActivity(
  activities: string[],
  seen: SeenEntry[],
): string | null {
  if (activities.length === 0) return null;
  let best = activities[0] ?? null;
  let bestAt = Number.POSITIVE_INFINITY;
  for (const activity of activities) {
    const stamp = seen.find((entry) => entry.activity === activity)?.at ?? 0;
    if (stamp < bestAt) {
      best = activity;
      bestAt = stamp;
    }
  }
  return best;
}
