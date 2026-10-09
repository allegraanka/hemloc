import { FORECAST_URL } from "@/lib/foraging-index/constants";
import {
  hourFromLocalIso,
  resolveTimeOfDay,
} from "@/lib/perfect-day/timeOfDay";
import type { WeatherInputs } from "@/lib/weatherScenarios";

type ErrorBody = { error: true; reason: string };

type CurrentWeatherPayload = {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number | null;
    relative_humidity_2m: number | null;
    precipitation: number | null;
    cloud_cover: number | null;
    wind_speed_10m: number | null;
    weather_code: number | null;
    is_day: number | null;
  };
};

export type CurrentWeather = WeatherInputs & {
  timezone: string;
};

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

export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<CurrentWeather> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,cloud_cover,wind_speed_10m,weather_code,is_day",
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "auto");

  const payload = (await readJson(await fetch(url))) as CurrentWeatherPayload;
  const current = payload.current;
  const observedAt = current.time ?? "";
  const isDay = (current.is_day ?? 1) === 1;
  const hour = hourFromLocalIso(observedAt) ?? (isDay ? 14 : 22);

  return {
    timezone: payload.timezone,
    temperatureF: current.temperature_2m ?? 55,
    relativeHumidity: current.relative_humidity_2m ?? 50,
    precipitationIn: current.precipitation ?? 0,
    cloudCover: current.cloud_cover ?? 50,
    windSpeedMph: current.wind_speed_10m ?? 0,
    weatherCode: current.weather_code ?? undefined,
    isDay,
    observedAt,
    timeOfDay: resolveTimeOfDay(hour, isDay),
  };
}
