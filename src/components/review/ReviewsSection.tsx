import { apiGet } from "@/lib/api";
import type { ReviewList } from "@/lib/types";
import { ReviewFeed } from "./ReviewFeed";
import { ReviewForm } from "./ReviewForm";
import { Stars } from "./Stars";

const PAGE_SIZE = 5;

/** Product reviews: summary with rating breakdown, the review list, and the customer's own review form. */
export async function ReviewsSection({ slug }: { slug: string }) {
  const first = await apiGet<ReviewList>(`/products/${encodeURIComponent(slug)}/reviews?limit=${PAGE_SIZE}`).catch(() => null);
  if (!first) return null;
  const { summary } = first;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="mt-16 scroll-mt-28 border-t border-brand-brown/15 pt-10">
      <h2 id="reviews-heading" className="font-display text-2xl text-brand-red">Customer reviews</h2>

      <div className="mt-6 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          {summary.count > 0 ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold">{summary.average.toFixed(1)}</span>
                <div>
                  <Stars rating={summary.average} className="h-5 w-5" />
                  <p className="text-sm text-brand-brown">
                    {summary.count} {summary.count === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5" aria-label="Rating breakdown">
                {([5, 4, 3, 2, 1] as const).map((n) => {
                  const count = summary.distribution[n];
                  const pct = summary.count ? Math.round((count / summary.count) * 100) : 0;
                  return (
                    <li key={n} className="flex items-center gap-2 text-sm">
                      <span className="w-10 shrink-0">{n} star</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-brand-brown/15">
                        <span className="block h-full rounded-full bg-brand-flame" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-8 text-right text-brand-brown">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-brand-brown">No reviews yet.</p>
          )}
          <div className="mt-6">
            <ReviewForm slug={slug} />
          </div>
        </div>

        {/* key: start over when the server data changes (e.g. after router.refresh() from the form) */}
        <ReviewFeed
          key={first.data.map((r) => r.id + r.updatedAt).join("|")}
          slug={slug}
          initial={first.data}
          totalPages={first.meta.totalPages}
          pageSize={PAGE_SIZE}
        />
      </div>
    </section>
  );
}
