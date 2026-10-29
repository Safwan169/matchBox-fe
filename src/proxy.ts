import { NextResponse, type NextRequest } from "next/server";

// The API's origin, e.g. https://matchbox-api.onrender.com (NEXT_PUBLIC_API_URL ends in /api).
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

/**
 * The browser calls the API through this site (/backend/...) instead of the API's own domain.
 * The session cookie is then first-party, so login works even when the shop and the API are on
 * different domains (Vercel and Render); Safari and Firefox block such third-party cookies.
 *
 * The API sees our server's IP, so the visitor's IP is passed on in `x-client-ip`, signed with
 * `x-proxy-key` (INTERNAL_API_KEY) so the API only trusts it when it comes from here.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const target = new URL(`${API_URL}${pathname.slice("/backend".length)}${search}`);

  const headers = new Headers(request.headers);
  headers.delete("x-client-ip");
  headers.delete("x-proxy-key");
  headers.delete("x-internal-key");
  const clientIp = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (process.env.INTERNAL_API_KEY && clientIp) {
    headers.set("x-client-ip", clientIp);
    headers.set("x-proxy-key", process.env.INTERNAL_API_KEY);
  }

  return NextResponse.rewrite(target, { request: { headers } });
}

export const config = { matcher: "/backend/:path*" };
