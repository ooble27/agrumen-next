"use client";

import { useState } from "react";
import { Check, ChevronRight, MessageCircle, Monitor, Moon, RotateCcw, Sun, User } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { cartActions, setProfile, setThemePref, useOrders, useProfile, useThemePref, type ThemePref } from "@/lib/store";
import { PageHeader } from "@/components/Header";
import { Food } from "@/components/Food";

const THEMES: { id: ThemePref; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Clair", Icon: Sun },
  { id: "dark", label: "Sombre", Icon: Moon },
  { id: "system", label: "Auto", Icon: Monitor },
];

export function ProfileView() {
  const saved = useProfile();
  const orders = useOrders();
  const theme = useThemePref();
  const [form, setForm] = useState<typeof saved | null>(null);
  const [ok, setOk] = useState(false);
  const f = form ?? saved;
  const initials =
    f.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-36 pt-[max(16px,env(safe-area-inset-top))] lg:pb-16 lg:pt-8">
      <PageHeader title="Profil" />

      <div className="mt-6 flex items-center gap-4 rounded-[26px] bg-surface p-4">
        <span className="grid size-16 place-items-center rounded-full bg-brand text-[22px] font-semibold text-white">{initials || <User className="size-7" strokeWidth={1.6} />}</span>
        <div className="min-w-0">
          <p className="truncate text-[20px] font-medium">{f.name || "Bienvenue"}</p>
          <p className="truncate text-muted">{f.phone || "Tes infos pré-remplissent le paiement"}</p>
        </div>
      </div>

      {/* Commandes */}
      <section className="mt-8">
        <h2 className="text-[19px] font-medium">Mes commandes</h2>
        {orders.length === 0 ? (
          <p className="mt-2 text-muted">Aucune commande pour l’instant.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {orders.slice(0, 5).map((o) => {
              const first = getProduct(o.lines[0]?.slug ?? "");
              return (
                <li key={o.id} className="flex items-center gap-3 rounded-[22px] bg-surface p-3">
                  {first && (
                    <span className={`tint-${first.tint} grid size-14 shrink-0 place-items-center rounded-[16px] p-1.5`}>
                      <Food src={first.image} alt="" sizes="56px" className="size-full" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px]">{o.lines.map((l) => `${l.qty} × ${l.name}`).join(", ")}</span>
                    <span className="text-[13px] text-muted">
                      {new Date(o.createdAt).toLocaleDateString("fr-CA", { day: "numeric", month: "short" })} · {price(o.total)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => o.lines.forEach((l) => cartActions.add(l.slug, l.qty, l.options ?? []))}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-bg px-3.5 text-[13px]"
                  >
                    <RotateCcw className="size-3.5" /> Recommander
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Infos */}
      <form
        className="mt-9 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setProfile(f);
          setForm(null);
          setOk(true);
          window.setTimeout(() => setOk(false), 1500);
        }}
      >
        <h2 className="text-[19px] font-medium">Mes infos</h2>
        {(
          [
            ["name", "Nom complet", "name"],
            ["phone", "Téléphone", "tel"],
            ["address", "Adresse", "street-address"],
            ["area", "Code postal", "postal-code"],
          ] as const
        ).map(([k, label, ac]) => (
          <label key={k} className="block">
            <span className="text-[15px] text-muted">{label}</span>
            <input className="field mt-2" value={f[k]} autoComplete={ac} onChange={(e) => setForm({ ...f, [k]: e.target.value })} />
          </label>
        ))}
        <button type="submit" className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-btn font-medium text-btn-fg">
          {ok ? (
            <>
              <Check className="size-5" /> Enregistré
            </>
          ) : (
            "Enregistrer"
          )}
        </button>
      </form>

      <section className="mt-9">
        <h2 className="text-[19px] font-medium">Apparence</h2>
        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-full bg-surface p-1.5">
          {THEMES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setThemePref(id)}
              aria-pressed={theme === id}
              className={`flex h-11 items-center justify-center gap-2 rounded-full text-[15px] transition ${
                theme === id ? "bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "text-muted"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.7} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {SITE.whatsapp && (
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center gap-4 rounded-[24px] bg-surface p-4"
        >
          <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
            <MessageCircle className="size-5" />
          </span>
          <span className="flex-1 font-medium">Nous écrire</span>
          <ChevronRight className="size-5 text-muted" />
        </a>
      )}
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.removeItem("nemsy-onboarded");
          } catch {
            /* ignore */
          }
          window.location.href = "/";
        }}
        className="mt-4 block w-full text-center text-[14px] text-muted"
      >
        Revoir la présentation
      </button>
    </main>
  );
}
