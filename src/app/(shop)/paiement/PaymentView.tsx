"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, Bike, ChevronDown, Clock, MapPin, Store } from "lucide-react";
import { ETA, SITE } from "@/lib/site";
import { price } from "@/lib/format";
import { addOrder, cartActions, computeTotals, newOrderStamp, setProfile, useCart, useProfile, type Order } from "@/lib/store";
import { PageHeader } from "@/components/Header";
import { MapCard } from "@/components/MapCard";
import { Checkbox, Radio } from "@/components/Option";

const METHODS = [
  { id: "interac", label: "Virement" },
  { id: "card", label: "Carte" },
  { id: "cash", label: "Comptant" },
] as const;
type Method = (typeof METHODS)[number]["id"];
const METHOD_NAME: Record<Method, string> = {
  interac: "Virement Interac",
  card: "Carte à la livraison",
  cash: "Comptant",
};

const TIPS = [0, 0.1, 0.15, 0.18];
const POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

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
      <span className="inline-flex h-7 w-11 items-center justify-center rounded-md bg-[#151515] ring-1 ring-line">
        <span className="size-3.5 rounded-full bg-[#eb001b]" />
        <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] mix-blend-screen" />
      </span>
      <span className="inline-flex h-7 items-center rounded-md bg-[#2e77bc] px-2 text-[11px] font-bold text-white">AMEX</span>
    </span>
  );
}

/** Créneaux de 30 min restants aujourd'hui (au moins 45 min d'avance). */
function slots(now: Date) {
  const out: string[] = [];
  const d = new Date(now.getTime() + 45 * 60e3);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  while (d.getHours() < SITE.closeHour && d.getDate() === now.getDate()) {
    if (d.getHours() >= SITE.openHour) out.push(d.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }));
    d.setMinutes(d.getMinutes() + 30);
  }
  return out;
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-[26px] bg-surface p-4">
      <h2 className="flex items-center gap-2 px-1 text-[17px]">
        {icon}
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PaymentView() {
  const router = useRouter();
  const { lines, subtotal } = useCart();
  const saved = useProfile();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [when, setWhen] = useState<"asap" | "later">("asap");
  const [slot, setSlot] = useState("");
  const [method, setMethod] = useState<Method>("interac");
  const [tip, setTip] = useState(0.15);
  const [form, setForm] = useState<typeof saved | null>(null);
  const [terms, setTerms] = useState(false);
  const [details, setDetails] = useState(false);
  const [tried, setTried] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const f = form ?? saved;
  const update = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...f, [k]: e.target.value });
  const t = computeTotals(subtotal, mode, tip);


  const phoneOk = f.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length === 10;
  const postalOk = mode === "pickup" || POSTAL.test(f.area.trim());
  const addressOk = mode === "pickup" || f.address.trim().length > 4;
  const slotOk = when === "asap" || !!slot;
  const valid = f.name.trim().length > 1 && phoneOk && postalOk && addressOk && slotOk && terms && lines.length > 0;
  const err = (bad: boolean) => (tried && bad ? "!border-[#ff5a5a]" : "");

  const submit = () => {
    setTried(true);
    if (!valid) return;

    const whenLabel = when === "asap" ? `Dès que possible (${ETA})` : `Aujourd’hui à ${slot}`;
    const order: Order = {
      ...newOrderStamp(),
      mode,
      when: whenLabel,
      lines: lines.map((l) => ({ slug: l.slug, name: l.product.name, qty: l.qty, unit: l.unit, label: l.label, options: l.options })),
      ...t,
      payment: METHOD_NAME[method],
      profile: f,
    };

    if (SITE.whatsapp) {
      const msg = [
        `Nouvelle commande ${SITE.name} #${order.id}`,
        `${mode === "delivery" ? "Livraison" : "Cueillette"} · ${whenLabel}`,
        "",
        ...lines.map((l) => `• ${l.qty} × ${l.product.name}${l.label ? ` (${l.label})` : ""}${l.note ? ` — « ${l.note} »` : ""} : ${price(l.qty * l.unit)}`),
        "",
        `Sous-total : ${price(t.subtotal)}`,
        mode === "delivery" ? `Livraison : ${t.delivery === 0 ? "offerte" : price(t.delivery)}` : "",
        `${SITE.taxLabel} : ${price(t.taxes)}`,
        t.tip ? `Pourboire : ${price(t.tip)}` : "",
        `Total : ${price(t.total)}`,
        `Paiement : ${order.payment}`,
        "",
        `Nom : ${f.name}`,
        `Téléphone : ${f.phone}`,
        mode === "delivery" ? `Adresse : ${f.address}, ${f.area.toUpperCase()}` : "",
      ]
        .filter((l) => l !== "")
        .join("\n");
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    }

    setProfile(f);
    addOrder(order);
    cartActions.clear();
    router.push("/confirmation");
  };

  if (lines.length === 0) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pt-[max(16px,env(safe-area-inset-top))] lg:pt-8">
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

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 pb-10 pt-[max(16px,env(safe-area-inset-top))] lg:pt-8">
      <PageHeader title="Paiement" fallback="/panier" />

      {/* Livraison / cueillette */}
      <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-full bg-surface p-1.5">
        {(
          [
            ["delivery", "Livraison", Bike],
            ["pickup", "Cueillette", Store],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            aria-pressed={mode === id}
            className={`flex h-12 items-center justify-center gap-2 rounded-full text-[16px] transition ${
              mode === id ? "bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "text-muted"
            }`}
          >
            <Icon className="size-[18px]" strokeWidth={1.7} />
            {label}
          </button>
        ))}
      </div>

      {/* Moyens de paiement (disposition de la maquette) */}
      <fieldset className="mt-8 space-y-6 px-1">
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
        <div className={mode === "delivery" ? "grid grid-cols-2 gap-3" : ""}>
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
          {mode === "delivery" && (
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
          )}
        </div>
      </div>

      {/* Adresse */}
      {mode === "delivery" ? (
        <Card title="Adresse de livraison" icon={<MapPin className="size-5" strokeWidth={1.7} />}>
          <div className="h-[140px] overflow-hidden rounded-[18px]">
            <MapCard />
          </div>
          <input
            className={`field mt-3 !bg-bg ${err(!addressOk)}`}
            value={f.address}
            onChange={update("address")}
            placeholder="Adresse complète (rue, app.)"
            autoComplete="street-address"
          />
        </Card>
      ) : (
        <Card title="Point de cueillette" icon={<Store className="size-5" strokeWidth={1.7} />}>
          <div className="h-[140px] overflow-hidden rounded-[18px]">
            <MapCard />
          </div>
          <p className="mt-3 px-1 text-[15px] text-ink/80">{SITE.pickupAddress}</p>
        </Card>
      )}

      {/* Heure */}
      <Card title={mode === "delivery" ? "Heure de livraison" : "Heure de cueillette"} icon={<Clock className="size-5" strokeWidth={1.7} />}>
        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-1 py-2.5">
            <input type="radio" name="when" className="sr-only" checked={when === "asap"} onChange={() => setWhen("asap")} />
            <Radio checked={when === "asap"} />
            <span className="flex-1">Dès que possible</span>
            <span className="text-[14px] text-muted">{ETA}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-1 py-2.5">
            <input type="radio" name="when" className="sr-only" checked={when === "later"} onChange={() => {
                setWhen("later");
                setTimeSlots(slots(new Date()));
              }}
            />
            <Radio checked={when === "later"} />
            <span className="flex-1">Planifier pour plus tard</span>
          </label>
        </div>
        {when === "later" && timeSlots.length === 0 && (
          <p className="mt-2 px-1 text-[14px] text-muted">Plus de créneau disponible aujourd’hui. Choisissez « Dès que possible ».</p>
        )}
        {when === "later" && timeSlots.length > 0 && (
          <div className={`mt-2 flex gap-2 overflow-x-auto rounded-2xl ${tried && !slot ? "ring-1 ring-[#ff5a5a]" : ""}`}>
            {timeSlots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`h-10 shrink-0 rounded-full border px-4 text-[14px] transition ${
                  slot === s ? "border-transparent bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "border-line text-ink/75"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Pourboire */}
      {mode === "delivery" && (
        <Card title="Pourboire au livreur">
          <div className="grid grid-cols-4 gap-2">
            {TIPS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTip(r)}
                aria-pressed={tip === r}
                className={`flex h-14 flex-col items-center justify-center rounded-2xl text-[15px] transition ${
                  tip === r ? "bg-[#151515] text-white dark:bg-white dark:text-[#151515]" : "bg-bg text-ink/80"
                }`}
              >
                {r === 0 ? "Aucun" : `${Math.round(r * 100)} %`}
                {r > 0 && <span className="text-[11px] opacity-60">{price(subtotal * r)}</span>}
              </button>
            ))}
          </div>
        </Card>
      )}

      <label className="mt-7 flex cursor-pointer items-start gap-3 px-1 text-[16px] leading-snug text-ink/75">
        <input type="checkbox" className="sr-only" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <Checkbox checked={terms} invalid={tried && !terms} />
        J’accepte les conditions de vente et la politique de confidentialité
      </label>

      {/* Total */}
      <section className="mt-8 rounded-[26px] bg-surface p-4">
        <button type="button" onClick={() => setDetails((d) => !d)} className="flex w-full items-center justify-between px-1 text-left">
          <span>
            <span className="block text-[18px] font-medium">Montant total</span>
            <span className="mt-0.5 flex items-center gap-1 text-[14px] text-ink/70">
              {details ? "Masquer le détail" : "Voir le détail"}
              <ChevronDown className={`size-4 transition ${details ? "rotate-180" : ""}`} />
            </span>
          </span>
          <span className="text-[22px] font-medium">{price(t.total)}</span>
        </button>

        {details && (
          <dl className="mt-4 space-y-2 border-t border-line px-1 pt-4 text-[14px] text-muted">
            {lines.map((l) => (
              <div key={l.key} className="flex justify-between gap-4">
                <dt className="truncate">
                  {l.qty} × {l.product.name}
                </dt>
                <dd className="shrink-0 text-ink">{price(l.qty * l.unit)}</dd>
              </div>
            ))}
            {mode === "delivery" && (
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd className={t.delivery === 0 ? "text-brand" : "text-ink"}>{t.delivery === 0 ? "Offerte" : price(t.delivery)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>{SITE.taxLabel}</dt>
              <dd className="text-ink">{price(t.taxes)}</dd>
            </div>
            {t.tip > 0 && (
              <div className="flex justify-between">
                <dt>Pourboire</dt>
                <dd className="text-ink">{price(t.tip)}</dd>
              </div>
            )}
          </dl>
        )}

        <button
          type="button"
          onClick={submit}
          className="mt-4 flex h-[60px] w-full items-center justify-center rounded-full bg-[#151515] text-[17px] font-medium text-white ring-1 ring-transparent transition active:scale-[0.98] dark:bg-surface-2 dark:ring-line"
        >
          Passer la commande
        </button>
        {tried && !valid && <p className="mt-3 text-center text-[13px] text-[#ff5a5a]">Complétez les champs en rouge pour continuer.</p>}
      </section>
    </main>
  );
}
