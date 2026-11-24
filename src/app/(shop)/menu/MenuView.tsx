"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Bell, Bike, Check, ChevronDown, Clock, Flame, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { PRODUCTS, getProduct, type Category, type Product } from "@/lib/products";
import { ETA, SITE } from "@/lib/site";
import { discount, price } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoMark } from "@/components/Logo";
import { Food } from "@/components/Food";
import { Sheet } from "@/components/Sheet";

type Sort = "popular" | "asc" | "desc";
const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Recommandés" },
  { id: "asc", label: "Prix croissant" },
  { id: "desc", label: "Prix décroissant" },
];

type Tab = { id: "popular" | Category; label: string; icon?: string };
const TABS: Tab[] = [
  { id: "popular", label: "Populaires" },
  { id: "nems", label: "Nems", icon: "/food/nems-poulet.svg" },
  { id: "samoussas", label: "Samoussas", icon: "/food/samoussas.svg" },
  { id: "raviolis", label: "Raviolis", icon: "/food/raviolis-vapeur.svg" },
  { id: "plats", label: "Plats", icon: "/food/riz-cantonais.svg" },
  { id: "boissons", label: "Boissons", icon: "/food/limonade-fraise.svg" },
];

function off(slug: string) {
  const p = getProduct(slug);
  return p?.oldPrice ? `-${discount(p.price, p.oldPrice)}%` : "";
}

const PROMOS = [
  { title: "Nems au poulet", big: off("nems-poulet"), href: "/produit/nems-poulet", image: "/food/nems-poulet.svg", bg: "var(--promo-1)" },
  { title: "Livraison offerte", big: "0 $", cta: `Dès ${price(SITE.freeDeliveryFrom)}`, href: "/panier", image: "/food/poulet-croustillant.svg", bg: "var(--promo-2)" },
  { title: "Samoussas maison", big: off("samoussas"), href: "/produit/samoussas", image: "/food/samoussas.svg", bg: "var(--promo-1)" },
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const noop = () => () => {};
function greeting() {
  const h = new Date().getHours();
  return h < 5 ? "Bonsoir" : h < 12 ? "Bonjour" : h < 17 ? "Bon après-midi" : "Bonsoir";
}

export function MenuView() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [sheet, setSheet] = useState<null | "sort" | "notif">(null);
  const [promo, setPromo] = useState(0);
  const [active, setActive] = useState<Tab["id"]>("popular");
  const hello = useSyncExternalStore(noop, greeting, () => null);

  const promoRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const touching = useRef(false);
  const jumping = useRef(false);

  const sortList = (list: Product[]) => {
    if (sort === "asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  };
  const q = norm(query.trim());
  const results = q ? sortList(PRODUCTS.filter((p) => norm(`${p.name} ${p.short} ${p.description}`).includes(q))) : [];
  const sections = TABS.map((t) => ({
    ...t,
    items: sortList(t.id === "popular" ? PRODUCTS.filter((p) => p.popular) : PRODUCTS.filter((p) => p.category === t.id)),
  })).filter((s) => s.items.length);

  /* Garde la catégorie active visible dans la rangée */
  useEffect(() => {
    const el = chipRefs.current[active];
    const box = chipsRef.current;
    if (!el || !box) return;
    const left = el.offsetLeft - 20;
    const right = el.offsetLeft + el.offsetWidth + 20;
    if (left < box.scrollLeft || right > box.scrollLeft + box.clientWidth) box.scrollTo({ left: Math.max(0, left), behavior: "auto" });
  }, [active]);

  /* Catégorie active selon le défilement (IntersectionObserver : aucun calcul à chaque pixel) */
  useEffect(() => {
    if (q) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        if (jumping.current) return;
        for (const e of entries) visible.set(e.target.id.replace("sec-", ""), e.isIntersecting);
        const first = TABS.find((t) => visible.get(t.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    for (const t of TABS) {
      const el = document.getElementById(`sec-${t.id}`);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [q]);

  const jump = (id: Tab["id"]) => {
    setActive(id);
    const el = document.getElementById(`sec-${id}`);
    if (!el) return;
    jumping.current = true;
    const offset = (window.innerWidth >= 1024 ? 76 : 0) + 72;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
    window.setTimeout(() => (jumping.current = false), 700);
  };

  /* Promos qui défilent seules */
  useEffect(() => {
    const id = window.setInterval(() => {
      const el = promoRef.current;
      if (!el || touching.current || document.hidden) return;
      const card = el.firstElementChild as HTMLElement | null;
      const w = (card?.offsetWidth ?? el.clientWidth) + 14;
      const next = (Math.round(el.scrollLeft / w) + 1) % PROMOS.length;
      el.scrollTo({ left: next * w, behavior: "smooth" });
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 pb-56 pt-[max(16px,env(safe-area-inset-top))] sm:px-8 lg:pb-20 lg:pt-8">
      {/* En-tête mobile */}
      <header className="flex items-center gap-3 lg:hidden">
        <LogoMark className="size-12" />
        <div className="min-w-0">
          <p className="text-[12px] leading-none text-muted">Livrer à</p>
          <p className="mt-1 flex items-center gap-1 text-[16px] font-medium leading-none">
            <span className="truncate">{SITE.city}</span>
            <ChevronDown className="size-4 text-muted" strokeWidth={2} />
          </p>
        </div>
        <div className="ml-auto flex gap-2.5">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setSheet("notif")}
            className="relative grid size-12 place-items-center rounded-full bg-surface transition active:scale-90"
          >
            <Bell className="size-[22px]" strokeWidth={1.5} />
            <span className="absolute right-[13px] top-[12px] size-2 rounded-full bg-[#ff3b3b] ring-2 ring-surface" />
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Salutation */}
      <div className="mt-7 lg:mt-0">
        <p className="h-6 text-[16px] text-muted">{hello && `${hello} !`}</p>
        <h1 className="mt-1 text-[30px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[36px] lg:text-[44px]">
          Qu’est-ce qui vous
          <br className="sm:hidden" /> ferait plaisir ?
        </h1>
        <StoreInfo className="mt-4" />
      </div>

      {/* Recherche */}
      <label className="mt-6 flex h-14 items-center gap-3 rounded-full bg-surface pl-5 pr-2 transition focus-within:ring-2 focus-within:ring-brand/40">
        <Search className="size-[22px] shrink-0 text-ink/80" strokeWidth={1.6} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un plat, une boisson…"
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
          enterKeyHint="search"
        />
        {query && (
          <button type="button" aria-label="Effacer" onClick={() => setQuery("")} className="grid size-9 place-items-center rounded-full text-muted active:scale-90">
            <X className="size-4" />
          </button>
        )}
        <button
          type="button"
          aria-label="Trier"
          onClick={() => setSheet("sort")}
          className="relative grid size-11 place-items-center rounded-full text-ink/85 transition hover:bg-surface-2 active:scale-90"
        >
          <SlidersHorizontal className="size-[22px]" strokeWidth={1.5} />
          {sort !== "popular" && <span className="absolute right-2 top-2 size-2 rounded-full bg-brand" />}
        </button>
      </label>

      {q ? (
        <section className="mt-6">
          <p className="mb-4 text-[15px] text-muted">
            {results.length} résultat{results.length > 1 ? "s" : ""} pour « {query.trim()} »
          </p>
          {results.length ? (
            <Grid items={results} />
          ) : (
            <div className="rounded-[26px] bg-surface px-6 py-14 text-center">
              <p className="text-lg font-medium">Rien trouvé</p>
              <p className="mt-1 text-muted">Essayez « nems », « poulet » ou « limonade ».</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Promos */}
          <section aria-label="Offres" className="mt-6">
            <div
              ref={promoRef}
              onTouchStart={() => (touching.current = true)}
              onTouchEnd={() => window.setTimeout(() => (touching.current = false), 2500)}
              onScroll={(e) => {
                const el = e.currentTarget;
                const w = ((el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth) + 14;
                const n = Math.round(el.scrollLeft / w);
                if (n !== promo) setPromo(n);
              }}
              className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8"
            >
              {PROMOS.map((p, i) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="press relative h-[160px] w-[86%] max-w-[440px] shrink-0 snap-start overflow-hidden rounded-[26px] sm:w-[420px]"
                  style={{ background: p.bg }}
                >
                  <span className="absolute -right-3 top-1/2 h-[130%] w-[56%] -translate-y-1/2">
                    <Food src={p.image} alt="" priority={i === 0} sizes="240px" className="size-full" />
                  </span>
                  <div className="relative flex h-full w-[62%] flex-col justify-between p-5">
                    <div>
                      <p className="text-[20px] font-semibold leading-none tracking-tight" style={{ color: "var(--promo-title)" }}>
                        {p.title}
                      </p>
                      <p
                        className="mt-1.5 text-[60px] font-extrabold leading-[0.92] tracking-[-0.04em]"
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
                <span key={i} className={`h-[5px] rounded-full transition-all duration-500 ${i === promo ? "w-6 bg-ink" : "w-[5px] bg-ink/25"}`} />
              ))}
            </div>
          </section>

          {/* Catégories collantes, avec pastille animée */}
          <nav aria-label="Catégories" className="sticky top-0 z-20 -mx-5 mt-4 bg-bg py-3 sm:-mx-8 lg:top-[76px]">
            <div ref={chipsRef} className="relative flex gap-2 overflow-x-auto px-5 sm:px-8">
              {TABS.map((t) => {
                const on = active === t.id;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      chipRefs.current[t.id] = el;
                    }}
                    type="button"
                    onClick={() => jump(t.id)}
                    aria-current={on}
                    className={`relative z-10 flex h-11 shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-4 text-[15px] transition-colors duration-300 ${
                      on ? "border-transparent bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "border-line text-ink/70"
                    }`}
                  >
                    <span className={`grid size-8 place-items-center rounded-full ${on ? "bg-white/15 dark:bg-black/5" : "bg-surface"}`}>
                      {t.icon ? (
                        <Image src={t.icon} alt="" width={28} height={28} className="size-7 object-contain" />
                      ) : (
                        <Flame className={`size-4 ${on ? "" : "text-orange"}`} strokeWidth={2} />
                      )}
                    </span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-4 space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-32 [contain-intrinsic-size:auto_600px] [content-visibility:auto]">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-[22px] font-medium tracking-tight">{s.id === "popular" ? "Les plus populaires" : s.label}</h2>
                    <p className="mt-0.5 text-[14px] text-muted">
                      {s.id === "popular" ? "Ce que tout le monde commande" : `${s.items.length} choix`}
                    </p>
                  </div>
                </div>
                <Grid items={s.items} priority={i === 0} />
              </section>
            ))}
          </div>
        </>
      )}

      <Sheet open={sheet === "sort"} onClose={() => setSheet(null)} title="Trier par">
        <div className="space-y-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSort(s.id);
                setSheet(null);
              }}
              className="flex h-14 w-full items-center justify-between rounded-2xl px-4 text-left text-[16px] transition active:bg-surface"
            >
              {s.label}
              <span className={`grid size-6 place-items-center rounded-full border-[1.5px] ${sort === s.id ? "border-brand bg-brand text-white" : "border-faint"}`}>
                {sort === s.id && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === "notif"} onClose={() => setSheet(null)} title="Notifications">
        <div className="flex items-center gap-4 rounded-[22px] bg-surface p-4">
          <Food src="/food/poulet-croustillant.svg" alt="" sizes="56px" className="size-14 shrink-0" />
          <div>
            <p className="font-medium">Livraison offerte</p>
            <p className="mt-0.5 text-[14px] leading-snug text-muted">Dès {price(SITE.freeDeliveryFrom)} d’achat, partout dans la zone de livraison.</p>
          </div>
        </div>
      </Sheet>
    </main>
  );
}

function StoreInfo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-[13px] ${className}`}>
      <span className="flex h-8 items-center gap-1.5 rounded-full bg-surface px-3">
        <Star className="size-3.5 fill-orange text-orange" /> {SITE.rating} <span className="text-muted">({SITE.reviews})</span>
      </span>
      <span className="flex h-8 items-center gap-1.5 rounded-full bg-surface px-3">
        <Clock className="size-3.5 fill-brand text-bg" strokeWidth={2.4} /> {ETA}
      </span>
      <span className="flex h-8 items-center gap-1.5 rounded-full bg-surface px-3">
        <Bike className="size-3.5" strokeWidth={1.8} /> {price(SITE.deliveryFee)}
      </span>
    </div>
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
