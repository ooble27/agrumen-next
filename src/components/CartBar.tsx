"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { price } from "@/lib/format";
import { useCart } from "@/lib/store";
import { useCartBump } from "@/lib/fx";

/** Barre « Voir le panier » au-dessus de la barre du bas (mobile). */
export function CartBar() {
  const pathname = usePathname();
  const { count, subtotal } = useCart();
  const bump = useCartBump();
  if (count === 0 || !["/menu", "/favoris"].includes(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(max(14px,env(safe-area-inset-bottom))+88px)] z-40 flex justify-center px-4 lg:hidden">
      <Link
        href="/panier"
        className="slide-up press flex h-14 w-full max-w-[400px] items-center gap-3 rounded-full bg-brand pl-2 pr-5 text-white shadow-[0_18px_40px_-14px_rgba(47,158,75,.75)]"
      >
        <span key={bump} className="bump grid size-10 place-items-center rounded-full bg-white/20 text-[15px] font-semibold">
          {count}
        </span>
        <span className="flex-1 text-[16px] font-medium">Voir le panier</span>
        <span className="flex items-center gap-2 text-[16px] font-medium">
          <ShoppingBag className="size-[18px]" strokeWidth={1.8} />
          {price(subtotal)}
        </span>
      </Link>
    </div>
  );
}
