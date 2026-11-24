import type { SVGProps } from "react";

/** Maison "pentagone arrondi" de la barre de navigation de la maquette. */
export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" {...props}>
      <path d="M10.2 3.4a3 3 0 0 1 3.6 0l5.6 4.2a3 3 0 0 1 1.1 3.1l-1.6 6.9a3 3 0 0 1-2.9 2.4H7.9A3 3 0 0 1 5 17.6l-1.6-6.9a3 3 0 0 1 1.1-3.1z" />
      <path d="M9.5 15.5c.8.6 1.6.9 2.5.9s1.7-.3 2.5-.9" />
    </svg>
  );
}

/** Grille 2×2 (icône en haut à droite de l'accueil). */
export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="3.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}
