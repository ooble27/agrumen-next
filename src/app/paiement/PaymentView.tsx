"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, Check, ChevronDown, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { cartActions, setLastOrder, setProfile, useCart, useProfile, type Order } from "@/lib/store";
import { PageHeader } from "@/components/Header";
import { MapCard } from "@/components/MapCard";

const METHODS = [
  { id: "interac", label: "Virement" },
  { id: "card", label: "Carte à la livraison" },
  { id: "cash", label: "Comptant à la livraison" },
] as const;
type Method = (typeof METHODS)[number]["id"];
const METHOD_NAME: Record<Method, string> = {
  interac: "Virement Interac",
  card: "Carte à la livraison",
  cash: "Comptant à la livraison",
};

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] transition ${
        checked ? "border-ink" : "border-faint"
      }`}
    >
      <span className={`size-3 rounded-full bg-ink transition ${checked ? "scale-100" : "scale-0"}`} />
    </span>
  );
}

function InteracMark() {
  return (
    <span className="inline-flex h-7 items-center rounded-md bg-[#fdb913] px-2.5 text-[15px] font-bold tracking-tight text-[#151515]">
      Interac
    </span>
  );
}

function CardMarks() {
  return (
    <span className="ml-auto flex gap-1.5">
      <span className="inline-flex h-7 items-center rounded-md bg-[#1a1f71] px-2 text-[12px] font-extrabold italic tracking-wide text-white">VISA</span>
      <span className="relative inline-flex h-7 w-11 items-center justify-center rounded-md bg-[#151515] ring-1 ring-line">
        <span className="size-3.5 rounded-full bg-[#eb001b]" />
        <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] mix-blend-screen" />
      </span>
      <span className="inline-flex h-7 items-center rounded-md bg-[#2e77bc] px-2 text-[11px] font-bold text-white">AMEX</span>
    </span>
  );
}

const POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

export function PaymentView() {
  const router = useRouter();
  const { lines, subtotal, delivery, taxes, total } = useCart();
  const saved = useProfile();
  const [method, setMethod] = useState<Method>("interac");
  const [form, setForm] = useState<typeof saved | null>(null);
  const [terms, setTerms] = useState(false);
  const [details, setDetails] = useState(false);
  const [tried, setTried] = useState(false);

  // Le profil enregistré pré-remplit le formulaire tant que l'utilisateur n'a rien tapé.
  const f = form ?? saved;
  const update = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...f, [k]: e.target.value });

  const phoneOk = f.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length === 10;
  const postalOk = POSTAL.test(f.area.trim());
  const addressOk = f.address.trim().length > 4;
  const valid = f.name.trim().length > 1 && phoneOk && postalOk && addressOk && terms && lines.length > 0;

  const submit = () => {
    setTried(true);
    if (!valid) return;

    const order: Order = {
      id: Math.random().toString(36).slice(2, 7).toUpperCase(),
      createdAt: Date.now(),
      lines: lines.map((l) => ({ slug: l.product.slug, name: l.product.name, qty: l.qty, price: l.product.price })),
      subtotal,
      delivery,
      taxes,
      total,
      payment: METHOD_NAME[method],
      profile: f,
    };

    if (SITE.whatsapp) {
      const msg = [
        `Nouvelle commande ${SITE.name} #${order.id}`,
        "",
        ...order.lines.map((l) => `• ${l.qty} × ${l.name} — ${price(l.qty * l.price)}`),
        "",
        `Sous-total : ${price(subtotal)}`,
        `Livraison : ${delivery === 0 ? "offerte" : price(delivery)}`,
        `${SITE.taxLabel} : ${price(taxes)}`,
        `Total : ${price(total)}`,
        `Paiement : ${order.payment}`,
        "",
        `Nom : ${f.name}`,
        `Téléphone : ${f.phone}`,
        `Code postal : ${f.area.toUpperCase()}`,
        `Adresse : ${f.address}`,
      ]
        .filter((l, i, a) => l !== "" || a[i - 1] !== "")
        .join("\n");
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    }

    setProfile(f);
    setLastOrder(order);
    cartActions.clear();
    router.push("/confirmation");
  };

  if (lines.length === 0) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <PageHeader title="Paiement" fallback="/panier" />
        <div className="mt-24 text-center">
          <p className="text-[20px] font-medium">Rien à payer pour l’instant</p>
          <Link href="/menu" className="mt-6 inline-flex h-14 items-center rounded-full bg-btn px-8 font-medium text-btn-fg">
            Voir le menu
          </Link>
        </div>
      </main>
    );
  }

  const err = (bad: boolean) => (tried && bad ? "!border-[#ff5a5a]" : "");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-10 pt-[max(16px,env(safe-area-inset-top))]">
      <PageHeader title="Paiement" fallback="/panier" />

      {/* Moyens de paiement */}
      <fieldset className="mt-8 space-y-6">
        <legend className="sr-only">Moyen de paiement</legend>
        {METHODS.map((m) => (
          <label key={m.id} className="flex cursor-pointer items-center gap-3 text-[18px]">
            <input type="radio" name="method" className="sr-only" checked={method === m.id} onChange={() => setMethod(m.id)} />
            <Radio checked={method === m.id} />
            <span className={method === m.id ? "text-ink" : "text-ink/70"}>{m.label}</span>
            {m.id === "interac" && <InteracMark />}
            {m.id === "card" && <CardMarks />}
            {m.id === "cash" && <Banknote className="ml-auto size-7 text-brand" strokeWidth={1.5} />}
          </label>
        ))}
      </fieldset>

      {/* Coordonnées */}
      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="text-[15px] text-muted">Nom complet</span>
          <input className={`field mt-2 ${err(f.name.trim().length < 2)}`} value={f.name} onChange={update("name")} autoComplete="name" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[15px] text-muted">Téléphone</span>
            <input
              className={`field mt-2 ${err(!phoneOk)}`}
              value={f.phone}
              onChange={update("phone")}
              inputMode="tel"
              autoComplete="tel"
              placeholder="514 555-0123"
            />
          </label>
          <label className="block">
            <span className="text-[15px] text-muted">Code postal</span>
            <input
              className={`field mt-2 uppercase ${err(!postalOk)}`}
              value={f.area}
              onChange={update("area")}
              placeholder="H2X 1Y4"
              autoComplete="postal-code"
              maxLength={7}
            />
          </label>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-[16px] leading-snug text-ink/75">
        <input type="checkbox" className="sr-only" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <span
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-[1.5px] transition ${
            terms ? "border-brand bg-brand text-white" : tried ? "border-[#ff5a5a]" : "border-faint"
          }`}
        >
          {terms && <Check className="size-4" strokeWidth={3} />}
        </span>
        J’accepte les conditions de vente et la politique de confidentialité
      </label>

      {/* Adresse */}
      <section className="mt-7 rounded-[26px] bg-surface p-4">
        <p className="flex items-center gap-2 text-[17px]">
          <MapPin className="size-5" strokeWidth={1.7} />
          Adresse de livraison
        </p>
        <div className="mt-3 h-[140px] overflow-hidden rounded-[18px]">
          <MapCard />
        </div>
        <input
          className={`field mt-3 !bg-bg ${err(!addressOk)}`}
          value={f.address}
          onChange={update("address")}
          placeholder="Adresse complète (rue, app.)"
          autoComplete="street-address"
        />
      </section>

      {/* Total */}
      <section className="mt-10 rounded-[26px] bg-surface p-4">
        <button type="button" onClick={() => setDetails((d) => !d)} className="flex w-full items-center justify-between px-1 text-left">
          <span>
            <span className="block text-[18px] font-medium">Montant total</span>
            <span className="mt-0.5 flex items-center gap-1 text-[14px] text-ink/70">
              {details ? "Masquer le détail" : "Voir le détail"}
              <ChevronDown className={`size-4 transition ${details ? "rotate-180" : ""}`} />
            </span>
          </span>
          <span className="text-[22px] font-medium">{price(total)}</span>
        </button>

        {details && (
          <dl className="mt-4 space-y-2 border-t border-line px-1 pt-4 text-[14px] text-muted">
            {lines.map((l) => (
              <div key={l.product.slug} className="flex justify-between">
                <dt>
                  {l.qty} × {l.product.name}
                </dt>
                <dd className="text-ink">{price(l.qty * l.product.price)}</dd>
              </div>
            ))}
            <div className="flex justify-between">
              <dt>Livraison</dt>
              <dd className={delivery === 0 ? "text-brand" : "text-ink"}>{delivery === 0 ? "Offerte" : price(delivery)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{SITE.taxLabel}</dt>
              <dd className="text-ink">{price(taxes)}</dd>
            </div>
          </dl>
        )}

        <button
          type="button"
          onClick={submit}
          className="mt-4 flex h-[60px] w-full items-center justify-center rounded-full bg-[#151515] text-[17px] font-medium text-white ring-1 ring-transparent transition active:scale-[0.98] dark:bg-surface-2 dark:ring-line"
        >
          Passer la commande
        </button>
        {tried && !valid && (
          <p className="mt-3 text-center text-[13px] text-[#ff5a5a]">Complétez les champs en rouge pour continuer.</p>
        )}
      </section>
    </main>
  );
}
