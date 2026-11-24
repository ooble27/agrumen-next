import type { Metadata } from "next";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = { title: { absolute: "Nemsy — Nems livrés tout chauds" } };

export default function Home() {
  return <Onboarding />;
}
