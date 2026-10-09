import Link from "next/link";
import { BORTLE_GUIDE_PATH } from "@/lib/dark-sky-window/constants";
import { formatCoords, formatPlaceName } from "@/lib/foraging-index/format";
import {
  formatNightDate,
  formatPercent,
  formatWindowRange,
} from "@/lib/dark-sky-window/format";
import type { DarkSkySnapshot } from "@/lib/dark-sky-window/types";
import type { Place } from "@/lib/foraging-index/types";

type WindowSummaryProps = {
  place: Place;
  sky: DarkSkySnapshot;
};

export function WindowSummary({ place, sky }: WindowSummaryProps) {
  const window = sky.nextWindow;
  const mapHref = `https://www.lightpollutionmap.info/#zoom=10&lat=${place.latitude}&lon=${place.longitude}`;

  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Location
      </h2>
      <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {formatPlaceName(place)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {formatCoords(place.latitude, place.longitude)} · {sky.timezone}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Next window
          </dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            {window
              ? `${formatNightDate(window.nightOf)}, ${formatWindowRange(window.start, window.end)}`
              : "No night hours yet"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Moon
          </dt>
          <dd className="mt-1 text-lg font-medium text-ink">{sky.moonName}</dd>
          <p className="mt-1 text-xs text-muted">
            {formatPercent(sky.moonIllumination * 100)} illuminated
          </p>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Light pollution
          </dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            Bortle {sky.light.bortle}
          </dd>
          <p className="mt-1 text-xs text-muted">{sky.light.note}</p>
          <p className="mt-1 text-xs">
            <Link
              href={BORTLE_GUIDE_PATH}
              className="font-medium text-azure underline-offset-2 hover:underline"
            >
              How this class is estimated
            </Link>
          </p>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Map
          </dt>
          <dd className="mt-1">
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-azure underline-offset-2 hover:underline"
            >
              Open light pollution map
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
