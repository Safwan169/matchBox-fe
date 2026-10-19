"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mb_age_verified";

/**
 * Inline <head> script: marks returning visitors who already confirmed their age, so CSS
 * hides the gate before the first paint (no flash, no waiting for JavaScript).
 */
export const AGE_GATE_SCRIPT = `try{if(localStorage.getItem("${STORAGE_KEY}")==="yes")document.documentElement.dataset.ageOk="1"}catch(e){}`;

type Status = "ask" | "verified" | "denied";

// Full-screen 18+ confirmation. It is server-rendered so it appears instantly; the
// answer is remembered in this browser. Real age checks happen at registration.
export function AgeGate() {
  const [status, setStatus] = useState<Status>("ask");

  useEffect(() => {
    let verified = false;
    try {
      verified = localStorage.getItem(STORAGE_KEY) === "yes";
    } catch {
      // Storage blocked: ask every visit.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after mount
    if (verified) setStatus("verified");
  }, []);

  function confirm() {
    try {
      localStorage.setItem(STORAGE_KEY, "yes");
    } catch {}
    document.documentElement.dataset.ageOk = "1";
    setStatus("verified");
  }

  if (status === "verified") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="age-gate fixed inset-0 z-50 flex items-center justify-center bg-brand-red p-4 text-brand-cream"
    >
      <div className="w-full max-w-md rounded-xl border-2 border-brand-cream/80 p-8 text-center">
        <Image src="/brand/logo.png" alt="MatchBox" width={96} height={96} className="mx-auto rounded-lg" loading="eager" />
        {status === "ask" ? (
          <>
            <h2 id="age-gate-title" className="mt-6 font-display text-2xl">
              Are you 18 or older?
            </h2>
            <p className="mt-3 text-sm text-brand-cream">This site sells tobacco products. You must be of legal age to enter.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={confirm}
                className="rounded-md bg-brand-flame px-6 py-2 font-semibold text-brand-charcoal hover:bg-brand-flame-light"
              >
                Yes, I am 18+
              </button>
              <button
                onClick={() => setStatus("denied")}
                className="rounded-md border-2 border-brand-cream/70 px-6 py-2 font-semibold hover:bg-brand-red-dark"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-gate-title" className="mt-6 font-display text-2xl">
              Sorry
            </h2>
            <p className="mt-3 text-sm text-brand-cream">You must be 18 or older to visit MatchBox.</p>
          </>
        )}
      </div>
    </div>
  );
}
