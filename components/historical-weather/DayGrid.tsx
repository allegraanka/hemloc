"use client";

import { DayColumn } from "@/components/historical-weather/DayColumn";
import { dayDelta, pickBaseline } from "@/lib/historical-weather/compare";
import { formatLongDate } from "@/lib/historical-weather/format";
import type { HistoricalDay } from "@/lib/historical-weather/types";

type DayGridProps = {
  dates: string[];
  days: HistoricalDay[];
  today: string;
  disabled?: boolean;
  onChangeDate: (index: number, iso: string) => void;
  onRemove: (index: number) => void;
};

function gridClass(count: number): string {
  if (count <= 1) return "grid gap-4 max-w-md";
  if (count === 2) return "grid gap-4 sm:grid-cols-2";
  if (count === 3) return "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  return "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";
}

export function DayGrid({
  dates,
  days,
  today,
  disabled = false,
  onChangeDate,
  onRemove,
}: DayGridProps) {
  const comparing = dates.length > 1;
  const loaded = dates
    .map((date) => days.find((day) => day.date === date) ?? null)
    .filter((day): day is HistoricalDay => day !== null);
  const baseline = comparing ? pickBaseline(loaded, today) : null;
  const baselineLabel = baseline
    ? baseline.date === today
      ? "today"
      : formatLongDate(baseline.date)
    : "";

  return (
    <div className={gridClass(dates.length)}>
      {dates.map((date, index) => {
        const day = days.find((item) => item.date === date) ?? null;
        return (
          <DayColumn
            key={date}
            date={date}
            day={day}
            today={today}
            isBaseline={comparing && baseline?.date === date}
            delta={day && baseline ? dayDelta(day, baseline) : null}
            baselineLabel={baselineLabel}
            canRemove={dates.length > 1}
            disabled={disabled}
            onChangeDate={(iso) => onChangeDate(index, iso)}
            onRemove={() => onRemove(index)}
          />
        );
      })}
    </div>
  );
}
