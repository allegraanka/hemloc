import type { NightBand } from "@/lib/dark-sky-window/types";

export const NIGHT_BANDS: NightBand[] = [
  "Prime window",
  "Worth a look",
  "Hazy",
  "Stay in",
];

export const BAND_FILL: Record<NightBand, string> = {
  "Stay in": "bg-coral",
  Hazy: "bg-[#e8a317]",
  "Worth a look": "bg-azure",
  "Prime window": "bg-lime",
};

export function bandFor(score: number): NightBand {
  if (score < 35) return "Stay in";
  if (score < 55) return "Hazy";
  if (score < 75) return "Worth a look";
  return "Prime window";
}
