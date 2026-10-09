"use client";

import ShinyText from "@/components/react-bits/ShinyText";
import { usePrefersReducedMotion } from "@/components/site/usePrefersReducedMotion";

export function BrandKicker({ text }: { text: string }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <p className="text-sm font-semibold text-coral">{text}</p>
    );
  }

  return (
    <p className="text-sm font-semibold">
      <ShinyText
        text={text}
        speed={3.2}
        delay={1.4}
        color="#ff6a3d"
        shineColor="#fff4ec"
      />
    </p>
  );
}
