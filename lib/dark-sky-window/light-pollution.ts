import type { LightPollution } from "@/lib/dark-sky-window/types";

export const BORTLE_UNKNOWN_POPULATION_CLASS = 5;

/** Exclusive upper population bounds, smallest class first. Class 1 is never inferred. */
export const BORTLE_POPULATION_THRESHOLDS = [
  { bortle: 2, below: 800 },
  { bortle: 3, below: 4000 },
  { bortle: 4, below: 20_000 },
  { bortle: 5, below: 60_000 },
  { bortle: 6, below: 150_000 },
  { bortle: 7, below: 400_000 },
  { bortle: 8, below: 2_000_000 },
] as const;

export const BORTLE_NOTES: Record<number, string> = {
  1: "Excellent dark sky. The Milky Way can cast a shadow.",
  2: "Typical truly dark site. Zodiacal light is often visible.",
  3: "Rural sky. The Milky Way still has structure.",
  4: "Rural/suburban transition. The Milky Way is visible overhead.",
  5: "Suburban sky. The Milky Way looks washed near the horizon.",
  6: "Bright suburban sky. The Milky Way is faint or gone.",
  7: "Suburban/urban transition. Only brighter stars stand out.",
  8: "City sky. Planets and the brightest stars remain.",
  9: "Inner-city sky. The ground is brightly lit.",
};

export type BortleGuideRow = {
  bortle: number;
  sky: string;
  populationRule: string;
};

function formatPeople(count: number): string {
  return count.toLocaleString("en-US");
}

/**
 * Open-Meteo has no night-lights layer. Bortle is inferred from the named
 * place's geocoding population — a stand-in, not a satellite map.
 */
export function lightPollutionFromPopulation(
  population: number | undefined,
): LightPollution {
  const bortle = bortleFromPopulation(population);
  return {
    bortle,
    estimated: true,
    note: BORTLE_NOTES[bortle] ?? "Typical suburban sky.",
  };
}

export function lightPollutionScore(bortle: number): number {
  return Math.round(((9 - bortle) / 8) * 100);
}

export function bortleFromPopulation(population: number | undefined): number {
  if (population === undefined) return BORTLE_UNKNOWN_POPULATION_CLASS;
  for (const row of BORTLE_POPULATION_THRESHOLDS) {
    if (population < row.below) return row.bortle;
  }
  return 9;
}

export function bortleGuideRows(): BortleGuideRow[] {
  const rows: BortleGuideRow[] = [
    {
      bortle: 1,
      sky: BORTLE_NOTES[1] ?? "",
      populationRule:
        "Never assigned. A town name is not evidence of a class-1 sky.",
    },
  ];

  BORTLE_POPULATION_THRESHOLDS.forEach((row, index) => {
    const previous = BORTLE_POPULATION_THRESHOLDS[index - 1];
    const low = previous ? previous.below : 0;
    let populationRule =
      low === 0
        ? `Named place under ${formatPeople(row.below)} people`
        : `Named place, ${formatPeople(low)}–${formatPeople(row.below - 1)} people`;
    if (row.bortle === BORTLE_UNKNOWN_POPULATION_CLASS) {
      populationRule += ". Also used when population is unknown.";
    }
    rows.push({
      bortle: row.bortle,
      sky: BORTLE_NOTES[row.bortle] ?? "",
      populationRule,
    });
  });

  const last = BORTLE_POPULATION_THRESHOLDS[BORTLE_POPULATION_THRESHOLDS.length - 1];
  rows.push({
    bortle: 9,
    sky: BORTLE_NOTES[9] ?? "",
    populationRule: last
      ? `Named place, ${formatPeople(last.below)} people or more`
      : "Largest named cities",
  });

  return rows;
}
