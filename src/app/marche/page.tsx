"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, SlidersHorizontal, ShoppingCart, MapPin,
  Apple, Leaf, Wheat, Flame, LayoutGrid, Star, Plus,
  Minus, ChevronDown, Home, User, Heart, ArrowLeft,
  Sprout, Package
} from "lucide-react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────── */

type CategoryId = "all" | "fruits" | "legumes" | "cereales" | "epices";

interface Category {
  id: CategoryId;
  label: string;
  icon: React.ElementType;
  color: string;
  lightBg: string;
}

interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, "all">;
  price: number;
  unit: string;
  shop: string;
  city: string;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
}

/* ─── Data ────────────────────────────────────────────────── */

const CATEGORIES: Category[] = [
  { id: "all",      label: "Tout",    icon: LayoutGrid, color: "#1C3520", lightBg: "#EEF3EE" },
  { id: "fruits",   label: "Fruits",  icon: Apple,      color: "#C2410C", lightBg: "#FFF4ED" },
  { id: "legumes",  label: "Légumes", icon: Leaf,       color: "#16A34A", lightBg: "#F0FDF4" },
  { id: "cereales", label: "Céréales",icon: Wheat,      color: "#B45309", lightBg: "#FFFBEB" },
  { id: "epices",   label: "Épices",  icon: Flame,      color: "#DC2626", lightBg: "#FEF2F2" },
];

const PRODUCTS: Product[] = [
  { id:"p1",  name:"Tomates cerise",    category:"legumes",  price:850,  unit:"kg",    shop:"Ferme Dakar",      city:"Dakar",       rating:4.8, reviews:124, stock:20, badge:"Populaire" },
  { id:"p2",  name:"Mangues Kent",      category:"fruits",   price:1200, unit:"kg",    shop:"Verger Thiès",     city:"Thiès",       rating:4.9, reviews:89,  stock:15, badge:"Saison" },
  { id:"p3",  name:"Riz Jasmine",       category:"cereales", price:650,  unit:"kg",    shop:"Grain du Sahel",   city:"Saint-Louis", rating:4.6, reviews:210, stock:100 },
  { id:"p4",  name:"Piment rouge",      category:"epices",   price:500,  unit:"botte", shop:"Épices du Nord",   city:"Dakar",       rating:4.7, reviews:56,  stock:30 },
  { id:"p5",  name:"Bananes",           category:"fruits",   price:750,  unit:"kg",    shop:"Verger Thiès",     city:"Thiès",       rating:4.5, reviews:73,  stock:40 },
  { id:"p6",  name:"Carottes bio",      category:"legumes",  price:600,  unit:"kg",    shop:"Maraîcher Bio",    city:"Mbour",       rating:4.8, reviews:98,  stock:25, badge:"Bio" },
  { id:"p7",  name:"Mil Souna",         category:"cereales", price:450,  unit:"kg",    shop:"Grain du Sahel",   city:"Saint-Louis", rating:4.7, reviews:163, stock:80 },
  { id:"p8",  name:"Gingembre frais",   category:"epices",   price:1000, unit:"kg",    shop:"Ferme Dakar",      city:"Dakar",       rating:4.9, reviews:44,  stock:15, badge:"Premium" },
  { id:"p9",  name:"Pastèques",         category:"fruits",   price:300,  unit:"pièce", shop:"Ferme Dakar",      city:"Dakar",       rating:4.4, reviews:37,  stock:10 },
  { id:"p10", name:"Aubergines",        category:"legumes",  price:700,  unit:"kg",    shop:"Maraîcher Bio",    city:"Mbour",       rating:4.6, reviews:55,  stock:20 },
  { id:"p11", name:"Maïs doux",         category:"cereales", price:250,  unit:"épi",   shop:"Grain du Sahel",   city:"Saint-Louis", rating:4.8, reviews:181, stock:50, badge:"Nouveau" },
  { id:"p12", name:"Cumin entier",      category:"epices",   price:800,  unit:"100g",  shop:"Épices du Nord",   city:"Dakar",       rating:4.7, reviews:29,  stock:35 },
  { id:"p13", name:"Papayes",           category:"fruits",   price:900,  unit:"kg",    shop:"Verger Thiès",     city:"Thiès",       rating:4.6, reviews:61,  stock:18 },
  { id:"p14", name:"Oignons violets",   category:"legumes",  price:550,  unit:"kg",    shop:"Ferme Dakar",      city:"Dakar",       rating:4.7, reviews:142, stock:60 },
  { id:"p15", name:"Fonio",             category:"cereales", price:1500, unit:"kg",    shop:"Grain du Sahel",   city:"Saint-Louis", rating:4.9, reviews:78,  stock:40, badge:"Bio" },
  { id:"p16", name:"Poivre noir",       category:"epices",   price:1200, unit:"100g",  shop:"Épices du Nord",   city:"Dakar",       rating:4.8, reviews:33,  stock:25, badge:"Premium" },
];

/* ─── Sub-components ──────────────────────────────────────── */

function ProductCardImage({ category }: { category: Exclude<CategoryId, "all"> }) {
  const cat = CATEGORIES.find(c => c.id === category)!;
  const Icon = cat.icon;
  return (
    <div
      className="w-full aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${cat.lightBg}, ${cat.lightBg}CC)` }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: cat.color + "15" }}
      >
        <Icon size={32} strokeWidth={1.5} style={{ color: cat.color }} />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: "#D97706" }}>
      <Star size={11} fill="#D97706" strokeWidth={0} />
      {rating.toFixed(1)}
    </span>
  );
}

function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="bg-surface rounded-2xl p-3 flex flex-col gap-3 cursor-pointer
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]
                 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.06)]
                 transition-shadow"
    >
      {/* Image */}
      <div className="relative">
        <ProductCardImage category={product.category} />
        {product.badge && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: "#1C3520" }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="font-display text-sm font-bold text-ink leading-tight line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-muted">· {product.city}</span>
        </div>
      </div>

      {/* Price + Cart */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="font-display text-base font-black text-ink">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted ml-1">/{product.unit}</span>
        </div>

        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer text-white"
              style={{ backgroundColor: "#1C3520" }}
              aria-label={`Ajouter ${product.name}`}
            >
              <Plus size={16} strokeWidth={2.5} />
            </motion.button>
          ) : (
            <motion.div
              key="qty"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-white"
                style={{ backgroundColor: "#1C3520" }}
                aria-label="Retirer"
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>
              <span className="font-display font-black text-sm w-4 text-center text-ink">
                {quantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "#ADDA3B" }}
                aria-label="Ajouter un de plus"
              >
                <Plus size={13} strokeWidth={2.5} style={{ color: "#1C3520" }} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main page ───────────────────────────────────────────── */

export default function MarchePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [scrolled, setScrolled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const addToCart = (id: string) =>
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) =>
    setCart(prev => {
      const next = { ...prev };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id]--;
      return next;
    });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const filtered = PRODUCTS
    .filter(p =>
      (activeCategory === "all" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      return 0;
    });

  const activeLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? "Tout";

  return (
    <div className="min-h-screen bg-bg">

      {/* ── Sticky Header ─────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-surface/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 safe-top">
          <div className="h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#1C3520" }}
              >
                <Sprout size={16} strokeWidth={2} className="text-white" />
              </div>
              <span className="font-display font-black text-base text-ink hidden sm:block">
                Agrumen
              </span>
            </Link>

            {/* Location */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-alt hover:bg-border transition-colors cursor-pointer">
              <MapPin size={13} style={{ color: "#1C3520" }} strokeWidth={2.5} />
              <span className="font-display text-xs font-bold text-ink">Dakar</span>
              <ChevronDown size={12} className="text-muted" strokeWidth={2.5} />
            </button>

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer text-white"
              style={{ backgroundColor: "#1C3520" }}
              aria-label={`Panier, ${cartCount} article${cartCount !== 1 ? "s" : ""}`}
            >
              <ShoppingCart size={16} strokeWidth={2} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="font-display text-xs font-black"
                >
                  {cartCount}
                </motion.span>
              )}
              {cartCount === 0 && (
                <span className="font-display text-xs font-semibold hidden sm:block">
                  Panier
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto pt-14 pb-28 md:pb-12">

        {/* Hero / Search section */}
        <div className="px-4 md:px-8 pt-6 pb-4">
          <h1 className="font-display text-2xl md:text-3xl font-black text-ink mb-1">
            Marché frais
          </h1>
          <p className="text-sm text-muted mb-5">
            Produits directs des agriculteurs · Livraison rapide
          </p>

          {/* Search bar */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <Search size={18} strokeWidth={2} />
            </div>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              className="w-full h-12 md:h-13 pl-11 pr-20 rounded-2xl bg-surface text-sm font-medium text-ink placeholder:text-muted
                         outline-none focus:ring-2 transition-all border border-border
                         shadow-[0_1px_3px_rgba(0,0,0,0.05)]
                         focus:ring-[#1C3520]/20 focus:border-[#1C3520]/30"
              style={{ fontFamily: "var(--font-sans)" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                    className="w-7 h-7 rounded-xl bg-surface-alt flex items-center justify-center cursor-pointer hover:bg-border transition-colors"
                    aria-label="Effacer"
                  >
                    <X size={14} className="text-muted" strokeWidth={2.5} />
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                onClick={() => setShowFilters(v => !v)}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                  showFilters
                    ? "text-white"
                    : "text-ink bg-surface-alt hover:bg-border"
                )}
                style={showFilters ? { backgroundColor: "#1C3520" } : undefined}
                aria-label="Filtres"
              >
                <SlidersHorizontal size={15} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 flex flex-wrap gap-2">
                  {(["default", "price_asc", "price_desc", "rating"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all font-display",
                        sortBy === opt
                          ? "text-white"
                          : "bg-surface border border-border text-ink-2 hover:bg-surface-alt"
                      )}
                      style={sortBy === opt ? { backgroundColor: "#1C3520" } : undefined}
                    >
                      {{ default: "Par défaut", price_asc: "Prix ↑", price_desc: "Prix ↓", rating: "Mieux notés" }[opt]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Categories ──────────────────────────────────── */}
        <div className="px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl shrink-0 cursor-pointer transition-all",
                    "font-display text-sm font-bold",
                    active
                      ? "text-white shadow-md"
                      : "text-ink-2 hover:bg-surface"
                  )}
                  style={active
                    ? { backgroundColor: "#1C3520" }
                    : { backgroundColor: cat.lightBg }
                  }
                >
                  <Icon
                    size={15}
                    strokeWidth={active ? 2.5 : 2}
                    style={{ color: active ? "#ADDA3B" : cat.color }}
                  />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Section header ──────────────────────────────── */}
        <div className="px-4 md:px-8 mt-7 mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-black text-ink">
              {query ? `"${query}"` : activeLabel}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          {cartCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold text-surface px-3 py-1.5 rounded-xl font-display"
              style={{ backgroundColor: "#1C3520" }}
            >
              {formatPrice(cartTotal)}
            </motion.div>
          )}
        </div>

        {/* ── Product Grid ────────────────────────────────── */}
        <div className="px-4 md:px-8">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <ProductCard
                      product={product}
                      quantity={cart[product.id] || 0}
                      onAdd={() => addToCart(product.id)}
                      onRemove={() => removeFromCart(product.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#EEF3EE" }}
                >
                  <Package size={28} strokeWidth={1.5} style={{ color: "#1C3520" }} />
                </div>
                <p className="font-display font-black text-base text-ink">
                  Aucun produit trouvé
                </p>
                <p className="text-sm text-muted mt-1 max-w-[220px]">
                  Essayez une autre recherche ou catégorie
                </p>
                <button
                  onClick={() => { setQuery(""); setActiveCategory("all"); }}
                  className="mt-5 px-5 py-2.5 rounded-xl text-sm font-bold text-white font-display cursor-pointer"
                  style={{ backgroundColor: "#1C3520" }}
                >
                  Voir tout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Cart bar (mobile, when cart not empty) ─────────── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:right-8 md:left-auto md:w-80 z-40"
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-white cursor-pointer
                         shadow-[0_8px_32px_rgba(28,53,32,0.35)]"
              style={{ backgroundColor: "#1C3520" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center font-display"
                  style={{ backgroundColor: "#ADDA3B", color: "#1C3520" }}
                >
                  {cartCount}
                </span>
                <span className="font-display font-bold text-sm">Voir mon panier</span>
              </div>
              <span className="font-display font-black text-sm">{formatPrice(cartTotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Nav ──────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-surface/95 backdrop-blur-md border-t border-border safe-bottom">
        <div className="flex items-center justify-around px-2 pt-2">
          {[
            { icon: Home,         label: "Accueil",  href: "/" },
            { icon: LayoutGrid,   label: "Marché",   href: "/marche",  active: true },
            { icon: Heart,        label: "Favoris",  href: "/favoris" },
            { icon: User,         label: "Compte",   href: "/compte" },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors cursor-pointer",
                active ? "text-ink" : "text-muted hover:text-ink-2"
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                style={active ? { color: "#1C3520" } : undefined}
              />
              <span className={cn("text-[10px] font-bold font-display", active ? "text-ink" : "")}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
