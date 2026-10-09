import type { MoonName } from "@/lib/dark-sky-window/types";

/** Open-Meteo moon_phase is 0 at new moon and 0.5 at full. */
export function illuminationFromPhase(phase: number): number {
  return (1 - Math.cos(2 * Math.PI * phase)) / 2;
}

export function moonNameFromPhase(phase: number): MoonName {
  const p = ((phase % 1) + 1) % 1;
  if (p < 0.0625 || p >= 0.9375) return "New moon";
  if (p < 0.1875) return "Waxing crescent";
  if (p < 0.3125) return "First quarter";
  if (p < 0.4375) return "Waxing gibbous";
  if (p < 0.5625) return "Full moon";
  if (p < 0.6875) return "Waning gibbous";
  if (p < 0.8125) return "Last quarter";
  return "Waning crescent";
}
