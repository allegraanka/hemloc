const LABELS: Array<{ codes: number[]; label: string }> = [
  { codes: [0], label: "Clear" },
  { codes: [1], label: "Mainly clear" },
  { codes: [2], label: "Partly cloudy" },
  { codes: [3], label: "Overcast" },
  { codes: [45, 48], label: "Fog" },
  { codes: [51, 53, 55], label: "Drizzle" },
  { codes: [56, 57], label: "Freezing drizzle" },
  { codes: [61, 63, 65], label: "Rain" },
  { codes: [66, 67], label: "Freezing rain" },
  { codes: [71, 73, 75, 77], label: "Snow" },
  { codes: [80, 81, 82], label: "Rain showers" },
  { codes: [85, 86], label: "Snow showers" },
  { codes: [95, 96, 99], label: "Thunderstorm" },
];

export function weatherCodeLabel(code: number | null): string {
  if (code === null) return "—";
  for (const group of LABELS) {
    if (group.codes.includes(code)) return group.label;
  }
  return `Code ${code}`;
}
