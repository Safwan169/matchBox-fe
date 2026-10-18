import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="MatchBox home">
      <Image src="/brand/logo.png" alt="" width={40} height={40} className="rounded-md" priority />
      <span className="font-display text-xl tracking-wide sm:text-2xl">MATCHBOX</span>
    </Link>
  );
}
