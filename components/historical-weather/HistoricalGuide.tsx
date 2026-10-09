import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";

const FAQS = [
  {
    question: "Where does the weather data come from?",
    answer:
      "Open-Meteo. Dates older than a few days use the Historical Weather API, based on ECMWF ERA5 reanalysis. Today and the last few days use Open-Meteo’s forecast API, because the archive usually lags about five days.",
  },
  {
    question: "How far back can I look?",
    answer:
      "Daily values start on 1 January 1940, the beginning of the ERA5 coverage Open-Meteo exposes. Dates after today are not accepted.",
  },
  {
    question: "Is this the same as a local weather station?",
    answer:
      "No. Reanalysis and forecast models estimate conditions on a grid, not a thermometer in your backyard. Use it for a quick lookup or a comparison, not as an official climate record or National Weather Service observation.",
  },
  {
    question: "What does the frost badge mean?",
    answer:
      "The overnight low was at or below 32 °F (0 °C). It is a flag for that day, not a first- or last-frost-of-the-season calculator.",
  },
  {
    question: "Can I look up one date or several?",
    answer:
      "Both. Remove extra cards for a single day, keep today plus a past date to compare, or add up to four dates side by side. Cards sort newest on the left and oldest on the right. Differences are versus today when today is in the set, otherwise versus the leftmost date.",
  },
  {
    question: "Why is today labeled forecast instead of archive?",
    answer:
      "The historical archive typically lags about five days. Recent dates still fill in from the forecast endpoint so you can compare them to older archive days.",
  },
];

export function HistoricalGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="mt-14 space-y-8" aria-labelledby="historical-how">
      <JsonLd data={jsonLd} />
      <div>
        <h2
          id="historical-how"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          How historical weather works
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          This is a daily lookup for your current location or a place you choose. Open-Meteo’s historical
          archive runs from 1 January 1940 through a few days ago and is based
          on ECMWF ERA5 reanalysis—a global reconstruction of past weather,
          not a station log. Today and the last few days come from Open-Meteo’s
          forecast API.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Each date is a column: sky, high and low, precipitation, snow, wind,
          sunshine, and sunrise/sunset. A frost badge appears when the overnight
          low was at or below freezing. Keep one day, compare a past date to
          today, or line up as many as four dates side by side — newest on the
          left, oldest on the right.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Search any city or coordinates. Highs and lows are shown in °F and °C;
          rain in inches and millimeters. Use it as a browser lookup, not a
          substitute for a local station or official records.
        </p>
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Common questions
        </h2>
        <dl className="mt-4 space-y-5">
          {FAQS.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-semibold text-ink">{item.question}</dt>
              <dd className="mt-1.5 text-sm leading-7 text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-sm text-muted">
        Archive and forecast data from{" "}
        <a
          href="https://open-meteo.com/"
          rel="noopener noreferrer"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Open-Meteo
        </a>
        {". Related: "}
        <Link
          href="/utilities/foraging-index"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Foraging index
        </Link>
        {", "}
        <Link
          href="/utilities/dark-sky-window"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Dark sky window
        </Link>
        {"."}
      </p>
    </section>
  );
}
