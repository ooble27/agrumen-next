"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, Heart, Plus } from "lucide-react";
import { defaultOptions, type Product } from "@/lib/products";
import { discount, price } from "@/lib/format";
import { Sticker } from "./Fun";
import { cartActions, toggleFavorite, useFavorites } from "@/lib/store";
import { flyToCart, haptic } from "@/lib/fx";
import { Food } from "./Food";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const fav = useFavorites().includes(product.slug);
  const [added, setAdded] = useState(false);
  const [pops, setPops] = useState(0);
  const imgRef = useRef<HTMLAnchorElement>(null);
  const href = `/produit/${product.slug}`;

  const add = () => {
    const opts = defaultOptions(product);
    cartActions.add(product.slug, 1, opts);
    flyToCart(imgRef.current);
    setAdded(true);
    setPops((n) => n + 1);
    window.setTimeout(() => setAdded(false), 1100);
  };

  return (
    <article className={`tint-${product.tint} press relative flex flex-col overflow-hidden rounded-[24px]`}>
      <Link ref={imgRef} href={href} className="block px-3 pt-4" aria-label={product.name}>
        <Food src={product.image} alt={product.name} priority={priority} sizes="(min-width: 1024px) 240px, 45vw" className="mx-auto aspect-[1/0.8] w-full" />
      </Link>

      <span className="pointer-events-none absolute left-2.5 top-2.5 z-10">
        {product.oldPrice ? (
          <Sticker kind="promo" label={`-${discount(product.price, product.oldPrice)}%`} />
        ) : product.isNew ? (
          <Sticker kind="new" label="Nouveau" />
        ) : product.popular ? (
          <Sticker kind="top" label="Top" />
        ) : null}
      </span>

      <button
        type="button"
        onClick={() => {
          haptic(8);
          toggleFavorite(product.slug);
        }}
        aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={fav}
        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-ink/25 bg-white/70 text-ink transition active:scale-75 dark:border-white/60 dark:bg-transparent dark:text-white"
      >
        <Heart key={String(fav)} className={`size-4 ${fav ? "bump fill-[#ff4d4d] text-[#ff4d4d]" : ""}`} strokeWidth={1.7} />
      </button>

      <div className="px-3.5 pb-3.5 pt-3">
        <Link href={href} className="line-clamp-1 text-[15px] leading-tight text-ink">
          {product.name}
        </Link>
        <p className="mt-2.5 text-[9.5px] leading-none text-ink/60">À partir de</p>
        <p className="mt-1 flex items-baseline gap-1.5 whitespace-nowrap pr-12">
          <span className="text-[17px] font-medium leading-none text-ink tabular-nums">{price(product.price)}</span>
          {product.oldPrice && <span className="text-[11px] leading-none text-ink/40 line-through">{price(product.oldPrice)}</span>}
        </p>
      </div>

      <div className="notch">
        {pops > 0 && (
          <span key={pops} className="plus-one pointer-events-none absolute left-1/2 top-0 z-10 rounded-full bg-orange px-2 py-0.5 text-[12px] font-extrabold text-white">
            +1
          </span>
        )}
        <button
          type="button"
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={add}
          key={pops}
          className={`grid size-[42px] place-items-center rounded-[14px] bg-plus text-plus-fg transition duration-300 active:scale-90 ${pops ? "wiggle" : ""}`}
        >
          <span key={String(added)} className="pop grid place-items-center">
            {added ? <Check className="size-5" strokeWidth={2.2} /> : <Plus className="size-[22px]" strokeWidth={1.6} />}
          </span>
        </button>
      </div>
    </article>
  );
}
