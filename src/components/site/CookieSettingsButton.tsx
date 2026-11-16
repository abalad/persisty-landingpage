"use client";

import { OPEN_NOTICE_EVENT } from "@/lib/consent";

/** "Cookies" in the footer: shows the cookie notice again, to change one's answer. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_NOTICE_EVENT))}>
      {label}
    </button>
  );
}
