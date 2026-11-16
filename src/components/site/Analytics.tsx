"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { downloadOf, pageView, startAnalytics, stopAnalytics, track } from "@/lib/analytics";
import { analyticsCookieNames, consentCookie, expiredCookies, OPEN_NOTICE_EVENT, readConsent, type Consent } from "@/lib/consent";
import { CookieNotice } from "./CookieNotice";

/*
 * The saved answer lives in a cookie; components re-read it when the notice
 * writes a new one. Before hydration it is unknown, so the server and the
 * first client render agree and the notice appears only in the browser.
 */
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const savedChoice = (): Consent | null => readConsent(document.cookie);
const beforeHydration = (): "unknown" => "unknown";

/**
 * The cookie notice and, only after Accept, Google Analytics. The layout
 * mounts this on the production deployment alone (`analyticsEnabled`).
 */
export function Analytics({ measurementId }: { measurementId: string }) {
  const choice = useSyncExternalStore(subscribe, savedChoice, beforeHydration);
  const [reopened, setReopened] = useState(false);
  // What opened the notice again (footer › Cookies), to give the focus back after the answer.
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reopen = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setReopened(true);
    };
    window.addEventListener(OPEN_NOTICE_EVENT, reopen);
    return () => window.removeEventListener(OPEN_NOTICE_EVENT, reopen);
  }, []);

  // A click on an installer link (the download page, All versions) counts as a download.
  useEffect(() => {
    if (choice !== "granted") return;
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      const download = link ? downloadOf(link.href) : null;
      if (download) track({ name: "download", params: download });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [choice]);

  function choose(next: Consent) {
    const before = savedChoice();
    document.cookie = consentCookie(next, window.location.protocol === "https:");
    // The same answer from the server, which Safari keeps for the full year.
    void fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ choice: next }), keepalive: true }).catch(() => {});
    if (next === "denied" && before === "granted") {
      stopAnalytics(measurementId);
      for (const cookie of expiredCookies(analyticsCookieNames(document.cookie, measurementId), window.location.hostname)) document.cookie = cookie;
    }
    if (reopened) opener.current?.focus();
    opener.current = null;
    setReopened(false);
    for (const listener of listeners) listener();
  }

  return (
    <>
      {choice === "granted" ? (
        <>
          <Script id="google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="lazyOnload" />
          <Suspense fallback={null}>
            <PageViews measurementId={measurementId} />
          </Suspense>
        </>
      ) : null}
      {choice === null || reopened ? <CookieNotice onChoice={choose} focus={reopened} /> : null}
    </>
  );
}

/** One page view per address the App Router shows; `pageView` skips repeats of the same clean address. */
function PageViews({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    startAnalytics(measurementId);
    pageView();
  }, [measurementId, pathname, search]);
  return null;
}
