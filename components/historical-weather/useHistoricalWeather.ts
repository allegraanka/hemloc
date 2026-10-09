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
import { searchPlaces } from "@/lib/foraging-index/open-meteo";
import type { Place } from "@/lib/foraging-index/types";
import {
  appendDate,
  removeDateAt,
  replaceDateAt,
  sortNewestFirst,
} from "@/lib/historical-weather/date-list";
import { browserToday, defaultDates, todayInTimeZone } from "@/lib/historical-weather/dates";
import { fetchHistoricalDays } from "@/lib/historical-weather/open-meteo";
import type { HistoricalSnapshot } from "@/lib/historical-weather/types";

type Status = "loading" | "ready" | "error";

export function useHistoricalWeather() {
  const seedToday = useRef(browserToday());
  const [place, setPlace] = useState<Place>(ROCHESTER_NY);
  const [today, setToday] = useState(seedToday.current);
  const [dates, setDates] = useState(() => defaultDates(seedToday.current));
  const [snapshot, setSnapshot] = useState<HistoricalSnapshot | null>(null);
  const [matches, setMatches] = useState<Place[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [located, setLocated] = useState(false);
  const requestId = useRef(0);

  const loadDays = useCallback(
    async (nextPlace: Place, nextDates: string[], nextToday: string) => {
      const id = requestId.current + 1;
      requestId.current = id;
      setStatus("loading");
      try {
        const data = await fetchHistoricalDays(
          nextPlace.latitude,
          nextPlace.longitude,
          nextDates,
          nextToday,
        );
        if (id !== requestId.current) return;
        setSnapshot(data);
        setStatus("ready");
        const tzToday = todayInTimeZone(data.timezone);
        if (tzToday !== seedToday.current) {
          const previous = seedToday.current;
          seedToday.current = tzToday;
          setToday(tzToday);
          setDates((prev) =>
            sortNewestFirst([...new Set(prev.map((d) => (d === previous ? tzToday : d)))]),
          );
        }
      } catch (error) {
        if (id !== requestId.current) return;
        setSnapshot(null);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not load weather");
      }
    },
    [],
  );

  useEffect(() => {
    if (!located) return;
    void loadDays(place, dates, today);
  }, [located, place, dates, today, loadDays]);

  const applyPlace = useCallback((next: Place) => {
    setMatches(null);
    setPlace(next);
    writeLastPlace(next);
    setLocated(true);
  }, []);

  const useMyLocation = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    setMatches(null);
    const { place, source } = await resolveCurrentPlace();
    applyPlace(place);
    if (source !== "gps") {
      setMessage(locationUnavailableMessage(source));
    }
  }, [applyPlace]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { place, source } = await resolveCurrentPlace();
      if (cancelled) return;
      setPlace(place);
      writeLastPlace(place);
      if (source !== "gps") {
        setMessage(locationUnavailableMessage(source));
      }
      setLocated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const search = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) return;
      setStatus("loading");
      setMessage(null);
      setMatches(null);
      const coords = parseLatLon(query);
      if (coords) {
        applyPlace(await placeForCoordinates(coords.latitude, coords.longitude));
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
          if (only) applyPlace(only);
          return;
        }
        setMatches(found);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Search failed");
      }
    },
    [applyPlace],
  );

  const changeDate = useCallback(
    (index: number, next: string) => {
      const result = replaceDateAt(dates, index, next, today);
      setMessage(result.error);
      setDates(result.dates);
    },
    [dates, today],
  );

  const addDate = useCallback(
    (iso?: string) => {
      const result = appendDate(dates, today, iso);
      setMessage(result.error);
      setDates(result.dates);
    },
    [dates, today],
  );

  const removeDate = useCallback((index: number) => {
    setDates((prev) => removeDateAt(prev, index));
    setMessage(null);
  }, []);

  return {
    place,
    today,
    dates,
    snapshot,
    matches,
    status,
    message,
    search,
    selectPlace: applyPlace,
    useMyLocation,
    changeDate,
    addDate,
    removeDate,
  };
}
