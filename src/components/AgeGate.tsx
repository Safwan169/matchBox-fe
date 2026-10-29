"use client";

import { FlameMark } from "@/components/luxury/icons";
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

  // Shop styling (.theme-lux); text only, so it paints instantly on a first visit.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="age-gate theme-lux fixed inset-0 z-[60] flex items-center justify-center bg-lux-ink p-6 text-lux-ivory"
    >
      <div className="w-full max-w-md text-center">
        <FlameMark className="mx-auto h-7 w-7 text-lux-brass" />
        <p className="mt-4 font-serif text-3xl tracking-[0.42em]">MATCHBOX</p>
        <span className="mx-auto mt-8 block h-px w-12 bg-lux-brass" />
        {status === "ask" ? (
          <>
            <h2 id="age-gate-title" className="mt-8 font-serif text-4xl font-light">
              Are you 18 or older?
            </h2>
            {/* System font: this is the first paint for new visitors, so it shouldn't wait for web fonts. */}
            <p className="mt-4 font-[system-ui,sans-serif] text-sm leading-relaxed font-light text-lux-ivory/75">
              This site sells tobacco products. You must be of legal age to enter.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={confirm}
                className="border border-lux-ivory bg-lux-ivory px-8 py-4 text-[11px] tracking-[0.3em] text-lux-ink uppercase transition-colors duration-500 hover:bg-transparent hover:text-lux-ivory"
              >
                Yes, I am 18+
              </button>
              <button
                onClick={() => setStatus("denied")}
                className="border border-lux-ivory/40 px-8 py-4 text-[11px] tracking-[0.3em] uppercase transition-colors duration-500 hover:border-lux-ivory"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-gate-title" className="mt-8 font-serif text-4xl font-light">
              Sorry
            </h2>
            <p className="mt-4 text-sm font-light text-lux-ivory/75">You must be 18 or older to visit MatchBox.</p>
          </>
        )}
      </div>
    </div>
  );
}
