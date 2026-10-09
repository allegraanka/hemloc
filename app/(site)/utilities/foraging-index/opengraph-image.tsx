import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Foraging index — recent rain, soil temperature, and season from Hemloc";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: "Hemloc · Foraging",
    title: "Foraging index",
    description:
      "Recent rain, soil temperature, and season. Weather scouting only.",
  });
}
