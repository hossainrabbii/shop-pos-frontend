"use client";

import {
  Banknote,
  CircleDollarSign,
  FileText,
  HandCoins,
  TrendingUp,
} from "lucide-react";

import type { ISaleStatistics } from "@/types/sale";
import { formatCurrency } from "./sale.utils";

interface Props {
  statistics: ISaleStatistics;
}

const SaleStatistics = ({ statistics }: Props) => {
  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(statistics.totalSales),
      description: `${statistics.totalTransactions} transactions`,
      icon: Banknote,
    },
    {
      title: "Collected",
      value: formatCurrency(statistics.totalPaid),
      description: "Total collected",
      icon: HandCoins,
    },
    {
      title: "Due",
      value: formatCurrency(statistics.totalDue),
      description: "Outstanding amount",
      icon: CircleDollarSign,
    },
    {
      title: "Profit",
      value: formatCurrency(statistics.totalProfit),
      description: "Gross product profit",
      icon: TrendingUp,
    },
    {
      title: "Transactions",
      value: statistics.totalTransactions.toLocaleString(),
      description: "Total sales",
      icon: FileText,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>

                <h3 className="mt-3 text-2xl font-bold">{card.value}</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SaleStatistics;
