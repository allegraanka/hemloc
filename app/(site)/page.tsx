import type { Metadata } from "next";
import { PerfectDayFor } from "@/components/PerfectDayFor";
import { JsonLd } from "@/components/site/JsonLd";
import { AuroraBackdrop } from "@/components/site/AuroraBackdrop";
import { BrandKicker } from "@/components/site/BrandKicker";
import { ToolGroupSection } from "@/components/site/ToolGroupSection";
import { toolGroups, tools, toolsInGroup, toolHref } from "@/components/site/tools";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  utilitiesItemListJsonLd,
  websiteJsonLd,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: "/",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <div className="relative">
      <JsonLd
        data={[
          websiteJsonLd(),
          utilitiesItemListJsonLd(
            tools.map((tool) => ({
              name: tool.title,
              path: toolHref(tool.slug),
            })),
          ),
        ]}
      />
      <AuroraBackdrop />
      <main
        id="main-content"
        className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      >
        <BrandKicker text="Wherever you are" />
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
          A collection of tools for adventurers.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
          Hemloc is a collection of utilities designed to help you plan your day, from your morning walk to that project you've been putting off, or your next fun adventure.
          Defaults to your current location. All tools run in your browser. No accounts. Free to use. We'll keep adding more tools over time.
        </p>

        <div className="mt-10 max-w-3xl">
          <PerfectDayFor />
        </div>

        {toolGroups.map((group) => (
          <ToolGroupSection
            key={group.id}
            title={group.title}
            tools={toolsInGroup(group.id)}
          />
        ))}
      </main>
    </div>
  );
}