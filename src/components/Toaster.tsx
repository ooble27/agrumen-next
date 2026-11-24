"use client";

import Image from "next/image";
import { dismissToast, useToasts } from "@/lib/fx";

/** Toast flottant façon app native, au-dessus de la barre du bas. */
export function Toaster() {
  const toasts = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[max(12px,env(safe-area-inset-top))] z-[60] flex justify-center px-4 lg:top-[92px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="sheet pointer-events-auto flex w-full max-w-[400px] items-center gap-3 rounded-[22px] bg-[#151515]/95 p-2 pr-3 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl [animation-name:toast-in] dark:bg-white/95 dark:text-[#151515]"
        >
          {t.image && (
            <span className="relative grid size-11 shrink-0 place-items-center rounded-[14px] bg-white/10 dark:bg-black/5">
              <Image src={t.image} alt="" width={40} height={40} className="size-9 object-contain" />
            </span>
          )}
          <p className="min-w-0 flex-1 truncate text-[14px]">{t.title}</p>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action?.run();
                dismissToast(t.id);
              }}
              className="shrink-0 rounded-full bg-white/12 px-3.5 py-2 text-[13px] font-medium dark:bg-black/8"
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
