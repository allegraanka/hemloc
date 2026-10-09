import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Hemloc handles location, weather requests, and localStorage on hemloc.co. There is no account.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Privacy
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Last updated October 8, 2026
      </p>
      <div className="mt-8 space-y-8 text-sm leading-7 text-muted">
        <section className="space-y-3" aria-labelledby="privacy-account">
          <h2 id="privacy-account" className="font-display text-lg font-bold text-ink">
            No account
          </h2>
          <p>
            Hemloc is a set of browser tools. There is no Hemloc account, no
            waitlist, and no login. We do not collect a name or email to use
            these pages. Hemloc does not run a backend that receives your
            weather lookups.
          </p>
        </section>
        <section className="space-y-3" aria-labelledby="privacy-location">
          <h2 id="privacy-location" className="font-display text-lg font-bold text-ink">
            Location
          </h2>
          <p>
            The homepage “today’s vibe” card and each weather tool may ask the
            browser for your location so they can load conditions near you. That
            permission is controlled by your browser. If you decline, the
            request times out, or geolocation is unavailable, tools fall back to
            the last place saved on this device, or to Rochester, NY.
          </p>
        </section>
        <section className="space-y-3" aria-labelledby="privacy-device">
          <h2 id="privacy-device" className="font-display text-lg font-bold text-ink">
            What stays on your device
          </h2>
          <p>
            Some tools store a small amount of data in localStorage in your
            browser. That data does not get sent to Hemloc. Clearing site data
            for hemloc.co removes it. Today that includes a last-used place
            (so a later visit can skip repeating Rochester when location is
            blocked) and a short list of recent “perfect day” activity lines so
            the homepage does not repeat the same suggestion too often.
          </p>
        </section>
        <section className="space-y-3" aria-labelledby="privacy-third-party">
          <h2 id="privacy-third-party" className="font-display text-lg font-bold text-ink">
            Third-party requests from your browser
          </h2>
          <p>
            Weather, geocoding search, and air-quality lookups go from your
            browser to{" "}
            <a
              href="https://open-meteo.com/"
              className="text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
            >
              Open-Meteo
            </a>
            , under their terms. When a tool turns GPS coordinates into a place
            name, that request goes to{" "}
            <a
              href="https://www.bigdatacloud.com/"
              className="text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
            >
              BigDataCloud
            </a>
            ’s reverse-geocode service. Those providers can see the IP address
            and coordinates your browser sends. Hemloc does not get a copy.
          </p>
        </section>
      </div>
    </main>
  );
}
