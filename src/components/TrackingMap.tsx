"use client";

import { useEffect, useRef } from "react";
import type { Map as LMap, Marker, Polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { routePoint } from "@/lib/tracking";

type Pt = { lat: number; lon: number };

const STORE = `<div style="width:44px;height:44px;border-radius:999px;background:#151515;display:grid;place-items:center;box-shadow:0 6px 16px -6px rgba(0,0,0,.5);border:3px solid #fff"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A1A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M9 20v-6h6v6"/></svg></div>`;
const HOME = `<svg viewBox="0 0 36 46" width="36" height="46" xmlns="http://www.w3.org/2000/svg"><path d="M18 42C8 30 3 23 3 16a15 15 0 1 1 30 0c0 7-5 14-15 26z" fill="#4CC764" stroke="#fff" stroke-width="2.5"/><path d="M11 17l7-6 7 6v7h-14z" fill="#fff"/></svg>`;
// Camionnette 3D vue du dessus (rendu Three.js, voir tools/vehicles). Version nuit = phares allumés.
const VAN = `<div class="van" style="width:96px;height:96px;will-change:transform"><img src="/vehicles/van-day.png" alt="" class="van-day" style="width:100%;height:100%"/><img src="/vehicles/van-night.png" alt="" class="van-night" style="width:100%;height:100%"/></div>`;

/** Trajet par les vraies rues (OSRM, OpenStreetMap) ; repli sur une courbe si le service ne répond pas. */
async function fetchRoute(a: Pt, b: Pt): Promise<[number, number][]> {
  const key = `nemsy-route:${a.lat.toFixed(4)},${a.lon.toFixed(4)}>${b.lat.toFixed(4)},${b.lon.toFixed(4)}`;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson`);
    const json = await res.json();
    const coords = (json.routes?.[0]?.geometry?.coordinates ?? []) as [number, number][];
    if (coords.length > 1) {
      const pts = coords.map(([lon, lat]) => [lat, lon] as [number, number]);
      try {
        sessionStorage.setItem(key, JSON.stringify(pts));
      } catch {
        /* ignore */
      }
      return pts;
    }
  } catch {
    /* repli plus bas */
  }
  return Array.from({ length: 41 }, (_, i) => routePoint(a, b, i / 40)).map((p) => [p.lat, p.lon] as [number, number]);
}

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Carte du suivi : resto, maison, trajet réel et camionnette qui roule.
 * `ride` = début et fin du trajet (timestamps) ; avant le départ, la camionnette attend au resto.
 */
export function TrackingMap({ from, to, ride, className = "" }: { from: Pt; to: Pt; ride: { start: number; end: number }; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const init = useRef({ from, to, ride });

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let map: LMap | null = null;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !el.current) return;
      const { from, to, ride } = init.current;
      const m = L.map(el.current, { zoomControl: false, attributionControl: true });
      map = m;
      m.attributionControl.setPrefix(false);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m);
      m.fitBounds(
        [
          [from.lat, from.lon],
          [to.lat, to.lon],
        ],
        { paddingTopLeft: [60, 100], paddingBottomRight: [60, 70] },
      );
      L.marker([from.lat, from.lon], { icon: L.divIcon({ html: STORE, className: "", iconSize: [44, 44], iconAnchor: [22, 22] }) }).addTo(m);
      L.marker([to.lat, to.lon], { icon: L.divIcon({ html: HOME, className: "", iconSize: [36, 46], iconAnchor: [18, 44] }) }).addTo(m);

      const route = await fetchRoute(from, to);
      if (cancelled) return;

      // longueurs cumulées pour avancer à vitesse régulière
      const cum = [0];
      for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + m.distance(route[i - 1], route[i]));
      const total = cum[cum.length - 1] || 1;

      L.polyline(route, { color: "#151515", weight: 6, opacity: 0.16, lineCap: "round", lineJoin: "round" }).addTo(m);
      const done: Polyline = L.polyline([route[0]], { color: "#FF7A1A", weight: 6, lineCap: "round", lineJoin: "round" }).addTo(m);
      const van: Marker = L.marker(route[0], { icon: L.divIcon({ html: VAN, className: "", iconSize: [96, 96], iconAnchor: [48, 48] }), zIndexOffset: 1000, interactive: false }).addTo(m);
      const vanEl = () => (van.getElement()?.querySelector(".van") as HTMLElement | null) ?? null;

      let angle: number | null = null;
      let lastTrail = 0;

      const frame = () => {
        const now = Date.now();
        const k = ease(Math.min(1, Math.max(0, (now - ride.start) / (ride.end - ride.start))));
        const d = k * total;
        let i = 1;
        while (i < cum.length - 1 && cum[i] < d) i++;
        const seg = cum[i] - cum[i - 1] || 1;
        const t = Math.min(1, Math.max(0, (d - cum[i - 1]) / seg));
        const a = route[i - 1];
        const b = route[i];
        const pos: [number, number] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        van.setLatLng(pos);

        // cap à l'écran (tient compte de la projection), lissé pour des virages doux
        const pa = m.latLngToLayerPoint(a);
        const pb = m.latLngToLayerPoint(b);
        const target = (Math.atan2(pb.x - pa.x, -(pb.y - pa.y)) * 180) / Math.PI;
        if (angle === null) angle = target;
        let diff = ((target - angle + 540) % 360) - 180;
        if (Math.abs(diff) < 0.2) diff = 0;
        angle += diff * 0.12;
        const ve = vanEl();
        if (ve) ve.style.transform = `rotate(${angle}deg)`;

        if (now - lastTrail > 250) {
          lastTrail = now;
          done.setLatLngs([...route.slice(0, i), pos]);
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      window.setTimeout(() => m.invalidateSize(), 300);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      map?.remove();
    };
  }, []);

  return <div ref={el} className={`isolate bg-surface ${className}`} />;
}
