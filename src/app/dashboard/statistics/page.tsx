import type { Metadata } from "next";

import SaleStatistics from "@/components/modules/sale/statistics/SaleStatistics";

export const metadata: Metadata = {
  title: "Sales Statistics",
  description: "View sales and profit statistics",
};

const SalesStatisticsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Statistics</h1>

        <p className="mt-1 text-sm text-gray-500">
          View sales, payments, due amounts, profit and transaction statistics.
        </p>
      </div>

      <SaleStatistics />
    </div>
  );
};

export default SalesStatisticsPage;
