"use client";

import { useSyncExternalStore } from "react";
import { SITE } from "./site";
import { getProduct } from "./products";

type Listener = () => void;

function persisted<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<Listener>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* stockage indisponible : on garde la valeur initiale */
    }
  };

  return {
    initial,
    get: () => {
      load();
      return state;
    },
    set: (next: T | ((prev: T) => T)) => {
      load();
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        /* ignore */
      }
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

type Persisted<T> = ReturnType<typeof persisted<T>>;

function usePersisted<T>(s: Persisted<T>) {
  return useSyncExternalStore(s.subscribe, s.get, () => s.initial);
}

/* ---------------------------------------------------------------- cart */

export type Cart = Record<string, number>;
const cartStore = persisted<Cart>("nemsy-cart", {});

export function useCart() {
  const cart = usePersisted(cartStore);
  const lines = Object.entries(cart)
    .map(([slug, qty]) => ({ product: getProduct(slug), qty }))
    .filter((l): l is { product: NonNullable<typeof l.product>; qty: number } => !!l.product && l.qty > 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0);
  const delivery = subtotal === 0 || subtotal >= SITE.freeDeliveryFrom ? 0 : SITE.deliveryFee;
  const taxes = Math.round((subtotal + delivery) * SITE.taxRate * 100) / 100;
  const total = Math.round((subtotal + delivery + taxes) * 100) / 100;
  return { cart, lines, count, subtotal, delivery, taxes, total };
}

export const cartActions = {
  add(slug: string, qty = 1) {
    cartStore.set((c) => ({ ...c, [slug]: (c[slug] ?? 0) + qty }));
  },
  setQty(slug: string, qty: number) {
    cartStore.set((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[slug];
      else next[slug] = qty;
      return next;
    });
  },
  clear() {
    cartStore.set({});
  },
};

/* ----------------------------------------------------------- favorites */

const favStore = persisted<string[]>("nemsy-favs", []);

export function useFavorites() {
  return usePersisted(favStore);
}

export function toggleFavorite(slug: string) {
  favStore.set((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]));
}

/* ------------------------------------------------------------- profile */

/** area = code postal */
export type Profile = { name: string; phone: string; area: string; address: string };
const profileStore = persisted<Profile>("nemsy-profile", { name: "", phone: "", area: "", address: "" });

export function useProfile() {
  return usePersisted(profileStore);
}
export const setProfile = profileStore.set;

/* --------------------------------------------------------------- order */

export type Order = {
  id: string;
  createdAt: number;
  lines: { slug: string; name: string; qty: number; price: number }[];
  subtotal: number;
  delivery: number;
  taxes: number;
  total: number;
  payment: string;
  profile: Profile;
};

const orderStore = persisted<Order | null>("nemsy-last-order", null);

export function useLastOrder() {
  return usePersisted(orderStore);
}
export const setLastOrder = orderStore.set;

/* --------------------------------------------------------------- theme */

export type ThemePref = "system" | "light" | "dark";
const themeStore = persisted<ThemePref>("nemsy-theme", "system");

export function useThemePref() {
  return usePersisted(themeStore);
}

export function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref !== "system") return pref;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setThemePref(pref: ThemePref) {
  themeStore.set(pref);
  document.documentElement.dataset.theme = resolveTheme(pref);
}
