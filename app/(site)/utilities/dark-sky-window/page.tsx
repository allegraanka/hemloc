import type { Metadata } from "next";
import { DarkSkyDisclaimer } from "@/components/dark-sky-window/DarkSkyDisclaimer";
import { DarkSkyGuide } from "@/components/dark-sky-window/DarkSkyGuide";
import { DarkSkyWindowApp } from "@/components/dark-sky-window/DarkSkyWindowApp";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BrandKicker } from "@/components/site/BrandKicker";
import { JsonLd } from "@/components/site/JsonLd";
import { webAppJsonLd } from "@/lib/site";

const title = "Dark sky window";
const description =
  "Find prime stargazing hours from moon phase, cloud cover, atmospheric transparency, and estimated light pollution. Free, no account.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "stargazing hours",
    "best time to stargaze",
    "moon phase clouds",
    "dark sky window",
  ],
  alternates: { canonical: "/utilities/dark-sky-window" },
  openGraph: {
    url: "/utilities/dark-sky-window",
    title,
    description,
  },
};

export default function DarkSkyWindowPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <JsonLd
        data={webAppJsonLd({
          name: title,
          path: "/utilities/dark-sky-window",
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
      <BrandKicker text="Stargazing and Outdoor conditions" />
      <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Hourly scouting for the next few nights. The score combines clouds, air
        clarity, moonlight, and an estimate of local sky brightness so you can
        see when it is actually worth going out.
      </p>
      <div className="mt-6">
        <DarkSkyDisclaimer />
      </div>
      <div className="mt-8">
        <DarkSkyWindowApp />
      </div>
      <DarkSkyGuide />
    </main>
  );
}
