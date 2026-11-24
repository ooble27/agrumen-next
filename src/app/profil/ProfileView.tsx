"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, MessageCircle, Monitor, Moon, Package, Sun } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { setProfile, setThemePref, useLastOrder, useProfile, useThemePref, type ThemePref } from "@/lib/store";
import { PageHeader } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const THEMES: { id: ThemePref; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Clair", Icon: Sun },
  { id: "dark", label: "Sombre", Icon: Moon },
  { id: "system", label: "Auto", Icon: Monitor },
];

export function ProfileView() {
  const saved = useProfile();
  const order = useLastOrder();
  const theme = useThemePref();
  const [form, setForm] = useState<typeof saved | null>(null);
  const [ok, setOk] = useState(false);
  const f = form ?? saved;
  const initials = f.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-36 pt-[max(16px,env(safe-area-inset-top))]">
      <PageHeader title="Profil" />

      <div className="mt-6 flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-brand text-[22px] font-semibold text-white">{initials}</span>
        <div>
          <p className="text-[20px] font-medium">{f.name || "Bienvenue"}</p>
          <p className="text-muted">{f.phone || "Vos infos pré-remplissent le paiement"}</p>
        </div>
      </div>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setProfile(f);
          setForm(null);
          setOk(true);
          window.setTimeout(() => setOk(false), 1500);
        }}
      >
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

      <section className="mt-10">
        <h2 className="text-[19px] font-medium">Apparence</h2>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-full bg-surface p-1.5">
          {THEMES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setThemePref(id)}
              aria-pressed={theme === id}
              className={`flex h-11 items-center justify-center gap-2 rounded-full text-[15px] transition ${
                theme === id ? "bg-bg text-ink shadow-[var(--shadow-soft)]" : "text-muted"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.7} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {order && (
        <Link href="/confirmation" className="mt-8 flex items-center gap-4 rounded-[24px] bg-surface p-4">
          <span className="grid size-12 place-items-center rounded-full bg-bg">
            <Package className="size-5" strokeWidth={1.6} />
          </span>
          <span className="flex-1">
            <span className="block font-medium">Dernière commande #{order.id}</span>
            <span className="text-[14px] text-muted">
              {order.lines.reduce((s, l) => s + l.qty, 0)} articles · {price(order.total)}
            </span>
          </span>
        </Link>
      )}

      {SITE.whatsapp && (
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-4 rounded-[24px] bg-surface p-4"
        >
          <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
            <MessageCircle className="size-5" />
          </span>
          <span className="font-medium">Nous écrire sur WhatsApp</span>
        </a>
      )}

      <BottomNav />
    </main>
  );
}
