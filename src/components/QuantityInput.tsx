"use client";

export function QuantityInput({ value, max, onChange }: { value: number; max: number; onChange(value: number): void }) {
  const btn = "h-9 w-9 text-lg font-bold hover:bg-brand-brown/10 disabled:opacity-30";
  return (
    <div className="inline-flex items-center rounded-md border border-brand-brown/30 bg-white">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <input
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n) && n >= 1) onChange(Math.min(n, max));
        }}
        aria-label="Quantity"
        className="h-9 w-12 [appearance:textfield] border-x border-brand-brown/20 text-center focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
