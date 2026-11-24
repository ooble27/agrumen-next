import { SITE } from "./site";

export type Place = {
  label: string; // « 1234 Rue Saint-Denis »
  detail: string; // « Montréal, H2X 1Y4 »
  street: string;
  city: string;
  postcode: string;
  lat: number;
  lon: number;
};

type PhotonFeature = {
  properties: {
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    locality?: string;
    district?: string;
    postcode?: string;
    state?: string;
    countrycode?: string;
  };
  geometry: { coordinates: [number, number] };
};

const BASE = "https://photon.komoot.io";

function toPlace(f: PhotonFeature): Place | null {
  const p = f.properties;
  if (p.countrycode && p.countrycode !== "CA") return null;
  const street = p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street ?? p.name ?? "";
  if (!street) return null;
  const city = p.city ?? p.locality ?? p.district ?? "";
  const [lon, lat] = f.geometry.coordinates;
  return {
    label: street,
    detail: [city, p.postcode].filter(Boolean).join(", "),
    street,
    city,
    postcode: p.postcode ?? "",
    lat,
    lon,
  };
}

/** Recherche d'adresses (autocomplétion), centrée sur la zone de livraison. */
export async function searchPlaces(q: string, signal?: AbortSignal): Promise<Place[]> {
  const { lat, lon } = SITE.store;
  const url = `${BASE}/api/?q=${encodeURIComponent(q)}&limit=8&lang=fr&lat=${lat}&lon=${lon}&location_bias_scale=0.4`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const json = (await res.json()) as { features: PhotonFeature[] };
  const seen = new Set<string>();
  return json.features
    .map(toPlace)
    .filter((p): p is Place => !!p)
    .filter((p) => {
      const k = `${p.label}|${p.detail}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => distanceKm(SITE.store, a) - distanceKm(SITE.store, b))
    .slice(0, 6);
}

/** Adresse la plus proche d'un point (pin déplacé, géolocalisation). */
export async function reversePlace(lat: number, lon: number): Promise<Place | null> {
  const res = await fetch(`${BASE}/reverse?lat=${lat}&lon=${lon}&lang=fr`);
  if (!res.ok) return null;
  const json = (await res.json()) as { features: PhotonFeature[] };
  const f = json.features[0];
  if (!f) return null;
  const p = toPlace(f);
  return p ? { ...p, lat, lon } : null;
}

/** Distance à vol d'oiseau en km. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function inZone(p: { lat?: number; lon?: number }) {
  if (p.lat == null || p.lon == null) return null;
  return distanceKm(SITE.store, { lat: p.lat, lon: p.lon }) <= SITE.deliveryRadiusKm;
}
