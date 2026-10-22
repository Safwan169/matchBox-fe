import { API_URL } from "./api";

// Uploaded files are stored by the API as root-relative paths ("/uploads/x.jpg").
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const CLOUDINARY_PREFIX = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`
  : null;

/**
 * Our own uploads (local "/uploads/..." or our Cloudinary account) go through Next's image
 * optimizer (resized WebP); other https URLs are used as-is.
 */
export const isUpload = (path: string) =>
  path.startsWith("/uploads/") || (CLOUDINARY_PREFIX !== null && path.startsWith(CLOUDINARY_PREFIX));

export function assetUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
}
