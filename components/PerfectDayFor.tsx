"use client";

import { useEffect, useState } from "react";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { resolveCurrentPlace } from "@/lib/browser-place";
import { fetchCurrentWeather, type CurrentWeather } from "@/lib/current-weather";
import { formatPlaceName } from "@/lib/foraging-index/format";
import type { Place } from "@/lib/foraging-index/types";
import { pickActivityLine } from "@/lib/pickActivityLine";
import {
  evaluateWeather,
  formatWeatherChip,
  type RankedScenario,
} from "@/lib/weatherScenarios";

type Status = "loading" | "ready" | "error";

type LoadedState = {
  place: Place;
  weather: CurrentWeather;
  scenario: RankedScenario;
  line: string;
};

async function loadForPlace(place: Place): Promise<LoadedState> {
  const weather = await fetchCurrentWeather(place.latitude, place.longitude);
  const scenario = evaluateWeather(weather).primary;
  return {
    place,
    weather,
    scenario,
    line: pickActivityLine(scenario.id, weather.timeOfDay, weather.isDay),
  };
}

function PerfectDaySkeleton({ label }: { label: string }) {
  return (
    <section aria-labelledby="todays-vibe-status">
      <SpotlightCard className="p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Today’s vibe
      </p>
      <h2
        id="todays-vibe-status"
        className="font-display mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      >
        Looking outside right now…
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">{label}</p>
      </SpotlightCard>
    </section>
  );
}

export function PerfectDayFor() {
  const [status, setStatus] = useState<Status>("loading");
  const [state, setState] = useState<LoadedState | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { place } = await resolveCurrentPlace();
        const next = await loadForPlace(place);
        if (!cancelled) {
          setState(next);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return <PerfectDaySkeleton label="Checking the sky over your neighborhood." />;
  }

  if (status === "error" || !state) {
    return (
      <PerfectDaySkeleton label="Couldn’t read the sky just now. A quiet indoor day still counts." />
    );
  }

  return (
    <section aria-labelledby="todays-vibe">
      <SpotlightCard className="p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Today’s vibe
        </p>
        <h2
          id="todays-vibe"
          className="font-display mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Looking outside right now…
        </h2>
        <p className="mt-2 text-sm font-medium text-coral">{state.scenario.title}</p>
        <p className="font-display mt-3 max-w-2xl text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
          {state.line}
        </p>
        <p className="mt-5 inline-flex max-w-full rounded-full border border-ink/10 bg-cream/80 px-3 py-1.5 text-xs font-medium text-ink sm:text-sm">
          {formatWeatherChip(state.weather)}
        </p>
        <p className="mt-3 text-xs text-muted">{formatPlaceName(state.place)}</p>
      </SpotlightCard>
    </section>
  );
}
