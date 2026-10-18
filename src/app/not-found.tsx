import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-6xl text-brand-red">404</p>
      <h1 className="mt-4 text-xl font-semibold">This page burned out.</h1>
      <p className="mt-2 text-brand-brown">We couldn’t find what you were looking for.</p>
      <Link href="/products" className="mt-6 rounded-md bg-brand-red px-5 py-2 font-semibold text-brand-cream hover:bg-brand-red-dark">
        Browse products
      </Link>
    </section>
  );
}
