import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Hemloc utilities — browser tools with no account required";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: "Hemloc",
    title: "Utilities",
    description: "Browser tools you can use without signing up.",
  });
}
