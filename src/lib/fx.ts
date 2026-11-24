"use client";

import { useSyncExternalStore } from "react";

/** Petite vibration (Android). */
export function haptic(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}

/** Fait voler une image jusqu'à l'icône du panier visible, puis fait rebondir le compteur. */
export function flyToCart(from: HTMLElement | null | undefined) {
  haptic();
  const img = from?.querySelector("img") ?? (from instanceof HTMLImageElement ? from : null);
  const target = [...document.querySelectorAll<HTMLElement>("[data-cart-target]")].find((el) => {
    if (el.offsetParent === null) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
  });
  const bump = () => window.dispatchEvent(new Event("cart-bump"));
  if (!img || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bump();
    return;
  }

  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(a.width, 140);
  const clone = img.cloneNode(true) as HTMLImageElement;
  Object.assign(clone.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "contain",
    zIndex: "200",
    pointerEvents: "none",
    filter: "drop-shadow(0 12px 16px rgba(0,0,0,.3))",
  });
  clone.removeAttribute("srcset");
  clone.removeAttribute("sizes");
  document.body.appendChild(clone);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const lift = Math.min(-60, dy * 0.25 - 80);
  const anim = clone.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${lift}px) scale(.62) rotate(-14deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(-28deg)`, opacity: 0.6 },
    ],
    { duration: 720, easing: "cubic-bezier(.5,0,.3,1)" },
  );
  anim.onfinish = () => {
    clone.remove();
    bump();
  };
}

/** S'abonne au rebond du panier : renvoie une clé qui change à chaque ajout. */
let bumps = 0;
const bumpListeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("cart-bump", () => {
    bumps++;
    bumpListeners.forEach((l) => l());
  });
}
export function useCartBump() {
  return useSyncExternalStore(
    (l) => {
      bumpListeners.add(l);
      return () => bumpListeners.delete(l);
    },
    () => bumps,
    () => 0,
  );
}

/* ------------------------------------------------------- confettis (une fois) */
let party = false;
const partyListeners = new Set<() => void>();
/** À appeler juste avant d'afficher la confirmation d'une nouvelle commande. */
export function celebrate() {
  party = true;
}
export function endCelebration() {
  party = false;
  partyListeners.forEach((l) => l());
}
export function useCelebration() {
  return useSyncExternalStore(
    (l) => {
      partyListeners.add(l);
      return () => partyListeners.delete(l);
    },
    () => party,
    () => false,
  );
}
