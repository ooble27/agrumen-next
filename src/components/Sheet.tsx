"use client";

import { useEffect } from "react";

/** Panneau qui monte du bas (mobile), centré sur ordinateur. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center" role="dialog" aria-modal aria-label={title}>
      <button type="button" aria-label="Fermer" onClick={onClose} className="backdrop absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
      <div className="sheet relative w-full max-w-[480px] rounded-t-[32px] bg-bg px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 lg:rounded-[32px] lg:pb-6">
        <div className="mx-auto h-[5px] w-10 rounded-full bg-ink/15 lg:hidden" />
        <p className="mt-4 px-1 text-[20px] font-medium">{title}</p>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
