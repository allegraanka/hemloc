import Link from "next/link";
import { BORTLE_GUIDE_PATH } from "@/lib/dark-sky-window/constants";

export function DarkSkyDisclaimer() {
  return (
    <aside
      className="rounded-3xl border border-coral/40 bg-coral/10 px-4 py-4 text-sm leading-6 text-ink sm:px-5"
      role="note"
    >
      <p className="font-semibold text-ink">Sky scouting only</p>
      <p className="mt-2 text-ink/80">
        Clouds, moonlight, humidity, visibility, and aerosol optical depth come
        from Open-Meteo. Light pollution is estimated from the named place’s
        size in Open-Meteo geocoding — not a satellite night-lights map. Local
        parks can be darker than the town name suggests.{" "}
        <Link
          href={BORTLE_GUIDE_PATH}
          className="font-medium text-ink underline decoration-coral/50 underline-offset-2 hover:decoration-coral"
        >
          How we estimate Bortle class
        </Link>
        .
      </p>
    </aside>
  );
}
