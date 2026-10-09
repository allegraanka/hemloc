import { formatCoords, formatMmIn, formatPlaceName, formatTemp } from "@/lib/foraging-index/format";
import { RECENT_DAY_COUNT } from "@/lib/foraging-index/constants";
import type { ForagingWeather, Place } from "@/lib/foraging-index/types";

type WeatherSummaryProps = {
  place: Place;
  weather: ForagingWeather;
};

export function WeatherSummary({ place, weather }: WeatherSummaryProps) {
  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Location
      </h2>
      <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {formatPlaceName(place)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {formatCoords(place.latitude, place.longitude)} · {weather.timezone}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            {RECENT_DAY_COUNT}-day rainfall
          </dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            {formatMmIn(weather.totalPrecipitationMm)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Soil temp (0–10 cm)
          </dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            {formatTemp(weather.latestSoilTempC)}
          </dd>
          <p className="mt-1 text-xs text-muted">Latest daily mean</p>
        </div>
      </dl>
    </section>
  );
}
