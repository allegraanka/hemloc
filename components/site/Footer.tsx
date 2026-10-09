import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { tools, toolHref } from "@/components/site/tools";
import { BORTLE_GUIDE_PATH } from "@/lib/dark-sky-window/constants";

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted">Proudly built in Rochester, NY.</p>
        </div>
        <div className="flex flex-col gap-6 text-sm text-muted sm:items-end">
          <nav aria-label="Tools">
            <ul className="flex flex-col gap-2 sm:items-end">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={toolHref(tool.slug)}
                    className="transition-colors hover:text-ink"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Guides">
            <ul className="flex flex-col gap-2 sm:items-end">
              <li>
                <Link
                  href={BORTLE_GUIDE_PATH}
                  className="transition-colors hover:text-ink"
                >
                  How we estimate Bortle class
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Footer" className="flex gap-4">
            <Link href="/utilities" className="transition-colors hover:text-ink">
              Utilities
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} Hemloc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
