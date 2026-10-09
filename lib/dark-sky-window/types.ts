export type MoonName =
  | "New moon"
  | "Waxing crescent"
  | "First quarter"
  | "Waxing gibbous"
  | "Full moon"
  | "Waning gibbous"
  | "Last quarter"
  | "Waning crescent";

export type NightBand = "Stay in" | "Hazy" | "Worth a look" | "Prime window";

export type FactorScore = {
  id: "clouds" | "transparency" | "moon" | "light";
  label: string;
  score: number;
  note: string;
};

export type HourlySkyRow = {
  time: string;
  isDay: boolean;
  cloudCover: number;
  cloudCoverLow: number;
  visibilityM: number | null;
  humidity: number | null;
  precipitationMm: number;
  aerosolOpticalDepth: number | null;
  moonPhase: number;
  moonIllumination: number;
  score: number;
};

export type NightWindow = {
  nightOf: string;
  start: string;
  end: string;
  meanScore: number;
  band: NightBand;
  hourCount: number;
};

export type LightPollution = {
  bortle: number;
  estimated: boolean;
  note: string;
};

export type DarkSkySnapshot = {
  timezone: string;
  moonPhase: number;
  moonName: MoonName;
  moonIllumination: number;
  light: LightPollution;
  hours: HourlySkyRow[];
  nights: NightWindow[];
  nextWindow: NightWindow | null;
  factors: FactorScore[];
  overallScore: number;
  overallBand: NightBand;
};

export type ForecastPayload = {
  timezone: string;
  utc_offset_seconds: number;
  daily: {
    time: string[];
    moon_phase: Array<number | null>;
  };
  hourly: {
    time: string[];
    cloud_cover: Array<number | null>;
    cloud_cover_low: Array<number | null>;
    visibility: Array<number | null>;
    relative_humidity_2m: Array<number | null>;
    precipitation: Array<number | null>;
    is_day: Array<number | null>;
  };
};

export type AirQualityPayload = {
  hourly: {
    time: string[];
    aerosol_optical_depth: Array<number | null>;
  };
};
