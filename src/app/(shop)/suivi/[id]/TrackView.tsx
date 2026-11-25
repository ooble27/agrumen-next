"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChefHat, ChevronDown, ChevronLeft, MessageCircle, Package, Phone, Star, Store, Truck } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { useOrders } from "@/lib/store";
import { useNow } from "@/lib/now";
import { courierFor, destination, rideWindow, trackOrder } from "@/lib/tracking";
import { TrackingMap } from "@/components/TrackingMap";
import { TrackingMap3D } from "@/components/TrackingMap3D";
import { MapView } from "@/components/MapView";

const time = (ts: number) => new Date(ts).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });

export function TrackView({ id }: { id: string }) {
  const router = useRouter();
  const order = useOrders().find((o) => o.id === id);
  const now = useNow();
  const [details, setDetails] = useState(false);
  const [rating, setRating] = useState(0);
  const [flat, setFlat] = useState(false);

  if (!order || !now) {
    return (
      <main className="mx-auto grid min-h-dvh max-w-xl place-items-center px-6 text-center">
        {now ? (
          <div>
            <p className="text-[20px] font-medium">Commande introuvable</p>
            <p className="mt-1 text-muted">Elle a peut-être été passée sur un autre appareil.</p>
            <Link href="/menu" className="mt-6 inline-flex h-12 items-center rounded-full bg-btn px-6 font-medium text-btn-fg">
              Retour au menu
            </Link>
          </div>
        ) : null}
      </main>
    );
  }

  const tr = trackOrder(order, now);
  const pickup = order.mode === "pickup";
  const courier = courierFor(order);
  const to = destination(order);
  const icons = pickup ? [Check, ChefHat, Package, Store] : [Check, ChefHat, Truck, Package];
  const onTheWay = tr.stage === "onTheWay" || tr.stage === "arriving";

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-xl lg:grid lg:max-w-[1280px] lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8 lg:px-8 lg:pt-8">
      {/* Carte */}
      <div className="relative h-[52dvh] min-h-[320px] overflow-hidden lg:sticky lg:top-[100px] lg:h-[calc(100dvh-132px)] lg:rounded-[32px]">
        {pickup ? (
          <MapView lat={SITE.store.lat} lon={SITE.store.lon} className="h-full w-full" />
        ) : (
          flat ? (
          <TrackingMap from={SITE.store} to={to} ride={rideWindow(order)} className="h-full w-full" />
        ) : (
          <TrackingMap3D from={SITE.store} to={to} ride={rideWindow(order)} onFail={() => setFlat(true)} className="h-full w-full" />
        )
        )}
        <div className="absolute inset-x-0 top-0 z-[500] flex items-center justify-between px-4 pt-[max(14px,env(safe-area-inset-top))]">
          <button
            type="button"
            aria-label="Retour"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/menu"))}
            className="grid size-12 place-items-center rounded-full bg-bg text-ink shadow-[0_8px_20px_-8px_rgba(0,0,0,.4)] active:scale-90"
          >
            <ChevronLeft className="size-5" strokeWidth={1.8} />
          </button>
          <span className="rounded-full bg-bg px-4 py-2 text-[13px] font-medium shadow-[0_8px_20px_-8px_rgba(0,0,0,.4)]">Commande #{order.id}</span>
        </div>
      </div>

      {/* Panneau */}
      <section className="relative z-10 -mt-8 rounded-t-[32px] bg-bg px-5 pb-16 pt-6 lg:mt-0 lg:rounded-[32px] lg:border lg:border-line lg:p-6">
        <div className="mx-auto -mt-3 mb-4 h-[5px] w-10 rounded-full bg-ink/15 lg:hidden" />

        {/* Heure d'arrivée */}
        {!tr.done && (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[14px] text-muted">{pickup ? "Prête vers" : "Arrivée estimée"}</p>
              <p className="text-[40px] font-semibold leading-none tracking-tight tabular-nums">{time(tr.etaAt)}</p>
            </div>
            {tr.minutesLeft > 0 && (
              <span className="rounded-full bg-orange/15 px-3.5 py-1.5 text-[14px] font-semibold text-orange">dans {tr.minutesLeft} min</span>
            )}
          </div>
        )}

        <h1 className={`${tr.done ? "" : "mt-4"} text-[22px] font-semibold tracking-tight`}>{tr.title}</h1>
        <p className="mt-1 text-[15px] text-muted">{tr.subtitle}</p>

        {/* Étapes */}
        <div className="mt-5 grid grid-cols-4 gap-1.5">
          {tr.steps.map((label, i) => (
            <div key={label}>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${i < tr.step || tr.done ? "w-full bg-brand" : i === tr.step ? "track-live w-full bg-orange" : "w-0"}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {tr.steps.map((label, i) => {
            const Icon = icons[i];
            const on = i <= tr.step;
            return (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <span className={`grid size-9 place-items-center rounded-full ${on ? (i === tr.step && !tr.done ? "bg-orange text-white" : "bg-brand text-white") : "bg-surface text-faint"}`}>
                  <Icon className="size-[17px]" strokeWidth={2} />
                </span>
                <span className={`text-[12px] leading-tight ${on ? "text-ink" : "text-faint"}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Livreur */}
        {!pickup && (onTheWay || tr.done) && (
          <div className="mt-6 flex items-center gap-3 rounded-[24px] bg-surface p-3.5">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-full">
              <Image src={`/avatars/${courier.avatar}.svg`} alt="" fill unoptimized className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{courier.name}</p>
              <p className="flex items-center gap-1 text-[13px] text-muted">
                <Star className="size-3.5 fill-orange text-orange" /> 4,9 · {courier.vehicle}
              </p>
            </div>
            {SITE.whatsapp && (
              <>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Écrire" className="grid size-11 place-items-center rounded-full bg-bg">
                  <MessageCircle className="size-5" strokeWidth={1.8} />
                </a>
                <a href={`tel:+${SITE.whatsapp}`} aria-label="Appeler" className="grid size-11 place-items-center rounded-full bg-bg">
                  <Phone className="size-5" strokeWidth={1.8} />
                </a>
              </>
            )}
          </div>
        )}

        {/* Note après livraison */}
        {tr.done && (
          <div className="mt-6 rounded-[24px] bg-surface p-5 text-center">
            <p className="font-medium">{rating ? "Merci pour ta note !" : "C’était bon ?"}</p>
            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-label={`${n} étoile${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} className="transition active:scale-90">
                  <Star className={`size-8 ${n <= rating ? "fill-orange text-orange" : "text-faint"}`} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Adresse */}
        <div className="mt-6 flex items-start gap-3 px-1">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface">
            {pickup ? <Store className="size-[18px]" strokeWidth={1.8} /> : <Package className="size-[18px]" strokeWidth={1.8} />}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] text-muted">{pickup ? "À récupérer" : "Livraison à"}</p>
            <p className="font-medium">{pickup ? SITE.pickupAddress : [order.profile.address, order.profile.address2].filter(Boolean).join(", ") || "Ton adresse"}</p>
          </div>
        </div>

        {/* Détail */}
        <div className="mt-5 rounded-[24px] bg-surface">
          <button type="button" onClick={() => setDetails((d) => !d)} className="flex w-full items-center justify-between p-4 text-left">
            <span>
              <span className="block font-medium">
                {order.lines.reduce((s, l) => s + l.qty, 0)} article{order.lines.reduce((s, l) => s + l.qty, 0) > 1 ? "s" : ""} · {price(order.total)}
              </span>
              <span className="text-[13px] text-muted">{order.payment}</span>
            </span>
            <ChevronDown className={`size-5 text-muted transition ${details ? "rotate-180" : ""}`} />
          </button>
          {details && (
            <ul className="space-y-1.5 border-t border-line px-4 py-3 text-[14px] text-ink/80">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span className="truncate">
                    {l.qty} × {l.name}
                  </span>
                  <span className="shrink-0">{price(l.qty * l.unit)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-[12px] text-faint">Commande passée à {time(order.createdAt)}</p>
      </section>
    </main>
  );
}
