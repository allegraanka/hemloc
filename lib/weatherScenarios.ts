import {
  TIME_OF_DAY_LABEL,
  formatClock,
  type TimeOfDay,
} from "@/lib/perfect-day/timeOfDay";

export type WeatherInputs = {
  temperatureF: number;
  relativeHumidity: number;
  windSpeedMph: number;
  precipitationIn: number;
  cloudCover: number;
  weatherCode?: number;
  isDay: boolean;
  observedAt: string;
  timeOfDay: TimeOfDay;
};

export type WeatherScenario = {
  id: string;
  title: string;
  nightTitle?: string;
};

export type RankedScenario = WeatherScenario & {
  score: number;
};

type ScenarioRule = WeatherScenario & {
  score: (weather: WeatherInputs) => number;
};

const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const FOG_CODES = new Set([45, 48]);

function isRain(weather: WeatherInputs): boolean {
  if (weather.precipitationIn >= 0.04) return true;
  return weather.weatherCode !== undefined && RAIN_CODES.has(weather.weatherCode);
}

function isSnow(weather: WeatherInputs): boolean {
  if (weather.weatherCode !== undefined && SNOW_CODES.has(weather.weatherCode)) {
    return true;
  }
  return weather.temperatureF <= 34 && weather.precipitationIn >= 0.01;
}

function isFog(weather: WeatherInputs): boolean {
  return weather.weatherCode !== undefined && FOG_CODES.has(weather.weatherCode);
}

const SCENARIOS: ScenarioRule[] = [
  {
    id: "snow-day",
    title: "Snow-quiet",
    score: (weather) => (isSnow(weather) ? 96 : 0),
  },
  {
    id: "heavy-rain",
    title: "Rain-soaked & cozy",
    score: (weather) => {
      if (isSnow(weather) || !isRain(weather)) return 0;
      if (weather.precipitationIn >= 0.12) return 94;
      return 88;
    },
  },
  {
    id: "hot-clear",
    title: "Hot & clear",
    nightTitle: "Clear & warm",
    score: (weather) => {
      if (isRain(weather) || weather.cloudCover > 40 || weather.temperatureF < 80) {
        return 0;
      }
      return weather.temperatureF >= 88 ? 90 : 84;
    },
  },
  {
    id: "crisp-sunny",
    title: "Crisp & sunny",
    nightTitle: "Crisp & clear",
    score: (weather) => {
      if (isRain(weather) || weather.cloudCover > 35 || weather.windSpeedMph > 12) {
        return 0;
      }
      if (weather.temperatureF < 45 || weather.temperatureF > 65) return 0;
      return 82;
    },
  },
  {
    id: "low-humidity-breezy",
    title: "Low humidity & breezy",
    nightTitle: "Breezy & dry",
    score: (weather) => {
      if (isRain(weather) || weather.relativeHumidity > 45) return 0;
      if (weather.windSpeedMph < 7 || weather.windSpeedMph > 22) return 0;
      if (weather.temperatureF < 50 || weather.temperatureF > 88) return 0;
      return 78;
    },
  },
  {
    id: "overcast-calm",
    title: "Overcast & calm",
    score: (weather) => {
      if (isRain(weather) || weather.cloudCover < 70 || weather.windSpeedMph >= 10) {
        return 0;
      }
      if (weather.temperatureF < 38 || weather.temperatureF > 72) return 0;
      return 74;
    },
  },
  {
    id: "fog",
    title: "Soft fog",
    score: (weather) => (isFog(weather) && !isRain(weather) ? 76 : 0),
  },
  {
    id: "muggy",
    title: "Warm & humid",
    score: (weather) => {
      if (isRain(weather) || weather.temperatureF < 76 || weather.relativeHumidity < 68) {
        return 0;
      }
      return 68;
    },
  },
  {
    id: "fallback",
    title: "An ordinary good day",
    nightTitle: "An ordinary good night",
    score: () => 12,
  },
];

export function evaluateWeather(weather: WeatherInputs): {
  primary: RankedScenario;
  matches: RankedScenario[];
} {
  const matches = SCENARIOS.map((scenario) => ({
    id: scenario.id,
    title: scenarioTitle(scenario, weather),
    score: scenario.score(weather),
  }))
    .filter((scenario) => scenario.score > 0)
    .sort((a, b) => b.score - a.score);

  const primary = matches[0] ?? {
    id: "fallback",
    title: "An ordinary good day",
    score: 12,
  };

  return { primary, matches };
}

export function windLabel(mph: number): string {
  if (mph < 4) return "Still air";
  if (mph < 8) return "Light air";
  if (mph < 13) return "Gentle breeze";
  if (mph < 19) return "Breezy";
  return "Windy";
}

export function scenarioTitle(
  scenario: WeatherScenario,
  weather: Pick<WeatherInputs, "timeOfDay" | "isDay">,
): string {
  if (scenario.nightTitle && (weather.timeOfDay === "night" || !weather.isDay)) {
    return scenario.nightTitle;
  }
  return scenario.title;
}

export function formatWeatherChip(weather: WeatherInputs): string {
  const clock = formatClock(weather.observedAt);
  const when = TIME_OF_DAY_LABEL[weather.timeOfDay];
  const temp = `${Math.round(weather.temperatureF)}°F`;
  const humidity = `${Math.round(weather.relativeHumidity)}% humidity`;
  const wind = windLabel(weather.windSpeedMph);
  const stamp = clock ? `${clock} · ${when}` : when;
  return `${stamp} · ${temp} • ${humidity} • ${wind}`;
}
