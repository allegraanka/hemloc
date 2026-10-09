"use client";

import { DateField } from "@/components/historical-weather/DateField";
import { MAX_DATES } from "@/lib/historical-weather/constants";

type DateToolbarProps = {
  today: string;
  dates: string[];
  disabled?: boolean;
  onAddDate: (iso?: string) => void;
};

export function DateToolbar({
  today,
  dates,
  disabled = false,
  onAddDate,
}: DateToolbarProps) {
  const canAdd = dates.length < MAX_DATES && !disabled;
  const hasToday = dates.includes(today);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <button
        type="button"
        disabled={!canAdd || hasToday}
        onClick={() => onAddDate(today)}
        className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream disabled:opacity-50"
      >
        Add today
      </button>
      <button
        type="button"
        disabled={!canAdd}
        onClick={() => onAddDate()}
        className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
      >
        Add another date
      </button>
      <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-muted sm:max-w-56">
        Jump to a date
        <DateField
          value=""
          max={today}
          disabled={!canAdd}
          clearOnCommit
          onCommit={(iso) => onAddDate(iso)}
          className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        />
      </label>
      <p className="text-xs text-muted sm:w-full">
        Up to {MAX_DATES} days, newest on the left and oldest on the right.
        Change any card’s date, or remove extras to look at a single day.
      </p>
    </div>
  );
}
