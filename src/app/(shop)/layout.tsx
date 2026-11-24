import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
      <BottomNav />
    </>
  );
}
