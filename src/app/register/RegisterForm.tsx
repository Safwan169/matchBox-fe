"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Field, errorMessage } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { safeNext } from "@/lib/safe-redirect";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== form.get("confirm")) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await register({
        name: String(form.get("name")),
        email: String(form.get("email")),
        phone: String(form.get("phone") ?? ""),
        dateOfBirth: String(form.get("dateOfBirth")),
        password,
      });
      router.replace(next);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <Alert>{error}</Alert>
      <Field label="Full name" name="name" autoComplete="name" required minLength={2} />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />
      <Field label="Date of birth" name="dateOfBirth" type="date" required hint="Used to confirm you are 18 or older." />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." />
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-brand-brown">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-red hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
