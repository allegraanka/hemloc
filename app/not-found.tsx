import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="mx-auto flex-1 px-4 py-16 sm:px-6 sm:py-24"
      >
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          That page is not here.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted">
          The link may be old, or the URL might be typed wrong. Check Utilities for the list of tools.
        </p>
        <p className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream"
          >
            Home
          </Link>
          <Link
            href="/utilities"
            className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink"
          >
            All utilities
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
