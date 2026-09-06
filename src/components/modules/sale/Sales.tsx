"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, FileText, Plus } from "lucide-react";

import type {
  ISale,
  ISaleStatistics,
  SalePaymentStatus,
  SalePeriod,
} from "@/types/sale";

import { getAllSales, getSaleStatistics } from "@/services/Sale";

import SaleStatistics from "./SaleStatistics";
import SaleFilters from "./SaleFilters";
import SaleTable from "./SaleTable";
import SaleDetails from "./SaleDetails";

import { getDateRangeFromPeriod } from "./sale.utils";

interface Props {
  sellers?: {
    _id: string;
    name: string;
  }[];
}

const Sales = ({ sellers = [] }: Props) => {
  const currentYear = new Date().getFullYear();

  const [sales, setSales] = useState<ISale[]>([]);

  const [statistics, setStatistics] = useState<ISaleStatistics>({
    totalSales: 0,
    totalPaid: 0,
    totalDue: 0,
    totalProfit: 0,
    totalTransactions: 0,
  });

  const [search, setSearch] = useState("");

  const [paymentStatus, setPaymentStatus] = useState<SalePaymentStatus>("ALL");

  const [seller, setSeller] = useState("");

  const [period, setPeriod] = useState<SalePeriod>("month");

  const [year, setYear] = useState(currentYear);

  const [customFrom, setCustomFrom] = useState("");

  const [customTo, setCustomTo] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const loadSales = useCallback(async () => {
    try {
      setLoading(true);

      const range =
        period === "custom"
          ? {
              from: customFrom || undefined,
              to: customTo || undefined,
            }
          : getDateRangeFromPeriod(period, year);

      const result = await getAllSales({
        page,
        limit: 10,
        search: search.trim() || undefined,
        paymentStatus,
        soldBy: seller || undefined,
        from: range.from,
        to: range.to,
      });

      setSales(result.sales);
      setTotalPages(result.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, search, paymentStatus, seller, period, year, customFrom, customTo]);

  const loadStatistics = useCallback(async () => {
    const params =
      period === "custom"
        ? {
            period,
            from: customFrom || undefined,
            to: customTo || undefined,
          }
        : {
            period,
            year: period === "year" ? year : undefined,
          };

    const result = await getSaleStatistics(params);

    setStatistics(result);
  }, [period, year, customFrom, customTo]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    setPage(1);
  }, [search, paymentStatus, seller, period, year, customFrom, customTo]);

  const handlePaymentSuccess = async () => {
    await Promise.all([loadSales(), loadStatistics()]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track invoices, collections and outstanding dues.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#111827] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f2937]"
        >
          <Plus className="h-4 w-4" />
          New Sale
        </button>
      </div>

      {/* Statistics selector */}
      <div className="flex items-center gap-2 text-sm">
        <CalendarDays className="h-4 w-4" />

        <span className="font-medium">Statistics</span>

        <span className="rounded-lg border px-3 py-2">
          {period === "today"
            ? "Today"
            : period === "week"
              ? "This week"
              : period === "month"
                ? "This month"
                : period === "year"
                  ? String(year)
                  : "Custom range"}
        </span>
      </div>

      {/* Statistics */}
      <SaleStatistics statistics={statistics} />

      {/* Filters */}
      <SaleFilters
        search={search}
        setSearch={setSearch}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        seller={seller}
        setSeller={setSeller}
        period={period}
        setPeriod={setPeriod}
        year={year}
        setYear={setYear}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
        sellers={sellers}
      />

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border bg-white py-20 text-center text-sm text-muted-foreground">
          Loading sales...
        </div>
      ) : (
        <SaleTable
          sales={sales}
          onView={(sale) => setSelectedSaleId(sale._id)}
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Details */}
      <SaleDetails
        saleId={selectedSaleId}
        onClose={() => setSelectedSaleId(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Sales;
