"use client";

import { LocationSearch } from "@/components/foraging-index/LocationSearch";
import { PlacePicker } from "@/components/foraging-index/PlacePicker";
import { DateToolbar } from "@/components/historical-weather/DateToolbar";
import { DayGrid } from "@/components/historical-weather/DayGrid";
import { PlaceSummary } from "@/components/historical-weather/PlaceSummary";
import { useHistoricalWeather } from "@/components/historical-weather/useHistoricalWeather";

export function HistoricalWeatherApp() {
  const {
    place,
    today,
    dates,
    snapshot,
    matches,
    status,
    message,
    search,
    selectPlace,
    useMyLocation,
    changeDate,
    addDate,
    removeDate,
  } = useHistoricalWeather();
  const busy = status === "loading";

  return (
    <div className="space-y-6">
      <LocationSearch
        onSearch={search}
        onUseMyLocation={() => {
          void useMyLocation();
        }}
        disabled={busy}
        inputId="historical-place-search"
      />

      {matches ? (
        <PlacePicker places={matches} onSelect={selectPlace} disabled={busy} />
      ) : null}

      <DateToolbar
        today={today}
        dates={dates}
        disabled={busy && !snapshot}
        onAddDate={addDate}
      />

      {message ? (
        <p className="text-sm text-coral" role="status">
          {message}
        </p>
      ) : null}

      {busy && !snapshot ? (
        <p className="text-sm text-muted" role="status">
          Loading daily weather…
        </p>
      ) : null}

      {snapshot ? (
        <>
          <PlaceSummary
            place={place}
            timezone={snapshot.timezone}
            dateCount={dates.length}
            includesToday={dates.includes(today)}
          />
          <DayGrid
            dates={dates}
            days={snapshot.days}
            today={today}
            onChangeDate={changeDate}
            onRemove={removeDate}
          />
        </>
      ) : null}
    </div>
  );
}
