import SaleStatistics from "@/features/statistic/components/SaleStatistics";
import { ChartNoAxesCombined } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Statistics",
  description: "View sales and profit statistics",
};

const SalesStatisticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ChartNoAxesCombined className="w-6 h-6 text-indigo-600" /> Statistics
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            View sales, payments, due amounts, profit and transaction
            statistics.
          </p>
        </div>
      </div>
      <SaleStatistics />
    </div>
  );
};

export default SalesStatisticsPage;
