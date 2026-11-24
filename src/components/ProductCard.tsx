"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { price } from "@/lib/format";
import { cartActions, toggleFavorite, useFavorites } from "@/lib/store";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const favs = useFavorites();
  const fav = favs.includes(product.slug);
  const [added, setAdded] = useState(false);

  return (
    <article className={`tint-${product.tint} group relative flex flex-col overflow-hidden rounded-[22px]`}>
      <Link href={`/produit/${product.slug}`} className="block p-2.5 pb-0" aria-label={product.name}>
        <div className="relative aspect-[1/0.92] overflow-hidden rounded-[16px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            style={{ objectPosition: product.focus ?? "50% 50%" }}
          />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.slug)}
        aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={fav}
        className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-black/25 text-white backdrop-blur-md transition active:scale-90"
      >
        <Heart className="size-4" strokeWidth={1.8} fill={fav ? "currentColor" : "none"} />
      </button>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <Link href={`/produit/${product.slug}`} className="line-clamp-1 text-[15px] leading-tight text-ink">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 whitespace-nowrap text-[10px] leading-none text-ink/60">
              À partir de
              {product.oldPrice && <span className="text-ink/45 line-through">{price(product.oldPrice)}</span>}
            </p>
            <p className="mt-1.5 whitespace-nowrap text-[16px] font-medium leading-none text-ink">{price(product.price)}</p>
          </div>
          <button
            type="button"
            aria-label={`Ajouter ${product.name} au panier`}
            onClick={() => {
              cartActions.add(product.slug);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 900);
            }}
            className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-plus text-plus-fg transition active:scale-90"
          >
            {added ? <Check className="size-5" strokeWidth={2} /> : <Plus className="size-5" strokeWidth={1.8} />}
          </button>
        </div>
      </div>
    </article>
  );
}
