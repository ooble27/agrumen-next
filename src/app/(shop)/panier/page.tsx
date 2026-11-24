import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Mon panier" };

export default function CartPage() {
  return (
    <PageTransition>
      <CartView />
    </PageTransition>
  );
}
