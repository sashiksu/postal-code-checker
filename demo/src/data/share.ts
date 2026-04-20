// Shareable-URL helpers used by every Playground panel.
//
// Values are JSON-stringified by the caller, then base64-encoded into a single
// query parameter (e.g. ?config=<base64>). Query strings are preserved by
// GitHub Pages (unlike hash fragments, which we also want free for the
// sidebar's #section anchors), so share links survive the production path
// `/postal-code-checker/?...#configuration`.

export function encodeShareValue(value: string): string {
  // unescape/encodeURIComponent dance keeps base64 safe for non-ASCII (e.g.
  // country names with diacritics in a custom config).
  return btoa(unescape(encodeURIComponent(value)));
}

export function decodeShareValue(raw: string): string | null {
  try {
    return decodeURIComponent(escape(atob(raw)));
  } catch {
    return null;
  }
}

export function readShareParam(paramName: string): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const raw = url.searchParams.get(paramName);
  if (!raw) return null;
  return decodeShareValue(raw);
}

export function buildShareUrl(paramName: string, value: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, encodeShareValue(value));
  return url.toString();
}

export async function copyShareUrl(
  paramName: string,
  value: string,
): Promise<string> {
  const url = buildShareUrl(paramName, value);
  history.replaceState(null, "", url);
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Clipboard may be blocked (non-HTTPS, permissions). The URL is still in
    // the address bar — callers just show the "Link copied" confirmation.
  }
  return url;
}
