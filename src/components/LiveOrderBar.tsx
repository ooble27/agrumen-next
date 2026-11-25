"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useOrders } from "@/lib/store";
import { useNow } from "@/lib/now";
import { isActive, trackOrder } from "@/lib/tracking";

/** Bandeau façon Uber : la commande en cours, toujours à portée de main. */
export function LiveOrderBar() {
  const pathname = usePathname();
  const order = useOrders()[0];
  const now = useNow();
  if (!now || !order || !isActive(order, now) || !["/menu", "/favoris", "/profil"].includes(pathname)) return null;
  const tr = trackOrder(order, now);
  const time = new Date(tr.etaAt).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
  const progress = tr.done ? 1 : (tr.step + 0.5) / tr.steps.length;
  return (
    <div className="fixed inset-x-0 bottom-[calc(max(14px,env(safe-area-inset-bottom))+88px)] z-40 flex justify-center px-4 lg:bottom-6">
      <Link
        href={`/suivi/${order.id}`}
        className="slide-up w-full max-w-[420px] overflow-hidden rounded-[22px] bg-[#151515] text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,.55)] ring-1 ring-white/10 dark:bg-[#232323]"
      >
        <span className="flex items-center gap-3 px-4 pb-3 pt-3.5">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold leading-tight">{tr.title}</span>
            <span className="mt-0.5 block text-[13px] text-white/60">
              {order.mode === "pickup" ? "Prête vers" : "Arrivée vers"} {time}
            </span>
          </span>
          {tr.minutesLeft > 0 && (
            <span className="text-right leading-none">
              <span className="block text-[22px] font-semibold tabular-nums">{tr.minutesLeft}</span>
              <span className="text-[11px] text-white/60">min</span>
            </span>
          )}
          <ChevronRight className="size-5 shrink-0 text-white/40" />
        </span>
        <span className="block h-[3px] bg-white/10">
          <span className="block h-full bg-orange transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
        </span>
      </Link>
    </div>
  );
}
