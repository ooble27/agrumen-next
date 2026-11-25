import * as THREE from "three";

/**
 * Voiture électrique de livraison, style berline Tesla : carrosserie sculptée
 * à partir d'un profil latéral, toit panoramique en verre noir, jantes aéro,
 * barre lumineuse arrière. Unités ≈ mètres, avant vers -Z, haut = +Y.
 */
export function buildCar(opts: { color?: number } = {}) {
  const car = new THREE.Group();
  const L = 4.7, W = 1.86, B = 0.16; // longueur, largeur, arrondi
  const paint = new THREE.MeshPhysicalMaterial({ color: opts.color ?? 0xe4e6ea, roughness: 0.32, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.12 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0b0e12, roughness: 0.06, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.05 });
  const tire = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.9 });
  const rimM = new THREE.MeshStandardMaterial({ color: 0x8c9096, roughness: 0.35, metalness: 0.8 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
  const head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4d6, emissiveIntensity: 0.6 });
  const tail = new THREE.MeshStandardMaterial({ color: 0xff2030, emissive: 0xff1020, emissiveIntensity: 0.8 });

  // profil latéral (u = de l'avant vers l'arrière, v = hauteur)
  const s = new THREE.Shape();
  s.moveTo(0.18, 0.28);
  s.quadraticCurveTo(0.0, 0.32, 0.03, 0.56);
  s.quadraticCurveTo(0.08, 0.74, 0.45, 0.8);
  s.lineTo(1.3, 0.92);
  s.quadraticCurveTo(1.62, 0.96, 1.82, 1.08);
  s.lineTo(2.3, 1.42);
  s.quadraticCurveTo(2.85, 1.52, 3.35, 1.43);
  s.quadraticCurveTo(4.0, 1.26, 4.5, 1.02);
  s.quadraticCurveTo(4.7, 0.93, 4.68, 0.66);
  s.lineTo(4.62, 0.32);
  s.quadraticCurveTo(4.6, 0.28, 4.48, 0.28);
  s.lineTo(0.18, 0.28);
  const depth = W - 2 * B;
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: B, bevelThickness: B, bevelSegments: 8, curveSegments: 24 }), paint);
  car.add(body);

  // verrière (pare-brise + toit + lunette) : légèrement en saillie
  const g = new THREE.Shape();
  g.moveTo(1.86, 1.06);
  g.lineTo(2.31, 1.43);
  g.quadraticCurveTo(2.85, 1.535, 3.35, 1.445);
  g.quadraticCurveTo(3.95, 1.28, 4.32, 1.08);
  g.lineTo(1.86, 1.06);
  const gDepth = depth - 0.06;
  const canopy = new THREE.Mesh(new THREE.ExtrudeGeometry(g, { depth: gDepth, bevelEnabled: true, bevelSize: B, bevelThickness: B, bevelSegments: 8, curveSegments: 20 }), glass);
  canopy.position.set(0.02, 0.05, 0.03);
  car.add(canopy);

  // vitres latérales
  const sw = new THREE.Shape();
  sw.moveTo(2.0, 1.02); sw.lineTo(2.33, 1.33); sw.quadraticCurveTo(2.85, 1.42, 3.4, 1.35); sw.quadraticCurveTo(3.85, 1.22, 4.15, 1.04); sw.lineTo(2.0, 1.02);
  for (const z of [-B - 0.005, depth + B - 0.015]) {
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sw, 16), glass);
    m.position.z = z + (z < 0 ? 0 : 0.02);
    if (z < 0) {
      m.rotation.y = Math.PI;
      m.scale.x = -1;
    }
    car.add(m);
  }

  // feux : fine bande avant, barre lumineuse arrière
  const hb = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.42), head);
  for (const zz of [0.12, depth - 0.12]) { const m = hb.clone(); m.position.set(0.04, 0.66, zz); m.rotation.z = -0.5; car.add(m); }
  const tb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, depth + 0.24), tail);
  tb.position.set(4.7, 0.84, depth / 2); tb.rotation.z = 0.9; car.add(tb);
  // logo discret sur le coffre
  const lg = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.4 }));
  lg.position.set(4.42, 1.075, depth / 2);
  lg.rotation.x = -1.15;
  car.add(lg);
  // bas de caisse sombre
  const sk = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.08, depth + 0.26), black);
  sk.position.set(2.35, 0.27, depth / 2); car.add(sk);

  // roues
  const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.24, 36);
  const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.25, 36);
  const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.28, 12);
  for (const u of [0.98, 3.72]) for (const z of [-B + 0.11, depth + B - 0.11]) {
    const w = new THREE.Group();
    const t = new THREE.Mesh(wheelGeo, tire); const r = new THREE.Mesh(rimGeo, rimM); const c = new THREE.Mesh(capGeo, black);
    for (const m of [t, r, c]) { m.rotation.x = Math.PI / 2; w.add(m); }
    w.position.set(u, 0.36, z); car.add(w);
  }

  // recentrage : avant vers -Z, centre au sol en (0,0,0)
  const pivot = new THREE.Group();
  car.position.set(-L / 2, 0, -depth / 2);
  pivot.add(car);
  pivot.rotation.y = -Math.PI / 2; // l’avant (u = 0) se retrouve vers -Z
  const root = new THREE.Group();
  root.add(pivot);
  // avant vers -Z (la rotation du pivot suffit)
  const setNight = (on: boolean) => { head.emissiveIntensity = on ? 3 : 0.6; tail.emissiveIntensity = on ? 2.4 : 0.8; };
  return { car: root, setNight };
}
