"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { SITE } from "@/lib/site";
import { pad, price } from "@/lib/format";
import { cartActions, useCart } from "@/lib/store";
import { PageHeader } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export function CartView() {
  const { lines, subtotal, delivery, total } = useCart();
  const missing = SITE.freeDeliveryFrom - subtotal;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-40 pt-[max(16px,env(safe-area-inset-top))]">
      <PageHeader title="Mon panier" />

      {lines.length === 0 ? (
        <div className="rise mt-20 flex flex-col items-center text-center">
          <span className="grid size-24 place-items-center rounded-full bg-surface">
            <ShoppingBag className="size-10 text-muted" strokeWidth={1.3} />
          </span>
          <h2 className="mt-6 text-[22px] font-medium">Votre panier est vide</h2>
          <p className="mt-2 max-w-xs text-muted">Des nems tout chauds vous attendent dans le menu.</p>
          <Link href="/menu" className="mt-8 inline-flex h-14 items-center rounded-full bg-btn px-8 text-[16px] font-medium text-btn-fg">
            Voir le menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 flex flex-col gap-4">
            {lines.map(({ product, qty }) => (
              <li key={product.slug} className="rise flex items-center gap-4">
                <Link
                  href={`/produit/${product.slug}`}
                  className={`tint-${product.tint} relative size-[104px] shrink-0 overflow-hidden rounded-[20px] p-1.5`}
                >
                  <span className="relative block h-full w-full overflow-hidden rounded-[15px]">
                    <Image src={product.image} alt={product.name} fill sizes="104px" className="object-cover" style={{ objectPosition: product.focus ?? "50% 50%" }} />
                  </span>
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[18px] leading-tight">{product.name}</p>
                  <p className="mt-1 text-[15px] text-muted">{product.portion}</p>
                  <p className="mt-3 text-[20px] font-medium">{price(product.price * qty)}</p>
                </div>
                {/* Stepper vertical */}
                <div className="flex h-[104px] w-11 shrink-0 flex-col items-center justify-between rounded-full border border-line py-1.5">
                  <button
                    type="button"
                    aria-label={`Ajouter un ${product.name}`}
                    onClick={() => cartActions.setQty(product.slug, qty + 1)}
                    className="grid size-8 place-items-center rounded-full bg-plus text-plus-fg transition active:scale-90"
                  >
                    <Plus className="size-4" strokeWidth={2.4} />
                  </button>
                  <span className="text-[17px] tabular-nums">{pad(qty)}</span>
                  <button
                    type="button"
                    aria-label={`Retirer un ${product.name}`}
                    onClick={() => cartActions.setQty(product.slug, qty - 1)}
                    className="grid size-8 place-items-center rounded-full text-ink transition active:scale-90"
                  >
                    <Minus className="size-4" strokeWidth={2.4} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {missing > 0 && (
            <div className="mt-7 rounded-[22px] bg-surface p-4">
              <p className="text-[14px] text-ink/80">
                Plus que <span className="font-medium text-ink">{price(missing)}</span> pour la livraison offerte
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, (subtotal / SITE.freeDeliveryFrom) * 100)}%` }} />
              </div>
            </div>
          )}

          <dl className="mt-6 space-y-3 rounded-[24px] bg-surface p-5 text-[15px]">
            <div className="flex justify-between text-muted">
              <dt>Sous-total</dt>
              <dd className="text-ink">{price(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Livraison</dt>
              <dd className={delivery === 0 ? "text-brand" : "text-ink"}>{delivery === 0 ? "Offerte" : price(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-[18px]">
              <dt>Total</dt>
              <dd className="font-medium">{price(total)}</dd>
            </div>
          </dl>

          <Link
            href="/paiement"
            className="mt-5 flex h-[60px] items-center justify-center rounded-full bg-btn text-[17px] font-medium text-btn-fg transition active:scale-[0.98]"
          >
            Passer au paiement
          </Link>
        </>
      )}

      <BottomNav />
    </main>
  );
}
