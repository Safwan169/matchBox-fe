"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

type Variant = "up" | "card" | "text";
const variantClass: Record<Variant, string> = { up: "lux-reveal", card: "lux-reveal-card", text: "lux-reveal-text" };

/** Wraps every word in a mask so it can rise on its own; keeps inline elements like <em>. */
function splitWords(node: ReactNode, counter: { i: number }): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, k) =>
      part.trim() === "" ? (
        part
      ) : (
        <span key={k} className="lux-mask">
          <span className="lux-word" style={{ "--w": counter.i++ } as CSSProperties}>
            {part}
          </span>
        </span>
      ),
    );
  }
  if (Array.isArray(node)) return Children.map(node, (child) => splitWords(child, counter));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, undefined, splitWords(el.props.children, counter));
  }
  return node;
}

/**
 * Animates its content in when it scrolls into view (once):
 * "up" slides up, "card" wipes up out of a mask (put `lux-card-media` on the photo wrapper),
 * "text" makes each word rise one after another.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  stagger,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-shown", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { "--lux-delay": `${delay}ms`, ...(stagger !== undefined && { "--lux-stagger": `${stagger}ms` }) } as CSSProperties;

  return (
    <Tag ref={ref} className={`${variantClass[variant]} ${className}`} style={style}>
      {variant === "text" ? splitWords(children, { i: 0 }) : children}
    </Tag>
  );
}
