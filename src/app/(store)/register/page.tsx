import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <h1 className="ui-title font-display text-3xl text-brand-red">Create account</h1>
      <p className="mt-2 text-sm text-brand-brown">You must be 18 or older to create an account.</p>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </section>
  );
}
