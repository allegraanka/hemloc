"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  locationUnavailableMessage,
  placeForCoordinates,
  resolveCurrentPlace,
  writeLastPlace,
} from "@/lib/browser-place";
import { ROCHESTER_NY } from "@/lib/foraging-index/constants";
import { parseLatLon } from "@/lib/foraging-index/format";
import { placesMatchingQuery } from "@/lib/foraging-index/geocode-query";
import { fetchForecast, searchPlaces } from "@/lib/foraging-index/open-meteo";
import type { ForagingWeather, Place } from "@/lib/foraging-index/types";

type Status = "loading" | "ready" | "error";

export function useForagingIndex() {
  const [place, setPlace] = useState<Place>(ROCHESTER_NY);
  const [weather, setWeather] = useState<ForagingWeather | null>(null);
  const [matches, setMatches] = useState<Place[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const requestId = useRef(0);

  const loadWeather = useCallback(async (next: Place) => {
    const id = requestId.current + 1;
    requestId.current = id;
    setStatus("loading");
    setMessage(null);
    setMatches(null);
    setPlace(next);
    writeLastPlace(next);
    try {
      const data = await fetchForecast(next.latitude, next.longitude);
      if (id !== requestId.current) return;
      setWeather(data);
      setStatus("ready");
    } catch (error) {
      if (id !== requestId.current) return;
      setWeather(null);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not load weather");
    }
  }, []);

  const useMyLocation = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    setMatches(null);
    const { place, source } = await resolveCurrentPlace();
    await loadWeather(place);
    if (source !== "gps") {
      setMessage(locationUnavailableMessage(source));
    }
  }, [loadWeather]);

  const search = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) return;

      setStatus("loading");
      setMessage(null);
      setMatches(null);

      const coords = parseLatLon(query);
      if (coords) {
        await loadWeather(
          await placeForCoordinates(coords.latitude, coords.longitude),
        );
        return;
      }

      try {
        const found = placesMatchingQuery(await searchPlaces(query), query);
        if (found.length === 0) {
          setStatus("error");
          setMessage(`No location matched “${query}”.`);
          return;
        }
        if (found.length === 1) {
          const only = found[0];
          if (only) await loadWeather(only);
          return;
        }
        setMatches(found);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Search failed");
      }
    },
    [loadWeather],
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { place, source } = await resolveCurrentPlace();
      if (cancelled) return;
      await loadWeather(place);
      if (!cancelled && source !== "gps") {
        setMessage(locationUnavailableMessage(source));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadWeather]);

  const selectPlace = useCallback(
    (next: Place) => {
      void loadWeather(next);
    },
    [loadWeather],
  );

  return { place, weather, status, message, matches, search, selectPlace, useMyLocation };
}
