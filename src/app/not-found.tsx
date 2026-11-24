import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="text-[96px] font-medium leading-none tracking-tighter text-brand">404</p>
        <h1 className="mt-4 text-2xl font-medium">Cette page est partie en livraison</h1>
        <p className="mt-2 text-muted">Elle n’existe pas ou plus.</p>
        <Link href="/menu" className="mt-8 inline-flex h-14 items-center rounded-full bg-btn px-8 font-medium text-btn-fg">
          Retour au menu
        </Link>
      </div>
    </main>
  );
}
