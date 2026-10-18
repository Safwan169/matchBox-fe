"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, errorMessage } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { ApiItem, Review } from "@/lib/types";

interface Mine {
  review: Review | null;
  canReview: boolean;
}

const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export function ReviewForm({ slug }: { slug: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mine, setMine] = useState<Mine | null>(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const path = `/products/${encodeURIComponent(slug)}/reviews/mine`;

  useEffect(() => {
    if (!user) return;
    api<ApiItem<Mine>>(path)
      .then(({ data }) => {
        setMine(data);
        setRating(data.review?.rating ?? 0);
        setComment(data.review?.comment ?? "");
      })
      .catch(() => setMine({ review: null, canReview: false }));
  }, [user, path]);

  if (authLoading) return null;

  if (!user) {
    return (
      <p className="text-sm text-brand-brown">
        <Link href={`/login?next=/products/${slug}%23reviews`} className="font-semibold text-brand-red hover:underline">
          Log in
        </Link>{" "}
        to review this product.
      </p>
    );
  }
  if (!mine) return null;
  if (!mine.canReview) {
    return <p className="text-sm text-brand-brown">Only customers who have received this product can review it.</p>;
  }

  if (mine.review && !editing) {
    return (
      <div className="rounded-md bg-brand-flame-light/40 p-3 text-sm">
        <p className="font-semibold">Thanks for your review!</p>
        <div className="mt-2 flex gap-3">
          <button className="font-semibold text-brand-red hover:underline" onClick={() => setEditing(true)}>Edit</button>
          <button className="text-brand-brown hover:text-red-700" onClick={remove}>Delete</button>
        </div>
        <Alert>{error}</Alert>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { data } = await api<ApiItem<Review>>(path, { method: "PUT", body: { rating, comment } });
      setMine({ review: data, canReview: true });
      setEditing(false);
      router.refresh(); // update the server-rendered summary and list
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete your review?")) return;
    try {
      await api(path, { method: "DELETE" });
      setMine({ review: null, canReview: true });
      setRating(0);
      setComment("");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-brand-brown/15 bg-white/60 p-4">
      <p className="font-semibold">{mine.review ? "Edit your review" : "Write a review"}</p>
      <fieldset>
        <legend className="sr-only">Your rating</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} className="peer sr-only" />
              <svg viewBox="0 0 20 20" className={`h-7 w-7 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-brand-red ${n <= rating ? "fill-brand-flame" : "fill-brand-brown/20 hover:fill-brand-flame/60"}`} aria-hidden>
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
              </svg>
              <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
            </label>
          ))}
          <span className="ml-2 text-sm text-brand-brown">{labels[rating]}</span>
        </div>
      </fieldset>
      <label className="block">
        <span className="sr-only">Your review</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder="What did you like or dislike?"
          className="w-full rounded-md border border-brand-brown/30 bg-white px-3 py-2 focus:border-brand-red focus:outline-none"
        />
      </label>
      <Alert>{error}</Alert>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Submit review"}</Button>
        {mine.review && <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>}
      </div>
    </form>
  );
}
