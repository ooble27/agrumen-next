// Petite bibliothèque d'illustration : lumière en haut à gauche, volumes doux, ombre portée au sol.
let uid = 0;
/** Générateur pseudo-aléatoire déterministe (textures organiques reproductibles). */
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
/** Contour de "blob" organique autour de (0,0). */
function blob(rx, ry, bumps, amp, seed) {
  const R = rng(seed), pts = [];
  const n = bumps * 2;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k = 1 + (i % 2 ? amp : -amp * 0.4) * (0.6 + R() * 0.8);
    pts.push([Math.cos(t) * rx * k, Math.sin(t) * ry * k]);
  }
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (i === 0) d += `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}
const id = (p) => `${p}${++uid}`;
const f = (n) => +n.toFixed(1);

function lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const i = id("g");
  return { id: i, def: `<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>` };
}
function rad(stops, cx = 0.35, cy = 0.3, r = 0.8) {
  const i = id("r");
  return { id: i, def: `<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>` };
}

class Art {
  constructor() { this.defs = []; this.body = []; }
  g(grad) { this.defs.push(grad.def); return `url(#${grad.id})`; }
  add(s) { this.body.push(s); return this; }
  shadow(cx, cy, rx, ry, o = 0.22) {
    const fid = id("b");
    this.defs.push(`<filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f(ry * 0.45)}"/></filter>`);
    return this.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a120b" opacity="${o}" filter="url(#${fid})"/>`);
  }
  svg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs>${this.defs.join("")}</defs>${this.body.join("")}</svg>`;
  }
}

/* ---------- vaisselle ---------- */
function plate(a, cx, cy, rx, ry, tone = "#ffffff") {
  a.shadow(cx, cy + ry * 0.55, rx * 0.95, ry * 0.55, 0.28);
  a.add(`<ellipse cx="${cx}" cy="${cy + ry * 0.12}" rx="${rx}" ry="${ry}" fill="${a.g(lin([[0, "#dfe5e8"], [1, "#b9c3c8"]]))}"/>`);
  a.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${a.g(lin([[0, tone], [1, "#eef2f4"]]))}"/>`);
  a.add(`<ellipse cx="${cx}" cy="${cy + ry * 0.06}" rx="${rx * 0.74}" ry="${ry * 0.7}" fill="${a.g(lin([[0, "#e9eef1"], [1, "#ffffff"]]))}"/>`);
  a.add(`<path d="M${cx - rx * 0.86} ${cy - ry * 0.2} A${rx} ${ry} 0 0 1 ${cx - rx * 0.2} ${cy - ry * 0.97}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>`);
}

function bowl(a, cx, cy, w, h, color = "#ffffff", inner = "#f1f4f6") {
  const rx = w / 2, ry = w * 0.17;
  a.shadow(cx, cy + h * 0.98, rx * 0.8, ry * 0.55, 0.3);
  a.add(`<path d="M${cx - rx} ${cy} C${cx - rx} ${cy + h * 0.75} ${cx - rx * 0.5} ${cy + h} ${cx} ${cy + h} C${cx + rx * 0.5} ${cy + h} ${cx + rx} ${cy + h * 0.75} ${cx + rx} ${cy} Z" fill="${a.g(lin([[0, color], [1, shade(color, -0.22)]], 0, 0, 1, 1))}"/>`);
  a.add(`<path d="M${cx - rx * 0.78} ${cy + h * 0.25} C${cx - rx * 0.72} ${cy + h * 0.6} ${cx - rx * 0.45} ${cy + h * 0.8} ${cx - rx * 0.2} ${cy + h * 0.86}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45"/>`);
  a.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${shade(color, -0.08)}"/>`);
  a.add(`<ellipse cx="${cx}" cy="${cy + 1.5}" rx="${rx - 6}" ry="${ry - 4}" fill="${inner}"/>`);
  return { rx: rx - 6, ry: ry - 4 };
}

function dip(a, cx, cy, r, sauce, sauce2) {
  a.shadow(cx, cy + r * 0.62, r * 1.0, r * 0.32, 0.25);
  a.add(`<ellipse cx="${cx}" cy="${cy + r * 0.18}" rx="${r}" ry="${r * 0.52}" fill="${a.g(lin([[0, "#e4e9ec"], [1, "#b8c2c7"]]))}"/>`);
  a.add(`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.46}" fill="#fff"/>`);
  a.add(`<ellipse cx="${cx}" cy="${cy + 2}" rx="${r * 0.78}" ry="${r * 0.33}" fill="${a.g(lin([[0, sauce2], [1, sauce]]))}"/>`);
  a.add(`<ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.05}" rx="${r * 0.22}" ry="${r * 0.07}" fill="#fff" opacity=".55"/>`);
}

/* ---------- couleurs ---------- */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ---------- aliments ---------- */
const GOLD = [[0, "#ffe19a"], [0.35, "#f7b548"], [0.8, "#e08a22"], [1, "#b8631a"]];

function nem(a, cx, cy, len, th, ang, { end = true } = {}) {
  const x = -len / 2, r = th / 2;
  let s = `<g transform="translate(${cx} ${cy}) rotate(${ang})">`;
  s += `<rect x="${x}" y="${-r}" width="${len}" height="${th}" rx="${r}" fill="${a.g(lin(GOLD))}"/>`;
  // texture croustillante
  for (let i = 0; i < 26; i++) {
    const px = x + r + ((i * 37) % (len - th)), py = -r * 0.55 + ((i * 53) % (th * 0.9)) * 0.75;
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="${1.3 + (i % 3) * 0.6}" fill="${i % 2 ? "#ffe9b8" : "#c9731f"}" opacity="${i % 2 ? 0.55 : 0.35}"/>`;
  }
  // plis de la galette
  for (let k = 1; k <= 3; k++) {
    const px = x + (len * k) / 4.2;
    s += `<path d="M${f(px)} ${-r + 2} q${f(-th * 0.32)} ${f(r)} 0 ${f(th - 4)}" fill="none" stroke="#b8631a" stroke-width="2.2" stroke-linecap="round" opacity=".45"/>`;
  }
  s += `<rect x="${x + r * 0.6}" y="${-r * 0.72}" width="${len * 0.62}" height="${th * 0.16}" rx="${th * 0.08}" fill="#fff6dc" opacity=".6"/>`;
  if (end) {
    s += `<ellipse cx="${x + len - r * 0.55}" cy="0" rx="${r * 0.5}" ry="${r * 0.92}" fill="${a.g(lin([[0, "#ffe7b0"], [1, "#e6982e"]]))}"/>`;
    s += `<ellipse cx="${x + len - r * 0.5}" cy="0" rx="${r * 0.3}" ry="${r * 0.62}" fill="#8a4a1c" opacity=".55"/>`;
    s += `<circle cx="${x + len - r * 0.55}" cy="${-r * 0.22}" r="${r * 0.12}" fill="#6cc04a"/><circle cx="${x + len - r * 0.45}" cy="${r * 0.22}" r="${r * 0.11}" fill="#f07a3a"/>`;
  }
  return a.add(s + `</g>`);
}

function leaf(a, cx, cy, s, ang, c1 = "#9ee06a", c2 = "#3f9e45") {
  return a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang}) scale(${s})"><path d="M0 0 C 18 -30 70 -34 96 -6 C 70 22 22 26 0 0 Z" fill="${a.g(lin([[0, c1], [1, c2]], 0, 0, 1, 1))}"/><path d="M6 -1 C 36 -6 66 -8 90 -5" stroke="#d9f7c0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></g>`);
}

function lettuce(a, cx, cy, w) {
  // feuille ondulée sous la nourriture
  const p = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI;
    const rx = w / 2, ry = w * 0.2;
    const bump = i % 2 ? 1.0 : 0.82;
    p.push(`${f(cx - Math.cos(t) * rx * bump)} ${f(cy - Math.sin(t) * ry * bump)}`);
  }
  return a.add(`<path d="M${p.join(" L")} Q ${cx} ${cy + w * 0.1} ${p[0]} Z" fill="${a.g(lin([[0, "#b6ec7c"], [1, "#4fae4a"]]))}" stroke-linejoin="round"/>`);
}

function chili(a, cx, cy, n = 6, r = 26) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const t = i * 2.399;
    s += `<circle cx="${f(cx + Math.cos(t) * r * Math.sqrt(i / n))}" cy="${f(cy + Math.sin(t) * r * 0.4 * Math.sqrt(i / n))}" r="${i % 2 ? 2.2 : 1.6}" fill="${i % 3 ? "#d6311f" : "#ffffff"}" opacity=".9"/>`;
  }
  return a.add(s);
}

function samosa(a, cx, cy, s, ang, seed = 1) {
  const R = rng(seed);
  let crumbs = "";
  for (let i = 0; i < 26; i++) {
    const u = R(), v = R() * (1 - u);
    const x = -52 + u * 104 * 0.5 + v * 52, y = 36 - (1 - u - v) * 0 - v * 84 - u * 10;
    crumbs += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.9 + R() * 1.8)}" fill="${R() > 0.5 ? "#fff0c4" : "#a85a16"}" opacity="${f(0.35 + R() * 0.35)}"/>`;
  }
  return a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang}) scale(${s})">
    <path d="M-58 36 Q -62 44 -50 44 L 44 44 Q 54 42 50 34 L 6 -48 Q 0 -58 -6 -48 Z" fill="${a.g(lin(GOLD, 0.2, 0, 0.6, 1))}"/>
    <path d="M6 -48 L 50 34 Q 54 42 44 44 L 70 30 Q 76 24 70 18 L 14 -46 Q 10 -52 6 -48 Z" fill="${a.g(lin([[0, "#e9962f"], [1, "#9c5214"]]))}"/>
    ${crumbs}
    <path d="M-50 40 L 44 40" stroke="#b8631a" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" opacity=".6"/>
    <path d="M-30 14 L -2 -36" stroke="#fff6dc" stroke-width="6" stroke-linecap="round" opacity=".6"/>
  </g>`);
}

function dumpling(a, cx, cy, s, ang, { fried = false } = {}) {
  const skin = fried ? [[0, "#fff4da"], [0.6, "#f2dfb8"], [1, "#d9a35a"]] : [[0, "#ffffff"], [0.7, "#f3eee6"], [1, "#d9d2c6"]];
  let pleats = "";
  for (let i = -3; i <= 3; i++) pleats += `<path d="M${i * 11} -26 q ${i * 2} 10 ${i * 3.5} 18" stroke="${fried ? "#d9b57a" : "#d8d0c3"}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang}) scale(${s})">
    <path d="M-52 14 C -54 -30 -20 -40 0 -40 C 20 -40 54 -30 52 14 C 30 30 -30 30 -52 14 Z" fill="${a.g(lin(skin))}"/>
    ${fried ? `<path d="M-50 12 C -30 28 30 28 50 12 C 46 22 30 30 0 31 C -30 30 -46 22 -50 12 Z" fill="${a.g(lin([[0, "#e9a640"], [1, "#a85a16"]]))}"/>` : ""}
    <path d="M-40 -18 C -30 -34 -6 -38 0 -38 C 6 -38 30 -34 40 -18" fill="none" stroke="${fried ? "#e2c48d" : "#e7e1d7"}" stroke-width="7" stroke-linecap="round"/>
    ${pleats}
    <ellipse cx="-24" cy="-6" rx="12" ry="5" fill="#fff" opacity=".7" transform="rotate(-20 -24 -6)"/>
  </g>`);
}

function glass(a, cx, base, w, h, liquid, { ice = true, garnish = "", straw = null } = {}) {
  const top = base - h, rt = w / 2, rb = w * 0.42;
  a.shadow(cx, base + 6, rt * 1.1, 10, 0.3);
  if (straw) a.add(`<path d="M${cx + rt * 0.2} ${top + 30} L ${cx + rt * 0.75} ${top - 46}" stroke="${straw}" stroke-width="9" stroke-linecap="round"/>`);
  // liquide
  const lt = top + h * 0.12;
  a.add(`<path d="M${cx - rt * 0.95} ${lt} L ${cx - rb} ${base - 6} Q ${cx} ${base + 4} ${cx + rb} ${base - 6} L ${cx + rt * 0.95} ${lt} Z" fill="${a.g(lin(liquid))}"/>`);
  if (ice) {
    for (const [dx, dy, s, r] of [[-0.35, 0.05, 30, -12], [0.25, 0.12, 28, 14], [-0.05, 0.32, 26, 4]]) {
      a.add(`<rect x="${f(cx + dx * w - s / 2)}" y="${f(lt + dy * h)}" width="${s}" height="${s}" rx="7" fill="#ffffff" opacity=".38" transform="rotate(${r} ${f(cx + dx * w)} ${f(lt + dy * h + s / 2)})"/>`);
    }
  }
  a.add(`<ellipse cx="${cx}" cy="${lt}" rx="${rt * 0.95}" ry="7" fill="#ffffff" opacity=".35"/>`);
  // verre
  a.add(`<path d="M${cx - rt} ${top} L ${cx - rb} ${base - 6} Q ${cx} ${base + 6} ${cx + rb} ${base - 6} L ${cx + rt} ${top}" fill="#ffffff" fill-opacity=".14" stroke="#ffffff" stroke-opacity=".7" stroke-width="3"/>`);
  a.add(`<path d="M${cx - rt * 0.78} ${top + 18} L ${cx - rb * 0.8} ${base - 22}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>`);
  a.add(`<ellipse cx="${cx}" cy="${top}" rx="${rt}" ry="8" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>`);
  if (garnish) a.add(garnish);
}

function citrusSlice(a, cx, cy, r, c1, c2, ang = 0) {
  let seg = "";
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2;
    seg += `<path d="M0 0 L ${f(Math.cos(t) * r * 0.8)} ${f(Math.sin(t) * r * 0.8)}" stroke="${shade(c1, 0.55)}" stroke-width="2"/>`;
  }
  return a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang})"><circle r="${r}" fill="${c2}"/><circle r="${r * 0.86}" fill="${shade(c1, 0.5)}"/><circle r="${r * 0.8}" fill="${c1}"/>${seg}<circle r="${r * 0.12}" fill="${shade(c1, 0.6)}"/></g>`);
}

function strawberry(a, cx, cy, s, ang = 0) {
  let seeds = "";
  for (let i = 0; i < 9; i++) seeds += `<ellipse cx="${f(-12 + ((i * 7) % 24))}" cy="${f(-6 + ((i * 11) % 26))}" rx="1.6" ry="2.4" fill="#ffd166"/>`;
  return a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang}) scale(${s})"><path d="M-22 -10 C -24 14 -6 30 0 32 C 6 30 24 14 22 -10 C 14 -18 -14 -18 -22 -10 Z" fill="${a.g(lin([[0, "#ff5a5f"], [1, "#c81d3a"]]))}"/>${seeds}<path d="M-16 -14 L -4 -8 L 0 -20 L 4 -8 L 16 -14 L 8 -4 L -8 -4 Z" fill="#4caf50"/><ellipse cx="-9" cy="0" rx="4" ry="8" fill="#fff" opacity=".35"/></g>`);
}

function mint(a, cx, cy, s, ang) {
  leaf(a, cx, cy, s, ang, "#8be07a", "#2f9e4b");
  leaf(a, cx + 4, cy + 2, s * 0.8, ang + 40, "#a8ec8a", "#3fae55");
}

module.exports = { rng, blob, Art, lin, rad, plate, bowl, dip, shade, nem, leaf, lettuce, chili, samosa, dumpling, glass, citrusSlice, strawberry, mint, GOLD, f };
