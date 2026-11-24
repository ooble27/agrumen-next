"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { resolveTheme, setThemePref, useThemePref } from "@/lib/store";

/** Bouton rond qui bascule clair / sombre. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const pref = useThemePref();

  // Suivre le thème du système tant que l'utilisateur n'a pas choisi.
  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => (document.documentElement.dataset.theme = resolveTheme("system"));
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [pref]);

  return (
    <button
      type="button"
      aria-label="Changer de thème"
      onClick={() => {
        const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
        setThemePref(current === "dark" ? "light" : "dark");
      }}
      className={`grid size-12 place-items-center rounded-full bg-surface text-ink transition active:scale-95 ${className}`}
    >
      <Sun className="hidden size-[22px] dark:block" strokeWidth={1.5} />
      <Moon className="size-[22px] dark:hidden" strokeWidth={1.5} />
    </button>
  );
}
