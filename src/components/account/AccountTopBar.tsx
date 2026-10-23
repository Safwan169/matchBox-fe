import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

/** Phone-only top bar for account pages: back arrow, logo and the page title. */
export function AccountTopBar({ title, backHref, backLabel }: { title: string; backHref: string; backLabel: string }) {
  return (
    <header className="sticky top-0 z-30 bg-brand-red text-brand-cream shadow-md md:hidden">
      <div className="flex h-14 items-center gap-3 px-2">
        <Link href={backHref} aria-label={backLabel} className="rounded-full p-2 hover:bg-brand-red-dark">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <Link href="/" aria-label="MatchBox home" className="shrink-0">
          <Image src="/brand/logo.png" alt="" width={36} height={36} loading="eager" className="rounded-md ring-2 ring-brand-cream/70" />
        </Link>
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
