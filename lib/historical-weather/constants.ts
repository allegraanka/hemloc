export const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
export const ARCHIVE_START = "1940-01-01";
/** Archive coverage typically lags a few days; use forecast for this window. */
export const FORECAST_LOOKBACK_DAYS = 5;
export const MAX_DATES = 4;

export const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "temperature_2m_mean",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "precipitation_sum",
  "rain_sum",
  "snowfall_sum",
  "precipitation_hours",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "sunrise",
  "sunset",
  "sunshine_duration",
].join(",");

export const FROST_C = 0;
