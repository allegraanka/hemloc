import { AIR_QUALITY_URL, FORECAST_DAYS } from "@/lib/dark-sky-window/constants";
import { lightPollutionFromPopulation, lightPollutionScore } from "@/lib/dark-sky-window/light-pollution";
import { illuminationFromPhase } from "@/lib/dark-sky-window/moon";
import { scoreHour, buildSnapshot } from "@/lib/dark-sky-window/score";
import { FORECAST_URL } from "@/lib/foraging-index/constants";
import { searchPlaces } from "@/lib/foraging-index/open-meteo";
import type { Place } from "@/lib/foraging-index/types";
import type {
  AirQualityPayload,
  DarkSkySnapshot,
  ForecastPayload,
  HourlySkyRow,
} from "@/lib/dark-sky-window/types";

type ErrorBody = { error: true; reason: string };

function isErrorBody(value: unknown): value is ErrorBody {
  return typeof value === "object" && value !== null && "error" in value;
}

async function readJson(response: Response): Promise<unknown> {
  const payload: unknown = await response.json();
  if (isErrorBody(payload) && payload.error === true) {
    throw new Error(payload.reason);
  }
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return payload;
}

function kmBetween(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function enrichPlace(place: Place): Promise<Place> {
  if (place.population !== undefined) return place;
  try {
    const matches = await searchPlaces(place.name);
    const closest = [...matches].sort(
      (a, b) => kmBetween(place, a) - kmBetween(place, b),
    )[0];
    if (closest && kmBetween(place, closest) < 80 && closest.population !== undefined) {
      return { ...place, population: closest.population };
    }
  } catch {
    return place;
  }
  return place;
}

function phaseByDate(dates: string[], phases: Array<number | null>): Map<string, number> {
  const map = new Map<string, number>();
  dates.forEach((date, index) => {
    map.set(date, phases[index] ?? 0);
  });
  return map;
}

function aodByTime(payload: AirQualityPayload | null): Map<string, number | null> {
  const map = new Map<string, number | null>();
  if (!payload) return map;
  payload.hourly.time.forEach((time, index) => {
    map.set(time, payload.hourly.aerosol_optical_depth[index] ?? null);
  });
  return map;
}

export async function fetchDarkSky(place: Place): Promise<DarkSkySnapshot> {
  const named = await enrichPlace(place);
  const forecastUrl = new URL(FORECAST_URL);
  forecastUrl.searchParams.set("latitude", String(named.latitude));
  forecastUrl.searchParams.set("longitude", String(named.longitude));
  forecastUrl.searchParams.set(
    "hourly",
    "cloud_cover,cloud_cover_low,visibility,relative_humidity_2m,precipitation,is_day",
  );
  forecastUrl.searchParams.set("daily", "moon_phase");
  forecastUrl.searchParams.set("forecast_days", String(FORECAST_DAYS));
  forecastUrl.searchParams.set("timezone", "auto");

  const airUrl = new URL(AIR_QUALITY_URL);
  airUrl.searchParams.set("latitude", String(named.latitude));
  airUrl.searchParams.set("longitude", String(named.longitude));
  airUrl.searchParams.set("hourly", "aerosol_optical_depth");
  airUrl.searchParams.set("forecast_days", String(FORECAST_DAYS));
  airUrl.searchParams.set("timezone", "auto");

  const [forecastResult, airResult] = await Promise.all([
    fetch(forecastUrl).then(readJson) as Promise<ForecastPayload>,
    fetch(airUrl)
      .then(readJson)
      .then((value) => value as AirQualityPayload)
      .catch(() => null),
  ]);

  const phases = phaseByDate(
    forecastResult.daily.time,
    forecastResult.daily.moon_phase,
  );
  const aod = aodByTime(airResult);
  const light = lightPollutionFromPopulation(named.population);
  const lightScore = lightPollutionScore(light.bortle);

  const hours: HourlySkyRow[] = forecastResult.hourly.time.map((time, index) => {
    const phase = phases.get(time.slice(0, 10)) ?? 0;
    const illumination = illuminationFromPhase(phase);
    const row = {
      time,
      isDay: (forecastResult.hourly.is_day[index] ?? 1) === 1,
      cloudCover: forecastResult.hourly.cloud_cover[index] ?? 100,
      cloudCoverLow: forecastResult.hourly.cloud_cover_low[index] ?? 0,
      visibilityM: forecastResult.hourly.visibility[index] ?? null,
      humidity: forecastResult.hourly.relative_humidity_2m[index] ?? null,
      precipitationMm: forecastResult.hourly.precipitation[index] ?? 0,
      aerosolOpticalDepth: aod.get(time) ?? null,
      moonPhase: phase,
      moonIllumination: illumination,
      score: 0,
    };
    return { ...row, score: scoreHour(row, lightScore) };
  });

  const todayPhase = forecastResult.daily.moon_phase[0] ?? 0;
  return buildSnapshot(
    hours,
    light,
    forecastResult.timezone,
    todayPhase,
    forecastResult.utc_offset_seconds ?? 0,
  );
}
