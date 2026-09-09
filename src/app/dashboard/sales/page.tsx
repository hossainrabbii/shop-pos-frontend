import type { Metadata } from "next";
import Link from "next/link";
import { BadgePoundSterling, ReceiptText } from "lucide-react";
import SalesManagementClient from "@/features/sale/components/SalesManagementClient";

export const metadata: Metadata = {
  title: "Sales Management",
  description: "Track invoices, collections and outstanding dues.",
};

export default function SalesManagementPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BadgePoundSterling className="w-6 h-6 text-indigo-600" /> Sales
          </h1>

          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Track invoices, collections and outstanding dues.
          </p>
        </div>

        <Link
          href="/dashboard/sales/new-sale"
          className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          <ReceiptText className="w-4 h-4 text-slate-300" /> New Sale
        </Link>
      </div>
      <SalesManagementClient />
    </div>
  );
}
