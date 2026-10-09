import { MAX_PLACE_MATCHES } from "@/lib/foraging-index/constants";
import { GEOCODING_QUALIFIERS } from "@/lib/foraging-index/geocode-qualifiers";
import type { Place } from "@/lib/foraging-index/types";

function collapseSpaces(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeCommas(value: string): string {
  return collapseSpaces(value)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

function insertQualifierComma(query: string): string | null {
  const lower = query.toLowerCase();
  for (const qualifier of GEOCODING_QUALIFIERS) {
    if (lower === qualifier) return null;
    if (!lower.endsWith(` ${qualifier}`)) continue;
    const city = query.slice(0, query.length - qualifier.length).trim();
    const region = query.slice(query.length - qualifier.length).trim();
    if (!city) return null;
    return `${city}, ${region}`;
  }
  return null;
}

export function normalizeGeocodingQuery(raw: string): string {
  const trimmed = collapseSpaces(raw);
  if (!trimmed) return trimmed;
  if (trimmed.includes(",")) return normalizeCommas(trimmed);
  return insertQualifierComma(trimmed) ?? trimmed;
}

export function geocodingQueryCandidates(raw: string): string[] {
  const trimmed = collapseSpaces(raw);
  const primary = normalizeGeocodingQuery(trimmed);
  const queries = [primary];

  if (!trimmed.includes(",") && primary === trimmed) {
    const parts = trimmed.split(" ");
    if (parts.length >= 2) {
      queries.push(`${parts.slice(0, -1).join(" ")}, ${parts[parts.length - 1]}`);
    }
    if (parts.length >= 3) {
      queries.push(
        `${parts.slice(0, -2).join(" ")}, ${parts.slice(-2).join(" ")}`,
      );
    }
  }

  return [...new Set(queries)];
}

export function placeNameFromQuery(query: string): string {
  return normalizeGeocodingQuery(query).split(",")[0]?.trim() ?? query.trim();
}

export function placesMatchingQuery(places: Place[], query: string): Place[] {
  const needle = placeNameFromQuery(query).toLowerCase();
  const exact = places.filter((place) => place.name.toLowerCase() === needle);
  const pool = exact.length > 0 ? exact : places;
  return [...pool]
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, MAX_PLACE_MATCHES);
}
