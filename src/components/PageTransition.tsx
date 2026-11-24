import { ViewTransition } from "react";

const MAP = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" };

/** Transition d'entrée/sortie d'une page (glissement selon le sens, sinon fondu). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={MAP} exit={MAP} default="none">
      {children}
    </ViewTransition>
  );
}
