import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE.name} — Nems livrés tout chauds`,
    short_name: SITE.name,
    description: SITE.tagline,
    lang: "fr-CA",
    start_url: "/menu",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#161616",
    theme_color: "#161616",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Menu", url: "/menu", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Mon panier", url: "/panier", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
