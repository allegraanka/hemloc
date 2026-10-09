import { RAIN_DAY_MM, RECENT_DAY_COUNT } from "@/lib/foraging-index/constants";
import { formatMmIn, formatTemp } from "@/lib/foraging-index/format";
import type {
  ConditionBand,
  DailyWeatherRow,
  FactorScore,
  ForagingConditions,
  ForagingWeather,
  SeasonName,
} from "@/lib/foraging-index/types";

const WEIGHTS = { rain: 0.4, soil: 0.35, heat: 0.25 } as const;

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number): number {
  return Math.round(clamp(value));
}

export function seasonFromDate(isoDate: string, latitude: number): SeasonName {
  const month = Number(isoDate.slice(5, 7));
  const northern = latitude >= 0;
  if (month >= 3 && month <= 5) return northern ? "Spring" : "Fall";
  if (month >= 6 && month <= 8) return northern ? "Summer" : "Winter";
  if (month >= 9 && month <= 11) return northern ? "Fall" : "Spring";
  return northern ? "Winter" : "Summer";
}

function seasonModifier(season: SeasonName): number {
  if (season === "Winter") return 0.45;
  if (season === "Summer") return 0.85;
  if (season === "Fall") return 1.05;
  return 1;
}

function bandFor(score: number): ConditionBand {
  if (score < 25) return "Skip";
  if (score < 45) return "Marginal";
  if (score < 70) return "Worth a look";
  return "Strong window";
}

function lastRainIndex(days: DailyWeatherRow[]): number {
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].precipitationMm >= RAIN_DAY_MM) return i;
  }
  return -1;
}

function scoreRain(days: DailyWeatherRow[], totalMm: number): FactorScore {
  let amount = 0;
  if (totalMm <= 0) amount = 0;
  else if (totalMm < 8) amount = 12 + (totalMm / 8) * 18;
  else if (totalMm < 25) amount = 30 + ((totalMm - 8) / 17) * 30;
  else if (totalMm < 70) amount = 60 + ((totalMm - 25) / 45) * 35;
  else if (totalMm < 140) amount = 95 - ((totalMm - 70) / 70) * 30;
  else amount = 50;

  const rainIdx = lastRainIndex(days);
  let timing = 35;
  let timingNote = "No meaningful rain in this window.";
  if (rainIdx >= 0) {
    const daysAgo = days.length - 1 - rainIdx;
    if (daysAgo === 0) {
      timing = 45;
      timingNote = "Rain fell today — growth often lags a few days.";
    } else if (daysAgo === 1) {
      timing = 75;
      timingNote = "Rain yesterday. Conditions may be turning.";
    } else if (daysAgo <= 7) {
      timing = 100;
      timingNote = `Rain ${daysAgo} days ago — a typical lag after rain.`;
    } else if (daysAgo <= 10) {
      timing = 80;
      timingNote = `Rain ${daysAgo} days ago. Some things respond later.`;
    } else {
      timing = 55;
      timingNote = "Last rain was early in the lookback; the pulse may have faded.";
    }
  }

  const score = rainIdx < 0 ? amount : amount * 0.65 + timing * 0.35;
  const note =
    totalMm < 8
      ? `Only ${formatMmIn(totalMm)} over ${RECENT_DAY_COUNT} days. ${timingNote}`
      : `${formatMmIn(totalMm)} over ${RECENT_DAY_COUNT} days. ${timingNote}`;

  return { id: "rain", label: "Recent rain", score: roundScore(score), note };
}

function scoreSoil(tempC: number | null): FactorScore {
  if (tempC === null) {
    return {
      id: "soil",
      label: "Soil temperature",
      score: 0,
      note: "No 0–10 cm soil temperature in this response.",
    };
  }

  let score = 15;
  if (tempC < 2) score = 8;
  else if (tempC < 10) score = 8 + ((tempC - 2) / 8) * 62;
  else if (tempC <= 15) score = 70 + ((tempC - 10) / 5) * 30;
  else if (tempC <= 21) score = 100 - ((tempC - 15) / 6) * 25;
  else if (tempC <= 26) score = 75 - ((tempC - 21) / 5) * 40;
  else score = 20;

  return {
    id: "soil",
    label: "Soil temperature",
    score: roundScore(score),
    note: `${formatTemp(tempC)} at 0–10 cm.`,
  };
}

function meanAirC(day: DailyWeatherRow): number | null {
  if (day.tempMaxC === null || day.tempMinC === null) return null;
  return (day.tempMaxC + day.tempMinC) / 2;
}

function scoreHeat(days: DailyWeatherRow[]): FactorScore {
  const rainIdx = lastRainIndex(days);
  const window = rainIdx >= 0 ? days.slice(rainIdx) : days.slice(-3);
  const means = window.map(meanAirC).filter((value): value is number => value !== null);
  const avg = means.length ? means.reduce((sum, value) => sum + value, 0) / means.length : null;
  const frost = window.some((day) => day.tempMinC !== null && day.tempMinC <= 0);
  const scorch = window.some((day) => day.tempMaxC !== null && day.tempMaxC >= 32);

  let score = 40;
  if (avg === null) {
    return {
      id: "heat",
      label: "Warmth after rain",
      score: 0,
      note: "Not enough air temperature data to score post-rain warmth.",
    };
  }

  if (avg < 5) score = 15;
  else if (avg < 12) score = 15 + ((avg - 5) / 7) * 50;
  else if (avg <= 22) score = 65 + ((avg - 12) / 10) * 35;
  else if (avg <= 28) score = 100 - ((avg - 22) / 6) * 45;
  else score = 40;

  if (frost) score *= 0.55;
  if (scorch) score *= 0.7;
  if (rainIdx < 0) score *= 0.75;

  const note = frost
    ? "Frost in this window slows growth."
    : rainIdx < 0
      ? `Mild air (${formatTemp(avg, 0)}) but no rain trigger to grow on.`
      : `Air after rain averaged about ${formatTemp(avg, 0)}. Mild beats hot-and-dry or a freeze.`;

  return { id: "heat", label: "Warmth after rain", score: roundScore(score), note };
}

export function scoreForagingConditions(
  weather: ForagingWeather,
  latitude: number,
): ForagingConditions {
  const latestDate = weather.days[weather.days.length - 1]?.date;
  const season = latestDate ? seasonFromDate(latestDate, latitude) : "Fall";
  const rain = scoreRain(weather.days, weather.totalPrecipitationMm);
  const soil = scoreSoil(weather.latestSoilTempC);
  const heat = scoreHeat(weather.days);
  const weighted =
    rain.score * WEIGHTS.rain + soil.score * WEIGHTS.soil + heat.score * WEIGHTS.heat;
  let score = weighted * seasonModifier(season);
  // Rain is the trigger. Mild soil and air cannot invent growth in a dry spell.
  if (weather.totalPrecipitationMm < 8) {
    score = Math.min(score, 44);
  }
  if (weather.totalPrecipitationMm < 3) {
    score = Math.min(score, 38);
  }
  score = roundScore(score);
  const band = bandFor(score);

  const summary =
    band === "Skip"
      ? "Weather is a poor match right now."
      : band === "Marginal"
        ? "Conditions are thin. Local knowledge still decides."
        : band === "Worth a look"
          ? "Weather is encouraging. Use what you already know about the area."
          : "Weather looks favorable. Local knowledge still matters more than the number.";

  return { score, band, season, factors: [rain, soil, heat], summary };
}
