import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { AuroraBackdrop } from "@/components/site/AuroraBackdrop";
import { BrandKicker } from "@/components/site/BrandKicker";
import { ToolGroupSection } from "@/components/site/ToolGroupSection";
import { toolGroups, tools, toolsInGroup, toolHref } from "@/components/site/tools";
import { utilitiesItemListJsonLd } from "@/lib/site";

const description =
  "Browse Hemloc’s free browser tools: foraging weather, stargazing hours, and historical lookups. No account required.";

export const metadata: Metadata = {
  title: "Utilities",
  description,
  alternates: { canonical: "/utilities" },
  openGraph: {
    url: "/utilities",
    title: "Utilities",
    description,
  },
};

export default function UtilitiesPage() {
  return (
    <div className="relative">
      <JsonLd
        data={utilitiesItemListJsonLd(
          tools.map((tool) => ({
            name: tool.title,
            path: toolHref(tool.slug),
          })),
        )}
      />
      <AuroraBackdrop />
      <main
        id="main-content"
        className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Utilities" },
          ]}
        />
        <BrandKicker text="Utilities" />
        <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Utilities for adventurers, doers, and curious minds.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted">
          We've started with a couple of tools and we'll keep adding more as we go. What will you do today? What will you discover?
        </p>
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
