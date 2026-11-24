import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Welcome() {
  return (
    <main
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{ background: "var(--splash-bg)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row lg:items-center lg:gap-16 lg:px-10">
        {/* Titre */}
        <section className="relative z-10 px-7 pt-[max(28px,env(safe-area-inset-top))] lg:flex-1 lg:px-0 lg:pt-0">
          <div className="flex items-center justify-between lg:mb-14">
            <span className="text-[17px] font-semibold tracking-tight">{SITE.name}</span>
            <ThemeToggle className="!bg-white/60 dark:!bg-surface" />
          </div>

          <h1 className="rise mt-[11vh] text-[64px] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[84px] lg:mt-0 lg:text-[104px]">
            <span className="flex items-center gap-4">
              Nems
              <span className="relative inline-block size-[54px] overflow-hidden rounded-full ring-[5px] ring-white/80 sm:size-[70px] lg:size-[86px] dark:ring-white/15">
                <Image src="/img/raviolis-vapeur.jpg" alt="" fill sizes="90px" className="object-cover" priority />
              </span>
            </span>
            <span className="flex items-center gap-4">
              livrés
              <span className="relative inline-flex h-[50px] w-[100px] shrink-0 sm:h-[64px] sm:w-[128px] lg:h-[80px] lg:w-[160px]" aria-hidden>
                <span className="absolute left-0 top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
                <span className="absolute left-[26%] top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
                <span className="absolute left-1/2 top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
              </span>
            </span>
            <span className="block">tout chauds</span>
          </h1>

          <p className="rise mt-5 max-w-sm text-[16px] leading-relaxed text-ink/65 [animation-delay:120ms]">
            {SITE.tagline} Commandez en deux minutes, payez par Interac, par carte ou comptant à la livraison.
          </p>

          <Link
            href="/menu"
            className="rise group mt-8 hidden h-16 items-center gap-4 rounded-full bg-btn-soft py-2 pl-7 pr-2 text-[17px] font-medium text-btn-soft-fg shadow-[var(--shadow-soft)] transition hover:gap-6 lg:inline-flex [animation-delay:200ms]"
          >
            Voir le menu
            <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </section>

        {/* Visuel */}
        <section className="relative mt-10 flex-1 px-6 lg:mt-0 lg:flex lg:h-[78vh] lg:max-w-[520px] lg:px-0">
          <div
            className="relative h-[52vh] min-h-[360px] w-full overflow-hidden rounded-[120px_150px_40px_40px] lg:h-full lg:rounded-[160px_200px_48px_48px]"
            style={{ background: "var(--splash-blob)" }}
          >
            <Image
              src="/img/hero.jpg"
              alt="Nems croustillants aux crevettes"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="rise object-cover [animation-delay:150ms]"
              style={{ objectPosition: "52% 58%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <Link
              href="/menu"
              className="group absolute inset-x-5 bottom-[max(20px,env(safe-area-inset-bottom))] flex h-16 items-center justify-between rounded-full bg-white/95 py-2 pl-7 pr-2 text-[17px] font-medium text-[#151515] backdrop-blur lg:hidden"
            >
              Commander maintenant
              <span className="grid size-12 place-items-center rounded-full bg-[#151515] text-white transition group-active:scale-95">
                <ArrowRight className="size-5" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
