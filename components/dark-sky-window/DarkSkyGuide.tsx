import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { BORTLE_GUIDE_PATH } from "@/lib/dark-sky-window/constants";

const FAQS = [
  {
    question: "What makes a prime stargazing window?",
    answer:
      "Clear night hours with low cloud cover, decent air clarity, a darker moon, and less estimated light pollution score higher. Consecutive hours at or above 60 count as a prime stretch.",
  },
  {
    question: "Does this use a real light-pollution satellite map?",
    answer:
      "No. Open-Meteo has no night-lights layer. Bortle class is estimated from the named place’s population in geocoding. A city park can still be darker than that town-wide estimate.",
  },
  {
    question: "Where do moon phase and transparency come from?",
    answer:
      "Moon phase, cloud cover, humidity, visibility, and precipitation come from the Open-Meteo forecast. Aerosol optical depth, when available, comes from Open-Meteo’s air-quality API.",
  },
];

export function DarkSkyGuide() {
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
    <section className="mt-14 space-y-8" aria-labelledby="dark-sky-how">
      <JsonLd data={jsonLd} />
      <div>
        <h2
          id="dark-sky-how"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          How dark sky window works
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          The tool scores upcoming night hours so you can see when the sky is
          actually worth a look. Clouds weigh most, then atmospheric
          transparency, moonlight, and an estimate of local sky brightness.
          Rain or a socked-in deck will cap the score.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Search any city or coordinates. Use it as hourly scouting, not a
          guarantee of the Milky Way. Parks, ridgelines, and your backyard can
          differ from the named town.
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
        Forecast and air data from{" "}
        <a
          href="https://open-meteo.com/"
          rel="noopener noreferrer"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Open-Meteo
        </a>
        {". Related: "}
        <Link
          href={BORTLE_GUIDE_PATH}
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          How we estimate Bortle class
        </Link>
        {", "}
        <Link
          href="/utilities/foraging-index"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Foraging index
        </Link>
        {", "}
        <Link
          href="/utilities/historical-weather"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Historical weather
        </Link>
        {"."}
      </p>
    </section>
  );
}
