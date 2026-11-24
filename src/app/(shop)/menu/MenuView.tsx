"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, Bike, Check, Clock, MapPin, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, getProduct, type Category, type Product } from "@/lib/products";
import { ETA, SITE } from "@/lib/site";
import { discount, price } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoMark } from "@/components/Logo";
import { Food } from "@/components/Food";

type Sort = "popular" | "asc" | "desc";
const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Les plus populaires" },
  { id: "asc", label: "Prix croissant" },
  { id: "desc", label: "Prix décroissant" },
];

function off(slug: string) {
  const p = getProduct(slug);
  return p?.oldPrice ? `-${discount(p.price, p.oldPrice)}%` : "";
}

const PROMOS = [
  { title: "Nems au poulet", big: off("nems-poulet"), href: "/produit/nems-poulet", image: "/food/nems-poulet.webp", bg: "var(--promo-1)" },
  {
    title: "Livraison offerte",
    big: "0 $",
    cta: `Dès ${price(SITE.freeDeliveryFrom)}`,
    href: "#carte",
    image: "/food/poulet-croustillant.webp",
    bg: "var(--promo-2)",
  },
  { title: "Samoussas maison", big: off("samoussas"), href: "/produit/samoussas", image: "/food/samoussas.webp", bg: "var(--promo-1)" },
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export function MenuView() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [panel, setPanel] = useState<null | "sort" | "notif">(null);
  const [promo, setPromo] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panel) return;
    const close = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [panel]);

  const sortList = (list: Product[]) => {
    if (sort === "asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  };

  const q = norm(query.trim());
  const filtered = sortList(
    PRODUCTS.filter((p) => (cat === "all" || p.category === cat) && (!q || norm(`${p.name} ${p.short} ${p.description}`).includes(q))),
  );

  // Vue "Tout" sans recherche : sections façon application de livraison.
  const sectioned = cat === "all" && !q;
  const popular = PRODUCTS.filter((p) => p.popular);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 pb-36 pt-[max(18px,env(safe-area-inset-top))] sm:px-8 lg:pb-20 lg:pt-8">
      {/* En-tête mobile */}
      <header className="flex items-center gap-3 lg:hidden">
        <LogoMark className="size-12 shrink-0" />
        <p className="flex min-w-0 items-center gap-1.5 text-[16px] text-ink/85">
          <MapPin className="size-[18px] shrink-0" strokeWidth={1.6} />
          <span className="truncate">{SITE.city}</span>
        </p>
        <div className="relative ml-auto flex gap-2.5" ref={panel === "notif" ? panelRef : undefined}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setPanel(panel === "notif" ? null : "notif")}
            className="relative grid size-12 place-items-center rounded-full bg-surface transition active:scale-95"
          >
            <Bell className="size-[22px]" strokeWidth={1.5} />
            <span className="absolute right-[13px] top-[12px] size-2 rounded-full bg-[#ff3b3b] ring-2 ring-surface" />
          </button>
          <ThemeToggle />
          {panel === "notif" && (
            <div className="rise absolute right-0 top-14 z-30 w-72 rounded-3xl border border-line bg-bg p-4 shadow-[var(--shadow-soft)]">
              <p className="text-[15px] font-medium">Notifications</p>
              <div className="mt-3 flex gap-3 rounded-2xl bg-surface p-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                <p className="text-[13px] leading-snug text-ink/80">
                  Livraison offerte dès {price(SITE.freeDeliveryFrom)} d’achat. Bon appétit !
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Titre ordinateur */}
      <div className="hidden items-end justify-between lg:flex">
        <div>
          <h1 className="text-[40px] font-medium tracking-tight">Qu’est-ce qui vous ferait plaisir ?</h1>
          <StoreInfo className="mt-3" />
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mt-6" ref={panel === "sort" ? panelRef : undefined}>
        <label className="flex h-14 items-center gap-3 rounded-full bg-surface pl-5 pr-2">
          <Search className="size-[22px] shrink-0 text-ink/80" strokeWidth={1.6} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat, une boisson…"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" aria-label="Effacer" onClick={() => setQuery("")} className="grid size-9 place-items-center text-muted">
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            aria-label="Trier"
            onClick={() => setPanel(panel === "sort" ? null : "sort")}
            className="grid size-11 place-items-center rounded-full text-ink/85 transition hover:bg-surface-2"
          >
            <SlidersHorizontal className="size-[22px]" strokeWidth={1.5} />
          </button>
        </label>
        {panel === "sort" && (
          <div className="rise absolute right-0 top-16 z-30 w-64 rounded-3xl border border-line bg-bg p-2 shadow-[var(--shadow-soft)]">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSort(s.id);
                  setPanel(null);
                }}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[15px] hover:bg-surface"
              >
                {s.label}
                {sort === s.id && <Check className="size-4 text-brand" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Promos */}
      <section aria-label="Offres" className="mt-6">
        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
            setPromo(Math.round(el.scrollLeft / (w + 14)));
          }}
          className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8"
        >
          {PROMOS.map((p, i) => (
            <Link
              key={p.title}
              href={p.href}
              className="relative h-[156px] w-[86%] max-w-[440px] shrink-0 snap-start overflow-hidden rounded-[24px] sm:w-[420px]"
              style={{ background: p.bg }}
            >
              <Food src={p.image} alt="" priority={i === 0} sizes="240px" className="absolute -right-3 top-1/2 h-[128%] w-[56%] -translate-y-1/2" />
              <div className="relative flex h-full w-[62%] flex-col justify-between p-5">
                <div>
                  <p className="text-[20px] font-semibold leading-none tracking-tight" style={{ color: "var(--promo-title)" }}>
                    {p.title}
                  </p>
                  <p
                    className="mt-1.5 text-[58px] font-extrabold leading-[0.92] tracking-tight"
                    style={{ backgroundImage: "var(--promo-big)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                  >
                    {p.big}
                  </p>
                </div>
                <span className="inline-flex h-9 w-fit items-center rounded-full bg-orange px-4 text-[13px] font-medium text-white shadow-[0_8px_18px_-8px_rgba(247,163,37,.9)]">
                  {p.cta ?? "Commander"}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {PROMOS.map((_, i) => (
            <span key={i} className={`h-[5px] rounded-full transition-all ${i === promo ? "w-6 bg-ink" : "w-[5px] bg-ink/25"}`} />
          ))}
        </div>
      </section>

      <StoreInfo className="mt-5 lg:hidden" />

      {/* Catégories (collantes) */}
      <nav
        id="carte"
        aria-label="Catégories"
        className="sticky top-0 z-20 -mx-5 mt-4 flex scroll-mt-0 gap-2.5 overflow-x-auto bg-bg/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:top-[76px]"
      >
        {CATEGORIES.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={active}
              className={`h-10 shrink-0 rounded-full border px-5 text-[15px] transition ${
                active
                  ? "border-transparent bg-[#151515] text-white dark:bg-white dark:text-[#151515]"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </nav>

      {sectioned ? (
        <div className="mt-3 space-y-9">
          <Section title="Les plus populaires" subtitle="Ce que tout le monde commande">
            <Grid items={sortList(popular)} priority />
          </Section>
          {CATEGORIES.filter((c) => c.id !== "all").map((c) => {
            const items = sortList(PRODUCTS.filter((p) => p.category === c.id && !p.popular));
            if (!items.length) return null;
            return (
              <Section key={c.id} title={c.label}>
                <Grid items={items} />
              </Section>
            );
          })}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-[24px] bg-surface px-6 py-14 text-center">
          <p className="text-lg font-medium">Aucun résultat</p>
          <p className="mt-1 text-muted">Essayez « nems », « poulet » ou « limonade ».</p>
        </div>
      ) : (
        <div className="mt-3">
          <Grid items={filtered} priority />
        </div>
      )}
    </main>
  );
}

function StoreInfo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-ink/75 ${className}`}>
      <span className="flex items-center gap-1.5">
        <Star className="size-4 fill-orange text-orange" /> {SITE.rating} ({SITE.reviews})
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="size-4 fill-brand text-bg" strokeWidth={2.4} /> {ETA}
      </span>
      <span className="flex items-center gap-1.5">
        <Bike className="size-4 text-ink/70" strokeWidth={1.7} /> Livraison {price(SITE.deliveryFee)}
      </span>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-[22px] font-medium tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[14px] text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Grid({ items, priority }: { items: Product[]; priority?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {items.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={priority && i < 4} />
      ))}
    </div>
  );
}
