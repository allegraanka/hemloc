"use client";

import { HourlyTable } from "@/components/dark-sky-window/HourlyTable";
import { NightGauge } from "@/components/dark-sky-window/NightGauge";
import { NightList } from "@/components/dark-sky-window/NightList";
import { WindowSummary } from "@/components/dark-sky-window/WindowSummary";
import { useDarkSkyWindow } from "@/components/dark-sky-window/useDarkSkyWindow";
import { LocationSearch } from "@/components/foraging-index/LocationSearch";
import { PlacePicker } from "@/components/foraging-index/PlacePicker";

export function DarkSkyWindowApp() {
  const { place, sky, status, message, matches, search, selectPlace, useMyLocation } =
    useDarkSkyWindow();
  const busy = status === "loading";

  return (
    <div className="space-y-6">
      <LocationSearch
        inputId="dark-sky-location"
        onSearch={search}
        onUseMyLocation={() => {
          void useMyLocation();
        }}
        disabled={busy}
      />

      {matches ? (
        <PlacePicker places={matches} onSelect={selectPlace} disabled={busy} />
      ) : null}

      {message ? (
        <p className="text-sm text-coral" role="status">
          {message}
        </p>
      ) : null}

      {busy && !sky ? (
        <p className="text-sm text-muted" role="status">
          Loading night sky conditions…
        </p>
      ) : null}

      {sky ? (
        <>
          <WindowSummary place={place} sky={sky} />
          <NightGauge sky={sky} />
          <NightList nights={sky.nights} />
          <HourlyTable hours={sky.hours} nights={sky.nights} />
        </>
      ) : null}
    </div>
  );
}
