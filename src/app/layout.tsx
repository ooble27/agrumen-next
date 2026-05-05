import type { Metadata, Viewport } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

export const metadata: Metadata = {
  title: "Agrumen — Produits frais",
  description: "Le marché digital des agriculteurs sénégalais. Livraison rapide.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060B06",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
