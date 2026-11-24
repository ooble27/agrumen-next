"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { Bell, Check, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

type Sort = "popular" | "asc" | "desc";
const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Les plus populaires" },
  { id: "asc", label: "Prix croissant" },
  { id: "desc", label: "Prix décroissant" },
];

const PROMOS = [
  {
    title: "Nems au poulet",
    big: "-20%",
    href: "/produit/nems-poulet",
    image: "/img/nems-poulet.jpg",
    focus: "50% 60%",
    bg: "var(--promo-1)",
  },
  {
    title: "Livraison offerte",
    big: "0 F",
    sub: `dès ${price(SITE.freeDeliveryFrom)}`,
    href: "#produits",
    image: "/img/poulet-croustillant.jpg",
    bg: "var(--promo-2)",
  },
  {
    title: "Samoussas bœuf",
    big: "-25%",
    href: "/produit/samoussas-boeuf",
    image: "/img/samoussas-boeuf.jpg",
    bg: "var(--promo-1)",
  },
];

export function MenuView() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [panel, setPanel] = useState<null | "sort" | "notif">(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panel) return;
    const close = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [panel]);

  const items = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const list = PRODUCTS.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.ingredients}`.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      return hay.includes(q);
    });
    if (sort === "asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
  }, [query, cat, sort]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 pb-36 pt-[max(20px,env(safe-area-inset-top))] sm:px-8">
      {/* En-tête */}
      <header className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-surface">
          <Image src="/img/hero.jpg" alt={SITE.name} fill sizes="48px" className="object-cover" style={{ objectPosition: "50% 60%" }} />
        </div>
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
                <span className="mt-1 size-2 shrink-0 rounded-full bg-brand" />
                <p className="text-[13px] leading-snug text-ink/80">
                  Livraison offerte dès {price(SITE.freeDeliveryFrom)} de commande, partout à Dakar.
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Recherche */}
      <div className="relative mt-6" ref={panel === "sort" ? panelRef : undefined}>
        <label className="flex h-14 items-center gap-3 rounded-full bg-surface pl-5 pr-2">
          <Search className="size-[22px] shrink-0 text-ink/80" strokeWidth={1.6} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher"
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
      <section aria-label="Offres" className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8">
        {PROMOS.map((p, i) => (
          <Link
            key={p.title}
            href={p.href}
            className="relative h-[150px] w-[86%] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[24px] sm:w-[400px]"
            style={{ background: p.bg }}
          >
            <div
              className="absolute inset-y-0 right-0 w-[56%]"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, #000 38%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 38%)",
              }}
            >
              <Image src={p.image} alt="" fill sizes="240px" priority={i === 0} className="object-cover" style={{ objectPosition: p.focus ?? "50% 50%" }} />
            </div>
            <div className="relative flex h-full flex-col justify-between p-5">
              <div>
                <p className="text-[20px] font-semibold leading-none tracking-tight" style={{ color: "var(--promo-title)" }}>
                  {p.title}
                </p>
                <p
                  className="mt-1 text-[56px] font-extrabold leading-[0.95] tracking-tight"
                  style={{ backgroundImage: "var(--promo-big)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                >
                  {p.big}
                </p>
              </div>
              <span className="inline-flex h-9 w-fit items-center rounded-full bg-orange px-4 text-[13px] font-medium text-white shadow-[0_6px_16px_-6px_rgba(247,163,37,.8)]">
                {p.sub ? `Commander ${p.sub}` : "Commander"}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Catégories */}
      <nav aria-label="Catégories" className="no-scrollbar -mx-5 mt-7 flex gap-2.5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
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

      {/* Produits */}
      <section id="produits" className="mt-5 scroll-mt-6">
        {items.length === 0 ? (
          <div className="rounded-[24px] bg-surface px-6 py-14 text-center">
            <p className="text-lg font-medium">Aucun résultat</p>
            <p className="mt-1 text-muted">Essayez “nems”, “poulet” ou “bissap”.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {items.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
