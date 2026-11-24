export type Tint = "green" | "teal" | "blue" | "olive" | "peach" | "rose";

export type Category = "nems" | "samoussas" | "raviolis" | "plats" | "boissons";

export type Choice = { id: string; label: string; price?: number };

export type OptionGroup = {
  id: string;
  title: string;
  /** "one" = choix unique obligatoire, "many" = cases à cocher facultatives */
  type: "one" | "many";
  max?: number;
  choices: Choice[];
};

export type Product = {
  slug: string;
  name: string;
  short: string;
  category: Category;
  price: number;
  oldPrice?: number;
  portion: string;
  image: string;
  tint: Tint;
  rating: number;
  reviews: string;
  description: string;
  options?: OptionGroup[];
  popular?: boolean;
};

export const CATEGORIES: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "nems", label: "Nems" },
  { id: "samoussas", label: "Samoussas" },
  { id: "raviolis", label: "Raviolis" },
  { id: "plats", label: "Plats" },
  { id: "boissons", label: "Boissons" },
];

/* ---------------------------------------------------- groupes d'options */

const SAUCE: OptionGroup = {
  id: "sauce",
  title: "Sauce",
  type: "one",
  choices: [
    { id: "nuoc", label: "Nuoc-mâm maison" },
    { id: "aigre", label: "Aigre-douce" },
    { id: "piquante", label: "Piquante maison" },
    { id: "cacahuete", label: "Cacahuète" },
  ],
};

const EXTRAS_NEMS: OptionGroup = {
  id: "extras",
  title: "Suppléments",
  type: "many",
  choices: [
    { id: "plus2", label: "+ 2 nems", price: 2.99 },
    { id: "salade", label: "Salade, menthe et coriandre", price: 1.25 },
    { id: "sauce2", label: "Sauce supplémentaire", price: 0.75 },
  ],
};

const EXTRAS_SIMPLE: OptionGroup = {
  id: "extras",
  title: "Suppléments",
  type: "many",
  choices: [
    { id: "sauce2", label: "Sauce supplémentaire", price: 0.75 },
    { id: "salade", label: "Petite salade", price: 1.25 },
  ],
};

const FILLING_SAMOUSSA: OptionGroup = {
  id: "farce",
  title: "Farce",
  type: "one",
  choices: [
    { id: "boeuf", label: "Bœuf épicé" },
    { id: "legumes", label: "Légumes au curry" },
    { id: "mixte", label: "Moitié-moitié" },
  ],
};

const PROTEIN: OptionGroup = {
  id: "proteine",
  title: "Protéine",
  type: "one",
  choices: [
    { id: "poulet", label: "Poulet" },
    { id: "crevettes", label: "Crevettes", price: 2 },
    { id: "tofu", label: "Tofu" },
  ],
};

const SPICE: OptionGroup = {
  id: "piquant",
  title: "Niveau de piquant",
  type: "one",
  choices: [
    { id: "doux", label: "Doux" },
    { id: "moyen", label: "Moyen" },
    { id: "fort", label: "Fort" },
  ],
};

const SIZE: OptionGroup = {
  id: "format",
  title: "Format",
  type: "one",
  choices: [
    { id: "500", label: "500 ml" },
    { id: "1l", label: "1 L", price: 2.5 },
  ],
};

/* ------------------------------------------------------------- produits */

export const PRODUCTS: Product[] = [
  {
    slug: "nems-poulet",
    name: "Nems au poulet",
    short: "Croustillants, sauce maison",
    category: "nems",
    price: 8.99,
    oldPrice: 10.99,
    portion: "6 pcs",
    image: "/food/nems-poulet.webp",
    tint: "green",
    rating: 4.9,
    reviews: "200+",
    description:
      "Galette de riz croustillante, poulet haché, vermicelles, carottes, chou, champignons noirs, oignon, ail. Servis avec salade, menthe et sauce maison.",
    options: [SAUCE, EXTRAS_NEMS],
    popular: true,
  },
  {
    slug: "rouleaux-printemps",
    name: "Rouleaux de printemps",
    short: "Frais, sauce cacahuète",
    category: "nems",
    price: 9.99,
    portion: "4 pcs",
    image: "/food/rouleaux-printemps.webp",
    tint: "teal",
    rating: 4.8,
    reviews: "120+",
    description:
      "Galette de riz fraîche, vermicelles, salade, chou rouge, carottes, menthe, coriandre. Sauce cacahuète maison.",
    options: [PROTEIN, EXTRAS_SIMPLE],
    popular: true,
  },
  {
    slug: "samoussas",
    name: "Samoussas maison",
    short: "Bœuf ou légumes",
    category: "samoussas",
    price: 6.99,
    oldPrice: 8.49,
    portion: "5 pcs",
    image: "/food/samoussas.webp",
    tint: "olive",
    rating: 4.8,
    reviews: "150+",
    description:
      "Pâte croustillante pliée à la main. Farce au bœuf épicé ou aux légumes au curry doux. Servis avec sauce verte et sauce piquante.",
    options: [FILLING_SAMOUSSA, EXTRAS_SIMPLE],
    popular: true,
  },
  {
    slug: "raviolis-vapeur",
    name: "Raviolis vapeur",
    short: "Poulet, ciboulette, gingembre",
    category: "raviolis",
    price: 10.99,
    portion: "8 pcs",
    image: "/food/raviolis-vapeur.webp",
    tint: "blue",
    rating: 4.7,
    reviews: "90+",
    description: "Pâte de blé fine, poulet, chou chinois, ciboulette, gingembre, sésame. Sauce soja vinaigrée.",
    options: [EXTRAS_SIMPLE],
    popular: true,
  },
  {
    slug: "raviolis-grilles",
    name: "Raviolis grillés",
    short: "Poêlés, sauce pimentée",
    category: "raviolis",
    price: 11.99,
    portion: "8 pcs",
    image: "/food/raviolis-grilles.webp",
    tint: "rose",
    rating: 4.7,
    reviews: "70+",
    description: "Raviolis poêlés jusqu’à ce qu’ils soient dorés, chou, oignon vert, sauce pimentée maison.",
    options: [PROTEIN, EXTRAS_SIMPLE],
  },
  {
    slug: "bouchees-vapeur",
    name: "Bouchées vapeur",
    short: "Crevettes et poulet",
    category: "raviolis",
    price: 11.99,
    portion: "6 pcs",
    image: "/food/dim-sum.webp",
    tint: "peach",
    rating: 4.6,
    reviews: "60+",
    description: "Pâte de riz, crevettes, poulet, châtaigne d’eau, gingembre, huile de sésame.",
    options: [EXTRAS_SIMPLE],
  },
  {
    slug: "momos-assortis",
    name: "Assortiment momos",
    short: "12 pièces, 3 sauces",
    category: "raviolis",
    price: 16.99,
    oldPrice: 18.99,
    portion: "12 pcs",
    image: "/food/momos.webp",
    tint: "green",
    rating: 4.8,
    reviews: "50+",
    description: "Assortiment de raviolis vapeur et grillés, légumes et poulet. Trois sauces maison.",
  },
  {
    slug: "poulet-croustillant",
    name: "Poulet croustillant",
    short: "Panko, sauce aigre-douce",
    category: "plats",
    price: 13.99,
    portion: "6 morceaux",
    image: "/food/poulet-croustillant.webp",
    tint: "peach",
    rating: 4.8,
    reviews: "110+",
    description: "Poulet mariné, chapelure panko, ail, gingembre, paprika. Sauce aigre-douce.",
    options: [SPICE, EXTRAS_SIMPLE],
    popular: true,
  },
  {
    slug: "riz-cantonais",
    name: "Riz cantonais",
    short: "Œuf, petits pois, poulet",
    category: "plats",
    price: 11.49,
    portion: "400 g",
    image: "/food/riz-cantonais.webp",
    tint: "olive",
    rating: 4.6,
    reviews: "90+",
    description: "Riz parfumé sauté, œuf, petits pois, carottes, oignon vert, dés de poulet, sauce soja.",
    options: [PROTEIN],
  },
  {
    slug: "nouilles-sautees",
    name: "Nouilles sautées",
    short: "Légumes croquants",
    category: "plats",
    price: 12.99,
    portion: "400 g",
    image: "/food/nouilles.webp",
    tint: "rose",
    rating: 4.7,
    reviews: "75+",
    description: "Nouilles de blé, poivrons, chou, carottes, oignon vert, sauce soja et huître.",
    options: [PROTEIN, SPICE],
  },
  {
    slug: "frites",
    name: "Frites maison",
    short: "Coupées à la main",
    category: "plats",
    price: 4.99,
    portion: "250 g",
    image: "/food/frites.webp",
    tint: "blue",
    rating: 4.5,
    reviews: "100+",
    description: "Pommes de terre fraîches, coupées à la main, sel de mer. Ketchup ou mayonnaise.",
  },
  {
    slug: "limonade-fraise",
    name: "Limonade fraise",
    short: "Fraises et menthe",
    category: "boissons",
    price: 4.49,
    portion: "500 ml",
    image: "/food/limonade-fraise.webp",
    tint: "rose",
    rating: 4.9,
    reviews: "180+",
    description: "Fraises fraîches, citron vert, menthe, sirop de canne, eau pétillante. Servie bien fraîche.",
    options: [SIZE],
    popular: true,
  },
  {
    slug: "citronnade",
    name: "Citronnade gingembre",
    short: "Citron vert, menthe",
    category: "boissons",
    price: 4.49,
    portion: "500 ml",
    image: "/food/citronnade.webp",
    tint: "green",
    rating: 4.7,
    reviews: "90+",
    description: "Citron vert pressé, gingembre frais, menthe, sucre de canne, eau pétillante.",
    options: [SIZE],
  },
  {
    slug: "jus-orange",
    name: "Jus d’orange pressé",
    short: "Sans sucre ajouté",
    category: "boissons",
    price: 4.99,
    portion: "500 ml",
    image: "/food/jus-orange.webp",
    tint: "peach",
    rating: 4.6,
    reviews: "70+",
    description: "Oranges fraîchement pressées, sans sucre ajouté.",
    options: [SIZE],
  },
  {
    slug: "the-glace",
    name: "Thé glacé citron",
    short: "Infusé à froid",
    category: "boissons",
    price: 3.99,
    portion: "500 ml",
    image: "/food/the-glace.webp",
    tint: "teal",
    rating: 4.5,
    reviews: "40+",
    description: "Thé noir infusé à froid, citron vert, sirop de canne, glaçons.",
    options: [SIZE],
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(p: Product, n = 3) {
  const same = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category);
  const rest = PRODUCTS.filter((x) => x.slug !== p.slug && x.category !== p.category && x.popular);
  return [...same, ...rest].slice(0, n);
}

/** Choix par défaut : premier choix de chaque groupe obligatoire. */
export function defaultOptions(p: Product) {
  return (p.options ?? []).filter((g) => g.type === "one").map((g) => `${g.id}.${g.choices[0].id}`);
}

/** "sauce.nuoc" -> { group, choice } */
export function findChoice(p: Product, key: string) {
  const [gid, cid] = key.split(".");
  const group = p.options?.find((g) => g.id === gid);
  const choice = group?.choices.find((c) => c.id === cid);
  return group && choice ? { group, choice } : null;
}

export function unitPrice(p: Product, options: string[]) {
  return options.reduce((s, k) => s + (findChoice(p, k)?.choice.price ?? 0), p.price);
}

export function optionsLabel(p: Product, options: string[]) {
  return options
    .map((k) => findChoice(p, k)?.choice.label)
    .filter(Boolean)
    .join(" · ");
}
