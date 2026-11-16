import { consentCookie, type Consent } from "@/lib/consent";

/**
 * Saves the cookie-notice answer from the server. The notice also writes it
 * with `document.cookie` so it takes effect at once, but Safari keeps a cookie
 * written by page script for 7 days at most; this one keeps its full year.
 */
export async function POST(request: Request) {
  let choice: unknown;
  try {
    choice = ((await request.json()) as { choice?: unknown } | null)?.choice;
  } catch {
    choice = undefined;
  }
  if (choice !== "granted" && choice !== "denied") return new Response(null, { status: 400 });
  const https = new URL(request.url).protocol === "https:";
  return new Response(null, { status: 204, headers: { "Set-Cookie": consentCookie(choice as Consent, https), "Cache-Control": "no-store" } });
}
