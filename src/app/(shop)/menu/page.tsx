import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { MenuView } from "./MenuView";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <PageTransition>
      <MenuView />
    </PageTransition>
  );
}
