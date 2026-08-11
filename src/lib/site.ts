/**
 * Canonical site origin. Configure with VITE_SITE_URL for a production domain.
 */
const raw = (import.meta.env?.["VITE_SITE_URL"] as string | undefined) ?? "https://quick-parse-zone.lovable.app";

export const SITE_URL = raw.replace(/\/+$/, "");

/** Build an absolute URL from a root-relative path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
