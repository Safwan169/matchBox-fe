export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

// On the Next.js server, identify ourselves so server-rendered requests (which all share
// this server's IP) skip the API's per-IP rate limits. The key is server-only: without the
// NEXT_PUBLIC_ prefix it is never included in the browser bundle.
const serverHeaders: Record<string, string> =
  typeof window === "undefined" && process.env.INTERNAL_API_KEY
    ? { "X-Internal-Key": process.env.INTERNAL_API_KEY }
    : {};

// Works in both server and client components. Sends cookies so authenticated
// requests from the browser carry the session.
export async function api<T>(path: string, { body, headers, ...init }: ApiOptions = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...serverHeaders,
      ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  const payload = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, payload?.error ?? `Request failed (${res.status})`, payload?.details);
  }
  return payload as T;
}

export const apiGet = <T>(path: string, init?: ApiOptions) => api<T>(path, init);
