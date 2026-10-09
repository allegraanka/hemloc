import { GEO_TIMEOUT_MS, ROCHESTER_NY } from "@/lib/foraging-index/constants";
import { placeFromCoordinates } from "@/lib/foraging-index/reverse-geocode";
import type { Place } from "@/lib/foraging-index/types";

const LAST_PLACE_KEY = "hemloc.last-place";

type PlaceResolveSource = "gps" | "cache" | "fallback";

function isPlace(value: unknown): value is Place {
  if (typeof value !== "object" || value === null) return false;
  if (!("name" in value) || !("latitude" in value) || !("longitude" in value)) {
    return false;
  }
  return (
    typeof value.name === "string" &&
    typeof value.latitude === "number" &&
    typeof value.longitude === "number" &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  );
}

function readLastPlace(): Place | null {
  try {
    const raw = localStorage.getItem(LAST_PLACE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPlace(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLastPlace(place: Place): void {
  try {
    localStorage.setItem(LAST_PLACE_KEY, JSON.stringify(place));
  } catch {
    // Private mode or full storage.
  }
}

function readBrowserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: GEO_TIMEOUT_MS,
      maximumAge: 5 * 60 * 1000,
    });
  });
}

export async function placeForCoordinates(
  latitude: number,
  longitude: number,
): Promise<Place> {
  try {
    return await placeFromCoordinates(latitude, longitude);
  } catch {
    return { name: "Unknown place", latitude, longitude };
  }
}

export function locationUnavailableMessage(
  source: "cache" | "fallback",
): string {
  if (source === "cache") {
    return "Using your last place — location access was not available.";
  }
  return "Using Rochester, NY — location access was not available.";
}

export async function resolveCurrentPlace(): Promise<{
  place: Place;
  source: PlaceResolveSource;
}> {
  try {
    const position = await readBrowserLocation();
    const place = await placeForCoordinates(
      position.coords.latitude,
      position.coords.longitude,
    );
    writeLastPlace(place);
    return { place, source: "gps" };
  } catch {
    const cached = readLastPlace();
    if (cached) return { place: cached, source: "cache" };
    return { place: ROCHESTER_NY, source: "fallback" };
  }
}
