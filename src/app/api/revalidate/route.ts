import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { STORE_TAG } from "@/lib/store-data";

// Called by the API after admin changes so cached store data refreshes right away.
// Authenticated with the shared INTERNAL_API_KEY (server-to-server only).
export async function POST(request: Request) {
  const expected = process.env.INTERNAL_API_KEY;
  const given = request.headers.get("x-internal-key");
  if (!expected || !given || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // expire: 0 → the next visitor gets fresh data instead of the stale copy.
  revalidateTag(STORE_TAG, { expire: 0 });
  return new Response(null, { status: 204 });
}
