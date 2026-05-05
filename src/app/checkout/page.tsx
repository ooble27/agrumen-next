"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  MapPin,
  Phone,
  User,
  Home,
  Smartphone,
  Wallet,
  Banknote,
  PackageCheck,
  Clock,
  Star,
  Leaf,
  Apple,
  Wheat,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */
interface CartItem {
  id: string;
  name: string;
  shop: string;
  price: number;
  qty: number;
  category: "fruits" | "legumes" | "cereales";
}

interface PaymentMethod {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  icon: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; className?: string }>;
  badge?: string;
}

/* ─── Mock cart data ─────────────────────────────────────── */
const CART_ITEMS: CartItem[] = [
  { id: "p1", name: "Tomates cerise", shop: "Ferme Dakar",    price: 850,  qty: 2, category: "legumes"  },
  { id: "p2", name: "Mangues Kent",   shop: "Verger Thiès",   price: 1080, qty: 1, category: "fruits"   },
  { id: "p3", name: "Fonio bio",      shop: "Grain du Sahel", price: 1500, qty: 1, category: "cereales" },
];

const DELIVERY_FEE_THRESHOLD = 2000;
const DELIVERY_FEE = 500;

const CITIES = [
  "Dakar", "Thiès", "Mbour", "Saint-Louis", "Ziguinchor", "Kaolack", "Touba",
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "wave",
    name: "Wave",
    subtitle: "Paiement instantané",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    icon: Smartphone,
    badge: "Populaire",
  },
  {
    id: "orange",
    name: "Orange Money",
    subtitle: "Paiement mobile",
    color: "#F97316",
    bgColor: "#FFF7ED",
    icon: Smartphone,
  },
  {
    id: "free",
    name: "Free Money",
    subtitle: "Paiement mobile",
    color: "#22C55E",
    bgColor: "#F0FDF4",
    icon: Smartphone,
  },
  {
    id: "cash",
    name: "Espèces",
    subtitle: "Paiement à la livraison",
    color: "#6B7280",
    bgColor: "#F9FAFB",
    icon: Banknote,
  },
];

/* ─── Category icon helper ───────────────────────────────── */
const CAT_META = {
  fruits:   { icon: Apple,  color: "#FB923C", gradFrom: "#431407", gradTo: "#1C0A02" },
  legumes:  { icon: Leaf,   color: "#4ADE80", gradFrom: "#052E16", gradTo: "#021408" },
  cereales: { icon: Wheat,  color: "#FCD34D", gradFrom: "#451A03", gradTo: "#1C0A00" },
};

function ItemImage({ category }: { category: CartItem["category"] }) {
  const meta = CAT_META[category];
  const Icon = meta.icon;
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
      style={{ background: `linear-gradient(135deg, ${meta.gradFrom} 0%, ${meta.gradTo} 100%)` }}
    >
      <Icon size={22} strokeWidth={1.8} style={{ color: meta.color }} />
    </div>
  );
}

/* ─── Step indicator ─────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Livraison" },
  { id: 2, label: "Paiement"  },
  { id: 3, label: "Confirmation" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-3">
      {STEPS.map((step, idx) => {
        const done   = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            {/* Dot + label */}
            <div className="flex flex-col items-center gap-1.5 relative">
              <motion.div
                animate={{
                  backgroundColor: done
                    ? "#C5F135"
                    : active
                    ? "#C5F135"
                    : "rgba(255,255,255,0.12)",
                  scale: active ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-7 h-7 rounded-full flex items-center justify-center relative z-10"
              >
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    >
                      <Check size={13} strokeWidth={3} className="text-[#070E07]" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="num"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "text-[11px] font-black font-display",
                        active ? "text-[#070E07]" : "text-white/40"
                      )}
                    >
                      {step.id}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Lime glow ring for active */}
                {active && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 0 4px rgba(197,241,53,0.25)" }}
                  />
                )}
              </motion.div>

              <span
                className={cn(
                  "text-[10px] font-bold font-display tracking-wide whitespace-nowrap",
                  active ? "text-[#C5F135]" : done ? "text-white/60" : "text-white/30"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {idx < STEPS.length - 1 && (
              <div className="relative w-16 sm:w-24 h-[2px] mx-2 mb-5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#C5F135]"
                  initial={{ width: "0%" }}
                  animate={{ width: current > step.id ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Order recap (shared) ──────────────────────────────── */
function OrderRecap({ subtotal, deliveryFee }: { subtotal: number; deliveryFee: number }) {
  const total = subtotal + deliveryFee;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h3 className="font-display text-sm font-black text-ink mb-3">Récapitulatif</h3>

      {/* Items */}
      <div className="flex flex-col gap-3 mb-4">
        {CART_ITEMS.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <ItemImage category={item.category} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink font-display truncate">{item.name}</p>
              <p className="text-xs text-muted">{item.shop} · ×{item.qty}</p>
            </div>
            <span className="text-sm font-black font-display text-ink shrink-0">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#E0E8E0] pt-3 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Sous-total</span>
          <span className="font-bold text-ink font-display">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Livraison</span>
          {deliveryFee === 0 ? (
            <span className="font-bold text-green-600 font-display">Gratuite</span>
          ) : (
            <span className="font-bold text-ink font-display">{formatPrice(deliveryFee)}</span>
          )}
        </div>
        {deliveryFee === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 bg-green-50 rounded-xl px-3 py-2"
          >
            <Check size={12} className="text-green-600" strokeWidth={2.5} />
            <span className="text-xs text-green-700 font-medium">
              Livraison offerte dès 2 000 F
            </span>
          </motion.div>
        )}
        <div className="flex justify-between items-center pt-1 border-t border-[#E0E8E0] mt-1">
          <span className="font-display font-black text-sm text-ink">Total</span>
          <span className="font-display font-black text-lg text-ink">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1 — Livraison ─────────────────────────────────── */
interface DeliveryForm {
  full_name: string;
  phone: string;
  address: string;
  city: string;
}

function isFormComplete(f: DeliveryForm) {
  return f.full_name.trim().length >= 2 &&
    f.phone.trim().length >= 9 &&
    f.address.trim().length >= 5 &&
    f.city !== "";
}

function StepLivraison({
  form,
  setForm,
}: {
  form: DeliveryForm;
  setForm: React.Dispatch<React.SetStateAction<DeliveryForm>>;
}) {
  const inputClass =
    "w-full bg-white rounded-xl px-4 py-3.5 border border-[#E0E8E0] text-ink text-sm " +
    "outline-none focus:border-[#0E2A0E]/30 focus:ring-2 focus:ring-[#C5F135]/20 " +
    "transition-all duration-200 font-sans placeholder:text-muted/60";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col gap-4"
    >
      {/* Delivery badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3.5 py-2 rounded-full">
          <Clock size={13} className="text-green-600" strokeWidth={2.5} />
          <span className="text-xs font-bold text-green-700 font-display">
            Livraison dans 2-4h
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#F0F9FF] border border-blue-100 px-3 py-2 rounded-full">
          <ShieldCheck size={13} className="text-blue-500" strokeWidth={2} />
          <span className="text-xs font-semibold text-blue-600">Sécurisé</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col gap-4">
        <h3 className="font-display text-sm font-black text-ink">Adresse de livraison</h3>

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted font-display uppercase tracking-wide">
            Nom complet
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Mamadou Diallo"
              className={cn(inputClass, "pl-10")}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted font-display uppercase tracking-wide">
            Téléphone
          </label>
          <div className="relative">
            <Phone
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+221 77 000 00 00"
              className={cn(inputClass, "pl-10")}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted font-display uppercase tracking-wide">
            Adresse
          </label>
          <div className="relative">
            <Home
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Rue 10, Médina, Dakar"
              className={cn(inputClass, "pl-10")}
            />
          </div>
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted font-display uppercase tracking-wide">
            Ville
          </label>
          <div className="relative">
            <MapPin
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              strokeWidth={2}
            />
            <select
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className={cn(
                inputClass,
                "pl-10 pr-10 appearance-none cursor-pointer",
                form.city === "" ? "text-muted/60" : "text-ink"
              )}
            >
              <option value="" disabled>Choisir une ville</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex items-center gap-3 px-1">
        {[
          { icon: Leaf,  text: "Produits frais" },
          { icon: Star,  text: "4.9 · 2 400 avis" },
          { icon: Clock, text: "2-4h garantis" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <Icon size={12} className="text-muted" strokeWidth={2} />
            <span className="text-xs text-muted">{text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Step 2 — Paiement ─────────────────────────────────── */
function StepPaiement({
  selected,
  onSelect,
  subtotal,
  deliveryFee,
}: {
  selected: string;
  onSelect: (id: string) => void;
  subtotal: number;
  deliveryFee: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col gap-4"
    >
      {/* Payment methods */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h3 className="font-display text-sm font-black text-ink mb-3">Mode de paiement</h3>

        <div className="flex flex-col gap-2.5">
          {PAYMENT_METHODS.map(method => {
            const Icon = method.icon;
            const isSelected = selected === method.id;
            return (
              <motion.button
                key={method.id}
                onClick={() => onSelect(method.id)}
                whileTap={{ scale: 0.98 }}
                animate={{
                  borderColor: isSelected ? "#C5F135" : "#E0E8E0",
                  backgroundColor: isSelected ? "#FAFFF0" : "#FFFFFF",
                }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "relative flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left cursor-pointer",
                  "transition-shadow duration-200",
                  isSelected ? "shadow-[0_0_0_0px_rgba(197,241,53,0.3)]" : ""
                )}
                style={{
                  borderColor: isSelected ? "#C5F135" : "#E0E8E0",
                  backgroundColor: isSelected ? "#FAFFF0" : "#FFFFFF",
                  boxShadow: isSelected ? "0 0 0 4px rgba(197,241,53,0.12), 0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {/* Icon square */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: method.bgColor }}
                >
                  <Icon size={22} strokeWidth={1.8} style={{ color: method.color }} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-black text-ink">{method.name}</span>
                    {method.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5F135] text-[#070E07] font-display">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">{method.subtitle}</p>
                </div>

                {/* Checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                      className="w-6 h-6 rounded-full bg-[#C5F135] flex items-center justify-center shrink-0"
                    >
                      <Check size={12} strokeWidth={3} className="text-[#070E07]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Order recap */}
      <OrderRecap subtotal={subtotal} deliveryFee={deliveryFee} />
    </motion.div>
  );
}

/* ─── Step 3 — Confirmation ─────────────────────────────── */
function StepConfirmation({
  orderNumber,
  form,
  paymentId,
  subtotal,
  deliveryFee,
}: {
  orderNumber: string;
  form: DeliveryForm;
  paymentId: string;
  subtotal: number;
  deliveryFee: number;
}) {
  const total = subtotal + deliveryFee;
  const payment = PAYMENT_METHODS.find(m => m.id === paymentId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col gap-5"
    >
      {/* Big success animation */}
      <div className="flex flex-col items-center py-8 gap-5">
        {/* Animated ring + check */}
        <div className="relative">
          {/* Outer pulse ring */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(197,241,53,0.18)", margin: "-16px" }}
          />
          {/* Middle ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ background: "rgba(197,241,53,0.12)", border: "2px solid rgba(197,241,53,0.25)" }}
          >
            {/* Inner circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 24, delay: 0.2 }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "#C5F135" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 26, delay: 0.35 }}
              >
                <Check size={36} strokeWidth={3} className="text-[#070E07]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="text-center"
        >
          <p className="font-display text-2xl font-black text-ink leading-tight">
            Commande confirmée !
          </p>
          <p className="text-sm text-muted mt-1.5 max-w-[240px] mx-auto">
            Vos produits frais sont en préparation et seront livrés dans 2-4h
          </p>
        </motion.div>

        {/* Order number pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 400, damping: 26 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{ background: "#C5F135" }}
        >
          <PackageCheck size={15} className="text-[#070E07]" strokeWidth={2.5} />
          <span className="font-display text-sm font-black text-[#070E07] tracking-wide">
            #{orderNumber}
          </span>
        </motion.div>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      >
        {/* Header stripe */}
        <div className="px-5 py-3.5 bg-[#F2F6F2] border-b border-[#E0E8E0]">
          <p className="font-display text-xs font-black text-muted uppercase tracking-widest">
            Détails de la commande
          </p>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {/* Items */}
          {CART_ITEMS.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <ItemImage category={item.category} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink font-display truncate">{item.name}</p>
                <p className="text-xs text-muted">×{item.qty}</p>
              </div>
              <span className="text-sm font-black font-display text-ink">
                {formatPrice(item.price * item.qty)}
              </span>
            </div>
          ))}

          <div className="border-t border-[#E0E8E0] pt-3 mt-1 flex flex-col gap-2">
            {/* Delivery info */}
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-muted mt-0.5 shrink-0" strokeWidth={2} />
              <div>
                <p className="text-xs font-bold text-ink">{form.full_name} · {form.phone}</p>
                <p className="text-xs text-muted">{form.address}, {form.city}</p>
              </div>
            </div>

            {/* Payment info */}
            {payment && (
              <div className="flex items-center gap-2">
                <Wallet size={14} className="text-muted shrink-0" strokeWidth={2} />
                <p className="text-xs text-muted">Paiement via <span className="font-bold text-ink">{payment.name}</span></p>
              </div>
            )}

            {/* Total row */}
            <div className="flex justify-between items-center pt-1.5 border-t border-[#E0E8E0] mt-1">
              <span className="font-display text-sm font-black text-ink">Total payé</span>
              <span className="font-display text-lg font-black text-ink">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-2.5 pb-2"
      >
        <button
          className="w-full py-4 rounded-2xl font-display font-black text-sm
                     bg-[#0E2A0E] text-[#C5F135] cursor-pointer hover:bg-[#1a4a1a]
                     transition-colors active:scale-[0.98] flex items-center justify-center gap-2.5
                     shadow-[0_4px_16px_rgba(14,42,14,0.25)]"
        >
          <PackageCheck size={17} strokeWidth={2.5} />
          Suivre ma commande
        </button>

        <Link href="/marche" className="w-full">
          <button
            className="w-full py-3.5 rounded-2xl font-display font-black text-sm
                       bg-[#F2F6F2] text-ink cursor-pointer hover:bg-[#E0E8E0]
                       transition-colors active:scale-[0.98]"
          >
            Retour au marché
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DeliveryForm>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [orderNumber] = useState(() =>
    "AGR-" + Math.floor(100000 + Math.random() * 900000)
  );

  /* Cart calculations */
  const subtotal    = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + deliveryFee;

  /* CTA state */
  const canContinue = step === 1 ? isFormComplete(form) : step === 2 ? !!paymentMethod : false;

  const handleCTA = () => {
    if (step < 3) setStep(s => s + 1);
  };

  const ctaLabel = step === 1
    ? "Choisir le paiement"
    : step === 2
    ? "Confirmer la commande"
    : null;

  /* Scroll to top on step change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="min-h-screen bg-canvas pb-32">

      {/* ── Floating header ──────────────────────────────── */}
      <header className="fixed top-3 left-3 right-3 z-50">
        <div className="glass rounded-2xl px-4 h-14 flex items-center justify-between max-w-lg mx-auto">
          {/* Back */}
          <Link
            href={step > 1 ? "#" : "/marche"}
            onClick={e => {
              if (step > 1 && step < 3) {
                e.preventDefault();
                setStep(s => s - 1);
              }
            }}
          >
            <motion.button
              whileTap={{ scale: 0.88 }}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                step === 3
                  ? "opacity-0 pointer-events-none"
                  : "bg-white/10 hover:bg-white/15 text-white/80"
              )}
              aria-label="Retour"
            >
              <ArrowLeft size={17} strokeWidth={2.5} />
            </motion.button>
          </Link>

          {/* Title */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="font-display font-black text-sm text-white tracking-tight"
              >
                {step === 1 ? "Commander" : step === 2 ? "Paiement" : "Confirmation"}
              </motion.p>
            </AnimatePresence>
            <p className="text-[10px] text-white/40 font-medium -mt-0.5">
              Étape {step} / 3
            </p>
          </div>

          {/* Spacer (right) */}
          <div className="w-9" />
        </div>
      </header>

      {/* ── Progress stepper ─────────────────────────────── */}
      <div className="fixed top-[68px] left-0 right-0 z-40 bg-canvas/95 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto">
          <StepIndicator current={step} />
        </div>
      </div>

      {/* ── Light surface ────────────────────────────────── */}
      <div className="pt-[148px]">
        <div
          className="bg-surface rounded-t-3xl min-h-[calc(100vh-148px)] relative"
        >
          {/* Decorative gradient top */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{ background: "linear-gradient(90deg, #C5F135 0%, #22C55E 50%, #C5F135 100%)" }}
          />

          <div className="max-w-lg mx-auto px-4 pt-6 pb-36">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepLivraison key="step1" form={form} setForm={setForm} />
              )}
              {step === 2 && (
                <StepPaiement
                  key="step2"
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                />
              )}
              {step === 3 && (
                <StepConfirmation
                  key="step3"
                  orderNumber={orderNumber}
                  form={form}
                  paymentId={paymentMethod}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Fixed bottom CTA ─────────────────────────────── */}
      <AnimatePresence>
        {step < 3 && (
          <motion.div
            key="cta-bar"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="fixed bottom-0 inset-x-0 z-50"
          >
            {/* Backdrop blur gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/95 to-transparent pointer-events-none" />

            <div className="relative max-w-lg mx-auto px-4 pb-6 pt-4 safe-b">
              {/* Price summary row */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-muted">Total</span>
                  {deliveryFee === 0 && (
                    <span className="text-[10px] text-green-600 font-bold">· livraison offerte</span>
                  )}
                </div>
                <motion.span
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-display font-black text-lg text-ink"
                >
                  {formatPrice(total)}
                </motion.span>
              </div>

              {/* CTA button */}
              <motion.button
                whileTap={canContinue ? { scale: 0.97 } : {}}
                onClick={handleCTA}
                disabled={!canContinue}
                className={cn(
                  "w-full py-4 rounded-2xl font-display font-black text-sm",
                  "flex items-center justify-center gap-2.5 transition-all duration-300",
                  "relative overflow-hidden",
                  canContinue
                    ? "bg-[#C5F135] text-[#070E07] cursor-pointer shadow-[0_8px_32px_rgba(197,241,53,0.35)] hover:shadow-[0_12px_40px_rgba(197,241,53,0.45)]"
                    : "bg-[#E0E8E0] text-[#6B8A6B] cursor-not-allowed"
                )}
              >
                {/* Shimmer on enabled */}
                {canContinue && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                  />
                )}

                <span className="relative z-10">
                  {ctaLabel}
                </span>

                {canContinue && (
                  <motion.div
                    className="relative z-10 w-6 h-6 rounded-lg bg-[#0E2A0E] flex items-center justify-center"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowLeft size={12} strokeWidth={2.5} className="text-[#C5F135] rotate-180" />
                  </motion.div>
                )}
              </motion.button>

              {/* Disabled helper */}
              <AnimatePresence>
                {!canContinue && step === 1 && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-center text-xs text-muted mt-2 overflow-hidden"
                  >
                    Remplissez tous les champs pour continuer
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
