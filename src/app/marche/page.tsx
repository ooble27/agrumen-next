"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Search, X, SlidersHorizontal, ShoppingCart, MapPin,
  Apple, Leaf, Wheat, Flame, LayoutGrid, Plus, Minus,
  ChevronDown, Home, User, Heart, Sprout, Package, ArrowRight,
  Zap, Star,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

/* ─── Types ──────────────────────────────────────────────── */
type CatId = "all" | "fruits" | "legumes" | "cereales" | "epices";

interface Category {
  id: CatId; label: string; icon: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; className?: string }>;
  color: string; gradFrom: string; gradTo: string;
}
interface Product {
  id: string; name: string; category: Exclude<CatId,"all">;
  price: number; unit: string; shop: string; city: string;
  rating: number; reviews: number; badge?: string; promo?: number;
}

/* ─── Data ───────────────────────────────────────────────── */
const CATS: Category[] = [
  { id:"all",      label:"Tout",     icon:LayoutGrid, color:"#C5F135", gradFrom:"#162416", gradTo:"#0A140A" },
  { id:"fruits",   label:"Fruits",   icon:Apple,      color:"#FB923C", gradFrom:"#3D1008", gradTo:"#1A0604" },
  { id:"legumes",  label:"Légumes",  icon:Leaf,       color:"#4ADE80", gradFrom:"#052E18", gradTo:"#021408" },
  { id:"cereales", label:"Céréales", icon:Wheat,      color:"#FCD34D", gradFrom:"#3D1A03", gradTo:"#1A0A00" },
  { id:"epices",   label:"Épices",   icon:Flame,      color:"#F87171", gradFrom:"#3D0A0A", gradTo:"#1A0404" },
];

const PRODUCTS: Product[] = [
  { id:"p1",  name:"Tomates cerise",  category:"legumes",  price:850,  unit:"kg",    shop:"Ferme Dakar",    city:"Dakar",       rating:4.8, reviews:124, badge:"Populaire" },
  { id:"p2",  name:"Mangues Kent",    category:"fruits",   price:1200, unit:"kg",    shop:"Verger Thiès",   city:"Thiès",       rating:4.9, reviews:89,  badge:"Saison", promo:10 },
  { id:"p3",  name:"Riz Jasmine",     category:"cereales", price:650,  unit:"kg",    shop:"Grain du Sahel", city:"Saint-Louis", rating:4.6, reviews:210 },
  { id:"p4",  name:"Piment rouge",    category:"epices",   price:500,  unit:"botte", shop:"Épices du Nord", city:"Dakar",       rating:4.7, reviews:56 },
  { id:"p5",  name:"Bananes",         category:"fruits",   price:750,  unit:"kg",    shop:"Verger Thiès",   city:"Thiès",       rating:4.5, reviews:73 },
  { id:"p6",  name:"Carottes bio",    category:"legumes",  price:600,  unit:"kg",    shop:"Maraîcher Bio",  city:"Mbour",       rating:4.8, reviews:98,  badge:"Bio" },
  { id:"p7",  name:"Mil Souna",       category:"cereales", price:450,  unit:"kg",    shop:"Grain du Sahel", city:"Saint-Louis", rating:4.7, reviews:163 },
  { id:"p8",  name:"Gingembre frais", category:"epices",   price:1000, unit:"kg",    shop:"Ferme Dakar",    city:"Dakar",       rating:4.9, reviews:44,  badge:"Premium" },
  { id:"p9",  name:"Pastèques",       category:"fruits",   price:300,  unit:"pièce", shop:"Ferme Dakar",    city:"Dakar",       rating:4.4, reviews:37,  promo:15 },
  { id:"p10", name:"Aubergines",      category:"legumes",  price:700,  unit:"kg",    shop:"Maraîcher Bio",  city:"Mbour",       rating:4.6, reviews:55 },
  { id:"p11", name:"Maïs doux",       category:"cereales", price:250,  unit:"épi",   shop:"Grain du Sahel", city:"Saint-Louis", rating:4.8, reviews:181, badge:"Nouveau" },
  { id:"p12", name:"Cumin entier",    category:"epices",   price:800,  unit:"100g",  shop:"Épices du Nord", city:"Dakar",       rating:4.7, reviews:29 },
  { id:"p13", name:"Papayes",         category:"fruits",   price:900,  unit:"kg",    shop:"Verger Thiès",   city:"Thiès",       rating:4.6, reviews:61 },
  { id:"p14", name:"Oignons violets", category:"legumes",  price:550,  unit:"kg",    shop:"Ferme Dakar",    city:"Dakar",       rating:4.7, reviews:142 },
  { id:"p15", name:"Fonio",           category:"cereales", price:1500, unit:"kg",    shop:"Grain du Sahel", city:"Saint-Louis", rating:4.9, reviews:78,  badge:"Bio" },
  { id:"p16", name:"Poivre noir",     category:"epices",   price:1200, unit:"100g",  shop:"Épices du Nord", city:"Dakar",       rating:4.8, reviews:33,  badge:"Premium" },
];

/* ─── 3D Tilt card ───────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.025,1.025,1.025)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (ref.current)
      ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("tilt-card", className)}
    >
      {children}
    </div>
  );
}

/* ─── Product image area ─────────────────────────────────── */
function ProductImage({ category }: { category: Exclude<CatId,"all"> }) {
  const cat = CATS.find(c => c.id === category)!;
  const Icon = cat.icon;
  return (
    <div
      className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${cat.gradFrom}, ${cat.gradTo})` }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center tilt-inner"
        style={{ background: `${cat.color}16` }}
      >
        <Icon size={30} strokeWidth={1.5} style={{ color: cat.color }} />
      </div>
    </div>
  );
}

/* ─── Product card ───────────────────────────────────────── */
function ProductCard({ product, qty, onAdd, onRemove }: {
  product: Product; qty: number; onAdd: () => void; onRemove: () => void;
}) {
  const finalPrice = product.promo
    ? Math.round(product.price * (1 - product.promo / 100))
    : product.price;

  return (
    <TiltCard>
      <article
        className="bg-card rounded-2xl overflow-hidden cursor-pointer gsap-fade
                   shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
      >
        <div className="relative overflow-hidden">
          <ProductImage category={product.category} />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-black tracking-wider uppercase
                             px-2 py-0.5 rounded-full text-[#060B06] bg-[#C5F135]">
              {product.badge}
            </span>
          )}
          {product.promo && (
            <span className="absolute top-2.5 right-2.5 text-[10px] font-black
                             px-2 py-0.5 rounded-full text-white bg-red-500">
              -{product.promo}%
            </span>
          )}
        </div>

        <div className="p-3 flex flex-col gap-2">
          <div>
            <p className="font-display text-[13px] font-bold text-ink leading-snug line-clamp-2">
              {product.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={10} fill="#F59E0B" strokeWidth={0} />
              <span className="text-[11px] font-semibold" style={{ color:"#92400E" }}>{product.rating}</span>
              <span className="text-[11px] text-muted">· {product.city}</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-[15px] font-black text-ink leading-none">
                {formatPrice(finalPrice)}
              </p>
              <p className="text-[11px] text-muted">/{product.unit}</p>
              {product.promo && (
                <p className="text-[10px] text-muted line-through">{formatPrice(product.price)}</p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {qty === 0 ? (
                <motion.button
                  key="add"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  whileTap={{ scale: 0.82 }}
                  onClick={e => { e.stopPropagation(); onAdd(); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer
                             bg-[#0C2210] text-[#C5F135] hover:bg-[#163318] transition-colors"
                  aria-label={`Ajouter ${product.name}`}
                >
                  <Plus size={17} strokeWidth={2.5} />
                </motion.button>
              ) : (
                <motion.div
                  key="qty"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <button
                    onClick={e => { e.stopPropagation(); onRemove(); }}
                    className="w-8 h-8 rounded-lg bg-[#EEF4EE] hover:bg-[#DCE8DC] transition-colors
                               flex items-center justify-center cursor-pointer text-ink"
                    aria-label="Retirer"
                  >
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  <motion.span
                    key={qty}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className="font-display font-black text-sm w-4 text-center text-ink"
                  >
                    {qty}
                  </motion.span>
                  <button
                    onClick={e => { e.stopPropagation(); onAdd(); }}
                    className="w-8 h-8 rounded-lg bg-[#C5F135] hover:bg-[#98BE22] transition-colors
                               flex items-center justify-center cursor-pointer text-[#060B06]"
                    aria-label="Ajouter"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function MarchePage() {
  const [query, setQuery]         = useState("");
  const [cat, setCat]             = useState<CatId>("all");
  const [cart, setCart]           = useState<Record<string,number>>({});
  const [sort, setSort]           = useState<"default"|"price_asc"|"price_desc"|"rating">("default");
  const [showSort, setShowSort]   = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const titleRef  = useRef<HTMLHeadingElement>(null);

  /* GSAP animations */
  useEffect(() => {
    let ctx: { revert?: () => void } = {};
    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        /* Hero text reveal */
        if (titleRef.current) {
          const lines = titleRef.current.querySelectorAll(".hero-line");
          gsap.fromTo(lines,
            { y: 60, opacity: 0, skewX: 3 },
            { y: 0, opacity: 1, skewX: 0, duration: 0.9, stagger: 0.12, ease: "expo.out", delay: 0.1 }
          );
        }
        /* Grid scroll reveal */
        if (gridRef.current) {
          gsap.fromTo(".gsap-fade",
            { y: 28, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power3.out",
              scrollTrigger: { trigger: gridRef.current, start: "top 88%", once: true },
            }
          );
        }
      });
    })();
    return () => ctx.revert?.();
  }, [cat, query]);

  const cartCount = Object.values(cart).reduce((a,b) => a+b, 0);
  const cartTotal = Object.entries(cart).reduce((s,[id,qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    const price = p?.promo ? Math.round(p.price*(1-p.promo/100)) : (p?.price ?? 0);
    return s + price*qty;
  }, 0);

  const addToCart    = (id:string) => setCart(p => ({...p, [id]:(p[id]||0)+1}));
  const removeFromCart = (id:string) => setCart(p => {
    const n={...p}; if ((n[id]||0)<=1) delete n[id]; else n[id]--; return n;
  });

  const filtered = PRODUCTS
    .filter(p => (cat==="all"||p.category===cat) && p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => sort==="price_asc" ? a.price-b.price : sort==="price_desc" ? b.price-a.price : sort==="rating" ? b.rating-a.rating : 0);

  const activeCat = CATS.find(c => c.id === cat)!;

  return (
    <div className="min-h-screen bg-[#060B06]">

      {/* ── Floating glass header ─────────────────────── */}
      <header className="fixed top-3 inset-x-3 z-50 max-w-6xl xl:left-1/2 xl:-translate-x-1/2 xl:w-[calc(100%-24px)]">
        <div className="glass rounded-2xl px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-[#C5F135] flex items-center justify-center">
              <Sprout size={16} strokeWidth={2.5} className="text-[#060B06]" />
            </div>
            <span className="font-display font-black text-[13px] text-white hidden sm:block tracking-tight">
              Agrumen
            </span>
          </Link>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <MapPin size={12} className="text-[#C5F135]" strokeWidth={2.5} />
            <span className="font-display text-xs font-semibold text-white/80">Dakar</span>
            <ChevronDown size={11} className="text-white/35" />
          </button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            className="relative flex items-center gap-2 h-9 px-3.5 rounded-xl cursor-pointer
                       bg-[#C5F135] text-[#060B06] font-display font-black text-xs
                       hover:bg-[#98BE22] transition-colors"
            aria-label="Panier"
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
            <AnimatePresence mode="wait">
              {cartCount > 0 ? (
                <motion.span key={cartCount} initial={{scale:0.5}} animate={{scale:1}} className="text-xs">
                  {cartCount}
                </motion.span>
              ) : (
                <motion.span key="label" initial={{opacity:0}} animate={{opacity:1}}>Panier</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section ref={heroRef} className="aurora-bg relative overflow-hidden pt-20 pb-10 min-h-[62vh] flex flex-col justify-center">
        {/* R3F canvas */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <HeroCanvas />
        </div>

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat:"repeat", backgroundSize:"128px" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                             bg-[#C5F135]/10 text-[#C5F135] border border-[#C5F135]/20">
              <Zap size={9} fill="#C5F135" strokeWidth={0} />
              Livraison express · Dakar
            </span>
          </motion.div>

          {/* Headline */}
          <h1 ref={titleRef} className="font-display font-black leading-[0.95] tracking-[-0.03em] mb-8 overflow-hidden">
            <span className="hero-line block text-white" style={{ fontSize:"clamp(2.8rem,8vw,5.5rem)", opacity:0 }}>
              Marché frais,
            </span>
            <span className="hero-line block" style={{ fontSize:"clamp(2.8rem,8vw,5.5rem)", color:"#C5F135", opacity:0 }}>
              direct du champ.
            </span>
          </h1>

          {/* Search */}
          <div className="relative max-w-xl mb-5">
            <Search size={17} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              className="w-full h-[52px] pl-11 pr-24 rounded-2xl font-medium text-sm text-white
                         placeholder:text-white/30 outline-none transition-all duration-200
                         bg-white/8 border border-white/10 focus:bg-white/12 focus:border-white/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{opacity:0,scale:0.6}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.6}}
                    onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                    className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/18"
                  >
                    <X size={13} className="text-white/60" strokeWidth={2.5} />
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                onClick={() => setShowSort(v=>!v)}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all",
                  showSort ? "bg-[#C5F135] text-[#060B06]" : "bg-white/10 text-white/60 hover:bg-white/16"
                )}
                aria-label="Filtres"
              >
                <SlidersHorizontal size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Sort panel */}
          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                className="overflow-hidden max-w-xl mb-4"
              >
                <div className="flex flex-wrap gap-2 py-2">
                  {(["default","price_asc","price_desc","rating"] as const).map(opt => (
                    <button key={opt} onClick={() => setSort(opt)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all font-display",
                        sort===opt ? "bg-[#C5F135] text-[#060B06] lime-glow" : "glass text-white/70 hover:text-white"
                      )}
                    >
                      {{"default":"Par défaut","price_asc":"Prix ↑","price_desc":"Prix ↓","rating":"Mieux notés"}[opt]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto no-scroll pb-1">
            {CATS.map(c => {
              const Icon = c.icon;
              const active = cat===c.id;
              return (
                <motion.button key={c.id} whileTap={{scale:0.88}}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full shrink-0 cursor-pointer transition-all duration-200",
                    "font-display text-xs font-bold",
                    active ? "bg-[#C5F135] text-[#060B06] lime-glow" : "glass text-white/70 hover:text-white hover:bg-white/12"
                  )}
                >
                  <Icon size={12} strokeWidth={active?2.5:2} style={active?{}:{color:c.color}} />
                  {c.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Content section (light) ────────────────────── */}
      <section className="bg-[#F0F4F0] rounded-t-[28px] -mt-4 relative z-10 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-7 pb-32 md:pb-14">

          {/* Section title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-black text-xl text-ink">
                {query ? `"${query}"` : activeCat.id==="all" ? "Toutes les offres" : activeCat.label}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {filtered.length} produit{filtered.length!==1?"s":""}
              </p>
            </div>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}
                  className="text-xs font-black text-white px-3 py-1.5 rounded-xl font-display bg-[#0C2210]">
                  {formatPrice(cartTotal)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <div ref={gridRef} key={`${cat}-${query}`}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} qty={cart[p.id]||0}
                    onAdd={() => addToCart(p.id)} onRemove={() => removeFromCart(p.id)} />
                ))}
              </div>
            ) : (
              <motion.div key="empty" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                className="flex flex-col items-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E4EDE4] flex items-center justify-center mb-4">
                  <Package size={28} strokeWidth={1.5} className="text-[#0C2210]" />
                </div>
                <p className="font-display font-black text-base text-ink">Aucun résultat</p>
                <p className="text-sm text-muted mt-1 max-w-[200px]">Essayez une autre recherche</p>
                <button onClick={() => { setQuery(""); setCat("all"); }}
                  className="mt-5 px-5 py-2.5 rounded-xl text-sm font-bold font-display
                             bg-[#0C2210] text-[#C5F135] cursor-pointer hover:bg-[#163318] transition-colors">
                  Tout afficher
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Floating cart ─────────────────────────────── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{y:90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:90,opacity:0}}
            transition={{type:"spring",stiffness:400,damping:36}}
            className="fixed bottom-[76px] md:bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-72 z-40"
          >
            <Link href="/checkout">
              <div className="w-full flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer
                              bg-[#C5F135] text-[#060B06] font-display font-black
                              shadow-[0_8px_32px_rgba(197,241,53,0.30)] lime-glow
                              hover:bg-[#98BE22] transition-colors active:scale-[0.97]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#060B06] text-[#C5F135] text-xs font-black
                                   flex items-center justify-center">{cartCount}</span>
                  <span className="text-sm">Commander</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  {formatPrice(cartTotal)}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile bottom nav ─────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-[#060B06]/92 backdrop-blur-xl border-t border-white/7 safe-b">
        <div className="flex items-center justify-around px-2 pt-2">
          {[
            {icon:Home,       label:"Accueil", href:"/"},
            {icon:LayoutGrid, label:"Marché",  href:"/marche", active:true},
            {icon:Heart,      label:"Favoris", href:"/favoris"},
            {icon:User,       label:"Compte",  href:"/compte"},
          ].map(({icon:Icon,label,href,active}) => (
            <Link key={href} href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors cursor-pointer min-h-[44px] justify-center",
                active ? "text-[#C5F135]" : "text-white/30 hover:text-white/60"
              )}
            >
              <Icon size={21} strokeWidth={active?2.5:1.8} />
              <span className="text-[10px] font-bold font-display">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
