import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { CartBar } from "@/components/CartBar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
      <CartBar />
      <BottomNav />
    </>
  );
}
