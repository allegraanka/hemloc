import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Dark sky window — prime stargazing hours from moon, clouds, and air clarity";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: "Hemloc · Stargazing",
    title: "Dark sky window",
    description:
      "Prime stargazing hours from moon phase, clouds, air, and estimated light pollution.",
  });
}
