import { lightPollutionScore } from "@/lib/dark-sky-window/light-pollution";
import { illuminationFromPhase, moonNameFromPhase } from "@/lib/dark-sky-window/moon";
import { bandFor } from "@/lib/dark-sky-window/bands";
import { nextWindow, nightKey, upcomingWindows, windowsForNight } from "@/lib/dark-sky-window/windows";
import type {
  DarkSkySnapshot,
  FactorScore,
  HourlySkyRow,
  LightPollution,
} from "@/lib/dark-sky-window/types";

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number): number {
  return Math.round(clamp(value));
}

function scoreClouds(cover: number, low: number): number {
  return clamp(100 - cover * 0.75 - low * 0.35);
}

function scoreTransparency(
  aod: number | null,
  humidity: number | null,
  visibilityM: number | null,
  precipMm: number,
): number {
  if (precipMm > 0.05) return 8;
  const parts: number[] = [];
  if (aod !== null) parts.push(clamp(((0.4 - aod) / 0.35) * 100));
  if (humidity !== null) parts.push(clamp(((95 - humidity) / 55) * 100));
  if (visibilityM !== null) {
    parts.push(clamp(((visibilityM - 2000) / 28000) * 100));
  }
  if (parts.length === 0) return 50;
  return parts.reduce((sum, value) => sum + value, 0) / parts.length;
}

function scoreMoon(illumination: number): number {
  return clamp(100 * (1 - illumination) ** 1.15);
}

export function scoreHour(
  row: Omit<HourlySkyRow, "score">,
  lightScore: number,
): number {
  const clouds = scoreClouds(row.cloudCover, row.cloudCoverLow);
  const transparency = scoreTransparency(
    row.aerosolOpticalDepth,
    row.humidity,
    row.visibilityM,
    row.precipitationMm,
  );
  const moon = scoreMoon(row.moonIllumination);
  let score = clouds * 0.45 + transparency * 0.25 + moon * 0.2 + lightScore * 0.1;
  if (row.precipitationMm > 0.2) score = Math.min(score, 18);
  if (row.cloudCover >= 90) score = Math.min(score, 32);
  return roundScore(score);
}

function factorNotes(
  hours: HourlySkyRow[],
  light: LightPollution,
  moonIllumination: number,
  moonName: ReturnType<typeof moonNameFromPhase>,
): FactorScore[] {
  const night = hours.filter((hour) => !hour.isDay);
  const sample = night.slice(0, 8);
  const cloud =
    sample.reduce((sum, hour) => sum + hour.cloudCover, 0) /
    Math.max(sample.length, 1);
  const humidity = sample
    .map((hour) => hour.humidity)
    .filter((value): value is number => value !== null);
  const aod = sample
    .map((hour) => hour.aerosolOpticalDepth)
    .filter((value): value is number => value !== null);

  return [
    {
      id: "clouds",
      label: "Cloud cover",
      score: roundScore(scoreClouds(cloud, 0)),
      note: sample.length
        ? `Upcoming night hours average ${Math.round(cloud)}% cloud cover.`
        : "No night hours in this forecast yet.",
    },
    {
      id: "transparency",
      label: "Transparency",
      score: roundScore(
        scoreTransparency(
          aod[0] ?? null,
          humidity[0] ?? null,
          sample[0]?.visibilityM ?? null,
          sample[0]?.precipitationMm ?? 0,
        ),
      ),
      note: "From humidity, visibility, and aerosol optical depth.",
    },
    {
      id: "moon",
      label: "Moon",
      score: roundScore(scoreMoon(moonIllumination)),
      note: `${moonName}. Illumination about ${Math.round(moonIllumination * 100)}%.`,
    },
    {
      id: "light",
      label: "Light pollution",
      score: lightPollutionScore(light.bortle),
      note: `Bortle class ${light.bortle} (estimated). ${light.note}`,
    },
  ];
}

export function buildSnapshot(
  hours: HourlySkyRow[],
  light: LightPollution,
  timezone: string,
  moonPhase: number,
  utcOffsetSeconds: number,
): DarkSkySnapshot {
  const moonIllumination = illuminationFromPhase(moonPhase);
  const moonName = moonNameFromPhase(moonPhase);
  const allNights = windowsForNight(hours);
  const nights = upcomingWindows(allNights, utcOffsetSeconds);
  const upcoming = nextWindow(allNights, utcOffsetSeconds);
  const nightKeys = new Set(nights.map((window) => window.nightOf));
  const nightHours = hours.filter(
    (hour) => !hour.isDay && (nightKeys.size === 0 || nightKeys.has(nightKey(hour.time))),
  );
  const overallScore = upcoming?.meanScore ?? 0;
  return {
    timezone,
    moonPhase,
    moonName,
    moonIllumination,
    light,
    hours: nightHours,
    nights: nights.length > 0 ? nights : allNights,
    nextWindow: upcoming ?? null,
    factors: factorNotes(nightHours, light, moonIllumination, moonName),
    overallScore,
    overallBand: bandFor(overallScore),
  };
}
