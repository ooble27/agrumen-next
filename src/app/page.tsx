import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { ETA, SITE } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Welcome() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden" style={{ background: "var(--splash-bg)" }}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row lg:items-center lg:gap-10 lg:px-10">
        {/* Titre */}
        <section className="relative z-10 px-7 pt-[max(22px,env(safe-area-inset-top))] lg:flex-1 lg:px-0 lg:pt-0">
          <div className="flex items-center justify-between lg:mb-16">
            <Logo />
            <ThemeToggle className="!bg-white/60 dark:!bg-surface" />
          </div>

          <h1 className="rise mt-[9vh] text-[62px] font-medium leading-[0.98] tracking-[-0.04em] min-[400px]:text-[68px] sm:text-[88px] lg:mt-0 lg:text-[108px]">
            <span className="flex items-center gap-3.5">
              Nems
              <span className="relative inline-block size-[54px] rounded-full bg-white/90 ring-4 ring-white/40 sm:size-[72px] lg:size-[88px] dark:bg-[#f2efe8] dark:ring-white/10">
                <Image src="/food/raviolis-vapeur.webp" alt="" fill sizes="90px" className="object-contain p-1.5" priority />
              </span>
            </span>
            <span className="flex items-center gap-4">
              livrés
              <span className="relative inline-flex h-[48px] w-[98px] shrink-0 sm:h-[64px] sm:w-[130px] lg:h-[80px] lg:w-[162px]" aria-hidden>
                <span className="absolute left-0 top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
                <span className="absolute left-[25%] top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
                <span className="absolute left-1/2 top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
              </span>
            </span>
            <span className="block">tout chauds</span>
          </h1>

          <div className="rise mt-8 hidden items-center gap-6 text-[15px] text-ink/70 lg:flex [animation-delay:120ms]">
            <span className="flex items-center gap-2">
              <Star className="size-[18px] fill-orange text-orange" /> {SITE.rating} ({SITE.reviews} avis)
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-[18px] fill-brand text-[var(--splash-bg)]" strokeWidth={2.4} /> Livré en {ETA}
            </span>
          </div>

          <Link
            href="/menu"
            className="rise group mt-10 hidden h-16 items-center gap-5 rounded-full bg-[#151515] py-2 pl-8 pr-2 text-[17px] font-medium text-white transition-all hover:gap-7 lg:inline-flex dark:bg-white dark:text-[#151515] [animation-delay:200ms]"
          >
            Commander maintenant
            <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </section>

        {/* Visuel : forme verte + plat qui déborde */}
        <section className="relative mt-auto h-[50vh] min-h-[380px] px-6 lg:mt-0 lg:h-[82vh] lg:w-[520px] lg:shrink-0 lg:px-0">
          <div
            className="absolute inset-x-6 bottom-0 top-[18%] rounded-[110px_150px_0_0] lg:inset-x-0 lg:bottom-[6%] lg:top-[14%] lg:rounded-[150px_200px_48px_48px]"
            style={{ background: "var(--splash-blob)" }}
          />
          {/* petits plats flous qui flottent */}
          <Image src="/food/samoussas.webp" alt="" width={140} height={140} className="food absolute bottom-[26%] left-0 w-[92px] -rotate-12 blur-[2px] lg:bottom-[2%] lg:left-[6%] lg:w-[110px]" />
          <Image src="/food/nems-poulet.webp" alt="" width={120} height={120} className="food absolute bottom-[6%] left-[18%] w-[64px] rotate-12 blur-[3px] lg:bottom-[10%]" />
          <Image
            src="/food/nems-poulet.webp"
            alt="Nems croustillants"
            width={820}
            height={820}
            priority
            className="food rise absolute right-[-4%] top-0 w-[92%] max-w-[520px] rotate-[-6deg] lg:right-[-8%] lg:w-[110%] lg:max-w-none [animation-delay:150ms]"
          />
          <Link
            href="/menu"
            className="group absolute inset-x-10 bottom-[max(22px,env(safe-area-inset-bottom))] z-10 flex h-16 items-center justify-between rounded-full bg-white py-2 pl-7 pr-2 text-[17px] font-medium text-[#151515] shadow-[0_18px_40px_-18px_rgba(0,0,0,.5)] lg:hidden"
          >
            Commander maintenant
            <span className="grid size-12 place-items-center rounded-full bg-[#151515] text-white transition group-active:scale-95">
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
