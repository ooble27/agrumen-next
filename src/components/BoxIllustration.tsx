/** Carton ouvert + coche, dessiné à la main façon maquette "Order Confirmed". */
export function BoxIllustration({ className = "" }: { className?: string }) {
  const ink = "currentColor";
  return (
    <svg viewBox="0 0 280 260" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* coche */}
      <g className="pop" style={{ animationDelay: "0.35s", transformOrigin: "140px 40px" }}>
        <circle cx="140" cy="40" r="27" stroke="var(--brand)" strokeWidth="3.5" />
        <path d="M127 40l9 9 23-25" stroke="var(--brand)" strokeWidth="3.5" />
      </g>

      {/* serpentin violet */}
      <path d="M82 70c-6-8-2-20 6-18s4 12-2 10-2-12 6-14" stroke="#7a6cf0" strokeWidth="2.2" />
      <path d="M96 84c-3 2-6 2-9 1" stroke="#7a6cf0" strokeWidth="2.2" />
      {/* étoile dorée */}
      <path d="M196 56l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" stroke="var(--orange)" strokeWidth="2" />
      {/* petits traits */}
      <path d="M72 92l6 3M184 46l4-6M196 40l6-3M208 98l7-2M210 90l6-6" stroke="var(--brand)" strokeWidth="2" />
      <path d="M64 206l-4 4M70 210l-1 5" stroke={ink} strokeWidth="2" />

      {/* rabats arrière */}
      <path d="M80 122l60-28-32-18-60 28z" fill="var(--flap)" stroke={ink} strokeWidth="2.2" />
      <path d="M140 94l60 28 32-18-60-28z" fill="var(--flap)" stroke={ink} strokeWidth="2.2" />
      {/* ouverture */}
      <path d="M80 122l60-28 60 28-60 28z" fill="var(--box-inner)" stroke={ink} strokeWidth="2.2" />
      <path d="M134 108c3 3 8 4 12 2" stroke="var(--box-mark)" strokeWidth="2" />
      {/* faces */}
      <path d="M80 122l60 28v62l-60-28z" fill="var(--box-left)" stroke={ink} strokeWidth="2.2" />
      <path d="M140 150l60-28v62l-60 28z" fill="var(--box-right)" stroke={ink} strokeWidth="2.2" />
      <path d="M110 136v40" stroke={ink} strokeWidth="1.6" />
      {/* rabats avant */}
      <path d="M80 122l60 28-30 16-60-28z" fill="var(--flap)" stroke={ink} strokeWidth="2.2" />
      <path d="M140 150l60-28 30 16-60 28z" fill="var(--flap)" stroke={ink} strokeWidth="2.2" />

      {/* ficelle */}
      <path
        d="M200 176c20 4 36-8 32-24-3-12-18-12-20 0-3 18 12 40-8 54-14 10-40 6-64 2-30-5-66-6-86-14-12-5-10-14 4-14"
        stroke={ink}
        strokeWidth="1.8"
      />
      {/* étoile contour */}
      <path d="M164 232l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" stroke={ink} strokeWidth="1.8" />
    </svg>
  );
}
