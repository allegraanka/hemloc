import type { Metadata } from "next";
import { ForagingDisclaimer } from "@/components/foraging-index/ForagingDisclaimer";
import { ForagingGuide } from "@/components/foraging-index/ForagingGuide";
import { ForagingIndexApp } from "@/components/foraging-index/ForagingIndexApp";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BrandKicker } from "@/components/site/BrandKicker";
import { JsonLd } from "@/components/site/JsonLd";
import { webAppJsonLd } from "@/lib/site";

const title = "Foraging index";
const description =
  "Check whether recent rain, warmth after rain, soil temperature, and current season favor a walk in the woods. Free weather scouting for any place.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "foraging weather",
    "foraging index",
    "soil temperature foraging",
    "recent rainfall forage",
  ],
  alternates: { canonical: "/utilities/foraging-index" },
  openGraph: {
    url: "/utilities/foraging-index",
    title,
    description,
  },
};

export default function ForagingIndexPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <JsonLd
        data={webAppJsonLd({
          name: title,
          path: "/utilities/foraging-index",
          description,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Utilities", href: "/utilities" },
          { name: title },
        ]}
      />
      <BrandKicker text="Environmental & Foraging" />
      <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Weather scouting from the last 14 days of rain, warmth after rain, soil temperature, and the current season. Use it to decide if conditions are worth a walk, not what is
        safe or ethical to forage.
      </p>
      <div className="mt-6">
        <ForagingDisclaimer />
      </div>
      <div className="mt-8">
        <ForagingIndexApp />
      </div>
      <ForagingGuide />
    </main>
  );
}
