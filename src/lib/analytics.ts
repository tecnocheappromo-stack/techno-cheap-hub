// Google Analytics 4 helper for client-side event tracking
// The GA4 script is injected in __root.tsx via head().scripts

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/** Send a GA4 event. Safe to call from anywhere; silently ignored during SSR or before gtag loads. */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}
