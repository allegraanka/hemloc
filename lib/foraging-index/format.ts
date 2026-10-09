import { MM_PER_INCH } from "@/lib/foraging-index/constants";
import type { Place } from "@/lib/foraging-index/types";

export function formatPlaceName(place: Place): string {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}

export function formatCoords(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

export function formatMmIn(mm: number): string {
  return `${mmToInches(mm).toFixed(2)} in / ${mm.toFixed(1)} mm`;
}

export function formatShortDate(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[Number(match[2]) - 1];
  return `${month} ${Number(match[3])}`;
}

export function formatWeekdayShort(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function formatDayNumber(isoDate: string): string {
  const day = Number(isoDate.slice(8, 10));
  return Number.isNaN(day) ? isoDate : String(day);
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(celsius: number | null, digits = 1): string {
  if (celsius === null) return "—";
  return `${celsiusToFahrenheit(celsius).toFixed(digits)} °F / ${celsius.toFixed(digits)} °C`;
}

export function formatAirMaxMin(
  maxC: number | null,
  minC: number | null,
): string {
  if (maxC === null || minC === null) {
    return `${formatTemp(maxC)} max / ${formatTemp(minC)} min`;
  }
  return `${celsiusToFahrenheit(maxC).toFixed(1)} / ${celsiusToFahrenheit(minC).toFixed(1)} °F · ${maxC.toFixed(1)} / ${minC.toFixed(1)} °C`;
}

export function parseLatLon(input: string): { latitude: number; longitude: number } | null {
  const match = input
    .trim()
    .match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}
