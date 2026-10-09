import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";

const FAQS = [
  {
    question: "Does the foraging index tell me what is safe to pick?",
    answer:
      "No. It only scores recent weather and season. You still need your own knowledge of habitat, species, and local rules.",
  },
  {
    question: "What weather does it look at?",
    answer:
      "The last 14 days of rainfall, soil temperature in the top 10 cm, air temperature, and the season implied by those dates and your hemisphere.",
  },
  {
    question: "Can I check a place besides my current location?",
    answer:
      "Yes. Search a city and state, or paste latitude and longitude. If several places match, you pick one.",
  },
];

export function ForagingGuide() {
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
    <section className="mt-14 space-y-8" aria-labelledby="foraging-how">
      <JsonLd data={jsonLd} />
      <div>
        <h2
          id="foraging-how"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          How the foraging index works
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          This is a weather scouting tool, not a field guide. It uses Open-Meteo
          rainfall, soil temperature, and air temperature for a place you
          choose, then compares that window to conditions that often favor a
          walk. Habitat, trees, and what you actually forage are still on you.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Rain carries the most weight, then soil warmth, then air temperature,
          with a season modifier. A dry stretch will cap the score even if the
          air feels pleasant. Use it to decide whether the weather is worth
          going out — not what to put in a basket.
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
        Weather data from{" "}
        <a
          href="https://open-meteo.com/"
          rel="noopener noreferrer"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Open-Meteo</a>. Related:{" "}
        <Link
          href="/utilities/dark-sky-window"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          Dark sky window
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
