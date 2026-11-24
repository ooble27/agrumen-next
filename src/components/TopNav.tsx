"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, ShoppingBag } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { useCart } from "@/lib/store";
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

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-bg/85 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center gap-6 px-8">
        <Link href="/menu" aria-label="Accueil">
          <Logo />
        </Link>
        <span className="flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-[14px] text-ink/80">
          <MapPin className="size-4" strokeWidth={1.7} />
          {SITE.city}
        </span>
        <nav className="ml-4 flex gap-1">
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
          <Link
            href="/panier"
            data-cart-target=""
            className="press flex h-12 items-center gap-3 rounded-full bg-[#151515] pl-5 pr-2 text-[15px] font-medium text-white dark:bg-white dark:text-[#151515]"
          >
            <ShoppingBag className="size-5" strokeWidth={1.7} />
            Panier
            <span key={bump} className="bump grid h-8 min-w-8 place-items-center rounded-full bg-brand px-2.5 text-[13px] text-white">
              {count > 0 ? `${count} · ${price(subtotal)}` : 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
