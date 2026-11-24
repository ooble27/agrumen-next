"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, Clock, Heart, Minus, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { SITE } from "@/lib/site";
import { pad, price } from "@/lib/format";
import { cartActions, toggleFavorite, useFavorites } from "@/lib/store";
import { PageHeader } from "@/components/Header";

const SLIDES = [
  { scale: 1, label: "Vue d’ensemble" },
  { scale: 1.6, label: "En détail" },
];

export function ProductView({ product, related }: { product: Product; related: Product[] }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [added, setAdded] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const fav = useFavorites().includes(product.slug);

  const add = () => {
    cartActions.add(product.slug, qty);
    setAdded(true);
    window.setTimeout(() => router.push("/panier"), 450);
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl pb-40 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-16 lg:pt-8">
      {/* Visuel */}
      <section className={`tint-${product.tint} relative rounded-b-[44px] pt-[max(16px,env(safe-area-inset-top))] lg:h-fit lg:rounded-[44px] lg:pt-4`}>
        <div className="px-5">
          <PageHeader title={product.name} />
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(product.slug)}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={fav}
          className="absolute right-5 top-[calc(max(16px,env(safe-area-inset-top))+4px)] grid size-12 place-items-center rounded-full bg-surface text-ink transition active:scale-95 lg:top-5"
        >
          <Heart className="size-5" strokeWidth={1.7} fill={fav ? "currentColor" : "none"} />
        </button>

        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar mt-4 flex snap-x snap-mandatory overflow-x-auto"
        >
          {SLIDES.map((s, i) => (
            <div key={i} className="w-full shrink-0 snap-center px-6">
              <div className="relative aspect-[1/0.86] overflow-hidden rounded-[32px] shadow-[var(--shadow-soft)]">
                <Image
                  src={product.image}
                  alt={`${product.name} — ${s.label}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: product.focus ?? "50% 50%", transform: `scale(${s.scale})` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 pb-6 pt-5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" })}
              className={`h-[5px] rounded-full transition-all ${i === slide ? "w-9 bg-ink" : "w-[5px] bg-ink/35"}`}
            />
          ))}
        </div>
      </section>

      {/* Infos */}
      <section className="px-6 pt-7 lg:px-0 lg:pt-4">
        <h2 className="text-[30px] font-normal leading-tight tracking-tight lg:text-[40px]">{product.name}</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[15px] text-ink/85">
          <span className="flex items-center gap-1.5">
            <Star className="size-5 fill-orange text-orange" />
            {product.rating} ({product.reviews} avis)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-5 fill-brand text-bg" strokeWidth={2.2} />
            Livraison en {SITE.deliveryTime}
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[26px] font-medium">{price(product.price)}</span>
          {product.oldPrice && <span className="text-[15px] text-muted line-through">{price(product.oldPrice)}</span>}
          <span className="ml-auto rounded-full bg-surface px-3 py-1 text-[13px] text-muted">{product.portion}</span>
        </div>

        <h3 className="mt-6 text-[19px] font-medium">Ingrédients</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{product.ingredients}</p>

        {related.length > 0 && (
          <>
            <h3 className="mt-7 text-[19px] font-medium">Produits similaires</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/produit/${r.slug}`}
                  className={`tint-${r.tint} group relative block aspect-[1/0.9] overflow-hidden rounded-[20px] p-1.5`}
                >
                  <span className="relative block h-full w-full overflow-hidden rounded-[15px]">
                    <Image src={r.image} alt={r.name} fill sizes="200px" className="object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: r.focus ?? "50% 50%" }} />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Barre d'achat */}
        <div
          className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-10 lg:static lg:mt-8 lg:p-0 lg:!bg-none"
          style={{ background: "var(--bar-fade)" }}
        >
          <div className="mx-auto flex max-w-xl items-center gap-3 lg:mx-0">
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
              className="flex h-[60px] flex-1 items-center justify-center gap-2 rounded-full bg-btn-soft text-[17px] font-medium text-btn-soft-fg shadow-[var(--shadow-soft)] transition active:scale-[0.98]"
            >
              {added ? (
                <>
                  <Check className="size-5" /> Ajouté
                </>
              ) : (
                <>
                  Ajouter au panier
                  <span className="hidden text-[15px] opacity-60 sm:inline">· {price(product.price * qty)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
