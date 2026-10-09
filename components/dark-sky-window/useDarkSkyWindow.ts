"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  locationUnavailableMessage,
  placeForCoordinates,
  resolveCurrentPlace,
  writeLastPlace,
} from "@/lib/browser-place";
import { fetchDarkSky } from "@/lib/dark-sky-window/open-meteo";
import type { DarkSkySnapshot } from "@/lib/dark-sky-window/types";
import { ROCHESTER_NY } from "@/lib/foraging-index/constants";
import { parseLatLon } from "@/lib/foraging-index/format";
import { placesMatchingQuery } from "@/lib/foraging-index/geocode-query";
import { searchPlaces } from "@/lib/foraging-index/open-meteo";
import type { Place } from "@/lib/foraging-index/types";

type Status = "loading" | "ready" | "error";

export function useDarkSkyWindow() {
  const [place, setPlace] = useState<Place>(ROCHESTER_NY);
  const [sky, setSky] = useState<DarkSkySnapshot | null>(null);
  const [matches, setMatches] = useState<Place[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const requestId = useRef(0);

  const loadSky = useCallback(async (next: Place) => {
    const id = requestId.current + 1;
    requestId.current = id;
    setStatus("loading");
    setMessage(null);
    setMatches(null);
    setPlace(next);
    writeLastPlace(next);
    try {
      const data = await fetchDarkSky(next);
      if (id !== requestId.current) return;
      setSky(data);
      setStatus("ready");
    } catch (error) {
      if (id !== requestId.current) return;
      setSky(null);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not load sky data");
    }
  }, []);

  const useMyLocation = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    setMatches(null);
    const { place, source } = await resolveCurrentPlace();
    await loadSky(place);
    if (source !== "gps") {
      setMessage(locationUnavailableMessage(source));
    }
  }, [loadSky]);

  const search = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) return;
      setStatus("loading");
      setMessage(null);
      setMatches(null);
      const coords = parseLatLon(query);
      if (coords) {
        await loadSky(
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
          if (only) await loadSky(only);
          return;
        }
        setMatches(found);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Search failed");
      }
    },
    [loadSky],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { place, source } = await resolveCurrentPlace();
      if (cancelled) return;
      await loadSky(place);
      if (!cancelled && source !== "gps") {
        setMessage(locationUnavailableMessage(source));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadSky]);

  const selectPlace = useCallback(
    (next: Place) => {
      void loadSky(next);
    },
    [loadSky],
  );

  return { place, sky, status, message, matches, search, selectPlace, useMyLocation };
}
