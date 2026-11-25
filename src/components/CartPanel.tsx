"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { cartActions, useCart } from "@/lib/store";
import { Food } from "./Food";

/** Panier latéral (ordinateur), comme le « Ta commande » des apps de livraison. */
export function CartPanel() {
  const { lines, count, subtotal } = useCart();
  const missing = SITE.freeDeliveryFrom - subtotal;

  return (
    <div className="rounded-[28px] border border-line bg-bg p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold tracking-tight">Ta commande</h2>
        {count > 0 && <span className="text-[13px] text-muted">{count} article{count > 1 ? "s" : ""}</span>}
      </div>

      {lines.length === 0 ? (
        <div className="py-10 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-surface">
            <ShoppingBag className="size-7 text-muted" strokeWidth={1.4} />
          </span>
          <p className="mt-4 font-medium">Ton panier est vide</p>
          <p className="mt-1 text-[14px] text-muted">Ajoute un plat pour commencer.</p>
        </div>
      ) : (
        <>
          <ul className="mt-4 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className={`tint-${l.product.tint} grid size-14 shrink-0 place-items-center rounded-[16px] p-1.5`}>
                  <Food src={l.product.image} alt="" sizes="56px" className="size-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{l.product.name}</span>
                  <span className="block truncate text-[12px] text-muted">{l.label || l.product.portion}</span>
                  <span className="text-[14px] font-semibold">{price(l.unit * l.qty)}</span>
                </span>
                <span className="flex items-center gap-1 rounded-full border border-line p-1">
                  <button type="button" aria-label="Retirer un" onClick={() => cartActions.setQty(l.key, l.qty - 1)} className="grid size-7 place-items-center rounded-full hover:bg-surface">
                    <Minus className="size-3.5" strokeWidth={2.4} />
                  </button>
                  <span className="w-5 text-center text-[13px] tabular-nums">{l.qty}</span>
                  <button type="button" aria-label="Ajouter un" onClick={() => cartActions.setQty(l.key, l.qty + 1)} className="grid size-7 place-items-center rounded-full hover:bg-surface">
                    <Plus className="size-3.5" strokeWidth={2.4} />
                  </button>
                </span>
              </li>
            ))}
          </ul>

          {missing > 0 ? (
            <div className="mt-4 rounded-2xl bg-surface p-3">
              <p className="text-[13px] text-ink/80">
                Plus que <span className="font-semibold text-ink">{price(missing)}</span> pour la livraison offerte
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (subtotal / SITE.freeDeliveryFrom) * 100)}%` }} />
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-brand/12 p-3 text-[13px] font-medium text-brand-strong dark:text-brand">Livraison offerte</p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-muted">Sous-total</span>
            <span className="text-[18px] font-semibold">{price(subtotal)}</span>
          </div>
          <Link
            href="/panier"
            className="mt-4 flex h-[52px] items-center justify-center rounded-full bg-[#151515] text-[15px] font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-[#151515]"
          >
            Voir le panier et payer
          </Link>
        </>
      )}
    </div>
  );
}
