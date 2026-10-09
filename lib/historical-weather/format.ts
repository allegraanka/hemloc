import { celsiusToFahrenheit, formatMmIn } from "@/lib/foraging-index/format";

export function formatLongDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatClock(stamp: string | null): string {
  if (!stamp) return "—";
  const time = stamp.includes("T") ? stamp.split("T")[1] : stamp;
  const [hourPart, minutePart] = time.split(":");
  const hour = Number(hourPart);
  if (Number.isNaN(hour) || !minutePart) return "—";
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutePart.slice(0, 2)} ${suffix}`;
}

export function formatSunshine(seconds: number | null): string {
  if (seconds === null) return "—";
  return `${(seconds / 3600).toFixed(1)} h`;
}

export function formatWindKmh(kmh: number | null): string {
  if (kmh === null) return "—";
  const mph = kmh / 1.60934;
  return `${Math.round(mph)} mph / ${Math.round(kmh)} km/h`;
}

export function formatSnowCm(cm: number | null): string {
  if (cm === null) return "—";
  if (cm <= 0) return "None";
  const inches = cm / 2.54;
  return `${inches.toFixed(1)} in / ${cm.toFixed(1)} cm`;
}

export function formatPrecip(mm: number | null): string {
  if (mm === null) return "—";
  if (mm <= 0) return "None";
  return formatMmIn(mm);
}

export function formatSignedF(diffF: number): string {
  if (Math.abs(diffF) < 0.05) return "same";
  const sign = diffF > 0 ? "+" : "−";
  return `${sign}${Math.abs(diffF).toFixed(1)} °F`;
}

export function formatSignedInches(diffMm: number): string {
  const inches = diffMm / 25.4;
  if (Math.abs(inches) < 0.005) return "same";
  const sign = inches > 0 ? "+" : "−";
  return `${sign}${Math.abs(inches).toFixed(2)} in`;
}

export { celsiusToFahrenheit };
