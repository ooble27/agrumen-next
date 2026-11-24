"use client";

import { useEffect, useRef } from "react";
import type { Circle, Map as LMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SITE } from "@/lib/site";

/** Tuiles OpenStreetMap (gratuites, sans clé). Le mode sombre est un filtre CSS (globals.css). */
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIB = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const PIN = `<svg viewBox="0 0 36 46" width="36" height="46" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="43" rx="7" ry="2.5" fill="rgba(0,0,0,.25)"/><path d="M18 42C8 30 3 23 3 16a15 15 0 1 1 30 0c0 7-5 14-15 26z" fill="#151515"/><circle cx="18" cy="16" r="6.5" fill="#FF7A1A"/></svg>`;

/**
 * Vraie carte (OpenStreetMap).
 * - `onMove` fourni : le pin se déplace (glisser ou toucher la carte).
 * - sinon : aperçu fixe.
 */
export function MapView({
  lat,
  lon,
  onMove,
  zone = false,
  className = "",
}: {
  lat: number;
  lon: number;
  onMove?: (lat: number, lon: number) => void;
  zone?: boolean;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const moveRef = useRef(onMove);
  useEffect(() => {
    moveRef.current = onMove;
  }, [onMove]);
  const start = useRef({ lat, lon, interactive: !!onMove, zone });

  // Création de la carte (une seule fois)
  useEffect(() => {
    let cancelled = false;
    let circle: Circle | null = null;

    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      const { lat, lon, interactive, zone } = start.current;
      const m = L.map(el.current, {
        zoomControl: false,
        attributionControl: true,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        boxZoom: false,
        keyboard: interactive,
      }).setView([lat, lon], 16);
      m.attributionControl.setPrefix(false);

      L.tileLayer(TILES, { maxZoom: 19, attribution: ATTRIB }).addTo(m);

      if (zone) {
        circle = L.circle([SITE.store.lat, SITE.store.lon], {
          radius: SITE.deliveryRadiusKm * 1000,
          color: "#4CC764",
          weight: 1.5,
          fillColor: "#4CC764",
          fillOpacity: 0.06,
          interactive: false,
        }).addTo(m);
      }

      const icon = L.divIcon({ html: PIN, className: "", iconSize: [36, 46], iconAnchor: [18, 44] });
      const mk = L.marker([lat, lon], { icon, draggable: interactive, keyboard: false }).addTo(m);
      if (interactive) {
        mk.on("dragend", () => {
          const p = mk.getLatLng();
          moveRef.current?.(p.lat, p.lng);
        });
        m.on("click", (e) => {
          mk.setLatLng(e.latlng);
          moveRef.current?.(e.latlng.lat, e.latlng.lng);
        });
      }
      map.current = m;
      marker.current = mk;
      // la carte est souvent montée dans un panneau animé : recalcul de taille
      window.setTimeout(() => m.invalidateSize(), 350);
    });

    return () => {
      cancelled = true;
      circle?.remove();
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  // Suivre les nouvelles coordonnées
  useEffect(() => {
    const m = map.current;
    const mk = marker.current;
    if (!m || !mk) return;
    mk.setLatLng([lat, lon]);
    m.panTo([lat, lon], { animate: true });
  }, [lat, lon]);

  return <div ref={el} className={`isolate overflow-hidden bg-surface ${className}`} />;
}
