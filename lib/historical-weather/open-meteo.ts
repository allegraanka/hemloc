import { FORECAST_URL } from "@/lib/foraging-index/constants";
import {
  ARCHIVE_URL,
  DAILY_FIELDS,
} from "@/lib/historical-weather/constants";
import { weatherSource } from "@/lib/historical-weather/dates";
import type {
  HistoricalDay,
  HistoricalSnapshot,
  OpenMeteoDailyPayload,
  WeatherSource,
} from "@/lib/historical-weather/types";

type ErrorBody = { error: true; reason: string };

function isErrorBody(value: unknown): value is ErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    (value as ErrorBody).error === true
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

function at<T>(list: Array<T | null> | undefined, index: number): T | null {
  return list?.[index] ?? null;
}

function emptyDay(date: string, source: WeatherSource): HistoricalDay {
  return {
    date,
    source,
    missing: true,
    weatherCode: null,
    tempMaxC: null,
    tempMinC: null,
    tempMeanC: null,
    apparentMaxC: null,
    apparentMinC: null,
    precipitationMm: null,
    rainMm: null,
    snowfallCm: null,
    precipitationHours: null,
    windMaxKmh: null,
    windGustsKmh: null,
    sunrise: null,
    sunset: null,
    sunshineSeconds: null,
  };
}

function parseDay(
  payload: OpenMeteoDailyPayload,
  date: string,
  source: WeatherSource,
): HistoricalDay {
  const index = payload.daily.time.indexOf(date);
  if (index < 0) return emptyDay(date, source);
  const daily = payload.daily;
  const tempMaxC = at(daily.temperature_2m_max, index);
  const tempMinC = at(daily.temperature_2m_min, index);
  return {
    date,
    source,
    missing: tempMaxC == null && tempMinC == null,
    weatherCode: at(daily.weather_code, index),
    tempMaxC,
    tempMinC,
    tempMeanC: at(daily.temperature_2m_mean, index),
    apparentMaxC: at(daily.apparent_temperature_max, index),
    apparentMinC: at(daily.apparent_temperature_min, index),
    precipitationMm: at(daily.precipitation_sum, index),
    rainMm: at(daily.rain_sum, index),
    snowfallCm: at(daily.snowfall_sum, index),
    precipitationHours: at(daily.precipitation_hours, index),
    windMaxKmh: at(daily.wind_speed_10m_max, index),
    windGustsKmh: at(daily.wind_gusts_10m_max, index),
    sunrise: at(daily.sunrise, index),
    sunset: at(daily.sunset, index),
    sunshineSeconds: at(daily.sunshine_duration, index),
  };
}

async function fetchOneDay(
  latitude: number,
  longitude: number,
  date: string,
  source: WeatherSource,
): Promise<{ timezone: string; day: HistoricalDay }> {
  const url = new URL(source === "archive" ? ARCHIVE_URL : FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);
  url.searchParams.set("daily", DAILY_FIELDS);
  url.searchParams.set("timezone", "auto");

  const payload = (await readJson(await fetch(url))) as OpenMeteoDailyPayload;
  return { timezone: payload.timezone, day: parseDay(payload, date, source) };
}

export async function fetchHistoricalDays(
  latitude: number,
  longitude: number,
  dates: string[],
  today: string,
): Promise<HistoricalSnapshot> {
  const unique = [...new Set(dates)];
  const results = await Promise.all(
    unique.map((date) =>
      fetchOneDay(latitude, longitude, date, weatherSource(date, today)),
    ),
  );
  const byDate = new Map(results.map((item) => [item.day.date, item.day]));
  const timezone = results[0]?.timezone ?? "UTC";

  return {
    timezone,
    today,
    days: dates.map(
      (date) =>
        byDate.get(date) ?? emptyDay(date, weatherSource(date, today)),
    ),
  };
}
