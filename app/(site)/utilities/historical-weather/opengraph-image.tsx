import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Historical weather — look up a past day or compare dates from Hemloc";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: "Hemloc · Weather",
    title: "Historical weather",
    description:
      "One date, versus today, or several days side by side. Highs, lows, rain, and frost.",
  });
}
