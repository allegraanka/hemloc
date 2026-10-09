"use client";

import Link from "next/link";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { toolHref, type Tool } from "@/components/site/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={toolHref(tool.slug)}
      className="block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
    >
      <SpotlightCard className="h-full p-6">
        <article>
          <h3 className="font-display text-xl font-bold tracking-tight text-ink">
            {tool.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">{tool.description}</p>
        </article>
      </SpotlightCard>
    </Link>
  );
}
