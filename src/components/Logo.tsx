import Image from "next/image";
import { SITE } from "@/lib/site";

/** Icône de l'app : un nem doré et fumant sur fond vert (public/logo.svg). */
export function LogoMark({ className = "size-12" }: { className?: string }) {
  return (
    <Image src="/logo.svg" alt={SITE.name} width={96} height={96} unoptimized priority className={`shrink-0 ${className}`} />
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-10" />
      <span className="text-[23px] font-semibold tracking-[-0.04em]">{SITE.name.toLowerCase()}</span>
    </span>
  );
}
