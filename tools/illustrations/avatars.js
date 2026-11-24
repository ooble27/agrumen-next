// Génère public/avatars/*.svg : personnages plats et souriants, variés.
const fs = require("fs");
const path = require("path");
const out = path.join(__dirname, "../../public/avatars");
fs.mkdirSync(out, { recursive: true });

const SKIN = { a: "#F6D2B8", b: "#E8B48C", c: "#C98B5E", d: "#9A6240", e: "#6B4028" };
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${((f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, "0")}`;
};

function avatar({ bg, skin, shirt, hair, hairColor, extra = "", glasses = false, beard = false, earrings = false }) {
  const s = SKIN[skin];
  const hairBack = {
    afro: `<circle cx="100" cy="86" r="58" fill="${hairColor}"/><circle cx="58" cy="100" r="22" fill="${hairColor}"/><circle cx="142" cy="100" r="22" fill="${hairColor}"/>`,
    long: `<path d="M48 96 C 44 40 156 40 152 96 L 158 168 C 130 178 70 178 42 168 Z" fill="${hairColor}"/>`,
    braids: `<path d="M52 92 C 50 40 150 40 148 92 L 150 150 L 50 150 Z" fill="${hairColor}"/><rect x="40" y="110" width="18" height="70" rx="9" fill="${hairColor}"/><rect x="142" y="110" width="18" height="70" rx="9" fill="${hairColor}"/>`,
    bun: `<circle cx="100" cy="34" r="22" fill="${hairColor}"/>`,
    hijab: `<path d="M38 112 C 34 34 166 34 162 112 L 168 200 L 32 200 Z" fill="${hairColor}"/>`,
    none: "",
    short: "",
    cap: "",
    curly: `<g fill="${hairColor}">${[[62, 70], [80, 54], [100, 48], [120, 54], [138, 70], [148, 92], [52, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20"/>`).join("")}</g>`,
  }[hair];
  const hairFront = {
    afro: `<path d="M58 84 C 70 56 130 56 142 84 C 126 72 74 72 58 84 Z" fill="${hairColor}"/>`,
    long: `<path d="M58 86 C 62 50 138 50 142 86 C 120 66 100 74 82 64 C 74 74 66 80 58 86 Z" fill="${hairColor}"/>`,
    braids: `<path d="M58 84 C 64 52 136 52 142 84 L 142 76 C 128 62 72 62 58 76 Z" fill="${hairColor}"/><path d="M100 54 V 74" stroke="${shade(hairColor, 0.7)}" stroke-width="3"/>`,
    bun: `<path d="M58 88 C 58 52 142 52 142 88 C 128 70 72 70 58 88 Z" fill="${hairColor}"/>`,
    hijab: `<path d="M56 100 C 56 56 144 56 144 100 C 140 74 60 74 56 100 Z" fill="${shade(hairColor, 1.12)}"/>`,
    none: "",
    short: `<path d="M58 86 C 58 50 142 50 142 86 C 136 72 120 66 100 70 C 82 66 64 72 58 86 Z" fill="${hairColor}"/>`,
    cap: `<path d="M56 80 C 56 44 144 44 144 80 Z" fill="${hairColor}"/><path d="M128 76 h 34 a 6 6 0 0 1 0 10 h -40 z" fill="${shade(hairColor, 0.8)}"/><circle cx="100" cy="48" r="4" fill="${shade(hairColor, 0.7)}"/>`,
    curly: `<g fill="${hairColor}">${[[70, 72], [88, 64], [106, 62], [124, 66], [138, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/>`).join("")}</g>`,
  }[hair];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 24 160 160">
<defs><clipPath id="c"><circle cx="100" cy="104" r="80"/></clipPath></defs>
<g clip-path="url(#c)">
<rect width="200" height="200" fill="${bg}"/>
${hairBack}
<path d="M30 210 C 30 160 62 142 100 142 C 138 142 170 160 170 210 Z" fill="${shirt}"/>
<path d="M84 140 h32 v18 a16 16 0 0 1 -32 0 z" fill="${shade(s, 0.88)}"/>
<ellipse cx="57" cy="104" rx="9" ry="12" fill="${shade(s, 0.95)}"/><ellipse cx="143" cy="104" rx="9" ry="12" fill="${shade(s, 0.95)}"/>
${earrings ? `<circle cx="56" cy="120" r="5" fill="#FFC93C"/><circle cx="144" cy="120" r="5" fill="#FFC93C"/>` : ""}
<ellipse cx="100" cy="100" rx="43" ry="48" fill="${s}"/>
${hairFront}
<ellipse cx="84" cy="104" rx="4.5" ry="5.5" fill="#2A1A10"/><ellipse cx="116" cy="104" rx="4.5" ry="5.5" fill="#2A1A10"/>
<circle cx="85.5" cy="102" r="1.5" fill="#fff"/><circle cx="117.5" cy="102" r="1.5" fill="#fff"/>
<path d="M76 92 q8 -5 16 0 M108 92 q8 -5 16 0" stroke="${shade(hairColor === "#FFFFFF" ? "#555555" : hairColor, 0.9)}" stroke-width="3" fill="none" stroke-linecap="round"/>
<ellipse cx="74" cy="118" rx="7" ry="4.5" fill="#FF7A6B" opacity=".35"/><ellipse cx="126" cy="118" rx="7" ry="4.5" fill="#FF7A6B" opacity=".35"/>
${beard ? `<path d="M60 112 C 62 150 138 150 140 112 C 132 128 118 132 100 132 C 82 132 68 128 60 112 Z" fill="${hairColor}"/>` : ""}
<path d="M88 124 q12 12 24 0" stroke="#7A2E1E" stroke-width="4" fill="${beard ? "none" : "#fff"}" stroke-linecap="round" stroke-linejoin="round"/>
${glasses ? `<g fill="none" stroke="#151515" stroke-width="3.5"><circle cx="84" cy="104" r="12"/><circle cx="116" cy="104" r="12"/><path d="M96 104 h8"/></g>` : ""}
${extra}
</g></svg>`;
}

const A = [
  { bg: "#FFE3C9", skin: "d", shirt: "#FF7A1A", hair: "afro", hairColor: "#2A1A10", earrings: true },
  { bg: "#D9F2DF", skin: "b", shirt: "#2F9E4B", hair: "short", hairColor: "#3B2A1E", beard: true },
  { bg: "#E6E0FF", skin: "e", shirt: "#7C5CFF", hair: "braids", hairColor: "#1A120C" },
  { bg: "#FFE0E6", skin: "a", shirt: "#FF4D6D", hair: "long", hairColor: "#C27A3A" },
  { bg: "#DCEFFF", skin: "c", shirt: "#2E7CF6", hair: "cap", hairColor: "#151515" },
  { bg: "#FFF1C2", skin: "d", shirt: "#151515", hair: "hijab", hairColor: "#2F9E4B" },
  { bg: "#E8F7F4", skin: "a", shirt: "#0F766E", hair: "curly", hairColor: "#6B3E1F", glasses: true },
  { bg: "#F3E8DC", skin: "e", shirt: "#E8B04A", hair: "none", hairColor: "#151515", beard: true, glasses: true },
  { bg: "#FDE2D2", skin: "c", shirt: "#FF7A1A", hair: "bun", hairColor: "#2A1A10", earrings: true },
  { bg: "#E2E8F0", skin: "b", shirt: "#334155", hair: "short", hairColor: "#151515", glasses: true },
  { bg: "#FFE3EC", skin: "d", shirt: "#B83280", hair: "long", hairColor: "#1A120C", earrings: true },
  { bg: "#E0F2FE", skin: "a", shirt: "#4CC764", hair: "cap", hairColor: "#FF7A1A" },
];
A.forEach((o, i) => fs.writeFileSync(path.join(out, `a${i + 1}.svg`), avatar(o)));
console.log(A.length, "avatars");
