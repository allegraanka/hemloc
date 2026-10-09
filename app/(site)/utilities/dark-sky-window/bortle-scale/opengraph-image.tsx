import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "How Hemloc estimates Bortle class for dark sky window";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: "Hemloc · Dark sky window",
    title: "Bortle class, estimated",
    description:
      "Population of the named place — not a satellite night-lights map.",
  });
}
