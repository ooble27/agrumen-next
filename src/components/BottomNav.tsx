"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, User } from "lucide-react";
import { HomeIcon } from "./icons";
import { useCart } from "@/lib/store";
import { useCartBump } from "@/lib/fx";

const ITEMS = [
  { href: "/menu", label: "Accueil", Icon: HomeIcon },
  { href: "/favoris", label: "Favoris", Icon: Heart },
  { href: "/panier", label: "Panier", Icon: ShoppingBag },
  { href: "/profil", label: "Profil", Icon: User },
];

/** Barre flottante (mobile uniquement), affichée sur les onglets principaux. */
export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const bump = useCartBump();
  if (!["/menu", "/favoris", "/profil"].includes(pathname)) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden"
      style={{ viewTransitionName: "bottom-nav" }}
    >
      <div
        className="flex w-full max-w-[400px] items-center justify-between rounded-full p-2 backdrop-blur-xl"
        style={{ background: "var(--nav)", boxShadow: "var(--shadow-soft)" }}
      >
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              transitionTypes={href === "/panier" ? ["nav-forward"] : undefined}
              data-cart-target={href === "/panier" ? "" : undefined}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "grid size-[60px] shrink-0 place-items-center rounded-full"
                  : "relative flex h-[60px] flex-1 flex-col items-center justify-center gap-1 text-[12px] text-ink/85"
              }
              style={active ? { background: "var(--nav-active)", color: "var(--nav-active-fg)" } : undefined}
            >
              <span className="relative">
                <Icon className={active ? "size-7" : "size-[22px]"} strokeWidth={1.5} />
                {href === "/panier" && count > 0 && (
                  <span key={bump} className="bump absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </span>
              {active ? <span className="sr-only">{label}</span> : <span>{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
