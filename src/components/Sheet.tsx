"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Zone réellement visible de l'écran (sans le clavier iOS).
 * Le panneau s'y cale pour ne jamais laisser voir la page derrière le clavier.
 */
function useVisualViewport(active: boolean) {
  const [vv, setVv] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    const v = window.visualViewport;
    if (!active || !v) return;
    const update = () => setVv({ top: v.offsetTop, height: v.height });
    update();
    v.addEventListener("resize", update);
    v.addEventListener("scroll", update);
    return () => {
      v.removeEventListener("resize", update);
      v.removeEventListener("scroll", update);
      setVv(null);
    };
  }, [active]);
  return vv;
}

/** Panneau qui monte du bas (mobile), centré sur ordinateur. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const vv = useVisualViewport(open);

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
  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal aria-label={title}>
      {/* fond assombri : couvre tout l'écran, clavier compris */}
      <button type="button" aria-label="Fermer" onClick={onClose} className="backdrop absolute inset-x-0 top-0 h-[200lvh] bg-black/50" />
      <div
        className="absolute inset-x-0 flex items-end justify-center lg:items-center"
        style={vv ? { top: vv.top, height: vv.height } : { top: 0, bottom: 0 }}
      >
        <div className="sheet relative flex max-h-[calc(100%-env(safe-area-inset-top)-12px)] w-full max-w-[480px] flex-col rounded-t-[32px] bg-bg shadow-[0_-10px_40px_-20px_rgba(0,0,0,.4)] lg:max-h-[90dvh] lg:rounded-[32px]">
          {/* prolonge le fond sous le panneau (derrière le clavier ou la barre d'accueil) */}
          <span aria-hidden className="absolute inset-x-0 top-full h-[100lvh] bg-bg lg:hidden" />
          <div className="shrink-0 px-5 pt-3">
            <div className="mx-auto h-[5px] w-10 rounded-full bg-ink/15 lg:hidden" />
            <p className="mt-4 px-1 text-[20px] font-medium">{title}</p>
          </div>
          <div className="mt-3 min-h-0 overflow-y-auto overscroll-contain px-5 pb-[max(20px,env(safe-area-inset-bottom))] lg:pb-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
