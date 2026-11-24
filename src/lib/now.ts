"use client";

import { useSyncExternalStore } from "react";

/** Heure courante qui se met à jour chaque seconde (0 côté serveur). */
const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
const snap = () => Math.floor(Date.now() / 1000) * 1000;
export function useNow() {
  return useSyncExternalStore(subscribe, snap, () => 0);
}
