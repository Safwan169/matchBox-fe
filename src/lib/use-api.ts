"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/** Fetches `path` on the client (with cookies). Pass null to skip. Re-fetches when path changes. */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!path);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the request started here
    setLoading(true);
    api<T>(path)
      .then((r) => {
        if (cancelled) return;
        setData(r);
        setError("");
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Request failed"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { data, error, loading, reload, setData };
}
