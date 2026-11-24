/** Mot souligné d'un trait fin tracé à la main (comme au stylo). */
export function Marker({ children, color = "var(--orange)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative">{children}</span>
      <svg aria-hidden viewBox="0 0 120 12" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.16em] left-[2%] h-[0.28em] w-[96%] overflow-visible">
        <path d="M2 8.5 C 30 3.5, 70 2.5, 118 6" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/** Autocollant penché sur les cartes produit. */
export function Sticker({ kind, label }: { kind: "promo" | "new" | "top"; label: string }) {
  if (kind === "promo") {
    const pts = Array.from({ length: 24 }, (_, i) => {
      const r = i % 2 ? 38 : 48, t = (i / 24) * Math.PI * 2;
      return `${(50 + Math.cos(t) * r).toFixed(1)},${(50 + Math.sin(t) * r).toFixed(1)}`;
    }).join(" ");
    return (
      <span className="sticker relative grid size-[54px] -rotate-12 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full drop-shadow-[0_4px_6px_rgba(0,0,0,.25)]" aria-hidden>
          <polygon points={pts} fill="var(--orange)" />
        </svg>
        <span className="relative text-[13px] font-extrabold leading-none tracking-tight text-white">{label}</span>
      </span>
    );
  }
  return (
    <span
      className={`sticker inline-flex h-7 -rotate-[8deg] items-center rounded-full px-3 text-[11px] font-extrabold uppercase tracking-wide shadow-[0_4px_8px_-2px_rgba(0,0,0,.3)] ${
        kind === "new" ? "bg-[#7C5CFF] text-white" : "bg-[#151515] text-white dark:bg-white dark:text-[#151515]"
      }`}
    >
      {label}
    </span>
  );
}

/** Confettis qui tombent une fois (CSS, transform uniquement). */
export function Confetti({ count = 46 }: { count?: number }) {
  const colors = ["#FF7A1A", "#4CC764", "#FFC93C", "#7C5CFF", "#FF4D6D", "#2EC4F1"];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = ((i * 53) % 90) / 100;
        const dur = 2.2 + ((i * 29) % 100) / 70;
        const size = 6 + ((i * 17) % 7);
        const round = i % 3 === 0;
        return (
          <span
            key={i}
            className="confetti absolute top-[-20px] block"
            style={{
              left: `${left}%`,
              width: size,
              height: round ? size : size * 1.8,
              borderRadius: round ? 999 : 2,
              background: colors[i % colors.length],
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              ["--drift" as string]: `${((i * 41) % 120) - 60}px`,
              ["--spin" as string]: `${((i * 97) % 720) - 360}deg`,
            }}
          />
        );
      })}
    </div>
  );
}
