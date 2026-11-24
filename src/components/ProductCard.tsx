"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Plus } from "lucide-react";
import { defaultOptions, type Product } from "@/lib/products";
import { price } from "@/lib/format";
import { cartActions, toggleFavorite, useFavorites } from "@/lib/store";
import { Food } from "./Food";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const fav = useFavorites().includes(product.slug);
  const [added, setAdded] = useState(false);

  return (
    <article className={`tint-${product.tint} relative flex flex-col overflow-hidden rounded-[24px]`}>
      <Link href={`/produit/${product.slug}`} className="block px-3 pt-4" aria-label={product.name}>
        <Food src={product.image} alt={product.name} priority={priority} sizes="(min-width: 1024px) 240px, 45vw" className="mx-auto aspect-[1/0.78] w-[92%]" />
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.slug)}
        aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={fav}
        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-ink/25 bg-white/50 text-ink backdrop-blur-sm transition active:scale-90 dark:border-white/60 dark:bg-transparent dark:text-white"
      >
        <Heart className={`size-4 ${fav ? "fill-[#ff4d4d] text-[#ff4d4d]" : ""}`} strokeWidth={1.7} />
      </button>

      <div className="px-3.5 pb-3.5 pt-3">
        <Link href={`/produit/${product.slug}`} className="line-clamp-1 text-[15px] leading-tight text-ink">
          {product.name}
        </Link>
        <p className="mt-2.5 text-[9.5px] leading-none text-ink/60">À partir de</p>
        <p className="mt-1 flex items-baseline gap-1.5 whitespace-nowrap pr-12">
          <span className="text-[17px] font-medium leading-none text-ink">{price(product.price)}</span>
          {product.oldPrice && <span className="text-[11px] leading-none text-ink/40 line-through">{price(product.oldPrice)}</span>}
        </p>
      </div>

      <div className="notch">
        <button
          type="button"
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={() => {
            cartActions.add(product.slug, 1, defaultOptions(product));
            setAdded(true);
            window.setTimeout(() => setAdded(false), 900);
          }}
          className="grid size-[42px] place-items-center rounded-[14px] bg-plus text-plus-fg transition active:scale-90"
        >
          {added ? <Check className="size-5" strokeWidth={2.2} /> : <Plus className="size-[22px]" strokeWidth={1.6} />}
        </button>
      </div>
    </article>
  );
}
