import { NightHourGroup } from "@/components/dark-sky-window/NightHourGroup";
import { BAND_FILL, NIGHT_BANDS } from "@/lib/dark-sky-window/bands";
import { formatWeekday } from "@/lib/dark-sky-window/format";
import { groupNightHours } from "@/lib/dark-sky-window/windows";
import type { HourlySkyRow, NightWindow } from "@/lib/dark-sky-window/types";

type HourlyTableProps = {
  hours: HourlySkyRow[];
  nights: NightWindow[];
};

export function HourlyTable({ hours, nights }: HourlyTableProps) {
  const groups = groupNightHours(hours);
  const windowByNight = new Map(nights.map((night) => [night.nightOf, night]));

  return (
    <section className="rounded-3xl border border-ink/8 bg-white/70">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Hour by hour
        </h2>
        <p className="font-display mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Night forecast
        </p>
        <p className="mt-1 text-sm text-muted">
          One bar per hour. Highlighted hours are that night’s best stretch.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          {NIGHT_BANDS.map((band) => (
            <li key={band} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={`size-2 rounded-full ${BAND_FILL[band]}`}
              />
              {band}
            </li>
          ))}
        </ul>
      </div>

      {groups.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted sm:px-6">
          No night hours in this forecast yet.
        </p>
      ) : (
        <div className="mt-2">
          {groups.map((group, index) => (
            <NightHourGroup
              key={group.nightOf}
              nightOf={group.nightOf}
              label={index === 0 ? "Tonight" : formatWeekday(group.nightOf)}
              hours={group.hours}
              stretch={windowByNight.get(group.nightOf)}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
