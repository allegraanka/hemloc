import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-cream/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Primary">
          <Link
            href="/utilities"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Utilities
          </Link>
        </nav>
      </div>
    </header>
  );
}
