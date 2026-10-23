import Link from "next/link";
import type { ReactNode } from "react";
import { AccountTopBar } from "./AccountTopBar";

/**
 * Frame for an account sub-page: the phone top bar, or on larger screens a back link and
 * a regular page heading.
 */
export function AccountSubPage({
  title,
  backHref,
  backLabel,
  wide = false,
  children,
}: {
  title: string;
  backHref: string;
  backLabel: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <AccountTopBar title={title} backHref={backHref} backLabel={backLabel} />
      <section className={`mx-auto w-full px-4 py-5 md:py-10 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
        <div className="hidden md:block">
          <Link href={backHref} className="text-sm font-semibold text-brand-red hover:underline">
            ← {backLabel}
          </Link>
          {/* Only one h1 is ever displayed: this one or the phone top bar's. */}
          <h1 className="mt-3 font-display text-3xl text-brand-red">{title}</h1>
        </div>
        <div className="md:mt-6">{children}</div>
      </section>
    </>
  );
}
