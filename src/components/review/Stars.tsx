const STAR = "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z";

/** Read-only star rating (supports fractions, e.g. 4.3). */
export function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - (n - 1))) * 100;
        return (
          <svg key={n} viewBox="0 0 20 20" className={className} aria-hidden>
            <defs>
              <linearGradient id={`star-${n}-${fill}`}>
                <stop offset={`${fill}%`} stopColor="var(--brand-flame)" />
                <stop offset={`${fill}%`} stopColor="var(--brand-brown)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d={STAR} fill={`url(#star-${n}-${fill})`} />
          </svg>
        );
      })}
    </span>
  );
}

/** "★★★★☆ 4.3 (12)" — shown only when there are reviews. */
export function RatingBadge({ average, count, className = "" }: { average: number; count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm text-brand-brown ${className}`}>
      <Stars rating={average} />
      <span className="font-semibold text-brand-charcoal">{average.toFixed(1)}</span>
      <span>({count})</span>
    </span>
  );
}
