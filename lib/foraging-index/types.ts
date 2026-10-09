export type Place = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  population?: number;
};

export type OpenMeteoErrorBody = {
  error: true;
  reason: string;
};

export type OpenMeteoGeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  feature_code?: string;
  population?: number;
};

export type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

export type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    precipitation_sum: Array<number | null>;
    temperature_2m_max: Array<number | null>;
    temperature_2m_min: Array<number | null>;
  };
  hourly: {
    time: string[];
    soil_temperature_0_to_10cm: Array<number | null>;
  };
};

export type DailyWeatherRow = {
  date: string;
  precipitationMm: number;
  soilTempC: number | null;
  tempMaxC: number | null;
  tempMinC: number | null;
};

export type ForagingWeather = {
  timezone: string;
  days: DailyWeatherRow[];
  totalPrecipitationMm: number;
  latestSoilTempC: number | null;
};

export type SeasonName = "Winter" | "Spring" | "Summer" | "Fall";

export type ConditionBand =
  | "Skip"
  | "Marginal"
  | "Worth a look"
  | "Strong window";

export type FactorScore = {
  id: "rain" | "soil" | "heat";
  label: string;
  score: number;
  note: string;
};

export type ForagingConditions = {
  score: number;
  band: ConditionBand;
  season: SeasonName;
  factors: FactorScore[];
  summary: string;
};
