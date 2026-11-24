import type { Metadata } from "next";
import { FavoritesView } from "./FavoritesView";

export const metadata: Metadata = { title: "Favoris" };

export default function FavoritesPage() {
  return <FavoritesView />;
}
