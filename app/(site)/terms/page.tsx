import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for Hemloc browser tools on hemloc.co. Provided as-is for general information.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Terms" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Terms
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Last updated October 8, 2026
      </p>
      <section className="mt-8 space-y-4 text-sm leading-7 text-muted" aria-labelledby="terms-body">
        <h2 id="terms-body" className="sr-only">
          Terms of use
        </h2>
        <p>
          Hemloc tools are provided as-is for general information. They are not
          professional advice (including weather, gardening, foraging, or
          financial advice). You are responsible for how you use the results.
        </p>
        <p>
          Weather and place data come from third-party services. Model output
          can differ from a local station or what you see outside. Pages may
          change or come down without notice. If a tool stores data in
          localStorage, clearing your browser data will remove it.
        </p>
      </section>
    </main>
  );
}
