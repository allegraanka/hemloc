import type { Place } from "@/lib/foraging-index/types";

/** Fallback when geolocation is denied, unavailable, or times out. */
export const ROCHESTER_NY: Place = {
  name: "Rochester",
  admin1: "New York",
  country: "United States",
  latitude: 43.1566,
  longitude: -77.6088,
};

export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
export const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const GEOCODING_RESULT_COUNT = 20;
export const MAX_PLACE_MATCHES = 8;

export const MM_PER_INCH = 25.4;
export const RECENT_DAY_COUNT = 14;
/** Daily rain at or above this counts as a meaningful rain day in the scorer. */
export const RAIN_DAY_MM = 1;
/** Soil chart top: 25 °C is a full bar. */
export const SOIL_CHART_MAX_C = 25;
export const GEO_TIMEOUT_MS = 8000;
