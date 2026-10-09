import type { Metadata } from "next";
import { HistoricalDisclaimer } from "@/components/historical-weather/HistoricalDisclaimer";
import { HistoricalGuide } from "@/components/historical-weather/HistoricalGuide";
import { HistoricalWeatherApp } from "@/components/historical-weather/HistoricalWeatherApp";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BrandKicker } from "@/components/site/BrandKicker";
import { JsonLd } from "@/components/site/JsonLd";
import { webAppJsonLd } from "@/lib/site";

const title = "Historical weather";
const description =
  "Look up a past date's weather, compare it to today, or line up several dates side by side. See highs, lows, rain, wind, and frost for any place.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "historical weather",
    "weather on this date",
    "compare weather to last year",
    "past weather lookup",
    "frost date weather",
  ],
  alternates: { canonical: "/utilities/historical-weather" },
  openGraph: {
    url: "/utilities/historical-weather",
    title,
    description,
  },
};

export default function HistoricalWeatherPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <JsonLd
        data={webAppJsonLd({
          name: title,
          path: "/utilities/historical-weather",
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
      <BrandKicker text="Weather" />
      <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
        One date, today versus a past date, or several dates side by side.
        Highs, lows, precipitation, and a frost flag when the overnight low was
        at or below freezing.
      </p>
      <div className="mt-6 max-w-3xl">
        <HistoricalDisclaimer />
      </div>
      <div className="mt-8">
        <HistoricalWeatherApp />
      </div>
      <div className="max-w-3xl">
        <HistoricalGuide />
      </div>
    </main>
  );
}
