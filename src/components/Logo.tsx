import Image from "next/image";
import { SITE } from "@/lib/site";

/** Icône de l'app : « n. » blanc et point orange sur noir (public/logo.svg). */
export function LogoMark({ className = "size-12" }: { className?: string }) {
  return (
    <Image src="/logo.svg" alt={SITE.name} width={96} height={96} unoptimized priority className={`shrink-0 rounded-[28%] dark:ring-1 dark:ring-white/15 ${className}`} />
  );
}

/** Mot-symbole « nemsy. » : noir en thème clair, blanc en thème sombre. */
export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className}`} aria-label={SITE.name} role="img">
      <Image src="/wordmark.svg" alt="" width={240} height={74} unoptimized priority className="h-full w-auto dark:hidden" />
      <Image src="/wordmark-white.svg" alt="" width={240} height={74} unoptimized priority className="hidden h-full w-auto dark:block" />
    </span>
  );
}
