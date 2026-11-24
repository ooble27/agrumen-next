import { SITE } from "@/lib/site";

/** Pictogramme : un nem doré roulé, sur pastille verte. */
export function LogoMark({ className = "size-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#4CC764" />
      <g transform="rotate(-38 24 25)">
        <rect x="9" y="18.5" width="30" height="13" rx="6.5" fill="#F7A325" />
        <rect x="9" y="18.5" width="30" height="13" rx="6.5" fill="url(#nemsy-shine)" />
        <path d="M17 19v12M24 19v12M31 19v12" stroke="#C9741A" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      </g>
      <path d="M31.5 11.5c3.2-.4 5.4 1.2 5.8 4.2-3.1.5-5.4-1-5.8-4.2z" fill="#E9FFE9" />
      <defs>
        <linearGradient id="nemsy-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3D6" stopOpacity=".7" />
          <stop offset=".45" stopColor="#FFF3D6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-10" />
      <span className="text-[22px] font-semibold tracking-[-0.03em]">{SITE.name.toLowerCase()}</span>
    </span>
  );
}
