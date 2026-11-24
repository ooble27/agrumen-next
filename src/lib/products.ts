export type Tint = "green" | "teal" | "blue" | "olive" | "peach" | "rose";

export type Category = "nems" | "samoussas" | "raviolis" | "plats" | "boissons";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  portion: string;
  image: string;
  /** cadrage de la photo (object-position) */
  focus?: string;
  tint: Tint;
  rating: number;
  reviews: string;
  ingredients: string;
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

export const PRODUCTS: Product[] = [
  {
    slug: "nems-poulet",
    name: "Nems au poulet",
    category: "nems",
    price: 8.99,
    oldPrice: 10.99,
    portion: "6 pcs",
    image: "/img/nems-poulet.jpg",
    focus: "50% 60%",
    tint: "green",
    rating: 4.9,
    reviews: "200+",
    ingredients:
      "Galette de riz croustillante, poulet haché, vermicelles, carottes, chou, champignons noirs, oignon, ail. Servis avec salade, menthe et sauce nuoc-mâm.",
    popular: true,
  },
  {
    slug: "rouleaux-printemps",
    name: "Rouleaux de printemps",
    category: "nems",
    price: 9.99,
    portion: "4 pcs",
    image: "/img/rouleaux-printemps.jpg",
    tint: "teal",
    rating: 4.8,
    reviews: "120+",
    ingredients:
      "Galette de riz fraîche, crevettes, vermicelles, salade, chou rouge, carottes, menthe, coriandre. Sauce cacahuète maison.",
    popular: true,
  },
  {
    slug: "samoussas-boeuf",
    name: "Samoussas bœuf",
    category: "samoussas",
    price: 6.99,
    oldPrice: 8.99,
    portion: "5 pcs",
    image: "/img/samoussas-boeuf.jpg",
    tint: "olive",
    rating: 4.8,
    reviews: "150+",
    ingredients: "Pâte feuilletée, viande de bœuf hachée, oignon, petits pois, pomme de terre, épices douces, persil.",
    popular: true,
  },
  {
    slug: "samoussas-legumes",
    name: "Samoussas légumes",
    category: "samoussas",
    price: 6.49,
    portion: "5 pcs",
    image: "/img/samoussas-legumes.jpg",
    tint: "peach",
    rating: 4.6,
    reviews: "80+",
    ingredients: "Pâte croustillante, pomme de terre, petits pois, carottes, oignon, curry doux. Sauce verte et sauce piquante.",
  },
  {
    slug: "raviolis-vapeur",
    name: "Raviolis vapeur",
    category: "raviolis",
    price: 10.99,
    portion: "8 pcs",
    image: "/img/raviolis-vapeur.jpg",
    tint: "blue",
    rating: 4.7,
    reviews: "90+",
    ingredients: "Pâte de blé fine, poulet, chou chinois, ciboulette, gingembre, sésame. Sauce soja vinaigrée.",
    popular: true,
  },
  {
    slug: "raviolis-grilles",
    name: "Raviolis grillés",
    category: "raviolis",
    price: 11.99,
    portion: "8 pcs",
    image: "/img/raviolis-grilles.jpg",
    tint: "rose",
    rating: 4.7,
    reviews: "70+",
    ingredients: "Raviolis poêlés, porc ou poulet au choix, chou, oignon vert, sauce pimentée maison.",
  },
  {
    slug: "bouchees-vapeur",
    name: "Bouchées vapeur",
    category: "raviolis",
    price: 11.99,
    portion: "6 pcs",
    image: "/img/dim-sum.jpg",
    tint: "peach",
    rating: 4.6,
    reviews: "60+",
    ingredients: "Pâte de riz, crevettes, poulet, châtaigne d'eau, gingembre, huile de sésame.",
  },
  {
    slug: "momos-assortis",
    name: "Assortiment momos",
    category: "raviolis",
    price: 16.99,
    oldPrice: 18.99,
    portion: "12 pcs",
    image: "/img/momos.jpg",
    tint: "green",
    rating: 4.8,
    reviews: "50+",
    ingredients: "Assortiment de raviolis vapeur et grillés, légumes et poulet. Trois sauces maison.",
  },
  {
    slug: "poulet-croustillant",
    name: "Poulet croustillant",
    category: "plats",
    price: 13.99,
    portion: "6 morceaux",
    image: "/img/poulet-croustillant.jpg",
    tint: "peach",
    rating: 4.8,
    reviews: "110+",
    ingredients: "Poulet mariné, chapelure panko, ail, gingembre, paprika. Sauce aigre-douce.",
    popular: true,
  },
  {
    slug: "riz-cantonais",
    name: "Riz cantonais",
    category: "plats",
    price: 11.49,
    portion: "400 g",
    image: "/img/riz-cantonais.jpg",
    tint: "olive",
    rating: 4.6,
    reviews: "90+",
    ingredients: "Riz parfumé sauté, œuf, petits pois, carottes, oignon vert, dés de poulet, sauce soja.",
  },
  {
    slug: "nouilles-sautees",
    name: "Nouilles sautées",
    category: "plats",
    price: 12.99,
    portion: "400 g",
    image: "/img/nouilles.jpg",
    tint: "rose",
    rating: 4.7,
    reviews: "75+",
    ingredients: "Nouilles de blé, poulet, poivrons, chou, carottes, oignon vert, sauce soja et huître.",
  },
  {
    slug: "brochettes",
    name: "Brochettes grillées",
    category: "plats",
    price: 13.99,
    portion: "4 pcs",
    image: "/img/brochettes.jpg",
    tint: "teal",
    rating: 4.7,
    reviews: "65+",
    ingredients: "Poulet et bœuf marinés, oignon, poivron, citron, sauce teriyaki ou piquante au choix.",
  },
  {
    slug: "frites",
    name: "Frites maison",
    category: "plats",
    price: 4.99,
    portion: "250 g",
    image: "/img/frites.jpg",
    tint: "olive",
    rating: 4.5,
    reviews: "100+",
    ingredients: "Pommes de terre fraîches, huile végétale, sel. Ketchup ou mayonnaise.",
  },
  {
    slug: "limonade-fraise",
    name: "Limonade fraise",
    category: "boissons",
    price: 4.49,
    portion: "500 ml",
    image: "/img/limonade-fraise.jpg",
    tint: "rose",
    rating: 4.9,
    reviews: "180+",
    ingredients: "Fraises fraîches, citron vert, menthe, sirop de canne, eau pétillante. Servie bien fraîche.",
    popular: true,
  },
  {
    slug: "citronnade",
    name: "Citronnade gingembre",
    category: "boissons",
    price: 4.49,
    portion: "500 ml",
    image: "/img/citronnade.jpg",
    tint: "green",
    rating: 4.7,
    reviews: "90+",
    ingredients: "Citron vert pressé, gingembre frais, menthe, sucre de canne, eau pétillante.",
  },
  {
    slug: "jus-orange",
    name: "Jus d'orange pressé",
    category: "boissons",
    price: 4.99,
    portion: "500 ml",
    image: "/img/jus-orange.jpg",
    tint: "peach",
    rating: 4.6,
    reviews: "70+",
    ingredients: "Oranges fraîchement pressées, sans sucre ajouté.",
  },
  {
    slug: "the-glace",
    name: "Thé glacé citron",
    category: "boissons",
    price: 3.99,
    portion: "500 ml",
    image: "/img/the-glace.jpg",
    tint: "teal",
    rating: 4.5,
    reviews: "40+",
    ingredients: "Thé noir infusé à froid, citron vert, sirop de canne, glaçons.",
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
