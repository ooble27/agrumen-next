"use client";

import { useSyncExternalStore } from "react";
import { SITE } from "./site";
import { getProduct, optionsLabel, unitPrice, type Product } from "./products";

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

const round = (n: number) => Math.round(n * 100) / 100;

/* ---------------------------------------------------------------- cart */

export type CartItem = { slug: string; qty: number; options: string[]; note?: string };
type CartState = Record<string, CartItem>;
const cartStore = persisted<CartState>("nemsy-cart-v2", {});

export const lineKey = (slug: string, options: string[]) => `${slug}|${[...options].sort().join(",")}`;

export type CartLine = CartItem & { key: string; product: Product; unit: number; label: string };

export function useCart() {
  const cart = usePersisted(cartStore);
  const lines: CartLine[] = [];
  for (const [key, item] of Object.entries(cart)) {
    const product = getProduct(item.slug);
    if (!product || item.qty <= 0) continue;
    lines.push({ ...item, key, product, unit: unitPrice(product, item.options), label: optionsLabel(product, item.options) });
  }
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = round(lines.reduce((s, l) => s + l.qty * l.unit, 0));
  return { lines, count, subtotal };
}

export const cartActions = {
  add(slug: string, qty = 1, options: string[] = [], note?: string) {
    const key = lineKey(slug, options);
    cartStore.set((c) => ({
      ...c,
      [key]: { slug, options, note: note || c[key]?.note, qty: (c[key]?.qty ?? 0) + qty },
    }));
  },
  setQty(key: string, qty: number) {
    cartStore.set((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[key];
      else if (next[key]) next[key] = { ...next[key], qty };
      return next;
    });
  },
  clear() {
    cartStore.set({});
  },
};

/** Calcul des montants d'une commande. */
export function computeTotals(subtotal: number, mode: "delivery" | "pickup", tipRate: number) {
  const delivery = mode === "pickup" || subtotal === 0 || subtotal >= SITE.freeDeliveryFrom ? 0 : SITE.deliveryFee;
  const taxes = round((subtotal + delivery) * SITE.taxRate);
  const tip = mode === "delivery" ? round(subtotal * tipRate) : 0;
  return { subtotal, delivery, taxes, tip, total: round(subtotal + delivery + taxes + tip) };
}

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

/* -------------------------------------------------------------- orders */

export type Order = {
  id: string;
  createdAt: number;
  mode: "delivery" | "pickup";
  when: string;
  lines: { slug: string; name: string; qty: number; unit: number; label: string; options: string[] }[];
  subtotal: number;
  delivery: number;
  taxes: number;
  tip: number;
  total: number;
  payment: string;
  profile: Profile;
};

export function newOrderStamp() {
  return { id: Math.random().toString(36).slice(2, 7).toUpperCase(), createdAt: Date.now() };
}

const ordersStore = persisted<Order[]>("nemsy-orders", []);

export function useOrders() {
  return usePersisted(ordersStore);
}
export function addOrder(o: Order) {
  ordersStore.set((list) => [o, ...list].slice(0, 30));
}

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
