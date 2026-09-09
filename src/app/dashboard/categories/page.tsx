import type { Metadata } from "next";
import CategoriesClient from "@/features/category/components/CategoriesClient";

export const metadata: Metadata = {
  title: "Category Management",
  description:
    "Organize shop stock by creating and maintaining item categories.",
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
