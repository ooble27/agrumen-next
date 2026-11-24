"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const KEY = "nemsy-onboarded";

function Chip({ src }: { src: string }) {
  return (
    <span className="relative inline-block size-[50px] shrink-0 rounded-full bg-white ring-4 ring-white/40 sm:size-[64px] dark:bg-[#f4f1ea] dark:ring-white/10">
      <Image src={src} alt="" fill unoptimized className="object-contain p-1" />
    </span>
  );
}

function Rings() {
  return (
    <span className="relative inline-flex h-[46px] w-[92px] shrink-0 sm:h-[58px] sm:w-[116px]" aria-hidden>
      <span className="absolute left-0 top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
      <span className="absolute left-[25%] top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
      <span className="absolute left-1/2 top-0 h-full w-1/2 rounded-full border-[2.5px] border-gold" />
    </span>
  );
}

const SLIDES = [
  {
    title: (
      <>
        <span className="flex items-center gap-3">
          Des nems <Chip src="/food/raviolis-vapeur.svg" />
        </span>
        <span className="block">croustillants</span>
        <span className="flex items-center gap-3">
          faits maison <Rings />
        </span>
      </>
    ),
    text: "Roulés à la main chaque jour, frits à la commande. Croustillants dehors, fondants dedans.",
    art: [{ src: "/food/nems-poulet.svg", cls: "left-[2%] top-[6%] w-[96%]" }],
  },
  {
    title: (
      <>
        <span className="block">Commandez</span>
        <span className="flex items-center gap-3">
          en deux <Rings />
        </span>
        <span className="flex items-center gap-3">
          minutes <Chip src="/food/limonade-fraise.svg" />
        </span>
      </>
    ),
    text: "Choisissez vos plats, vos sauces et vos extras. Payez par Interac, par carte ou comptant.",
    art: [
      { src: "/food/samoussas.svg", cls: "left-[-2%] top-[28%] w-[74%]" },
      { src: "/food/limonade-fraise.svg", cls: "right-[2%] top-[0%] w-[50%]" },
    ],
  },
  {
    title: (
      <>
        <span className="flex items-center gap-3">
          Livrés <Chip src="/food/nems-poulet.svg" />
        </span>
        <span className="block">tout chauds</span>
        <span className="flex items-center gap-3">
          chez vous <Rings />
        </span>
      </>
    ),
    text: "Votre commande arrive en 25 à 35 minutes. Livraison offerte dès 40 $.",
    art: [
      { src: "/food/raviolis-vapeur.svg", cls: "left-[0%] top-[2%] w-[66%]" },
      { src: "/food/poulet-croustillant.svg", cls: "right-[0%] top-[32%] w-[62%]" },
    ],
  },
];

export function Onboarding() {
  const router = useRouter();
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;

  // Déjà vu : on va directement au menu.
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) router.replace("/menu");
    } catch {
      /* ignore */
    }
  }, [router]);

  const finish = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    router.push("/menu");
  };
  const go = (n: number) => track.current?.scrollTo({ left: n * track.current.clientWidth, behavior: "smooth" });

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden" style={{ background: "var(--splash-bg)" }}>
      <header className="relative z-10 flex items-center justify-between px-6 pt-[max(18px,env(safe-area-inset-top))] lg:px-12 lg:pt-8">
        <Logo />
        <div className="flex items-center gap-2">
          {!last && (
            <button type="button" onClick={finish} className="h-11 rounded-full px-4 text-[15px] text-ink/70 transition active:scale-95">
              Passer
            </button>
          )}
          <ThemeToggle className="!bg-white/60 dark:!bg-surface" />
        </div>
      </header>

      <div
        ref={track}
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {SLIDES.map((s, k) => (
          <section key={k} className="flex h-full w-full shrink-0 snap-center flex-col lg:flex-row-reverse lg:items-center lg:gap-16 lg:px-16">
            {/* Visuel */}
            <div className="relative mx-6 mt-4 min-h-0 flex-1 lg:mx-0 lg:h-[72%] lg:flex-1">
              <div
                className="absolute inset-0 rounded-[120px_160px_40px_40px] lg:rounded-[160px_220px_48px_48px]"
                style={{ background: "var(--splash-blob)" }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative aspect-square h-[112%] max-w-[112%] -translate-y-[4%]">
                {s.art.map((a) => (
                  <span key={a.src} className={`absolute aspect-square ${a.cls}`}>
                    <Image src={a.src} alt="" fill unoptimized priority={k === 0} className="object-contain" draggable={false} />
                  </span>
                ))}
                </div>
              </div>
            </div>

            {/* Texte */}
            <div className="px-7 pb-36 pt-7 lg:flex-1 lg:px-0 lg:pb-0 lg:pt-0">
              <h1 className="text-[46px] font-medium leading-[1.02] tracking-[-0.04em] min-[400px]:text-[50px] sm:text-[64px] lg:text-[80px]">
                {s.title}
              </h1>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink/65">{s.text}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Contrôles */}
      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-7 pb-[max(26px,env(safe-area-inset-bottom))] lg:px-16 lg:pb-12">
        <div className="flex gap-2">
          {SLIDES.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Écran ${k + 1}`}
              onClick={() => go(k)}
              className={`h-2 rounded-full transition-all duration-300 ${k === i ? "w-8 bg-ink" : "w-2 bg-ink/25"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish() : go(i + 1))}
          className={`flex h-16 items-center justify-center gap-3 rounded-full bg-[#151515] text-[17px] font-medium text-white transition-all duration-300 active:scale-95 dark:bg-white dark:text-[#151515] ${
            last ? "w-[200px] pl-6 pr-2" : "w-16"
          }`}
          aria-label={last ? "Commencer" : "Suivant"}
        >
          {last && <span className="flex-1 text-left">Commencer</span>}
          <span className={`grid size-12 place-items-center rounded-full ${last ? "bg-brand text-white" : ""}`}>
            <ArrowRight className="size-5" />
          </span>
        </button>
      </footer>
    </main>
  );
}
