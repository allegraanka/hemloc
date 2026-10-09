"use client";

import Aurora from "@/components/react-bits/Aurora";
import { usePrefersReducedMotion } from "@/components/site/usePrefersReducedMotion";

const COLOR_STOPS = ["#ff6a3d", "#3b6bff", "#3ee0a0"];

export function AuroraBackdrop() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,106,61,0.22),_transparent_42%),radial-gradient(ellipse_at_top,_rgba(59,107,255,0.18),_transparent_50%),radial-gradient(ellipse_at_top_right,_rgba(62,224,160,0.18),_transparent_45%)]" />
      {reducedMotion ? null : (
        <div className="absolute inset-0 opacity-45 saturate-[1.75] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <Aurora
            colorStops={COLOR_STOPS}
            amplitude={1.25}
            blend={0.4}
            speed={0.7}
          />
        </div>
      )}
    </div>
  );
}
