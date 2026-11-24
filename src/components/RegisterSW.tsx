"use client";

import { useEffect } from "react";

/** Service worker (production) + blocage du zoom par pincement sur iOS Safari. */
export function RegisterSW() {
  useEffect(() => {
    // Safari iOS ignore user-scalable=no dans le navigateur : on bloque le geste.
    const stop = (e: Event) => e.preventDefault();
    const pinch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("gesturestart", stop);
    document.addEventListener("gesturechange", stop);
    document.addEventListener("touchmove", pinch, { passive: false });

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    }
    return () => {
      document.removeEventListener("gesturestart", stop);
      document.removeEventListener("gesturechange", stop);
      document.removeEventListener("touchmove", pinch);
    };
  }, []);
  return null;
}
