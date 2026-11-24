import type { Metadata } from "next";
import { MenuView } from "./MenuView";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return <MenuView />;
}
