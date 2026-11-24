"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/** Bouton retour rond + titre centré (Payment / My Cart). */
export function PageHeader({ title, fallback = "/menu" }: { title: string; fallback?: string }) {
  const router = useRouter();
  return (
    <header className="relative flex h-14 items-center justify-center">
      <button
        type="button"
        aria-label="Retour"
        onClick={() => (window.history.length > 1 ? router.back() : router.push(fallback))}
        className="absolute left-0 grid size-12 place-items-center rounded-full bg-surface text-ink transition active:scale-95"
      >
        <ChevronLeft className="size-5" strokeWidth={1.8} />
      </button>
      <h1 className="truncate px-16 text-[22px] font-medium tracking-tight">{title}</h1>
    </header>
  );
}
