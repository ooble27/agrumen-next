const L = require("./lib");
const { Art, lin, plate, bowl, dip, nem, leaf, lettuce, chili, samosa, dumpling, glass, citrusSlice, strawberry, mint, f } = L;
const fs = require("fs");
const out = process.argv[2] || require("path").join(__dirname, "../../public/food");
fs.mkdirSync(out, { recursive: true });
const D = {};

D["nems-poulet"] = () => {
  const a = new Art();
  plate(a, 190, 262, 160, 62);
  lettuce(a, 175, 262, 210);
  nem(a, 175, 250, 210, 52, -12);
  nem(a, 190, 218, 200, 50, -20);
  nem(a, 160, 196, 190, 48, -6);
  dip(a, 318, 300, 40, "#d9772c", "#f4a95a");
  chili(a, 318, 300, 7, 22);
  mint(a, 92, 278, 0.42, -150);
  return a;
};

D["rouleaux-printemps"] = () => {
  const a = new Art();
  plate(a, 200, 270, 170, 64);
  const roll = (cx, cy, ang, seed) => {
    const R = L.rng(seed);
    let fill = "";
    for (let i = 0; i < 16; i++) {
      const x = -64 + R() * 118, y = -16 + R() * 30;
      const k = R();
      fill += k < 0.35
        ? `<path d="M${f(x)} ${f(y)} c 6 -9 18 -9 22 1 c -9 0 -15 3 -22 -1z" fill="#ff8f70"/>`
        : k < 0.65
          ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(6 + R() * 8)}" ry="${f(3 + R() * 3)}" fill="#5fbf46" opacity=".9" transform="rotate(${f(R() * 60 - 30)} ${f(x)} ${f(y)})"/>`
          : k < 0.82
            ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5 + R() * 5)}" ry="2.4" fill="#9b3d8f" opacity=".8"/>`
            : `<rect x="${f(x)}" y="${f(y)}" width="${f(10 + R() * 8)}" height="3" rx="1.5" fill="#f39a3a"/>`;
    }
    a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang})">
      <rect x="-80" y="-30" width="160" height="60" rx="30" fill="#eef6ec"/>
      <rect x="-74" y="-24" width="148" height="48" rx="24" fill="#d8ead2"/>
      ${fill}
      <rect x="-80" y="-30" width="160" height="60" rx="30" fill="url(#rp-shine)"/>
      <ellipse cx="74" cy="0" rx="10" ry="27" fill="#f6fbf4" opacity=".9"/>
      <path d="M-62 -22 L 46 -22" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    </g>`);
  };
  a.defs.push(`<linearGradient id="rp-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#cfe3d1" stop-opacity=".45"/></linearGradient>`);
  roll(160, 262, -10, 11);
  roll(186, 214, -16, 23);
  dip(a, 316, 296, 42, "#b8742e", "#e0a35c");
  a.add(`<circle cx="306" cy="294" r="3" fill="#f6e3b5"/><circle cx="322" cy="300" r="2.6" fill="#f6e3b5"/><circle cx="330" cy="292" r="2.2" fill="#d6311f"/>`);
  leaf(a, 84, 268, 0.5, -160);
  return a;
};

D["samoussas"] = () => {
  const a = new Art();
  // planche en bois
  a.shadow(200, 300, 160, 28, 0.3);
  a.add(`<rect x="44" y="230" width="312" height="76" rx="22" fill="${a.g(lin([[0, "#d89a5b"], [1, "#a8662f"]]))}"/>`);
  a.add(`<rect x="44" y="222" width="312" height="70" rx="22" fill="${a.g(lin([[0, "#f0c08a"], [1, "#d89a5b"]]))}"/>`);
  a.add(`<path d="M70 240 Q 200 232 330 244 M80 262 Q 200 256 320 268" stroke="#c98a4e" stroke-width="2" fill="none" opacity=".6"/>`);
  samosa(a, 140, 214, 1.0, -8, 3);
  samosa(a, 232, 206, 1.05, 10, 5);
  samosa(a, 186, 238, 0.9, 2, 9);
  dip(a, 316, 248, 30, "#2e8b3c", "#6fcf6a");
  a.add(`<circle cx="96" cy="250" r="5" fill="#d6311f"/><circle cx="108" cy="258" r="4" fill="#d6311f"/>`);
  leaf(a, 70, 236, 0.4, -150);
  return a;
};

D["raviolis-vapeur"] = () => {
  const a = new Art();
  // panier vapeur en bambou
  a.shadow(200, 318, 150, 26, 0.32);
  a.add(`<path d="M60 220 L 60 290 Q 200 340 340 290 L 340 220 Z" fill="${a.g(lin([[0, "#e7c27a"], [1, "#b98a3e"]]))}"/>`);
  for (let i = 0; i < 3; i++) a.add(`<path d="M60 ${238 + i * 18} Q 200 ${286 + i * 18} 340 ${238 + i * 18}" stroke="#a0742f" stroke-width="2.5" fill="none" opacity=".55"/>`);
  a.add(`<ellipse cx="200" cy="220" rx="140" ry="48" fill="#a0742f"/>`);
  a.add(`<ellipse cx="200" cy="222" rx="128" ry="40" fill="${a.g(lin([[0, "#7a5a26"], [1, "#caa25a"]]))}"/>`);
  a.add(`<ellipse cx="200" cy="224" rx="122" ry="36" fill="#7fbf5a" opacity=".9"/>`);
  dumpling(a, 150, 214, 0.85, -6);
  dumpling(a, 248, 214, 0.85, 8);
  dumpling(a, 200, 236, 0.9, 0);
  dumpling(a, 200, 196, 0.75, 0);
  // vapeur
  a.add(`<g fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity=".75"><path d="M160 150 c -12 -16 12 -24 0 -42"/><path d="M204 140 c -12 -16 12 -24 0 -42"/><path d="M248 150 c -12 -16 12 -24 0 -42"/></g>`);
  return a;
};

D["raviolis-grilles"] = () => {
  const a = new Art();
  plate(a, 196, 266, 168, 62, "#2b2b2b");
  // assiette sombre : retouche
  a.body.pop(); a.body.pop(); a.body.pop();
  a.add(`<ellipse cx="196" cy="273" rx="168" ry="62" fill="#1c1c1c"/><ellipse cx="196" cy="266" rx="168" ry="62" fill="${a.g(lin([[0, "#3a3a3a"], [1, "#242424"]]))}"/><ellipse cx="196" cy="270" rx="124" ry="43" fill="#2c2c2c"/>`);
  dumpling(a, 130, 250, 0.9, -12, { fried: true });
  dumpling(a, 200, 262, 0.95, 0, { fried: true });
  dumpling(a, 268, 250, 0.9, 12, { fried: true });
  dumpling(a, 168, 220, 0.8, -6, { fried: true });
  dumpling(a, 236, 220, 0.8, 6, { fried: true });
  a.add(`<g stroke="#5ec44f" stroke-width="5" stroke-linecap="round"><path d="M150 286 l 14 -4"/><path d="M226 290 l 12 3"/><path d="M196 206 l 10 -6"/></g>`);
  a.add(`<g fill="#f6e3b5">${[[180, 236], [214, 240], [150, 262], [250, 266], [200, 282]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.6"/>`).join("")}</g>`);
  return a;
};

D["poulet-croustillant"] = () => {
  const a = new Art();
  bowl(a, 200, 210, 280, 110, "#e8452f", "#fbe9d0");
  let seed = 7;
  const piece = (cx, cy, s, ang) => {
    const R = L.rng(++seed * 31);
    let bumps = "";
    for (let i = 0; i < 40; i++) {
      const t = R() * Math.PI * 2, r = Math.sqrt(R());
      bumps += `<circle cx="${f(Math.cos(t) * r * 38)}" cy="${f(Math.sin(t) * r * 26)}" r="${f(1.5 + R() * 4)}" fill="${R() > 0.45 ? "#ffd98a" : "#b5601a"}" opacity="${f(0.3 + R() * 0.45)}"/>`;
    }
    a.add(`<g transform="translate(${cx} ${cy}) rotate(${ang}) scale(${s})"><path d="${L.blob(48, 36, 12, 0.05, seed)}" fill="${a.g(lin(L.GOLD))}"/>${bumps}<path d="M-28 -18 C -14 -28 6 -28 18 -22" stroke="#fff4d6" stroke-width="6" stroke-linecap="round" fill="none" opacity=".55"/></g>`);
  };
  piece(150, 196, 1.0, -10);
  piece(250, 192, 0.95, 14);
  piece(200, 176, 1.05, 4);
  piece(196, 214, 0.9, -4);
  // pique en bois avec sauce
  dip(a, 320, 300, 36, "#c0392b", "#ef6b4a");
  leaf(a, 104, 216, 0.36, -140);
  return a;
};

D["riz-cantonais"] = () => {
  const a = new Art();
  const b = bowl(a, 200, 200, 280, 120, "#ffffff", "#f5efe0");
  // dôme de riz
  a.add(`<path d="M${200 - b.rx} 202 C ${200 - b.rx + 10} 96 ${200 + b.rx - 10} 96 ${200 + b.rx} 202 Z" fill="${a.g(lin([[0, "#fff6dd"], [1, "#e6c88a"]]))}"/>`);
  let grains = "";
  for (let i = 0; i < 110; i++) {
    const t = (i * 137.5 * Math.PI) / 180, r = Math.sqrt(i / 110);
    const x = 200 + Math.cos(t) * r * 112, y = 170 + Math.sin(t) * r * 26 - (1 - r) * 38;
    const c = i % 9 === 0 ? "#6cbf45" : i % 11 === 0 ? "#f07a3a" : i % 13 === 0 ? "#ffcf3f" : "#fffaf0";
    grains += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${c === "#fffaf0" ? 4 : 5}" ry="${c === "#fffaf0" ? 2.2 : 4}" fill="${c}" transform="rotate(${(i * 47) % 180} ${f(x)} ${f(y)})" opacity="${c === "#fffaf0" ? 0.9 : 1}"/>`;
  }
  a.add(grains);
  a.add(`<g stroke="#4fae4a" stroke-width="5" stroke-linecap="round"><path d="M170 150 l 12 -4"/><path d="M226 156 l 10 4"/><path d="M196 136 l 6 -8"/></g>`);
  // cuillère
  a.add(`<path d="M300 150 L 360 70" stroke="#d9dee1" stroke-width="10" stroke-linecap="round"/><ellipse cx="292" cy="160" rx="18" ry="11" fill="#eef2f4" transform="rotate(-50 292 160)"/>`);
  return a;
};

D["nouilles-sautees"] = () => {
  const a = new Art();
  const b = bowl(a, 200, 206, 290, 118, "#1f1f1f", "#3a2412");
  let s = "";
  for (let i = 0; i < 22; i++) {
    const y = 176 + (i % 6) * 6, x0 = 200 - b.rx + 14 + ((i * 13) % 30);
    s += `<path d="M${x0} ${y} C ${x0 + 40} ${y - 26} ${x0 + 70} ${y + 22} ${x0 + 110} ${y - 6} S ${x0 + 180} ${y + 18} ${x0 + 220} ${y - 4}" fill="none" stroke="${i % 3 ? "#e9b25a" : "#c98a35"}" stroke-width="6" stroke-linecap="round"/>`;
  }
  a.add(`<g transform="translate(0 0)">${s}</g>`);
  a.add(`<path d="M${200 - b.rx} 206 C ${200 - b.rx + 20} 150 ${200 + b.rx - 20} 150 ${200 + b.rx} 206" fill="none"/>`);
  a.add(`<g><rect x="150" y="168" width="34" height="10" rx="5" fill="#e8452f" transform="rotate(-18 167 173)"/><rect x="228" y="178" width="30" height="10" rx="5" fill="#ffcf3f" transform="rotate(14 243 183)"/><rect x="196" y="160" width="26" height="9" rx="4.5" fill="#f07a3a" transform="rotate(-6 209 164)"/></g>`);
  a.add(`<g stroke="#5ec44f" stroke-width="6" stroke-linecap="round"><path d="M170 196 l 14 -4"/><path d="M236 200 l 12 4"/><path d="M206 186 l 8 -8"/></g>`);
  // baguettes
  a.add(`<g stroke-linecap="round"><path d="M230 150 L 360 52" stroke="#c98a4e" stroke-width="9"/><path d="M246 160 L 372 74" stroke="#b07636" stroke-width="9"/></g>`);
  return a;
};

D["frites"] = () => {
  const a = new Art();
  a.shadow(200, 330, 100, 18, 0.32);
  let fries = "";
  const list = [[-60, -8, 150], [-38, 6, 175], [-16, -4, 185], [6, 4, 170], [28, -6, 180], [50, 8, 160], [-48, 14, 130], [40, -12, 140], [-4, 10, 150], [18, 16, 120]];
  for (const [dx, rot, h] of list) fries += `<g transform="translate(${200 + dx} 210) rotate(${rot})"><rect x="-9" y="${-h + 60}" width="18" height="${h}" rx="5" fill="${a.g(lin([[0, "#ffe08a"], [1, "#f2a93a"]], 0, 0, 1, 0))}"/><rect x="-5" y="${-h + 66}" width="4" height="${h - 20}" rx="2" fill="#fff6c8" opacity=".6"/></g>`;
  a.add(fries);
  a.add(`<path d="M110 200 L 128 330 Q 200 344 272 330 L 290 200 Q 200 222 110 200 Z" fill="${a.g(lin([[0, "#ff5a4a"], [1, "#c62828"]], 0, 0, 1, 1))}"/>`);
  a.add(`<path d="M110 200 Q 200 222 290 200 L 286 228 Q 200 250 114 228 Z" fill="#ffffff" opacity=".18"/>`);
  a.add(`<circle cx="200" cy="278" r="24" fill="#ffffff"/><path d="M188 282 q 12 -18 24 0" stroke="#e8452f" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  a.add(`<path d="M126 220 L 140 320" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/>`);
  return a;
};

const drink = (liquid, garnish, straw) => () => {
  const a = new Art();
  glass(a, 200, 340, 150, 240, liquid, { garnish: "", straw });
  garnish(a);
  return a;
};

D["limonade-fraise"] = drink([[0, "#ff8a8a"], [1, "#e0263f"]], (a) => {
  strawberry(a, 268, 98, 1.0, 20);
  mint(a, 150, 104, 0.5, -60);
  citrusSlice(a, 132, 106, 26, "#d4ef6a", "#7cc242", -20);
  strawberry(a, 300, 334, 0.7, -30);
}, "#ffffff");

D["citronnade"] = drink([[0, "#f6fbe6"], [1, "#cfe98a"]], (a) => {
  citrusSlice(a, 270, 104, 30, "#d4ef6a", "#7cc242", 20);
  mint(a, 156, 106, 0.55, -60);
  citrusSlice(a, 122, 320, 22, "#d4ef6a", "#7cc242", 0);
}, "#4cc764");

D["jus-orange"] = drink([[0, "#ffc35a"], [1, "#f07a14"]], (a) => {
  citrusSlice(a, 272, 104, 32, "#ffb53d", "#f07a14", 20);
  citrusSlice(a, 128, 322, 24, "#ffb53d", "#f07a14", 0);
}, "#ffffff");

D["the-glace"] = drink([[0, "#d98b3a"], [1, "#7a3b12"]], (a) => {
  citrusSlice(a, 272, 104, 30, "#d4ef6a", "#7cc242", 20);
  mint(a, 150, 108, 0.5, -60);
}, "#1f1f1f");

for (const [name, fn] of Object.entries(D)) fs.writeFileSync(`${out}/${name}.svg`, fn().svg());
console.log(Object.keys(D).length, "illustrations");
