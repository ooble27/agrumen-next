"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, MapPin, ShoppingBag } from "lucide-react";
import { price } from "@/lib/format";
import { setProfile, useCart, useProfile } from "@/lib/store";
import { AddressSheet } from "./AddressSheet";
import { Avatar } from "./Avatar";
import { useCartBump } from "@/lib/fx";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/favoris", label: "Favoris" },
  { href: "/profil", label: "Profil" },
];

/** En-tête ordinateur (style application de livraison). */
export function TopNav() {
  const pathname = usePathname();
  const { count, subtotal } = useCart();
  const bump = useCartBump();
  const profile = useProfile();
  const [picking, setPicking] = useState(false);

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-bg/85 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center gap-6 px-8">
        <Link href="/menu" aria-label="Accueil">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="flex h-11 max-w-[260px] items-center gap-2 rounded-full bg-surface px-4 text-[14px] text-ink/85 transition hover:bg-surface-2"
        >
          <MapPin className="size-4 shrink-0" strokeWidth={1.7} />
          <span className="truncate">{profile.address || "Choisir mon adresse"}</span>
          <ChevronDown className="size-4 shrink-0 text-muted" />
        </button>
        <nav className="flex gap-1 xl:ml-4">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href === "/menu" && pathname.startsWith("/produit"));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`h-11 rounded-full px-5 text-[15px] leading-[44px] transition ${
                  active ? "bg-surface text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Link href="/profil" aria-label="Mon profil" className="transition active:scale-90">
            <Avatar profile={profile} className="size-12 text-[17px]" />
          </Link>
          <Link
            href="/panier"
            data-cart-target=""
            className="press flex h-12 shrink-0 items-center gap-3 rounded-full bg-[#151515] pl-5 pr-2 text-[15px] font-medium text-white dark:bg-white dark:text-[#151515]"
          >
            <ShoppingBag className="size-5" strokeWidth={1.7} />
            Panier
            <span key={bump} className="bump grid h-8 min-w-8 place-items-center whitespace-nowrap rounded-full bg-brand px-2.5 text-[13px] text-white">
              {count > 0 ? (
                <span>
                  {count}
                  <span className="hidden xl:inline"> · {price(subtotal)}</span>
                </span>
              ) : (
                0
              )}
            </span>
          </Link>
        </div>
      </div>
      <AddressSheet open={picking} onClose={() => setPicking(false)} value={profile} onConfirm={(patch) => setProfile({ ...profile, ...patch })} />
    </header>
  );
}
