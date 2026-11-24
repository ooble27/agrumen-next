"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useFavorites } from "@/lib/store";
import { PageHeader } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";

export function FavoritesView() {
  const favs = useFavorites();
  const items = PRODUCTS.filter((p) => favs.includes(p.slug));

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 pb-36 pt-[max(16px,env(safe-area-inset-top))] sm:px-8 lg:pb-16 lg:pt-8">
      <PageHeader title="Favoris" />
      {items.length === 0 ? (
        <div className="rise mt-20 flex flex-col items-center text-center">
          <span className="grid size-24 place-items-center rounded-full bg-surface">
            <Heart className="size-10 text-muted" strokeWidth={1.3} />
          </span>
          <h2 className="mt-6 text-[22px] font-medium">Aucun favori pour l’instant</h2>
          <p className="mt-2 max-w-xs text-muted">Touche le cœur sur un plat pour le retrouver ici.</p>
          <Link href="/menu" className="mt-8 inline-flex h-14 items-center rounded-full bg-btn px-8 text-[16px] font-medium text-btn-fg">
            Explorer le menu
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
