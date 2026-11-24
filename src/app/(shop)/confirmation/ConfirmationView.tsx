"use client";

import Link from "next/link";
import { Bike, Check, ChefHat, Package, Store } from "lucide-react";
import { ETA, SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { useOrders } from "@/lib/store";
import { BoxIllustration } from "@/components/BoxIllustration";
import { Confetti, Marker } from "@/components/Fun";
import { endCelebration, useCelebration } from "@/lib/fx";
import { useEffect } from "react";

function at(ts: number) {
  return new Date(ts).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
}

export function ConfirmationView() {
  const order = useOrders()[0];
  const party = useCelebration();
  useEffect(() => {
    if (!party) return;
    const t = window.setTimeout(endCelebration, 4000);
    return () => window.clearTimeout(t);
  }, [party]);
  const pickup = order?.mode === "pickup";

  const steps = [
    { label: "Commande envoyée", Icon: Check },
    { label: "En préparation", Icon: ChefHat },
    { label: pickup ? "Prête à récupérer" : "En route", Icon: pickup ? Package : Bike },
    { label: pickup ? "Récupérée" : "Livrée", Icon: pickup ? Store : Package },
  ];

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(36px,env(safe-area-inset-top))] lg:pt-12">
      {party && <Confetti />}
      <div className="flex flex-1 flex-col items-center text-center">
        <BoxIllustration className="rise w-[250px] text-ink sm:w-[290px]" />

        <h1 className="rise mt-5 whitespace-nowrap text-[32px] font-semibold tracking-tight sm:text-[40px] [animation-delay:120ms]">
          Commande <Marker>confirmée</Marker>
        </h1>
        <p className="rise mt-3 text-[16px] leading-relaxed text-ink/70 [animation-delay:180ms]">
          Ta commande est bien partie !
          <br />
          {order ? (
            <>
              {pickup ? "Cueillette" : "Livraison"} <span className="text-faint">{order.when.toLowerCase()}</span>
            </>
          ) : (
            <>
              Livraison en <span className="text-faint">{ETA}</span>
            </>
          )}
        </p>

        {order && (
          <>
            {/* Suivi */}
            <section className="rise mt-8 w-full rounded-[26px] bg-surface p-5 text-left [animation-delay:240ms]">
              <div className="flex items-center justify-between">
                <p className="text-[17px] font-medium">Suivi de commande</p>
                <span className="text-[14px] text-muted">#{order.id}</span>
              </div>
              <ol className="mt-5">
                {steps.map(({ label, Icon }, i) => {
                  const done = i === 0;
                  return (
                    <li key={label} className="relative flex items-center gap-4 pb-5 last:pb-0">
                      {i < steps.length - 1 && <span className={`absolute left-[19px] top-10 h-[calc(100%-30px)] w-[2px] ${done ? "bg-brand" : "bg-line"}`} />}
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full ${
                          done ? "bg-brand text-white" : i === 1 ? "border-2 border-brand text-brand" : "bg-bg text-faint"
                        }`}
                      >
                        <Icon className="size-[18px]" strokeWidth={1.8} />
                      </span>
                      <span className="flex-1">
                        <span className={`block text-[15px] ${done || i === 1 ? "text-ink" : "text-muted"}`}>{label}</span>
                        {done && <span className="text-[13px] text-muted">{at(order.createdAt)}</span>}
                        {i === 1 && <span className="text-[13px] text-muted">On te confirme par téléphone</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Récapitulatif */}
            <section className="rise mt-4 w-full rounded-[26px] bg-surface p-5 text-left text-[15px] [animation-delay:300ms]">
              <ul className="space-y-1.5 text-ink/80">
                {order.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span className="truncate">
                      {l.qty} × {l.name}
                    </span>
                    <span className="shrink-0">{price(l.qty * l.unit)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-line pt-3">
                <span className="text-muted">{order.payment}</span>
                <span className="text-[17px] font-medium">{price(order.total)}</span>
              </div>
              {pickup && <p className="mt-2 text-[13px] text-muted">À récupérer : {SITE.pickupAddress}</p>}
            </section>
          </>
        )}
      </div>

      {order && (
        <Link
          href={`/suivi/${order.id}`}
          className="mt-8 flex h-[60px] items-center justify-center gap-2 rounded-full bg-orange text-[17px] font-semibold text-white transition active:scale-[0.98]"
        >
          Suivre ma commande en direct
        </Link>
      )}
      <Link
        href="/menu"
        className={`${order ? "mt-3" : "mt-8"} flex h-[60px] items-center justify-center rounded-full bg-btn text-[17px] font-medium text-btn-fg transition active:scale-[0.98]`}
      >
        Retour au menu
      </Link>
    </main>
  );
}
