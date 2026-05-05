"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Bell,
  Mail,
  Moon,
  LogOut,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  RotateCcw,
  Package,
  Home,
  LayoutGrid,
  Heart,
  User,
  Sprout,
  Phone,
  Edit3,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";

/* ─── Types ───────────────────────────────────────────────── */
type TabId = "commandes" | "profil" | "adresses" | "parametres";

type OrderStatus = "En route" | "Livré" | "En préparation" | "Annulé";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  isDefault: boolean;
}

/* ─── Mock data ───────────────────────────────────────────── */
const MOCK_ORDERS: Order[] = [
  {
    id: "AGR-2047",
    date: "3 mai 2026",
    status: "En route",
    address: "12 Rue Carnot, Dakar",
    items: [
      { name: "Mangues Kent", qty: 2, price: 1080 },
      { name: "Tomates cerise", qty: 1, price: 850 },
      { name: "Carottes bio", qty: 3, price: 600 },
    ],
    total: 4710,
  },
  {
    id: "AGR-2031",
    date: "28 avr. 2026",
    status: "Livré",
    address: "12 Rue Carnot, Dakar",
    items: [
      { name: "Fonio", qty: 1, price: 1500 },
      { name: "Gingembre frais", qty: 1, price: 1000 },
    ],
    total: 2500,
  },
  {
    id: "AGR-2018",
    date: "20 avr. 2026",
    status: "Livré",
    address: "45 Av. Cheikh Anta Diop, Dakar",
    items: [
      { name: "Riz Jasmine", qty: 5, price: 650 },
      { name: "Oignons violets", qty: 2, price: 550 },
      { name: "Piment rouge", qty: 1, price: 500 },
    ],
    total: 5350,
  },
  {
    id: "AGR-1995",
    date: "12 avr. 2026",
    status: "En préparation",
    address: "12 Rue Carnot, Dakar",
    items: [
      { name: "Pastèques", qty: 2, price: 255 },
      { name: "Bananes", qty: 3, price: 750 },
    ],
    total: 2760,
  },
  {
    id: "AGR-1972",
    date: "5 avr. 2026",
    status: "Annulé",
    address: "12 Rue Carnot, Dakar",
    items: [{ name: "Maïs doux", qty: 6, price: 250 }],
    total: 1500,
  },
];

const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Domicile",
    street: "12 Rue Carnot",
    city: "Dakar, Plateau",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Bureau",
    street: "45 Av. Cheikh Anta Diop",
    city: "Dakar, Université",
    isDefault: false,
  },
];

/* ─── Status helpers ──────────────────────────────────────── */
const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; border: string; icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }> }
> = {
  "En route": {
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    icon: Truck,
  },
  Livré: {
    color: "#16A34A",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    icon: CheckCircle2,
  },
  "En préparation": {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: Clock,
  },
  Annulé: {
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: XCircle,
  },
};

/* ─── Tab definitions ─────────────────────────────────────── */
const TABS: { id: TabId; label: string }[] = [
  { id: "commandes", label: "Commandes" },
  { id: "profil", label: "Profil" },
  { id: "adresses", label: "Adresses" },
  { id: "parametres", label: "Paramètres" },
];

/* ─── Order card ──────────────────────────────────────────── */
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]"
      style={{ borderLeft: `3px solid ${cfg.color}` }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 pt-4 pb-4 flex items-start justify-between gap-3 cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-black text-sm text-ink">
              #{order.id}
            </span>
            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                color: cfg.color,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
              }}
            >
              <StatusIcon size={9} strokeWidth={2.5} />
              {order.status}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">{order.date}</p>
          <p className="text-xs text-muted truncate mt-0.5">
            <MapPin
              size={9}
              className="inline mr-0.5 -mt-px"
              strokeWidth={2}
            />
            {order.address}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="font-display font-black text-sm text-ink">
            {formatPrice(order.total)}
          </span>
          <span className="text-muted">
            {expanded ? (
              <ChevronUp size={15} strokeWidth={2} />
            ) : (
              <ChevronDown size={15} strokeWidth={2} />
            )}
          </span>
        </div>
      </button>

      {/* Expandable items */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#F0F4F0]">
              <ul className="mt-3 space-y-2">
                {order.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-ink/70">
                      <span className="font-bold text-ink">{item.qty}×</span>{" "}
                      {item.name}
                    </span>
                    <span className="font-semibold text-ink">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t border-dashed border-[#E0E8E0] flex items-center justify-between">
                <span className="text-xs font-bold text-muted">Total</span>
                <span className="font-display font-black text-sm text-ink">
                  {formatPrice(order.total)}
                </span>
              </div>

              {/* Reorder button for delivered */}
              {order.status === "Livré" && (
                <button
                  className="mt-3 w-full flex items-center justify-center gap-2 h-10 rounded-xl
                             bg-[#0E2A0E] text-[#C5F135] text-xs font-display font-bold cursor-pointer
                             hover:bg-[#1a4a1a] transition-colors active:scale-[0.98]"
                >
                  <RotateCcw size={13} strokeWidth={2.5} />
                  Commander à nouveau
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Profile tab ─────────────────────────────────────────── */
function ProfileTab() {
  const [form, setForm] = useState({
    nom: "Mohamed Agrumen",
    telephone: "+221 77 123 45 67",
    ville: "Dakar",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Avatar change */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "#0E2A0E" }}
          >
            <span
              className="font-display font-black text-2xl"
              style={{ color: "#C5F135" }}
            >
              MA
            </span>
          </div>
          <button
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full
                       bg-[#C5F135] flex items-center justify-center cursor-pointer
                       shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#9DC22A] transition-colors"
            aria-label="Changer la photo"
          >
            <Camera size={14} strokeWidth={2.5} className="text-[#070E07]" />
          </button>
        </div>
        <p className="text-xs text-muted">Appuyer pour changer la photo</p>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {[
          {
            key: "nom" as const,
            label: "Nom complet",
            icon: User,
            type: "text",
            placeholder: "Votre nom",
          },
          {
            key: "telephone" as const,
            label: "Téléphone",
            icon: Phone,
            type: "tel",
            placeholder: "+221 77 000 00 00",
          },
          {
            key: "ville" as const,
            label: "Ville",
            icon: MapPin,
            type: "text",
            placeholder: "Votre ville",
          },
        ].map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-bold text-ink/60 uppercase tracking-wider">
              {label}
            </label>
            <div className="relative">
              <Icon
                size={15}
                strokeWidth={2}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                type={type}
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E0E8E0]
                           bg-white text-sm text-ink placeholder:text-muted/50
                           outline-none focus:border-[#C5F135] focus:ring-2 focus:ring-[#C5F135]/20
                           transition-all duration-200 font-medium"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className={cn(
          "w-full h-12 rounded-xl font-display font-black text-sm cursor-pointer",
          "flex items-center justify-center gap-2 transition-all duration-300",
          saved
            ? "bg-green-500 text-white"
            : "bg-[#C5F135] text-[#070E07] hover:bg-[#9DC22A] lime-glow"
        )}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <Check size={15} strokeWidth={2.5} />
              Enregistré !
            </motion.span>
          ) : (
            <motion.span
              key="save"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <Edit3 size={14} strokeWidth={2.5} />
              Enregistrer les modifications
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/* ─── Addresses tab ───────────────────────────────────────── */
function AddressesTab() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] relative overflow-hidden"
        >
          {addr.isDefault && (
            <span
              className="absolute top-3 right-3 flex items-center gap-1
                         px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                color: "#16A34A",
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
              }}
            >
              <Check size={9} strokeWidth={3} />
              Défaut
            </span>
          )}

          <div className="flex items-start gap-3 pr-16">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#F2F6F2" }}
            >
              <MapPin size={16} strokeWidth={2} className="text-[#0E2A0E]" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-black text-sm text-ink">
                {addr.label}
              </p>
              <p className="text-xs text-muted mt-0.5">{addr.street}</p>
              <p className="text-xs text-muted">{addr.city}</p>
            </div>
          </div>

          {!addr.isDefault && (
            <button
              onClick={() => setDefault(addr.id)}
              className="mt-3 text-xs font-bold text-[#0E2A0E] cursor-pointer
                         hover:text-[#1a4a1a] transition-colors flex items-center gap-1"
            >
              <Check size={11} strokeWidth={2.5} />
              Définir par défaut
            </button>
          )}
        </div>
      ))}

      {/* Add address */}
      <button
        className="w-full h-13 rounded-2xl border-2 border-dashed border-[#C5F135]/50
                   flex items-center justify-center gap-2 cursor-pointer
                   text-[#0E2A0E] font-display font-bold text-sm
                   hover:border-[#C5F135] hover:bg-[#C5F135]/5 transition-all duration-200"
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: "#C5F135" }}
        >
          <Plus size={13} strokeWidth={2.5} className="text-[#070E07]" />
        </div>
        Ajouter une adresse
      </button>
    </div>
  );
}

/* ─── Settings tab ────────────────────────────────────────── */
function SettingsTab() {
  const [toggles, setToggles] = useState({
    pushNotifs: true,
    emailNotifs: false,
    darkMode: false,
  });

  const flip = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const rows: {
    key: keyof typeof toggles;
    label: string;
    sublabel: string;
    icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>;
  }[] = [
    {
      key: "pushNotifs",
      label: "Notifications push",
      sublabel: "Livraisons, promotions, nouveautés",
      icon: Bell,
    },
    {
      key: "emailNotifs",
      label: "Notifications email",
      sublabel: "Récapitulatifs et offres exclusives",
      icon: Mail,
    },
    {
      key: "darkMode",
      label: "Mode sombre",
      sublabel: "Activer le thème sombre de l'app",
      icon: Moon,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Toggle rows */}
      {rows.map(({ key, label, sublabel, icon: Icon }) => (
        <div
          key={key}
          className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3
                     shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#F2F6F2" }}
          >
            <Icon size={16} strokeWidth={1.8} className="text-[#0E2A0E]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-sm text-ink">{label}</p>
            <p className="text-xs text-muted mt-0.5 truncate">{sublabel}</p>
          </div>
          {/* Toggle */}
          <button
            role="switch"
            aria-checked={toggles[key]}
            onClick={() => flip(key)}
            className={cn(
              "relative w-11 h-6 rounded-full shrink-0 cursor-pointer transition-colors duration-300",
              toggles[key] ? "bg-[#C5F135]" : "bg-[#D1D5DB]"
            )}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white",
                "shadow-[0_1px_4px_rgba(0,0,0,0.2)]",
                toggles[key] ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>
      ))}

      {/* Divider */}
      <div className="pt-2" />

      {/* Logout */}
      <button
        className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 cursor-pointer
                   bg-red-50 border border-red-100 text-red-600
                   font-display font-bold text-sm
                   hover:bg-red-100 transition-colors active:scale-[0.98]"
      >
        <LogOut size={15} strokeWidth={2} />
        Déconnexion
      </button>

      <p className="text-center text-[10px] text-muted pt-2">
        Agrumen v1.0.0 · Fait avec amour au Sénégal
      </p>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function ComptePage() {
  const [activeTab, setActiveTab] = useState<TabId>("commandes");

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Dark hero section ─────────────────────────────── */}
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse at 30% -20%, #1F5C20 0%, #0C230C 40%, #070E07 75%)",
        }}
      >
        {/* Floating header */}
        <header className="sticky top-0 z-40 px-4 pt-3 pb-2">
          <div className="glass rounded-2xl px-4 h-13 flex items-center justify-between max-w-xl mx-auto">
            <Link href="/marche">
              <button
                className="w-9 h-9 rounded-xl glass flex items-center justify-center
                           cursor-pointer hover:bg-white/10 transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft size={17} strokeWidth={2.5} className="text-white" />
              </button>
            </Link>

            <span className="font-display font-black text-sm text-white tracking-tight">
              Mon compte
            </span>

            {/* Logo mark */}
            <div className="w-9 h-9 rounded-xl bg-[#C5F135] flex items-center justify-center">
              <Sprout size={16} strokeWidth={2.5} className="text-[#070E07]" />
            </div>
          </div>
        </header>

        {/* Profile section */}
        <div className="px-4 pt-6 pb-8 max-w-xl mx-auto">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center
                           ring-4 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                style={{ background: "#0E2A0E" }}
              >
                <span
                  className="font-display font-black text-3xl"
                  style={{ color: "#C5F135" }}
                >
                  MA
                </span>
              </div>
              {/* Online dot */}
              <span
                className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-400
                           ring-2 ring-canvas"
              />
            </div>

            <div className="text-center">
              <h1 className="font-display font-black text-xl text-white tracking-tight">
                Mohamed Agrumen
              </h1>
              <p className="text-sm text-white/45 mt-0.5">
                m.agrumen@gmail.com
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mt-7">
            {[
              { label: "Commandes", value: "14", sub: "total" },
              { label: "Points fidélité", value: "2 340", sub: "pts" },
              { label: "Économisé", value: formatPrice(12500), sub: "ce mois" },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="glass rounded-2xl p-3 flex flex-col items-center text-center gap-1"
              >
                <span className="font-display font-black text-lg text-white leading-none">
                  {value}
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider leading-none">
                  {sub}
                </span>
                <span className="text-[10px] text-white/55 leading-tight mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab bar (sticky, glass, on dark) ────────────── */}
        <div className="sticky top-[68px] z-30 px-4 pb-4 max-w-xl mx-auto">
          <div className="glass rounded-2xl p-1 flex gap-1 overflow-x-auto no-scroll">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 shrink-0 min-w-fit px-3 py-2 rounded-xl text-xs font-display font-bold",
                    "cursor-pointer transition-all duration-200 whitespace-nowrap min-h-[40px]",
                    active
                      ? "bg-[#C5F135] text-[#070E07] lime-glow"
                      : "text-white/55 hover:text-white hover:bg-white/8"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content surface ───────────────────────────────── */}
      <section className="bg-surface rounded-t-3xl -mt-2 relative z-10 min-h-screen">
        <div className="max-w-xl mx-auto px-4 pt-6 pb-32">
          <AnimatePresence mode="wait">
            {/* COMMANDES */}
            {activeTab === "commandes" && (
              <motion.div
                key="commandes"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                {/* Section header */}
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display font-black text-base text-ink">
                    Mes commandes
                  </h2>
                  <span className="text-xs text-muted font-medium">
                    {MOCK_ORDERS.length} commandes
                  </span>
                </div>

                {MOCK_ORDERS.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </motion.div>
            )}

            {/* PROFIL */}
            {activeTab === "profil" && (
              <motion.div
                key="profil"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-5">
                  <h2 className="font-display font-black text-base text-ink">
                    Mon profil
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Modifiez vos informations personnelles
                  </p>
                </div>
                <ProfileTab />
              </motion.div>
            )}

            {/* ADRESSES */}
            {activeTab === "adresses" && (
              <motion.div
                key="adresses"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-5">
                  <h2 className="font-display font-black text-base text-ink">
                    Mes adresses
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Gérez vos adresses de livraison
                  </p>
                </div>
                <AddressesTab />
              </motion.div>
            )}

            {/* PARAMETRES */}
            {activeTab === "parametres" && (
              <motion.div
                key="parametres"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-5">
                  <h2 className="font-display font-black text-base text-ink">
                    Paramètres
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Préférences et compte
                  </p>
                </div>
                <SettingsTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Mobile bottom nav ─────────────────────────────── */}
      <nav
        className="fixed bottom-0 inset-x-0 md:hidden z-50
                   bg-canvas/90 backdrop-blur-xl border-t border-white/8 safe-b"
      >
        <div className="flex items-center justify-around px-2 pt-2">
          {[
            { icon: Home, label: "Accueil", href: "/" },
            { icon: LayoutGrid, label: "Marché", href: "/marche" },
            { icon: Heart, label: "Favoris", href: "/favoris" },
            { icon: User, label: "Compte", href: "/compte", active: true },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl cursor-pointer",
                "transition-colors min-h-[44px] justify-center",
                active
                  ? "text-[#C5F135]"
                  : "text-white/35 hover:text-white/60"
              )}
            >
              <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-bold font-display">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Empty state for orders if needed */}
      {activeTab === "commandes" && MOCK_ORDERS.length === 0 && (
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Package size={48} strokeWidth={1.2} className="text-muted mb-4" />
          <p className="font-display font-black text-ink text-lg">
            Aucune commande
          </p>
          <p className="text-muted text-sm mt-1">
            Vos commandes apparaîtront ici
          </p>
        </div>
      )}
    </div>
  );
}
