"use client";

import { ConditionsGauge } from "@/components/foraging-index/ConditionsGauge";
import { DailyTable } from "@/components/foraging-index/DailyTable";
import { LocationSearch } from "@/components/foraging-index/LocationSearch";
import { PlacePicker } from "@/components/foraging-index/PlacePicker";
import { WeatherSummary } from "@/components/foraging-index/WeatherSummary";
import { useForagingIndex } from "@/components/foraging-index/useForagingIndex";
import { scoreForagingConditions } from "@/lib/foraging-index/score";

export function ForagingIndexApp() {
  const { place, weather, status, message, matches, search, selectPlace, useMyLocation } =
    useForagingIndex();
  const busy = status === "loading";
  const conditions = weather
    ? scoreForagingConditions(weather, place.latitude)
    : null;

  return (
    <div className="space-y-6">
      <LocationSearch
        onSearch={search}
        onUseMyLocation={() => {
          void useMyLocation();
        }}
        disabled={busy}
      />

      {matches ? (
        <PlacePicker
          places={matches}
          onSelect={selectPlace}
          disabled={busy}
        />
      ) : null}

      {message ? (
        <p className="text-sm text-coral" role="status">
          {message}
        </p>
      ) : null}

      {busy && !weather ? (
        <p className="text-sm text-muted" role="status">
          Loading recent weather…
        </p>
      ) : null}

      {weather && conditions ? (
        <>
          <WeatherSummary place={place} weather={weather} />
          <ConditionsGauge conditions={conditions} />
          <DailyTable days={weather.days} />
        </>
      ) : null}
    </div>
  );
}
