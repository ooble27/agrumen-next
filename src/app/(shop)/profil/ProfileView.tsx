"use client";

import Link from "next/link";
import { useState } from "react";
import { Camera, ChevronRight, Heart, MapPin, MessageCircle, Monitor, Moon, Pencil, RotateCcw, Sparkles, Sun, User } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { cartActions, setProfile, setThemePref, useFavorites, useOrders, useProfile, useThemePref, type ThemePref } from "@/lib/store";
import { haptic } from "@/lib/fx";
import { Food } from "@/components/Food";
import { Sheet } from "@/components/Sheet";
import { AddressSheet } from "@/components/AddressSheet";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { AvatarSheet } from "@/components/AvatarSheet";

const THEMES: { id: ThemePref; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Clair", Icon: Sun },
  { id: "dark", label: "Sombre", Icon: Moon },
  { id: "system", label: "Auto", Icon: Monitor },
];

function Row({
  icon,
  label,
  value,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bg text-ink">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-medium leading-tight">{label}</span>
        {value && <span className="mt-0.5 block truncate text-[13px] text-muted">{value}</span>}
      </span>
      <ChevronRight className="size-5 shrink-0 text-faint" />
    </>
  );
  const cls = "flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition active:bg-surface-2";
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2.5 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted">{title}</h2>
      <div className="divide-y divide-line overflow-hidden rounded-[24px] bg-surface">{children}</div>
    </section>
  );
}

export function ProfileView() {
  const profile = useProfile();
  const orders = useOrders();
  const favs = useFavorites();
  const theme = useThemePref();
  const [sheet, setSheet] = useState<null | "infos" | "address" | "avatar">(null);
  const [draft, setDraft] = useState({ name: "", phone: "" });

  const first = profile.name.trim().split(/\s+/)[0];
  const spent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-40 pt-[max(18px,env(safe-area-inset-top))] lg:pb-16 lg:pt-8">
      <h1 className="text-[32px] font-medium tracking-tight">{first ? `Salut ${first} !` : "Profil"}</h1>

      {/* Carte d'identité */}
      <section className="mt-5 overflow-hidden rounded-[28px] bg-[#151515] p-5 text-white dark:bg-surface">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setSheet("avatar")} aria-label="Changer mon avatar" className="relative shrink-0 transition active:scale-95">
            <Avatar profile={profile} className="size-[68px] text-[22px] ring-[3px] ring-white/15" />
            <span className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full bg-white text-[#151515] ring-[3px] ring-[#151515] dark:ring-surface">
              <Camera className="size-3.5" strokeWidth={2.2} />
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[21px] font-semibold leading-tight">{profile.name || "Ton nom"}</p>
            <p className="mt-0.5 truncate text-[14px] text-white/60">{profile.phone || "Ajoute ton numéro pour commander plus vite"}</p>
          </div>
          <button
            type="button"
            aria-label="Modifier mes infos"
            onClick={() => {
              setDraft({ name: profile.name, phone: profile.phone });
              setSheet("infos");
            }}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition active:scale-90"
          >
            <Pencil className="size-[18px]" strokeWidth={1.8} />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            [String(orders.length), orders.length > 1 ? "commandes" : "commande"],
            [String(favs.length), favs.length > 1 ? "favoris" : "favori"],
            [price(spent), "dépensés"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-white/[0.07] px-3 py-3">
              <p className="truncate text-[19px] font-semibold tabular-nums">{v}</p>
              <p className="text-[12px] text-white/55">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commandes récentes */}
      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between px-1">
          <h2 className="text-[20px] font-medium tracking-tight">Commandes récentes</h2>
        </div>
        {orders.length === 0 ? (
          <div className="flex items-center gap-4 rounded-[24px] bg-surface p-4">
            <Food src="/food/nems-poulet.svg" alt="" sizes="64px" className="size-16 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Pas encore de commande</p>
              <p className="text-[14px] text-muted">Tes nems préférés t’attendent.</p>
            </div>
            <Link href="/menu" className="h-10 rounded-full bg-[#151515] px-4 text-[14px] font-medium leading-10 text-white dark:bg-white dark:text-[#151515]">
              Menu
            </Link>
          </div>
        ) : (
          <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
            {orders.slice(0, 8).map((o) => {
              const prods = o.lines.map((l) => getProduct(l.slug)).filter(Boolean).slice(0, 3);
              const tint = prods[0]?.tint ?? "green";
              return (
                <article key={o.id} className="w-[250px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-surface">
                  <div className={`tint-${tint} flex h-[110px] items-center justify-center gap-1 px-3`}>
                    {prods.map((p, i) => (
                      <Food key={p!.slug + i} src={p!.image} alt="" sizes="90px" className={i === 0 ? "size-[92px]" : "size-[64px]"} />
                    ))}
                  </div>
                  <div className="p-4">
                    <p className="text-[12px] text-muted">
                      {new Date(o.createdAt).toLocaleDateString("fr-CA", { weekday: "short", day: "numeric", month: "short" })} · #{o.id}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[15px] font-medium">{o.lines.map((l) => `${l.qty} × ${l.name}`).join(", ")}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-[17px] font-semibold">{price(o.total)}</span>
                        <Link href={`/suivi/${o.id}`} className="text-[13px] font-medium text-orange underline-offset-2 hover:underline">
                          Suivi
                        </Link>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          haptic();
                          o.lines.forEach((l) => cartActions.add(l.slug, l.qty, l.options ?? []));
                        }}
                        className="flex h-9 items-center gap-1.5 rounded-full bg-[#151515] px-3.5 text-[13px] font-medium text-white transition active:scale-95 dark:bg-white dark:text-[#151515]"
                      >
                        <RotateCcw className="size-3.5" /> Recommander
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Group title="Compte">
        <Row
          icon={<MapPin className="size-5" strokeWidth={1.8} />}
          
          label="Adresse de livraison"
          value={profile.address ? [profile.address, profile.address2].filter(Boolean).join(", ") : "À choisir sur la carte"}
          onClick={() => setSheet("address")}
        />
        <Row
          icon={<User className="size-5" strokeWidth={1.8} />}
          
          label="Mes infos"
          value={[profile.name, profile.phone].filter(Boolean).join(" · ") || "Nom et téléphone"}
          onClick={() => {
            setDraft({ name: profile.name, phone: profile.phone });
            setSheet("infos");
          }}
        />
        <Row icon={<Heart className="size-5" strokeWidth={1.8} />} label="Mes favoris" value={`${favs.length} plat${favs.length > 1 ? "s" : ""}`} href="/favoris" />
      </Group>

      <Group title="Apparence">
        <div className="grid grid-cols-3 gap-1.5 p-1.5">
          {THEMES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setThemePref(id)}
              aria-pressed={theme === id}
              className={`flex h-12 items-center justify-center gap-2 rounded-[18px] text-[15px] transition ${
                theme === id ? "bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "text-muted"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Aide">
        {SITE.whatsapp && (
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3.5 px-4 py-3.5">
            <span className="grid size-10 place-items-center rounded-full bg-bg text-ink">
              <MessageCircle className="size-5" strokeWidth={1.8} />
            </span>
            <span className="flex-1 text-[16px] font-medium">Nous écrire</span>
            <ChevronRight className="size-5 text-faint" />
          </a>
        )}
        <Row
          icon={<Sparkles className="size-5" strokeWidth={1.8} />}
          
          label="Revoir la présentation"
          onClick={() => {
            try {
              localStorage.removeItem("nemsy-onboarded");
            } catch {
              /* ignore */
            }
            window.location.href = "/";
          }}
        />
      </Group>

      <footer className="mt-10 flex flex-col items-center gap-2 text-center">
        <Logo className="h-6 opacity-60" />
        <p className="text-[12px] text-faint">Fait maison à {SITE.city.split(",")[0]}</p>
        <p className="text-[11px] text-faint">
          Avatars « Adventurer » par{" "}
          <a href="https://www.instagram.com/lischi_art/" target="_blank" rel="noopener noreferrer" className="underline">
            Lisa Wischofsky
          </a>
          ,{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
            CC BY 4.0
          </a>
        </p>
      </footer>

      {/* Infos personnelles */}
      <Sheet open={sheet === "infos"} onClose={() => setSheet(null)} title="Mes infos">
        <form
          className="space-y-4 pb-2"
          onSubmit={(e) => {
            e.preventDefault();
            setProfile({ ...profile, name: draft.name.trim(), phone: draft.phone.trim() });
            haptic();
            setSheet(null);
          }}
        >
          <label className="block">
            <span className="text-[14px] text-muted">Nom complet</span>
            <input className="field mt-2" value={draft.name} autoComplete="name" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-[14px] text-muted">Téléphone</span>
            <input
              className="field mt-2"
              value={draft.phone}
              inputMode="tel"
              autoComplete="tel"
              placeholder="514 555-0123"
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </label>
          <button type="submit" className="h-14 w-full rounded-full bg-[#151515] text-[16px] font-medium text-white dark:bg-white dark:text-[#151515]">
            Enregistrer
          </button>
        </form>
      </Sheet>

      <AvatarSheet open={sheet === "avatar"} onClose={() => setSheet(null)} profile={profile} onChange={(avatar) => setProfile({ ...profile, avatar })} />
      <AddressSheet open={sheet === "address"} onClose={() => setSheet(null)} value={profile} onConfirm={(patch) => setProfile({ ...profile, ...patch })} />
    </main>
  );
}
