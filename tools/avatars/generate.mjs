import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import fs from "node:fs";
// Usage : npm i --no-save @dicebear/core @dicebear/collection && node tools/avatars/generate.mjs public/avatars
// Style « Adventurer » de Lisa Wischofsky (CC BY 4.0), via DiceBear.
const out = process.argv[2] ?? "public/avatars";
fs.mkdirSync(out, { recursive: true });
const v = (n) => `variant${String(n).padStart(2, "0")}`;
const SK = { a: "f2d3b1", b: "ecad80", c: "9e5622", d: "763900" };
const BG = ["ffe3c9", "d9f2df", "e6e0ff", "ffe0e6", "dcefff", "fff1c2", "e3f6f1", "f3e8dc"];
// [peau, coiffure, couleur cheveux, yeux, bouche, lunettes?, boucles?, trait]
const L = [
  ["c", "long03", "0e0e0e", 1, 23, 0, 1, "blush"],
  ["d", "short04", "0e0e0e", 2, 26, 0, 0, ""],
  ["b", "long14", "562306", 9, 1, 0, 1, ""],
  ["a", "short09", "ac6511", 3, 5, 3, 0, "freckles"],
  ["d", "long19", "0e0e0e", 12, 27, 0, 4, "blush"],
  ["c", "short12", "0e0e0e", 1, 23, 0, 0, "mustache"],
  ["a", "long06", "e5d7a3", 24, 2, 0, 2, ""],
  ["b", "short16", "6a4e35", 25, 26, 1, 0, ""],
  ["d", "long10", "562306", 19, 28, 0, 1, ""],
  ["c", "short02", "0e0e0e", 2, 1, 2, 0, ""],
  ["b", "long22", "0e0e0e", 3, 5, 0, 3, "blush"],
  ["a", "short06", "cb6820", 9, 27, 0, 0, "freckles"],
  ["c", "long16", "0e0e0e", 12, 26, 4, 1, ""],
  ["d", "short19", "0e0e0e", 24, 23, 0, 0, ""],
  ["b", "long01", "ab2a18", 1, 2, 0, 5, ""],
  ["a", "short14", "afafaf", 25, 1, 5, 0, ""],
  ["c", "long25", "562306", 2, 28, 0, 2, "blush"],
  ["b", "short11", "0e0e0e", 19, 23, 0, 0, "mustache"],
  ["d", "long12", "0e0e0e", 9, 5, 0, 6, ""],
  ["a", "short01", "796a45", 3, 26, 0, 0, ""],
];
L.forEach(([sk, hair, hc, e, m, g, er, feat], i) => {
  const svg = createAvatar(adventurer, {
    seed: `nemsy-${i}`,
    skinColor: [SK[sk]],
    hair: [hair],
    hairColor: [hc],
    eyes: [v(e)],
    mouth: [v(m)],
    eyebrows: [v(10)],
    glasses: g ? [v(g)] : undefined,
    glassesProbability: g ? 100 : 0,
    earrings: er ? [v(er)] : undefined,
    earringsProbability: er ? 100 : 0,
    features: feat ? [feat] : undefined,
    featuresProbability: feat ? 100 : 0,
    backgroundColor: [BG[i % BG.length]],
    scale: 110,
    translateY: 4,
  }).toString();
  const name = `adv-${String(i + 1).padStart(2, "0")}.svg`;
  fs.writeFileSync(`${out}/${name}`, svg);
});
console.log(L.length, "avatars");
