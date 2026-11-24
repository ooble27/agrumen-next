"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { haptic } from "@/lib/fx";

/** Ligne qu'on glisse vers la gauche pour la supprimer (comme sur iOS). */
export function SwipeRow({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  const [x, setX] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; base: number } | null>(null);
  const horizontal = useRef<boolean | null>(null);
  const OPEN = -92;

  const remove = () => {
    haptic(16);
    setLeaving(true);
    window.setTimeout(onDelete, 320);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[24px] transition-all duration-300"
      style={leaving ? { opacity: 0, maxHeight: 0, marginTop: -16 } : { maxHeight: 220 }}
    >
      <button
        type="button"
        onClick={remove}
        aria-label="Supprimer"
        className="absolute inset-y-0 right-0 flex w-[84px] flex-col items-center justify-center gap-1 rounded-[24px] bg-[#ff4d4d] text-[12px] font-medium text-white"
        style={{ opacity: Math.min(1, -x / 60) }}
      >
        <Trash2 className="size-5" strokeWidth={1.8} />
        Supprimer
      </button>
      <div
        className="relative bg-bg"
        style={{
          transform: `translateX(${leaving ? -420 : x}px)`,
          transition: dragging ? "none" : "transform .45s var(--ease-out)",
          touchAction: "pan-y",
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          start.current = { x: e.clientX, y: e.clientY, base: x };
          setDragging(true);
          horizontal.current = null;
        }}
        onPointerMove={(e) => {
          const s = start.current;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (horizontal.current === null && Math.abs(dx) + Math.abs(dy) > 8) horizontal.current = Math.abs(dx) > Math.abs(dy);
          if (!horizontal.current) return;
          setX(Math.max(-200, Math.min(0, s.base + dx)));
        }}
        onPointerUp={() => {
          if (!start.current) return;
          start.current = null;
          setDragging(false);
          if (x < -170) remove();
          else setX(x < OPEN / 2 ? OPEN : 0);
        }}
        onPointerCancel={() => {
          start.current = null;
          setDragging(false);
          setX(0);
        }}
      >
        {children}
      </div>
    </div>
  );
}
