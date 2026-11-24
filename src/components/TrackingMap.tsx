"use client";

import { useEffect, useRef } from "react";
import type { Map as LMap, Marker, Polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { routePoint } from "@/lib/tracking";

type Pt = { lat: number; lon: number };

const STORE = `<div style="width:44px;height:44px;border-radius:999px;background:#151515;display:grid;place-items:center;box-shadow:0 6px 16px -6px rgba(0,0,0,.5);border:3px solid #fff"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A1A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M9 20v-6h6v6"/></svg></div>`;
const HOME = `<svg viewBox="0 0 36 46" width="36" height="46" xmlns="http://www.w3.org/2000/svg"><path d="M18 42C8 30 3 23 3 16a15 15 0 1 1 30 0c0 7-5 14-15 26z" fill="#4CC764" stroke="#fff" stroke-width="2.5"/><path d="M11 17l7-6 7 6v7h-14z" fill="#fff"/></svg>`;
const BIKE = `<div class="courier-pulse" style="width:46px;height:46px;border-radius:999px;background:#FF7A1A;display:grid;place-items:center;border:3px solid #fff;box-shadow:0 8px 20px -6px rgba(255,122,26,.8)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h3l2 6"/><path d="M5.5 17.5L9 9h5l1.5 8.5"/><path d="M9 9L7 6H5"/></svg></div>`;

const curve = (a: Pt, b: Pt, from: number, to: number) =>
  Array.from({ length: 41 }, (_, i) => routePoint(a, b, from + ((to - from) * i) / 40)).map((p) => [p.lat, p.lon] as [number, number]);

/** Carte du suivi : resto, maison, trajet et livreur qui avance. */
export function TrackingMap({ from, to, courier, showCourier, className = "" }: { from: Pt; to: Pt; courier: number; showCourier: boolean; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const bike = useRef<Marker | null>(null);
  const done = useRef<Polyline | null>(null);
  const init = useRef({ from, to });
  const latest = useRef({ courier, showCourier });
  useEffect(() => {
    latest.current = { courier, showCourier };
  }, [courier, showCourier]);

  const place = () => {
    const b = bike.current;
    const d = done.current;
    if (!b || !d) return;
    const { from, to } = init.current;
    const { courier, showCourier } = latest.current;
    const p = routePoint(from, to, courier);
    b.setLatLng([p.lat, p.lon]);
    b.setOpacity(showCourier ? 1 : 0);
    d.setLatLngs(curve(from, to, 0, Math.max(0.001, courier)));
  };

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      const { from, to } = init.current;
      const m = L.map(el.current, { zoomControl: false, attributionControl: true });
      m.attributionControl.setPrefix(false);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m);

      L.polyline(curve(from, to, 0, 1), { color: "#151515", weight: 5, opacity: 0.18, dashArray: "2 10", lineCap: "round" }).addTo(m);
      done.current = L.polyline(curve(from, to, 0, 0.001), { color: "#FF7A1A", weight: 5, lineCap: "round" }).addTo(m);

      L.marker([from.lat, from.lon], { icon: L.divIcon({ html: STORE, className: "", iconSize: [44, 44], iconAnchor: [22, 22] }) }).addTo(m);
      L.marker([to.lat, to.lon], { icon: L.divIcon({ html: HOME, className: "", iconSize: [36, 46], iconAnchor: [18, 44] }) }).addTo(m);
      bike.current = L.marker([from.lat, from.lon], { icon: L.divIcon({ html: BIKE, className: "", iconSize: [46, 46], iconAnchor: [23, 23] }), zIndexOffset: 1000, opacity: 0 }).addTo(m);

      m.fitBounds(
        [
          [from.lat, from.lon],
          [to.lat, to.lon],
        ],
        { paddingTopLeft: [50, 90], paddingBottomRight: [50, 60] },
      );
      map.current = m;
      place();
      window.setTimeout(() => m.invalidateSize(), 300);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Position du livreur
  useEffect(() => {
    place();
  }, [courier, showCourier]);

  return <div ref={el} className={`isolate bg-surface ${className}`} />;
}
