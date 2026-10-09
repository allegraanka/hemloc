import type { Metadata } from "next";
import { BortleGuide } from "@/components/dark-sky-window/BortleGuide";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BrandKicker } from "@/components/site/BrandKicker";
import { JsonLd } from "@/components/site/JsonLd";
import { BORTLE_GUIDE_PATH } from "@/lib/dark-sky-window/constants";
import { articleJsonLd } from "@/lib/site";

const title = "How Hemloc estimates Bortle class";
const description =
  "Dark sky window does not use a satellite night-lights map. Bortle class is estimated from the named place’s population in Open-Meteo geocoding.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Bortle scale",
    "Bortle class estimate",
    "light pollution stargazing",
    "Hemloc dark sky window",
  ],
  alternates: { canonical: BORTLE_GUIDE_PATH },
  openGraph: {
    url: BORTLE_GUIDE_PATH,
    title,
    description,
    type: "article",
  },
};

export default function BortleScalePage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <JsonLd
        data={articleJsonLd({
          headline: title,
          description,
          path: BORTLE_GUIDE_PATH,
          datePublished: "2026-10-07",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Utilities", href: "/utilities" },
          { name: "Dark sky window", href: "/utilities/dark-sky-window" },
          { name: "Bortle class" },
        ]}
      />
      <BrandKicker text="Dark sky window" />
      <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        When Dark sky window shows “Bortle 7,” that is a town-size estimate, not
        a reading from your backyard. Here is the mapping, why class 1 never
        appears, and how it feeds the hourly score.
      </p>
      <div className="mt-10">
        <BortleGuide />
      </div>
    </main>
  );
}
