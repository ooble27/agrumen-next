import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { CartBar } from "@/components/CartBar";
import { LiveOrderBar } from "@/components/LiveOrderBar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
      <LiveOrderBar />
      <CartBar />
      <BottomNav />
    </>
  );
}
