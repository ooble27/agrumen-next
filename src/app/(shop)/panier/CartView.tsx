"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { PRODUCTS, defaultOptions } from "@/lib/products";
import { SITE } from "@/lib/site";
import { pad, price } from "@/lib/format";
import { cartActions, computeTotals, useCart } from "@/lib/store";
import { haptic } from "@/lib/fx";
import { PageHeader } from "@/components/Header";
import { Food } from "@/components/Food";
import { SwipeRow } from "@/components/SwipeRow";
import { Marker } from "@/components/Fun";

export function CartView() {
  const { lines, subtotal } = useCart();
  const t = computeTotals(subtotal, "delivery", 0);
  const missing = SITE.freeDeliveryFrom - subtotal;
  const inCart = new Set(lines.map((l) => l.slug));
  const suggestions = PRODUCTS.filter((p) => !inCart.has(p.slug) && (p.category === "boissons" || p.category === "desserts" || p.slug === "frites")).slice(0, 5);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-40 pt-[max(16px,env(safe-area-inset-top))] lg:pt-8">
      <PageHeader title="Mon panier" />

      {lines.length === 0 ? (
        <div className="rise mt-20 flex flex-col items-center text-center">
          <span className="grid size-24 place-items-center rounded-full bg-surface">
            <ShoppingBag className="size-10 text-muted" strokeWidth={1.3} />
          </span>
          <h2 className="mt-6 text-[26px] font-medium tracking-tight">Ton panier a <Marker>faim</Marker></h2>
          <p className="mt-2 max-w-xs text-muted">Des nems tout chauds t’attendent dans le menu.</p>
          <Link href="/menu" className="mt-8 inline-flex h-14 items-center rounded-full bg-btn px-8 text-[16px] font-medium text-btn-fg">
            Voir le menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 flex flex-col gap-4">
            {lines.map((l) => (
              <li key={l.key}>
                <SwipeRow onDelete={() => cartActions.setQty(l.key, 0)}>
                <div className="flex items-center gap-4">
                <Link href={`/produit/${l.slug}`} className={`tint-${l.product.tint} grid size-[104px] shrink-0 place-items-center rounded-[22px] p-2`}>
                  <Food src={l.product.image} alt={l.product.name} sizes="104px" className="size-full" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[18px] leading-tight">{l.product.name}</p>
                  <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-muted">
                    {l.label || l.product.portion}
                  </p>
                  {l.note && <p className="mt-0.5 truncate text-[13px] italic text-faint">« {l.note} »</p>}
                  <p className="mt-2.5 text-[20px] font-medium">{price(l.unit * l.qty)}</p>
                </div>
                <div className="flex h-[104px] w-11 shrink-0 flex-col items-center justify-between rounded-full border border-line py-1.5">
                  <button
                    type="button"
                    aria-label={`Ajouter un ${l.product.name}`}
                    onClick={() => cartActions.setQty(l.key, l.qty + 1)}
                    className="grid size-8 place-items-center rounded-full bg-plus text-plus-fg transition active:scale-90"
                  >
                    <Plus className="size-4" strokeWidth={2.4} />
                  </button>
                  <span className="text-[17px] tabular-nums">{pad(l.qty)}</span>
                  <button
                    type="button"
                    aria-label={`Retirer un ${l.product.name}`}
                    onClick={() => cartActions.setQty(l.key, l.qty - 1)}
                    className="grid size-8 place-items-center rounded-full text-ink transition active:scale-90"
                  >
                    <Minus className="size-4" strokeWidth={2.4} />
                  </button>
                </div>
                </div>
                </SwipeRow>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-[12px] text-faint lg:hidden">Glisse une ligne vers la gauche pour la retirer</p>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <section className="mt-9">
              <h2 className="text-[19px] font-medium">Ça irait trop bien avec</h2>
              <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
                {suggestions.map((p) => (
                  <div key={p.slug} className={`tint-${p.tint} relative w-[132px] shrink-0 overflow-hidden rounded-[22px] p-2.5`}>
                    <Link href={`/produit/${p.slug}`}>
                      <Food src={p.image} alt={p.name} sizes="132px" className="mx-auto aspect-square w-[86%]" />
                      <p className="mt-1.5 truncate text-[13px]">{p.name}</p>
                    </Link>
                    <p className="mt-0.5 text-[14px] font-medium">{price(p.price)}</p>
                    <div className="notch">
                      <button
                        type="button"
                        aria-label={`Ajouter ${p.name}`}
                        onClick={(e) => {
                      cartActions.add(p.slug, 1, defaultOptions(p));
                      haptic();
                      e.currentTarget.closest("div.relative")?.animate(
                        [{ transform: "scale(1)" }, { transform: "scale(.94)" }, { transform: "scale(1)" }],
                        { duration: 350, easing: "ease-out" },
                      );
                    }}
                        className="grid size-9 place-items-center rounded-[12px] bg-plus text-plus-fg transition active:scale-90"
                      >
                        <Plus className="size-[18px]" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {missing > 0 && (
            <div className="mt-8 rounded-[22px] bg-surface p-4">
              <p className="text-[14px] text-ink/80">
                Plus que <span className="font-medium text-ink">{price(missing)}</span> pour la livraison offerte
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, (subtotal / SITE.freeDeliveryFrom) * 100)}%` }} />
              </div>
            </div>
          )}

          <dl className="mt-4 space-y-3 rounded-[24px] bg-surface p-5 text-[15px]">
            <div className="flex justify-between text-muted">
              <dt>Sous-total</dt>
              <dd className="text-ink">{price(t.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Livraison</dt>
              <dd className={t.delivery === 0 ? "text-brand" : "text-ink"}>{t.delivery === 0 ? "Offerte" : price(t.delivery)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>{SITE.taxLabel}</dt>
              <dd className="text-ink">{price(t.taxes)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-[18px]">
              <dt>Total estimé</dt>
              <dd className="font-medium">{price(t.total)}</dd>
            </div>
          </dl>

          <div
            className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-12"
            style={{ background: "var(--bar-fade)" }}
          >
            <Link
              href="/paiement"
              className="mx-auto flex h-[60px] max-w-xl items-center justify-between rounded-full bg-[#151515] pl-7 pr-2 text-[17px] font-medium text-white shadow-[var(--shadow-soft)] transition active:scale-[0.98] dark:bg-white dark:text-[#151515]"
            >
              Passer au paiement
              <span className="rounded-full bg-white/15 px-4 py-2.5 text-[15px] dark:bg-black/10">{price(t.total)}</span>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
