import { API_URL } from "./api";

// Uploaded files are stored by the API as root-relative paths ("/uploads/x.jpg").
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/** Our own uploads go through Next's image optimizer (resized WebP); other https URLs are used as-is. */
export const isUpload = (path: string) => path.startsWith("/uploads/");

export function assetUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
}
