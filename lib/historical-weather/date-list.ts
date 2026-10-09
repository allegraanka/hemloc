import { MAX_DATES } from "@/lib/historical-weather/constants";
import {
  isSelectableDate,
  nextSuggestedDate,
  sortNewestFirst,
} from "@/lib/historical-weather/dates";

export { sortNewestFirst };

export type DateListResult = {
  dates: string[];
  error: string | null;
};

export function replaceDateAt(
  dates: string[],
  index: number,
  next: string,
  today: string,
): DateListResult {
  if (!isSelectableDate(next, today)) return { dates, error: null };
  if (dates.includes(next) && dates[index] !== next) {
    return { dates, error: "That date is already shown." };
  }
  const copy = [...dates];
  copy[index] = next;
  return { dates: sortNewestFirst(copy), error: null };
}

export function appendDate(
  dates: string[],
  today: string,
  iso?: string,
): DateListResult {
  if (dates.length >= MAX_DATES) {
    return { dates, error: `You can compare up to ${MAX_DATES} dates.` };
  }
  const next = iso ?? nextSuggestedDate(dates, today);
  if (!isSelectableDate(next, today)) return { dates, error: null };
  if (dates.includes(next)) {
    return { dates, error: "That date is already shown." };
  }
  return { dates: sortNewestFirst([...dates, next]), error: null };
}

export function removeDateAt(dates: string[], index: number): string[] {
  if (dates.length <= 1) return dates;
  return dates.filter((_, i) => i !== index);
}
