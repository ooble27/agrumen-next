import type { Metadata } from "next";
import { ConfirmationView } from "./ConfirmationView";

export const metadata: Metadata = { title: "Commande confirmée" };

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
