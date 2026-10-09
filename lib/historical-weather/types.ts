export type WeatherSource = "archive" | "forecast";

export type HistoricalDay = {
  date: string;
  source: WeatherSource;
  missing: boolean;
  weatherCode: number | null;
  tempMaxC: number | null;
  tempMinC: number | null;
  tempMeanC: number | null;
  apparentMaxC: number | null;
  apparentMinC: number | null;
  precipitationMm: number | null;
  rainMm: number | null;
  snowfallCm: number | null;
  precipitationHours: number | null;
  windMaxKmh: number | null;
  windGustsKmh: number | null;
  sunrise: string | null;
  sunset: string | null;
  sunshineSeconds: number | null;
};

export type HistoricalSnapshot = {
  timezone: string;
  today: string;
  days: HistoricalDay[];
};

export type OpenMeteoDailyPayload = {
  timezone: string;
  daily: {
    time: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    temperature_2m_mean?: Array<number | null>;
    apparent_temperature_max?: Array<number | null>;
    apparent_temperature_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    rain_sum?: Array<number | null>;
    snowfall_sum?: Array<number | null>;
    precipitation_hours?: Array<number | null>;
    wind_speed_10m_max?: Array<number | null>;
    wind_gusts_10m_max?: Array<number | null>;
    sunrise?: Array<string | null>;
    sunset?: Array<string | null>;
    sunshine_duration?: Array<number | null>;
  };
};

export type DayDelta = {
  highF: number | null;
  lowF: number | null;
  precipMm: number | null;
};
