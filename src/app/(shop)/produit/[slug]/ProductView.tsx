"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Clock, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { defaultOptions, unitPrice, type Product } from "@/lib/products";
import { ETA } from "@/lib/site";
import { pad, price } from "@/lib/format";
import { cartActions, toggleFavorite, useCart, useFavorites } from "@/lib/store";
import { flyToCart, haptic, useCartBump } from "@/lib/fx";
import { PageHeader } from "@/components/Header";
import { Food } from "@/components/Food";
import { Checkbox, Radio } from "@/components/Option";

export function ProductView({ product, related }: { product: Product; related: Product[] }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<string[]>(() => defaultOptions(product));
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);
  const fav = useFavorites().includes(product.slug);
  const unit = unitPrice(product, options);
  const { count } = useCart();
  const bump = useCartBump();
  const foodRef = useRef<HTMLSpanElement>(null);
  const [compact, setCompact] = useState(false);

  // Barre compacte : on ne met à jour l'état qu'au passage du seuil (pas à chaque pixel).
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const back = () => (window.history.length > 1 ? router.back() : router.push("/menu"));

  const pick = (groupId: string, choiceId: string, single: boolean) => {
    const key = `${groupId}.${choiceId}`;
    setOptions((o) =>
      single ? [...o.filter((k) => !k.startsWith(`${groupId}.`)), key] : o.includes(key) ? o.filter((k) => k !== key) : [...o, key],
    );
  };

  const add = () => {
    cartActions.add(product.slug, qty, options, note.trim());
    flyToCart(foodRef.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    setQty(1);
  };

  const cartButton = (
    <Link
      href="/panier"
      data-cart-target=""
      aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
      className="relative grid size-12 place-items-center rounded-full bg-surface text-ink transition active:scale-90"
    >
      <ShoppingBag className="size-[21px]" strokeWidth={1.6} />
      {count > 0 && (
        <span key={bump} className="bump absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl pb-40 lg:grid lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14 lg:px-8 lg:pb-16 lg:pt-8">
      {/* Visuel */}
      <section className={`tint-${product.tint} relative rounded-b-[44px] px-5 pb-8 pt-[max(14px,env(safe-area-inset-top))] lg:sticky lg:top-[100px] lg:rounded-[44px] lg:pt-5`}>
        <div className="relative">
          <div className="lg:invisible">
            <PageHeader title={product.name} />
          </div>
          <div className="absolute right-0 top-1">{cartButton}</div>
        </div>
        <span ref={foodRef} className="block">
          <Food src={product.image} alt={product.name} priority sizes="(min-width: 1024px) 520px, 90vw" className="mx-auto mt-2 aspect-square w-[82%] max-w-[440px]" />
        </span>
        <button
          type="button"
          onClick={() => {
            haptic(8);
            toggleFavorite(product.slug);
          }}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={fav}
          className="absolute -bottom-6 right-6 z-10 grid size-14 place-items-center rounded-full bg-bg text-ink shadow-[var(--shadow-soft)] transition active:scale-90"
        >
          <Heart key={String(fav)} className={`size-6 ${fav ? "bump fill-[#ff4d4d] text-[#ff4d4d]" : ""}`} strokeWidth={1.6} />
        </button>
      </section>

      {/* Barre compacte qui apparaît en défilant (mobile) */}
      <div
        className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-bg pt-[env(safe-area-inset-top)] transition-all duration-500 [transition-timing-function:var(--ease-out)] lg:hidden ${
          compact ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <button type="button" onClick={back} aria-label="Retour" className="grid size-11 place-items-center rounded-full bg-surface active:scale-90">
            <ChevronLeft className="size-5" strokeWidth={1.8} />
          </button>
          <p className="flex-1 truncate text-center text-[17px] font-medium">{product.name}</p>
          <span className="scale-90">{cartButton}</span>
        </div>
      </div>


      {/* Infos */}
      <section className="px-6 pt-7 lg:px-0 lg:pt-2">
        <h2 className="text-[30px] font-normal leading-tight tracking-tight lg:text-[40px]">{product.name}</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[15px] text-ink/85">
          <span className="flex items-center gap-1.5">
            <Star className="size-5 fill-orange text-orange" />
            {product.rating.toLocaleString("fr-CA")} ({product.reviews} avis)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-5 fill-brand text-bg" strokeWidth={2.2} />
            Livraison en {ETA}
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[26px] font-medium">{price(product.price)}</span>
          {product.oldPrice && <span className="text-[15px] text-muted line-through">{price(product.oldPrice)}</span>}
          <span className="ml-auto rounded-full bg-surface px-3.5 py-1.5 text-[13px] text-ink/70">{product.portion}</span>
        </div>

        <h3 className="mt-6 text-[19px] font-medium">Ingrédients</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{product.description}</p>

        {/* Options */}
        {product.options?.map((g) => (
          <fieldset key={g.id} className="mt-8">
            <legend className="flex w-full items-center justify-between">
              <span className="text-[19px] font-medium">{g.title}</span>
              <span
                className={`rounded-full px-3 py-1 text-[12px] ${
                  g.type === "one" ? "bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "bg-surface text-muted"
                }`}
              >
                {g.type === "one" ? "Obligatoire" : "Facultatif"}
              </span>
            </legend>
            <div className="mt-2 divide-y divide-line">
              {g.choices.map((c) => {
                const key = `${g.id}.${c.id}`;
                const on = options.includes(key);
                return (
                  <label key={c.id} className="flex cursor-pointer items-center gap-4 py-3.5">
                    <input
                      type={g.type === "one" ? "radio" : "checkbox"}
                      name={g.id}
                      className="sr-only"
                      checked={on}
                      onChange={() => pick(g.id, c.id, g.type === "one")}
                    />
                    {g.type === "one" ? <Radio checked={on} /> : <Checkbox checked={on} />}
                    <span className={`flex-1 text-[16px] ${on ? "text-ink" : "text-ink/75"}`}>{c.label}</span>
                    {c.price ? <span className="text-[15px] text-muted">+{price(c.price)}</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <label className="mt-8 block">
          <span className="text-[19px] font-medium">Instructions spéciales</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={140}
            placeholder="Allergies, sans oignon, bien croustillant…"
            className="mt-3 w-full resize-none rounded-[22px] border border-line bg-surface px-5 py-4 text-[16px] outline-none placeholder:text-faint focus:border-brand"
          />
        </label>

        {related.length > 0 && (
          <>
            <h3 className="mt-8 text-[19px] font-medium">Produits similaires</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/produit/${r.slug}`} className={`tint-${r.tint} block rounded-[20px] p-2.5`}>
                  <Food src={r.image} alt={r.name} sizes="160px" className="aspect-square w-full" />
                  <span className="mt-1.5 block truncate text-center text-[12px] text-ink/80">{r.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Barre d'achat */}
        <div
          className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-12 lg:static lg:mt-10 lg:p-0 lg:!bg-none"
          style={{ background: "var(--bar-fade)" }}
        >
          <div className="mx-auto flex max-w-xl items-center gap-3 lg:mx-0 lg:max-w-none">
            <div
              className="flex h-[60px] items-center gap-3 rounded-full px-2 backdrop-blur-xl"
              style={{ background: "var(--stepper)", color: "var(--stepper-fg)" }}
            >
              <button
                type="button"
                aria-label="Retirer un"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center rounded-full transition active:scale-90"
                style={{ background: "var(--stepper-knob)", color: "var(--stepper-knob-fg)" }}
              >
                <Minus className="size-5" strokeWidth={2.2} />
              </button>
              <span className="w-7 text-center text-[18px] tabular-nums" aria-live="polite">
                {pad(qty)}
              </span>
              <button
                type="button"
                aria-label="Ajouter un"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="grid size-11 place-items-center rounded-full transition active:scale-90"
                style={{ background: "var(--stepper-knob)", color: "var(--stepper-knob-fg)" }}
              >
                <Plus className="size-5" strokeWidth={2.2} />
              </button>
            </div>
            <button
              type="button"
              onClick={add}
              className="flex h-[60px] flex-1 items-center justify-center gap-2 rounded-full bg-btn-soft px-5 text-[16px] font-medium text-btn-soft-fg shadow-[var(--shadow-soft)] transition active:scale-[0.98]"
            >
              {added ? (
                <>
                  <Check className="size-5" /> Ajouté
                </>
              ) : (
                <>
                  Ajouter <span className="opacity-60">·</span> {price(unit * qty)}
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
