/**
 * Runs `restored` when the browser brings the page back from its
 * back-forward cache (Back from Stripe, for one): the page comes back as it
 * was left, busy buttons included. Returns the cleanup.
 */
export function onPageRestored(restored: () => void, target: EventTarget = window): () => void {
  const listener = (e: Event) => {
    if ((e as PageTransitionEvent).persisted) restored();
  };
  target.addEventListener("pageshow", listener);
  return () => target.removeEventListener("pageshow", listener);
}
