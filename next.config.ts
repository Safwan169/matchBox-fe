import type { NextConfig } from "next";

// Uploaded product/banner images are served by the API at <api origin>/uploads/…
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api");
const apiIsLocal = ["localhost", "127.0.0.1", "[::1]"].includes(apiUrl.hostname);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Metadata streams for browsers (Googlebot reads it); non-JS bots such as Facebook/WhatsApp
  // link previews get it in <head> automatically. Don't set htmlLimitedBots to /.*/: with
  // params-based generateMetadata it prevents a static shell (Next invariant error).
  images: {
    // Resize and convert uploads (WebP) instead of sending the full original to phones.
    remotePatterns: [
      {
        protocol: apiUrl.protocol === "https:" ? "https" : "http",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
    ],
    // Only for local development, where the API runs on localhost. Limited to the single
    // pattern above (our own uploads), so it can't be used to reach other local services.
    dangerouslyAllowLocalIP: apiIsLocal,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
