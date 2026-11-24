import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Camionnette de livraison en 3D (unités ≈ mètres, avant vers -Z, haut = +Y).
 * Rendu « argile » propre, comme les véhicules d'une maquette 3D, avec logo sur le toit.
 */
const std = (color: number, o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.05, ...o });

function logoTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#FF7A1A";
  g.beginPath();
  g.roundRect(8, 8, 240, 240, 52);
  g.fill();
  g.fillStyle = "#fff";
  g.font = "900 156px Arial, Helvetica, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("n", 112, 122);
  g.fillStyle = "#151515";
  g.beginPath();
  g.arc(180, 170, 21, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 64, 4, 32, 64, 60);
  r.addColorStop(0, "rgba(0,0,0,.55)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 128);
  return new THREE.CanvasTexture(c);
}

function beamTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 256, 0, 0);
  grd.addColorStop(0, "rgba(255,236,170,.9)");
  grd.addColorStop(1, "rgba(255,236,170,0)");
  g.fillStyle = grd;
  g.beginPath();
  g.moveTo(54, 256);
  g.lineTo(74, 256);
  g.lineTo(128, 0);
  g.lineTo(0, 0);
  g.closePath();
  g.fill();
  return new THREE.CanvasTexture(c);
}

export function buildVan() {
  const van = new THREE.Group();
  const white = std(0xf6f5f1, { roughness: 0.38 });
  const glass = std(0x161b21, { roughness: 0.12, metalness: 0.5 });
  const dark = std(0x1b1b1b, { roughness: 0.85 });
  const trim = std(0x2a2a2a, { roughness: 0.6 });
  const orange = std(0xff7a1a, { roughness: 0.45 });
  const rim = std(0xc9ccd1, { roughness: 0.3, metalness: 0.6 });

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.x = rx;
    van.add(m);
    return m;
  };

  // ombre douce au sol
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 7.2), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2;
  sh.position.set(0.25, 0.02, 0.1);
  van.add(sh);

  // caisse, cabine, capot
  add(new RoundedBoxGeometry(2.05, 2.1, 3.3, 6, 0.2), white, 0, 1.4, 0.6);
  add(new RoundedBoxGeometry(2.0, 1.6, 1.6, 6, 0.32), white, 0, 1.15, -1.6);
  add(new RoundedBoxGeometry(1.94, 0.8, 0.95, 6, 0.3), white, 0, 0.75, -2.42);
  // bas de caisse sombre + passages de roue
  add(new RoundedBoxGeometry(2.08, 0.32, 5.2, 4, 0.12), trim, 0, 0.42, -0.25);
  // pare-chocs
  add(new RoundedBoxGeometry(2.0, 0.28, 0.25, 4, 0.1), trim, 0, 0.48, -2.92);
  add(new RoundedBoxGeometry(2.0, 0.28, 0.2, 4, 0.08), trim, 0, 0.5, 2.3);
  // calandre
  add(new RoundedBoxGeometry(1.2, 0.26, 0.06, 3, 0.04), dark, 0, 0.8, -2.9);
  // pare-brise incliné + lunette
  add(new RoundedBoxGeometry(1.78, 1.0, 0.1, 4, 0.05), glass, 0, 1.52, -2.24, -0.55);
  // vitres latérales, portes, bandes orange, rétroviseurs
  for (const s of [-1, 1]) {
    add(new RoundedBoxGeometry(0.05, 0.62, 1.0, 3, 0.02), glass, s * 1.0, 1.5, -1.6);
    add(new THREE.BoxGeometry(0.02, 1.3, 0.02), trim, s * 1.03, 1.15, -0.85);
    add(new THREE.BoxGeometry(0.03, 0.24, 3.1), orange, s * 1.03, 0.82, 0.6);
    add(new THREE.BoxGeometry(0.03, 0.08, 3.1), orange, s * 1.03, 1.02, 0.6);
    add(new RoundedBoxGeometry(0.3, 0.24, 0.12, 2, 0.05), trim, s * 1.16, 1.5, -2.08);
  }
  // logo sur le toit
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.55), new THREE.MeshStandardMaterial({ map: logoTexture(), transparent: true, roughness: 0.55 }));
  roof.rotation.x = -Math.PI / 2;
  roof.position.set(0, 2.46, 0.6);
  van.add(roof);
  // roues (pneu + jante)
  for (const [x, z] of [
    [-0.98, -1.8],
    [0.98, -1.8],
    [-0.98, 1.45],
    [0.98, 1.45],
  ]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.34, 28), dark);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.44, z);
    van.add(w);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.36, 20), rim);
    r.rotation.z = Math.PI / 2;
    r.position.set(x, 0.44, z);
    van.add(r);
  }
  // phares et feux (s'allument la nuit)
  const head = std(0xfff3c4, { emissive: new THREE.Color(0xfff0b0), emissiveIntensity: 0.4 });
  const tail = std(0xff2a2a, { emissive: new THREE.Color(0xff1a1a), emissiveIntensity: 0.5 });
  for (const s of [-1, 1]) {
    add(new RoundedBoxGeometry(0.44, 0.2, 0.08, 2, 0.04), head, s * 0.64, 0.9, -2.88);
    add(new RoundedBoxGeometry(0.16, 0.46, 0.06, 2, 0.03), tail, s * 0.88, 1.0, 2.27);
  }
  // faisceaux des phares au sol (nuit)
  const beams = new THREE.Group();
  const bt = beamTexture();
  for (const s of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 5), new THREE.MeshBasicMaterial({ map: bt, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    b.rotation.x = -Math.PI / 2;
    b.position.set(s * 0.64, 0.05, -5.4);
    beams.add(b);
  }
  beams.visible = false;
  van.add(beams);

  const setNight = (on: boolean) => {
    head.emissiveIntensity = on ? 2.4 : 0.4;
    tail.emissiveIntensity = on ? 1.8 : 0.5;
    beams.visible = on;
  };
  return { van, setNight };
}
