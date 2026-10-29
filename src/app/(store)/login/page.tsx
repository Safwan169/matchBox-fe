import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <h1 className="ui-title font-display text-3xl text-brand-red">Log in</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
