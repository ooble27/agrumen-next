import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { PaymentView } from "./PaymentView";

export const metadata: Metadata = { title: "Paiement" };

export default function PaymentPage() {
  return (
    <PageTransition>
      <PaymentView />
    </PageTransition>
  );
}
