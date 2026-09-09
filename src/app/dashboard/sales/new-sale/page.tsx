import type { Metadata } from "next";
import CreateSaleClient from "@/features/sale/components/CreateSaleClient";

export const metadata: Metadata = {
  title: "New Sale",
  description:
    "Add customer details, products and payment to generate an invoice.",
};

export default function CreateSalePage() {
  return <CreateSaleClient />;
}
