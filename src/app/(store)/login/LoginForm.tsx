"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Field, errorMessage } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { safeNext } from "@/lib/safe-redirect";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      await login(String(form.get("email")), String(form.get("password")));
      router.replace(next);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <Alert>{error}</Alert>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-brand-brown">
        New here?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-red hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
