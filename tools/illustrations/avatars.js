// Génère public/avatars/a1…a12.svg : dégradés « aurora » haut de gamme (flous + grain + reflet).
const fs = require("fs");
const path = require("path");
const out = path.join(__dirname, "../../public/avatars");
fs.mkdirSync(out, { recursive: true });

const PALETTES = [
  ["#FF6A00", "#FF2E63", "#FFC93C"], // Coucher de soleil
  ["#0EA5E9", "#6366F1", "#22D3EE"], // Océan
  ["#84CC16", "#059669", "#FDE047"], // Citron vert
  ["#7C3AED", "#EC4899", "#F59E0B"], // Raisin
  ["#10B981", "#06B6D4", "#A7F3D0"], // Menthe
  ["#DC2626", "#F97316", "#7C2D12"], // Braise
  ["#F472B6", "#FB7185", "#FDE68A"], // Rose
  ["#1E1B4B", "#4338CA", "#38BDF8"], // Nuit
  ["#FB923C", "#F87171", "#FEF3C7"], // Pêche
  ["#064E3B", "#10B981", "#BEF264"], // Forêt
  ["#0F172A", "#475569", "#CBD5E1"], // Graphite
  ["#92400E", "#F59E0B", "#FEF08A"], // Or
];

// positions des taches de couleur (varient d'un avatar à l'autre)
const LAYOUTS = [
  [[30, 30], [80, 40], [50, 85]],
  [[75, 25], [20, 70], [80, 85]],
  [[20, 20], [85, 60], [35, 90]],
  [[60, 15], [15, 55], [85, 90]],
];

PALETTES.forEach(([a, b, c], i) => {
  const L = LAYOUTS[i % LAYOUTS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs>
  <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter>
  <radialGradient id="shine" cx=".3" cy=".22" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="edge" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient>
  <clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="100" height="100" fill="${a}"/>
  <g filter="url(#blur)">
    <circle cx="${L[0][0]}" cy="${L[0][1]}" r="38" fill="${a}"/>
    <circle cx="${L[1][0]}" cy="${L[1][1]}" r="34" fill="${b}"/>
    <circle cx="${L[2][0]}" cy="${L[2][1]}" r="32" fill="${c}"/>
  </g>
  <rect width="100" height="100" filter="url(#grain)" opacity=".12"/>
  <rect width="100" height="100" fill="url(#edge)"/>
  <rect width="100" height="100" fill="url(#shine)"/>
</g>
</svg>`;
  fs.writeFileSync(path.join(out, `a${i + 1}.svg`), svg);
});
console.log(PALETTES.length, "avatars");
