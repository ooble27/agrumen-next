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
  return (
    <div className="fixed inset-x-0 bottom-[calc(max(14px,env(safe-area-inset-bottom))+88px)] z-40 flex justify-center px-4 lg:bottom-6">
      <Link
        href={`/suivi/${order.id}`}
        className="slide-up flex w-full max-w-[420px] items-center gap-3 rounded-full bg-[#151515] py-2 pl-2 pr-4 text-white shadow-[0_16px_36px_-14px_rgba(0,0,0,.6)] dark:bg-white dark:text-[#151515]"
      >
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-orange">
          <span className="absolute inset-0 animate-ping rounded-full bg-orange opacity-40" />
          <span className="relative size-2.5 rounded-full bg-white" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold">{tr.title}</span>
          <span className="block text-[12px] opacity-70">{tr.minutesLeft > 0 ? `Arrivée dans ${tr.minutesLeft} min` : "Touche pour voir"}</span>
        </span>
        <ChevronRight className="size-5 opacity-70" />
      </Link>
    </div>
  );
}
