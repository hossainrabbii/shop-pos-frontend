import type { Metadata } from "next";
import ProductsClient from "@/features/product/components/ProductsClient";

export const metadata: Metadata = {
  title: "Product Inventory",
  description: "Manage stock items, pricing, thresholds, and categories.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
