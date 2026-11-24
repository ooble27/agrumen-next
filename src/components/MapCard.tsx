/** Mini carte stylisée (pas de dépendance externe), suit le thème. */
export function MapCard() {
  return (
    <svg viewBox="0 0 360 140" className="block h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="360" height="140" fill="var(--map-bg)" />
      <path d="M0 0h70v40H0zM90 0h80v28H90zM260 0h100v46H260zM0 96h60v44H0zM200 92h70v48h-70zM300 70h60v70h-60z" fill="var(--map-block)" />
      <path d="M100 52c30-8 60-6 80 10s10 40-20 44-70-4-74-24 0-26 14-30z" fill="var(--map-park)" />
      <path d="M296 10c20 0 40 14 40 30" stroke="var(--map-park)" strokeWidth="14" fill="none" />
      <g stroke="var(--map-road)" strokeWidth="6" fill="none" strokeLinecap="round">
        <path d="M-10 60C60 50 120 30 200 40s120 30 180 20" />
        <path d="M80 -10c10 50 0 100 20 160" />
        <path d="M240 -10c-10 60 10 100 0 160" />
        <path d="M-10 120c80-10 160 10 380-10" />
      </g>
      <g stroke="var(--map-main)" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M-10 86c70 6 140-20 210-10s110 26 170 10" />
        <path d="M180 -10c-6 40 20 80 10 160" />
      </g>
      <g fill="var(--map-text)" fontSize="8" fontFamily="inherit">
        <text x="34" y="30">Centre-ville</text>
        <text x="108" y="20">Marché</text>
        <text x="266" y="30">Gare</text>
        <text x="288" y="98">Université</text>
        <text x="34" y="114">Vieux-Port</text>
        <text x="204" y="112">Rue Principale</text>
        <text x="120" y="78">Parc</text>
      </g>
      <g transform="translate(176 52)">
        <ellipse cx="0" cy="26" rx="9" ry="3" fill="rgba(0,0,0,.25)" />
        <path d="M0 26c-10-12-15-20-15-28a15 15 0 1 1 30 0c0 8-5 16-15 28z" fill="var(--brand)" />
        <circle cx="0" cy="-2" r="5.5" fill="#fff" />
      </g>
    </svg>
  );
}
