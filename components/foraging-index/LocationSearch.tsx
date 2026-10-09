"use client";

import { useState, type FormEvent } from "react";

type LocationSearchProps = {
  onSearch: (query: string) => void;
  onUseMyLocation: () => void;
  disabled?: boolean;
  inputId?: string;
};

export function LocationSearch({
  onSearch,
  onUseMyLocation,
  disabled = false,
  inputId = "place-search",
}: LocationSearchProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={inputId}>
        City or latitude, longitude
      </label>
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="City and state, or lat, lon (43.16, -77.61)"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-azure"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream disabled:opacity-60"
        >
          Look up
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onUseMyLocation}
          className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-60"
        >
          Use my location
        </button>
      </div>
    </form>
  );
}
