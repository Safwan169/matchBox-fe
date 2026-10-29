import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { FlameMark } from "@/components/luxury/icons";

/** Phone-only top bar for account pages: back arrow, the brand mark and the page title. */
export function AccountTopBar({ title, backHref, backLabel }: { title: string; backHref: string; backLabel: string }) {
  return (
    <header className="sticky top-0 z-30 bg-lux-ink text-lux-ivory md:hidden">
      <div className="flex h-14 items-center gap-3 px-2">
        <Link href={backHref} aria-label={backLabel} className="p-2 transition-opacity hover:opacity-60">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <Link href="/" aria-label="MatchBox home" className="shrink-0">
          <FlameMark className="h-5 w-5 text-lux-brass" />
        </Link>
        <h1 className="truncate font-serif text-xl font-light tracking-wide">{title}</h1>
      </div>
    </header>
  );
}
