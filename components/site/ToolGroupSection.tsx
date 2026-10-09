import { ToolCard } from "@/components/site/ToolCard";
import { type Tool } from "@/components/site/tools";

export function ToolGroupSection({
  title,
  tools,
}: {
  title: string;
  tools: Tool[];
}) {
  if (tools.length === 0) return null;

  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-tools`;

  return (
    <section className="mt-14" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-display text-lg font-bold tracking-tight text-ink"
      >
        {title}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
