"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { useLastOrder } from "@/lib/store";
import { BoxIllustration } from "@/components/BoxIllustration";

function eta(createdAt: number) {
  const fmt = (d: Date) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(new Date(createdAt + 30 * 60e3))} – ${fmt(new Date(createdAt + 45 * 60e3))}`;
}

export function ConfirmationView() {
  const order = useLastOrder();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(40px,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BoxIllustration className="rise w-[260px] text-ink sm:w-[300px]" />

        <h1 className="rise mt-6 whitespace-nowrap text-[32px] font-semibold sm:text-[40px] tracking-tight [animation-delay:120ms]">Commande confirmée</h1>
        <p className="rise mt-3 text-[16px] leading-relaxed text-ink/70 [animation-delay:180ms]">
          Votre commande a bien été enregistrée
          <br />
          {order ? (
            <>
              Livraison prévue <span className="text-faint">aujourd’hui, {eta(order.createdAt)}</span>
            </>
          ) : (
            <>
              Livraison en <span className="text-faint">{SITE.deliveryTime} environ</span>
            </>
          )}
        </p>

        {order && (
          <div className="rise mt-8 w-full rounded-[24px] bg-surface p-5 text-left text-[15px] [animation-delay:240ms]">
            <div className="flex items-center justify-between">
              <span className="text-muted">Commande</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-ink/80">
              {order.lines.map((l) => (
                <li key={l.slug} className="flex justify-between">
                  <span>
                    {l.qty} × {l.name}
                  </span>
                  <span>{price(l.qty * l.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-line pt-3">
              <span className="text-muted">{order.payment}</span>
              <span className="text-[17px] font-medium">{price(order.total)}</span>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/menu"
        className="mt-8 flex h-[60px] items-center justify-center rounded-full bg-btn text-[17px] font-medium text-btn-fg transition active:scale-[0.98]"
      >
        Retour au menu
      </Link>
      <div className="mx-auto mt-5 h-[5px] w-36 rounded-full bg-ink/25 sm:hidden" />
    </main>
  );
}
