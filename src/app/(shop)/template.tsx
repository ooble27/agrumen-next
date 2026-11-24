/** Rejoué à chaque navigation : petit fondu d'entrée de la page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
