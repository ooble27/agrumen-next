import { SITE } from "./site";
import type { Order } from "./store";

/**
 * Suivi de commande.
 * Pas encore de base de données : l'avancement est SIMULÉ à partir de l'heure
 * de la commande. Quand le back-office existera, il suffira de remplacer
 * `trackOrder` par le statut réel envoyé par le resto (même forme de retour).
 */
export type Stage = "confirmed" | "preparing" | "onTheWay" | "arriving" | "delivered" | "ready" | "pickedUp";

export type Tracking = {
  stage: Stage;
  step: number; // 0..3
  steps: string[];
  title: string;
  subtitle: string;
  etaAt: number; // timestamp
  minutesLeft: number;
  /** avancée du livreur sur le trajet (0 = resto, 1 = chez toi) */
  courier: number;
  done: boolean;
};

const MIN = 60_000;
const PREP = 12; // minutes de préparation
const RIDE = SITE.etaMax - PREP; // minutes de trajet

export function trackOrder(o: Order, now: number): Tracking {
  const t = (now - o.createdAt) / MIN;
  const etaAt = o.createdAt + SITE.etaMax * MIN;
  const minutesLeft = Math.max(0, Math.ceil((etaAt - now) / MIN));

  if (o.mode === "pickup") {
    const steps = ["Reçue", "En préparation", "Prête", "Récupérée"];
    if (t < 1.5) return { stage: "confirmed", step: 0, steps, title: "Commande reçue", subtitle: "Le resto vient de recevoir ta commande.", etaAt: o.createdAt + PREP * MIN, minutesLeft: Math.ceil(PREP - t), courier: 0, done: false };
    if (t < PREP) return { stage: "preparing", step: 1, steps, title: "On prépare ta commande", subtitle: "Tes nems sont en train de dorer.", etaAt: o.createdAt + PREP * MIN, minutesLeft: Math.max(1, Math.ceil(PREP - t)), courier: 0, done: false };
    return { stage: "ready", step: 2, steps, title: "C’est prêt !", subtitle: `Passe récupérer ta commande : ${SITE.pickupAddress}`, etaAt: o.createdAt + PREP * MIN, minutesLeft: 0, courier: 0, done: false };
  }

  const steps = ["Reçue", "En préparation", "En route", "Livrée"];
  if (t < 1.5) return { stage: "confirmed", step: 0, steps, title: "Commande reçue", subtitle: "Le resto vient de recevoir ta commande.", etaAt, minutesLeft, courier: 0, done: false };
  if (t < PREP) return { stage: "preparing", step: 1, steps, title: "On prépare ta commande", subtitle: "Tes nems sont en train de dorer.", etaAt, minutesLeft, courier: 0, done: false };
  if (t < SITE.etaMax - 3) {
    const k = (t - PREP) / RIDE;
    return { stage: "onTheWay", step: 2, steps, title: "Ton livreur est en route", subtitle: "Il arrive avec ta commande bien chaude.", etaAt, minutesLeft: Math.max(1, minutesLeft), courier: Math.min(0.95, k), done: false };
  }
  if (t < SITE.etaMax) return { stage: "arriving", step: 2, steps, title: "Presque là !", subtitle: "Ton livreur arrive dans quelques instants.", etaAt, minutesLeft: Math.max(1, minutesLeft), courier: 0.95 + ((t - (SITE.etaMax - 3)) / 3) * 0.05, done: false };
  return { stage: "delivered", step: 3, steps, title: "Livrée, bon appétit !", subtitle: "Merci d’avoir commandé chez nous.", etaAt, minutesLeft: 0, courier: 1, done: true };
}

/** La commande est-elle encore en cours (pour le bandeau du menu) ? */
export function isActive(o: Order | undefined, now: number) {
  if (!o) return false;
  const tr = trackOrder(o, now);
  return !tr.done && now - o.createdAt < 90 * MIN;
}

const COURIERS = [
  { name: "Moussa", avatar: "adv-02", vehicle: "Berline électrique" },
  { name: "Inès", avatar: "adv-05", vehicle: "Berline électrique" },
  { name: "Karim", avatar: "adv-06", vehicle: "Berline électrique" },
  { name: "Aminata", avatar: "adv-09", vehicle: "Berline électrique" },
];
export function courierFor(o: Order) {
  const n = [...o.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  return COURIERS[n % COURIERS.length];
}

/** Fenêtre du trajet du livreur (début et fin), en timestamps. */
export function rideWindow(o: Order) {
  return { start: o.createdAt + PREP * MIN, end: o.createdAt + SITE.etaMax * MIN };
}

/** Point de livraison (adresse choisie, sinon un point proche du resto). */
export function destination(o: Order) {
  const p = o.profile;
  if (p?.lat != null && p?.lon != null) return { lat: p.lat, lon: p.lon };
  return { lat: SITE.store.lat + 0.018, lon: SITE.store.lon - 0.022 };
}

/** Point sur une courbe douce entre a et b (le trajet n'est pas une ligne droite). */
export function routePoint(a: { lat: number; lon: number }, b: { lat: number; lon: number }, k: number) {
  const mid = { lat: (a.lat + b.lat) / 2 + (b.lon - a.lon) * 0.18, lon: (a.lon + b.lon) / 2 - (b.lat - a.lat) * 0.18 };
  const u = 1 - k;
  return { lat: u * u * a.lat + 2 * u * k * mid.lat + k * k * b.lat, lon: u * u * a.lon + 2 * u * k * mid.lon + k * k * b.lon };
}
