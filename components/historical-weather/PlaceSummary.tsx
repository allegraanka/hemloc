import { formatCoords, formatPlaceName } from "@/lib/foraging-index/format";
import type { Place } from "@/lib/foraging-index/types";

type PlaceSummaryProps = {
  place: Place;
  timezone: string;
  dateCount: number;
  includesToday: boolean;
};

export function PlaceSummary({
  place,
  timezone,
  dateCount,
  includesToday,
}: PlaceSummaryProps) {
  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Location
      </h2>
      <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {formatPlaceName(place)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {formatCoords(place.latitude, place.longitude)} · {timezone}
      </p>
      <p className="mt-3 text-sm text-muted">
        {dateCount === 1
          ? includesToday
            ? "One date. Add another day to compare side by side."
            : "One date. Add today or another day to compare side by side."
          : `${dateCount} dates side by side, with the most recent date on the left. Differences are versus today when today is in the set, otherwise versus the leftmost date.`}
      </p>
    </section>
  );
}
