import Link from "next/link";
import { HemlockMark } from "@/components/site/HemlockMark";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="Hemloc home">
      <HemlockMark className="h-8 w-8" />
      <span className="font-display text-lg font-bold tracking-tight" aria-hidden="true">
        Hemloc
      </span>
    </Link>
  );
}
