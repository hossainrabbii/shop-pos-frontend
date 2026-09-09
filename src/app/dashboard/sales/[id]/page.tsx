import type { Metadata } from "next";
import SaleDetailsClient from "@/features/sale/components/SaleDetailsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Sale Invoice Details",
  description:
    "View invoice details, items, payment history, and record due payments.",
};

export default async function SaleDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  return <SaleDetailsClient saleId={resolvedParams.id} />;
}
