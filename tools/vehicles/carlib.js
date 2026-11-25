export const CAR_COLORS = { white: 0xeceef1, grey: 0x9c9fa6, black: 0x1c1d20 };

export function buildCar(THREE, opts = {}) {
  const car = new THREE.Group();
  const L = 4.7, W = 1.9, B = 0.24; // longueur, largeur, arrondi de la caisse
  const depth = W - 2 * B;
  const paint = new THREE.MeshPhysicalMaterial({ color: opts.color ?? CAR_COLORS.white, roughness: 0.5, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.12, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 });
  const tire = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.85 });
  const hub = new THREE.MeshStandardMaterial({ color: 0xdcdde1, roughness: 0.55 });
  const seam = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, transparent: true, opacity: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.4 });
  const head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9 });
  const tail = new THREE.MeshStandardMaterial({ color: 0xff3040, emissive: 0xff1a2a, emissiveIntensity: 0.6 });

  // 1. caisse (« baignoire ») : profil latéral, u de l'avant (0) vers l'arrière (L)
  const s = new THREE.Shape();
  s.moveTo(0.35, 0.24);
  s.quadraticCurveTo(0.02, 0.26, 0.02, 0.5);
  s.quadraticCurveTo(0.02, 0.7, 0.32, 0.75);
  s.quadraticCurveTo(0.9, 0.84, 1.3, 0.86);
  s.lineTo(4.15, 0.88);
  s.quadraticCurveTo(4.62, 0.88, 4.66, 0.66);
  s.quadraticCurveTo(4.7, 0.3, 4.35, 0.24);
  s.lineTo(0.35, 0.24);
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: B, bevelThickness: B, bevelSegments: 12, curveSegments: 28 }), paint);
  car.add(body);

  // 2. dôme de verre noir (pare-brise + toit + lunette), plus étroit : on garde une bordure de carrosserie
  const g = new THREE.Shape();
  g.moveTo(1.2, 0.9);
  g.quadraticCurveTo(1.75, 1.0, 2.2, 1.42);
  g.quadraticCurveTo(2.9, 1.66, 3.6, 1.44);
  g.quadraticCurveTo(4.1, 1.18, 4.45, 0.93);
  g.lineTo(1.2, 0.9);
  const gB = 0.2, inset = 0.12;
  const gDepth = depth + 2 * B - 2 * inset - 2 * gB;
  const dome = new THREE.Mesh(new THREE.ExtrudeGeometry(g, { depth: gDepth, bevelEnabled: true, bevelSize: gB, bevelThickness: gB, bevelSegments: 12, curveSegments: 24 }), glass);
  dome.position.set(0, 0.02, -B + inset + gB);
  car.add(dome);

  // 3. barre lumineuse avant et arrière (tubes fins arrondis)
  const bar = (len) => new THREE.CapsuleGeometry(0.022, len, 6, 12);
  const hl = new THREE.Mesh(bar(depth + 0.15), head);
  hl.rotation.x = Math.PI / 2; hl.position.set(-0.2, 0.62, depth / 2); car.add(hl);
  const tl = new THREE.Mesh(bar(depth + 0.15), tail);
  tl.rotation.x = Math.PI / 2; tl.position.set(4.9, 0.7, depth / 2); car.add(tl);

  // 4. détails latéraux : lignes de portes, poignées, rétroviseurs
  for (const z of [-B - 0.003, depth + B + 0.003]) {
    for (const u of [2.15, 3.3]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.6, 0.006), seam);
      l.position.set(u, 0.56, z); car.add(l);
    }
    for (const u of [2.5, 3.6]) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.025, 0.012), dark);
      h.position.set(u, 0.78, z); car.add(h);
    }
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.12, 4, 10), dark);
    m.rotation.x = Math.PI / 2; m.position.set(1.55, 0.92, z + (z < 0 ? -0.06 : 0.06)); car.add(m);
  }

  // 5. roues : pneu + enjoliveur plein
  const tireG = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 40);
  const hubG = new THREE.CylinderGeometry(0.24, 0.24, 0.31, 40);
  for (const u of [0.95, 3.8]) for (const z of [-B + 0.07, depth + B - 0.07]) {
    const w = new THREE.Group();
    const t = new THREE.Mesh(tireG, tire), h = new THREE.Mesh(hubG, hub);
    t.rotation.x = h.rotation.x = Math.PI / 2;
    w.add(t, h); w.position.set(u, 0.4, z); car.add(w);
  }

  car.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  // recentrage : centre au sol en (0,0,0), avant vers -Z
  car.position.set(-L / 2, 0, -depth / 2);
  const root = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.add(car);
  pivot.rotation.y = -Math.PI / 2; // l'avant (u = 0) se retrouve vers -Z
  root.add(pivot);
  const setNight = (on) => { head.emissiveIntensity = on ? 3 : 0.9; tail.emissiveIntensity = on ? 2.4 : 0.6; };
  return { car: root, setNight };
}
