import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const buttonVariants = {
  primary: "bg-brand-red text-brand-cream hover:bg-brand-red-dark",
  accent: "bg-brand-flame text-brand-charcoal hover:bg-brand-flame-light",
  outline: "border-2 border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream",
  ghost: "text-brand-red hover:bg-brand-red/10",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

export function buttonClass(variant: keyof typeof buttonVariants = "primary", extra = "") {
  // `ui-btn` / `ui-title` / `ui-card` let the shop theme (.theme-lux) restyle these; the admin keeps this look.
  return `ui-btn inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

const inputClass =
  "ui-input w-full rounded-md border border-brand-brown/30 bg-white px-3 py-2 text-brand-charcoal focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none";

interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
}

export function Field({ label, hint, error, id, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id ?? props.name;
  return (
    <div>
      <label htmlFor={inputId} className="ui-label mb-1 block text-sm font-semibold">
        {label}
      </label>
      <input id={inputId} className={inputClass} aria-invalid={!!error} {...props} />
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : hint && <p className="mt-1 text-xs text-brand-brown">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, error, id, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? props.name;
  return (
    <div>
      <label htmlFor={inputId} className="ui-label mb-1 block text-sm font-semibold">
        {label}
      </label>
      <textarea id={inputId} className={inputClass} aria-invalid={!!error} {...props} />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function Select({ label, id, children, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const inputId = id ?? props.name;
  return (
    <div>
      <label htmlFor={inputId} className="ui-label mb-1 block text-sm font-semibold">
        {label}
      </label>
      <select id={inputId} className={inputClass} {...props}>
        {children}
      </select>
    </div>
  );
}

export function Alert({ kind = "error", children }: { kind?: "error" | "success"; children: ReactNode }) {
  if (!children) return null;
  const styles = kind === "error" ? "border-red-300 bg-red-50 text-red-800" : "border-green-300 bg-green-50 text-green-800";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-md border px-3 py-2 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ui-card rounded-lg border border-brand-brown/15 bg-white/70 p-6 ${className}`}>{children}</div>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="ui-title font-display text-3xl text-brand-red">{children}</h1>;
}

/** Turns an API validation error into a readable message. */
export function errorMessage(err: unknown) {
  if (err && typeof err === "object" && "details" in err && Array.isArray((err as { details: unknown }).details)) {
    const issues = (err as { details: { path: string[]; message: string }[] }).details;
    if (issues.length) return issues.map((i) => `${i.path.join(".") || "field"}: ${i.message}`).join(" · ");
  }
  return err instanceof Error ? err.message : "Something went wrong";
}
