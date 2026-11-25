"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { LocateFixed } from "lucide-react";
import { fetchRoute } from "./TrackingMap";

type Pt = { lat: number; lon: number };

/** Taille d’affichage du véhicule (x3,4 : lisible, et reste dans la largeur de la rue). */
const VAN_SCALE = 4;
const ease = (t: number) => t * t * (3 - 2 * t);

const pin = (html: string) => {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.firstElementChild as HTMLElement;
};
const STORE = `<div style="width:46px;height:46px;border-radius:999px;background:#151515;display:grid;place-items:center;box-shadow:0 8px 18px -6px rgba(0,0,0,.55);border:3px solid #fff"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A1A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M9 20v-6h6v6"/></svg></div>`;
const HOME = `<div style="display:flex;flex-direction:column;align-items:center"><div style="width:44px;height:44px;border-radius:999px;background:#4CC764;display:grid;place-items:center;border:3px solid #fff;box-shadow:0 8px 18px -6px rgba(0,0,0,.45)"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z"/></svg></div><div style="width:3px;height:14px;background:#4CC764;border-radius:2px"></div></div>`;

function bearing(a: [number, number], b: [number, number]) {
  // a, b = [lat, lon] -> cap en degrés depuis le nord, sens horaire
  const toR = Math.PI / 180;
  const y = Math.sin((b[1] - a[1]) * toR) * Math.cos(b[0] * toR);
  const x = Math.cos(a[0] * toR) * Math.sin(b[0] * toR) - Math.sin(a[0] * toR) * Math.cos(b[0] * toR) * Math.cos((b[1] - a[1]) * toR);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

/**
 * Carte vectorielle 3D (MapLibre + OpenFreeMap), bâtiments en relief,
 * trajet par les vraies rues et camionnette 3D (Three.js) qui roule dessus.
 * Renvoie `false` via onFail si WebGL n'est pas disponible.
 */
export function TrackingMap3D({
  from,
  to,
  ride,
  onFail,
  className = "",
}: {
  from: Pt;
  to: Pt;
  ride: { start: number; end: number };
  onFail: () => void;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const init = useRef({ from, to, ride, onFail });
  const [following, setFollowing] = useState(true);
  const followRef = useRef(true);
  const recenter = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let cleanup = () => {};

    (async () => {
      const [maplibregl, THREE, { buildCar, CAR_COLORS }, { RoomEnvironment }] = await Promise.all([import("maplibre-gl"), import("three"), import("@/lib/car3d"), import("three/examples/jsm/environments/RoomEnvironment.js")]);
      if (cancelled || !el.current) return;
      // worker servi depuis public/ (le bundler ne le fournit pas) ; à recopier si maplibre-gl est mis à jour
      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      const { from, to, ride, onFail } = init.current;
      const dark = document.documentElement.dataset.theme === "dark";

      let map: import("maplibre-gl").Map;
      try {
        map = new maplibregl.Map({
          container: el.current,
          style: `https://tiles.openfreemap.org/styles/${dark ? "dark" : "positron"}`,
          center: [from.lon, from.lat],
          zoom: 14,
          pitch: 50,
          bearing: -18,
          attributionControl: { compact: true },
          maxPitch: 70,
          canvasContextAttributes: { antialias: true },
        });
      } catch {
        onFail();
        return;
      }
      cleanup = () => map.remove();
      map.on("error", () => {});

      map.on("load", async () => {
        // Bâtiments en 3D
        const firstLabel = map.getStyle().layers?.find((l) => l.type === "symbol")?.id;
        if (map.getSource("openmaptiles")) {
          map.addLayer(
            {
              id: "nemsy-buildings",
              type: "fill-extrusion",
              source: "openmaptiles",
              "source-layer": "building",
              minzoom: 13,
              paint: {
                "fill-extrusion-color": dark ? "#30343b" : "#ebe8e1",
                "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
                "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
                "fill-extrusion-opacity": 1,
                "fill-extrusion-vertical-gradient": true,
              },
            },
            firstLabel,
          );
        }

        const route = await fetchRoute(from, to);
        if (cancelled) return;
        const coords = route.map(([lat, lon]) => [lon, lat] as [number, number]);
        const cum = [0];
        for (let i = 1; i < route.length; i++) {
          const a = new maplibregl.LngLat(coords[i - 1][0], coords[i - 1][1]);
          cum.push(cum[i - 1] + a.distanceTo(new maplibregl.LngLat(coords[i][0], coords[i][1])));
        }
        const total = cum[cum.length - 1] || 1;

        map.addSource("route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } } });
        map.addSource("done", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [coords[0], coords[0]] } } });
        map.addLayer({ id: "route-casing", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": dark ? "#0d0d0d" : "#ffffff", "line-width": 11 } });
        map.addLayer({ id: "route-line", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": dark ? "#5b5f66" : "#151515", "line-width": 6 } });
        map.addLayer({ id: "route-done", type: "line", source: "done", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#FF7A1A", "line-width": 6 } });

        new maplibregl.Marker({ element: pin(STORE) }).setLngLat([from.lon, from.lat]).addTo(map);
        new maplibregl.Marker({ element: pin(HOME), anchor: "bottom" }).setLngLat([to.lon, to.lat]).addTo(map);

        // Camionnette 3D (calque Three.js dans la carte)
        const { car: van, setNight } = buildCar({ color: CAR_COLORS.white });
        setNight(dark);
        const scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8a8a, dark ? 1.4 : 2.2));
        const sun = new THREE.DirectionalLight(0xffffff, dark ? 1.2 : 2.4);
        sun.position.set(-30, 80, -40);
        scene.add(sun);
        scene.add(van);
        const camera = new THREE.Camera();
        let renderer: InstanceType<typeof THREE.WebGLRenderer> | null = null;
        let vanPos = coords[0];
        let vanHeading = bearing(route[0], route[Math.min(1, route.length - 1)]);

        map.addLayer({
          id: "van-3d",
          type: "custom",
          renderingMode: "3d",
          onAdd(_m, gl) {
            renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl, antialias: true });
            renderer.autoClear = false;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = dark ? 0.9 : 0.85;
            // reflets réalistes sur la peinture et le verre
            const pm = new THREE.PMREMGenerator(renderer);
            scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
            pm.dispose();
          },
          render(_gl, args) {
            if (!renderer) return;
            const o = maplibregl.MercatorCoordinate.fromLngLat(vanPos, 0);
            const s = o.meterInMercatorCoordinateUnits() * VAN_SCALE;
            const model = new THREE.Matrix4()
              .makeTranslation(o.x, o.y, o.z)
              .scale(new THREE.Vector3(s, -s, s))
              .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2))
              .multiply(new THREE.Matrix4().makeRotationY((-vanHeading * Math.PI) / 180));
            camera.projectionMatrix = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix as unknown as number[]).multiply(model);
            renderer.resetState();
            renderer.render(scene, camera);
          },
        });

        // Vue d'ensemble, puis suivi de la camionnette
        const overview = () =>
          map.fitBounds(
            [
              [Math.min(from.lon, to.lon), Math.min(from.lat, to.lat)],
              [Math.max(from.lon, to.lon), Math.max(from.lat, to.lat)],
            ],
            { padding: { top: 110, bottom: 80, left: 60, right: 60 }, pitch: 50, bearing: -18, duration: 900 },
          );
        overview();
        recenter.current = () => {
          followRef.current = true;
          setFollowing(true);
        };
        map.on("dragstart", () => {
          followRef.current = false;
          setFollowing(false);
        });

        let lastDone = 0;
        let lastFollow = 0;
        let lastPaint = 0;
        let lastKey = "";
        const frame = () => {
          const now = Date.now();
          const k = ease(Math.min(1, Math.max(0, (now - ride.start) / (ride.end - ride.start))));
          const d = k * total;
          let i = 1;
          while (i < cum.length - 1 && cum[i] < d) i++;
          const seg = cum[i] - cum[i - 1] || 1;
          const t = Math.min(1, Math.max(0, (d - cum[i - 1]) / seg));
          const a = coords[i - 1];
          const b = coords[i];
          vanPos = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const target = bearing([a[1], a[0]], [b[1], b[0]]);
          let diff = ((target - vanHeading + 540) % 360) - 180;
          if (Math.abs(diff) < 0.1) diff = 0;
          vanHeading += diff * 0.1;

          // redessiner seulement si la camionnette a bougé (30 i/s max)
          const key = `${vanPos[0].toFixed(7)},${vanPos[1].toFixed(7)},${vanHeading.toFixed(1)}`;
          if (key !== lastKey && now - lastPaint > 33) {
            lastKey = key;
            lastPaint = now;
            map.triggerRepaint();
          }

          if (now - lastDone > 300) {
            lastDone = now;
            (map.getSource("done") as import("maplibre-gl").GeoJSONSource | undefined)?.setData({
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: [...coords.slice(0, i), vanPos] },
            });
          }
          // la caméra suit la camionnette pendant la livraison
          const moving = k > 0 && k < 1;
          if (moving && followRef.current && now - lastFollow > 900 && !map.isMoving()) {
            lastFollow = now;
            map.easeTo({ center: vanPos, zoom: 17.6, pitch: 62, bearing: vanHeading - 20, duration: 1000, easing: (x) => x });
          }
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      });
    })().catch(() => init.current.onFail());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  return (
    <div className={`relative isolate ${className}`}>
      <div ref={el} className="h-full w-full" />
      {!following && (
        <button
          type="button"
          onClick={() => recenter.current()}
          className="absolute bottom-12 right-4 z-10 flex h-11 items-center gap-2 rounded-full bg-bg px-4 text-[14px] font-medium shadow-[0_8px_20px_-8px_rgba(0,0,0,.4)]"
        >
          <LocateFixed className="size-4" /> Recentrer
        </button>
      )}
    </div>
  );
}
