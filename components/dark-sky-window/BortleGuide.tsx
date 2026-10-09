import Link from "next/link";
import { BortleScaleTable } from "@/components/dark-sky-window/BortleScaleTable";
import { JsonLd } from "@/components/site/JsonLd";

const FAQS = [
  {
    question: "Why is a city park the same class as downtown?",
    answer:
      "The estimate follows the named place, not the acre you are standing on. A park inside a city of 200,000 still inherits that city’s population. It can be darker in person than the class suggests.",
  },
  {
    question: "Why do you never show Bortle 1?",
    answer:
      "Class 1 is an excellent dark-sky site. Town size cannot prove that. Hemloc starts at class 2 for the smallest named places, and only when geocoding has a tiny population.",
  },
  {
    question: "Does weather change the Bortle class?",
    answer:
      "No. Clouds, haze, and moonlight are scored separately each hour. Bortle here is only the light-pollution term, and it stays put for that named place.",
  },
  {
    question: "If I paste coordinates in the countryside, do I get a darker class?",
    answer:
      "Only if we can attach a small place’s population to those coordinates. If the name still resolves to a nearby city within about 80 km, you get that city’s class. If population is missing, Hemloc uses class 5.",
  },
];

export function BortleGuide() {
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
    <article className="space-y-10">
      <JsonLd data={jsonLd} />
      <section aria-labelledby="bortle-what">
        <h2
          id="bortle-what"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          The nine classes, briefly
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          John E. Bortle published a 1–9 scale in 2001 to describe how bright
          the night sky looks, from an excellent dark site (1) to an inner city
          (9). Hemloc borrows those class names as labels. We do not observe
          your zenith limiting magnitude, and we do not ingest a satellite
          night-lights map.
        </p>
      </section>

      <section aria-labelledby="bortle-how">
        <h2
          id="bortle-how"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          How Hemloc picks a class
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          Dark sky window pulls weather from Open-Meteo. That API has clouds,
          moon, humidity, visibility, and aerosol optical depth — and no Bortle
          layer. After a place is named, we take its geocoding population and
          map it to a class. If population is missing, we use class 5
          (suburban).
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          The table below is the same mapping the scorer uses. Rochester, NY,
          at roughly 210,000 people, lands in class 7.
        </p>
        <div className="mt-5">
          <BortleScaleTable />
        </div>
      </section>

      <section aria-labelledby="bortle-not">
        <h2
          id="bortle-not"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          What this is not
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          It is not a measurement at your lat/lon. A ridge, a lake, or a city
          park can be darker than the town name. For a map that paints actual
          night lights, use an external atlas; Dark sky window links out to one
          from the location card. Treat Hemloc’s class as a town-wide bias in
          the score, not a finding chart.
        </p>
      </section>

      <section aria-labelledby="bortle-score">
        <h2
          id="bortle-score"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          How it affects the stargazing score
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          Each night hour is 45% clouds, 25% transparency, 20% moonlight, and
          10% this light-pollution term. Class 1 would score 100 on that 10%;
          class 9 scores 0. A clear, moonless night in a class-7 city can still
          be a prime window. Socked-in clouds will not.
        </p>
        <p className="mt-4">
          <Link
            href="/utilities/dark-sky-window"
            className="inline-flex rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream"
          >
            Open dark sky window
          </Link>
        </p>
      </section>

      <section aria-labelledby="bortle-faq">
        <h2
          id="bortle-faq"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
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
      </section>

      <p className="text-sm text-muted">
        This page describes the estimate used in{" "}
        <Link
          href="/utilities/dark-sky-window"
          className="font-medium text-azure underline-offset-2 hover:underline"
        >
          dark sky window</Link>. It is not John Bortle’s original observing
        article.
      </p>
    </article>
  );
}
