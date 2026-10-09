"use client";

import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ARCHIVE_START } from "@/lib/historical-weather/constants";
import { isSelectableDate } from "@/lib/historical-weather/dates";

type DateFieldProps = {
  value: string;
  max: string;
  disabled?: boolean;
  clearOnCommit?: boolean;
  onCommit: (iso: string) => void;
  className?: string;
};

export function DateField({
  value,
  max,
  disabled = false,
  clearOnCommit = false,
  onCommit,
  className,
}: DateFieldProps) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clearOnCommit || focused.current) return;
    setDraft(value);
  }, [value, clearOnCommit]);

  function commit(next: string) {
    if (!isSelectableDate(next, max)) return false;
    if (next === value && !clearOnCommit) return true;
    onCommit(next);
    if (clearOnCommit) setDraft("");
    return true;
  }

  function openPicker() {
    const picker = pickerRef.current;
    if (!picker || disabled) return;
    try {
      picker.showPicker();
    } catch {
      picker.focus();
      picker.click();
    }
  }

  const pickerValue = isSelectableDate(draft, max) ? draft : value;

  return (
    <div className="relative min-w-0 w-full">
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        placeholder="YYYY-MM-DD"
        value={draft}
        disabled={disabled}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          commit(next);
        }}
        onBlur={() => {
          focused.current = false;
          if (clearOnCommit) {
            setDraft("");
            return;
          }
          if (!commit(draft)) setDraft(value);
        }}
        className={`pr-10 ${className ?? ""}`}
      />
      <input
        ref={pickerRef}
        type="date"
        min={ARCHIVE_START}
        max={max}
        value={pickerValue || value}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const next = event.target.value;
          if (!next) return;
          setDraft(next);
          commit(next);
        }}
        className="pointer-events-none absolute inset-y-0 right-0 w-10 opacity-0"
      />
      <button
        type="button"
        disabled={disabled}
        aria-label="Choose date from calendar"
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={openPicker}
        className="absolute inset-y-0 right-0 z-10 flex w-10 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Calendar aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
