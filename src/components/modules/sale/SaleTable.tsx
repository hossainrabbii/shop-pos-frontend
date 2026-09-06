"use client";

import { ArrowRight } from "lucide-react";

import type { ISale } from "@/types/sale";
import { formatCurrency, formatSaleDate } from "./sale.utils";

interface Props {
  sales: ISale[];
  onView: (sale: ISale) => void;
}

const SaleTable = ({ sales, onView }: Props) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Invoice</th>

              <th className="px-4 py-3 text-left font-medium">Customer</th>

              <th className="px-4 py-3 text-left font-medium">Sold by</th>

              <th className="px-4 py-3 text-right font-medium">Total</th>

              <th className="px-4 py-3 text-right font-medium">Paid</th>

              <th className="px-4 py-3 text-right font-medium">Due</th>

              <th className="px-4 py-3 text-left font-medium">Status</th>

              <th className="px-4 py-3 text-left font-medium">Date</th>

              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y">
            {sales.map((sale) => {
              const seller =
                typeof sale.soldBy === "string"
                  ? sale.soldBy
                  : sale.soldBy.name;

              const isDue = sale.dueAmount > 0;

              return (
                <tr key={sale._id} className="transition hover:bg-muted/20">
                  <td className="px-4 py-4 font-medium">
                    {sale.invoiceNumber}
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-medium">{sale.customer.name}</div>

                    {sale.customer.phone && (
                      <div className="text-xs text-muted-foreground">
                        {sale.customer.phone}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4">{seller}</td>

                  <td className="px-4 py-4 text-right font-medium">
                    {formatCurrency(sale.totalAmount)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    {formatCurrency(sale.paidAmount)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    {isDue ? formatCurrency(sale.dueAmount) : "—"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        isDue
                          ? "inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
                          : "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                      }
                    >
                      {isDue ? "Due" : "Paid"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {formatSaleDate(sale.createdAt)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(sale)}
                      className="rounded-md p-2 hover:bg-muted"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {sales.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-16 text-center text-muted-foreground"
                >
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleTable;
