import { API_URL } from "./api";

// Uploaded files are stored by the API as root-relative paths ("/uploads/x.jpg").
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function assetUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
}
