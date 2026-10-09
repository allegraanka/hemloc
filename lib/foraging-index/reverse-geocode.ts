import type { Place } from "@/lib/foraging-index/types";

const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function displayCountry(name: string | undefined): string | undefined {
  if (!name) return undefined;
  if (name === "United States of America") return "United States";
  return name;
}

/** Resolve a display name for coordinates. Weather still uses the raw lat/lon. */
export async function placeFromCoordinates(
  latitude: number,
  longitude: number,
): Promise<Place> {
  const url = new URL(REVERSE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "en");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Reverse geocode failed (${response.status})`);
  }

  const record = asRecord(await response.json());
  const name =
    (record && (readString(record, "city") ?? readString(record, "locality"))) ||
    "Unknown place";

  return {
    name,
    admin1: record ? readString(record, "principalSubdivision") : undefined,
    country: displayCountry(record ? readString(record, "countryName") : undefined),
    latitude,
    longitude,
  };
}
