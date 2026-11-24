import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { CartBar } from "@/components/CartBar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* fond derrière l'heure et la batterie (app installée) */}
      <div aria-hidden data-safe-top className="fixed inset-x-0 top-0 z-30 h-[env(safe-area-inset-top)] bg-bg lg:hidden" />
      <TopNav />
      {children}
      <CartBar />
      <BottomNav />
    </>
  );
}
