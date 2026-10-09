import {
  FORECAST_URL,
  GEOCODING_RESULT_COUNT,
  GEOCODING_URL,
  RECENT_DAY_COUNT,
} from "@/lib/foraging-index/constants";
import { geocodingQueryCandidates } from "@/lib/foraging-index/geocode-query";
import type {
  DailyWeatherRow,
  ForagingWeather,
  OpenMeteoErrorBody,
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
  OpenMeteoGeocodingResult,
  Place,
} from "@/lib/foraging-index/types";

function isErrorBody(value: unknown): value is OpenMeteoErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    (value as OpenMeteoErrorBody).error === true
  );
}

async function readJson(response: Response): Promise<unknown> {
  const payload: unknown = await response.json();
  if (isErrorBody(payload)) {
    throw new Error(payload.reason);
  }
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return payload;
}

function toPlace(match: OpenMeteoGeocodingResult): Place {
  return {
    name: match.name,
    admin1: match.admin1,
    country: match.country,
    latitude: match.latitude,
    longitude: match.longitude,
    population: match.population,
  };
}

function isPopulatedPlace(match: OpenMeteoGeocodingResult): boolean {
  return (match.feature_code ?? "PPL").startsWith("PPL");
}

function dedupePlaces(places: Place[]): Place[] {
  const seen = new Set<string>();
  return places.filter((place) => {
    const key = `${place.name}|${place.latitude.toFixed(3)}|${place.longitude.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchGeocodeResults(
  name: string,
): Promise<OpenMeteoGeocodingResult[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", name);
  url.searchParams.set("count", String(GEOCODING_RESULT_COUNT));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const payload = (await readJson(await fetch(url))) as OpenMeteoGeocodingResponse;
  return payload.results ?? [];
}

export async function searchPlaces(query: string): Promise<Place[]> {
  for (const name of geocodingQueryCandidates(query)) {
    const results = await fetchGeocodeResults(name);
    if (results.length === 0) continue;
    const populated = results.filter(isPopulatedPlace);
    const pool = populated.length > 0 ? populated : results;
    return dedupePlaces(pool.map(toPlace));
  }
  return [];
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function dailySoilMeans(
  times: string[],
  temps: Array<number | null>,
): Map<string, number | null> {
  const buckets = new Map<string, number[]>();
  times.forEach((stamp, index) => {
    const date = stamp.slice(0, 10);
    const temp = temps[index];
    if (temp === null || temp === undefined) return;
    const list = buckets.get(date) ?? [];
    list.push(temp);
    buckets.set(date, list);
  });

  const means = new Map<string, number | null>();
  for (const [date, list] of buckets) {
    means.set(date, mean(list));
  }
  return means;
}

function parseForecast(
  payload: OpenMeteoForecastResponse,
): ForagingWeather {
  const soilByDate = dailySoilMeans(
    payload.hourly.time,
    payload.hourly.soil_temperature_0_to_10cm,
  );

  const days: DailyWeatherRow[] = payload.daily.time.map((date, index) => ({
    date,
    precipitationMm: payload.daily.precipitation_sum[index] ?? 0,
    soilTempC: soilByDate.get(date) ?? null,
    tempMaxC: payload.daily.temperature_2m_max[index] ?? null,
    tempMinC: payload.daily.temperature_2m_min[index] ?? null,
  }));

  const recent = days.slice(-RECENT_DAY_COUNT);
  const latest = recent[recent.length - 1];

  return {
    timezone: payload.timezone,
    days: recent,
    totalPrecipitationMm: recent.reduce((sum, day) => sum + day.precipitationMm, 0),
    latestSoilTempC: latest?.soilTempC ?? null,
  };
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
): Promise<ForagingWeather> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  // soil_temperature_0_to_10cm is hourly on this endpoint; we average it per day.
  url.searchParams.set(
    "daily",
    "precipitation_sum,temperature_2m_max,temperature_2m_min",
  );
  url.searchParams.set("hourly", "soil_temperature_0_to_10cm");
  url.searchParams.set("past_days", String(RECENT_DAY_COUNT));
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  const payload = (await readJson(
    await fetch(url),
  )) as OpenMeteoForecastResponse;
  return parseForecast(payload);
}
