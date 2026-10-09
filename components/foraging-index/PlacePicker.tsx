"use client";

import { formatCoords, formatPlaceName } from "@/lib/foraging-index/format";
import type { Place } from "@/lib/foraging-index/types";

type PlacePickerProps = {
  places: Place[];
  onSelect: (place: Place) => void;
  disabled?: boolean;
};

export function PlacePicker({ places, onSelect, disabled = false }: PlacePickerProps) {
  return (
    <section
      className="rounded-3xl border border-ink/8 bg-white/70 p-4 sm:p-5"
      aria-label="Matching places"
    >
      <p className="text-sm font-medium text-ink">
        Several places match. Choose one:
      </p>
      <ul className="mt-3 grid gap-2">
        {places.map((place) => (
          <li key={`${place.name}-${place.latitude}-${place.longitude}`}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(place)}
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-left disabled:opacity-60 hover:border-azure/40 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-azure"
            >
              <span className="block text-sm font-medium text-ink">
                {formatPlaceName(place)}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {formatCoords(place.latitude, place.longitude)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
