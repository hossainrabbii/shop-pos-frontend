"use client";

import { CalendarDays, Search } from "lucide-react";

import type { SalePaymentStatus, SalePeriod } from "@/types/sale";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  paymentStatus: SalePaymentStatus;
  setPaymentStatus: (value: SalePaymentStatus) => void;

  seller: string;
  setSeller: (value: string) => void;

  period: SalePeriod;
  setPeriod: (value: SalePeriod) => void;

  year: number;
  setYear: (value: number) => void;

  customFrom: string;
  setCustomFrom: (value: string) => void;

  customTo: string;
  setCustomTo: (value: string) => void;

  sellers: {
    _id: string;
    name: string;
  }[];
}

const SaleFilters = ({
  search,
  setSearch,
  paymentStatus,
  setPaymentStatus,
  seller,
  setSeller,
  period,
  setPeriod,
  year,
  setYear,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  sellers,
}: Props) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - 2019 },
    (_, index) => currentYear - index,
  );

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoice, customer, phone..."
            className="h-10 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none focus:ring-2"
          />
        </div>

        {/* Payment */}
        <select
          value={paymentStatus}
          onChange={(event) =>
            setPaymentStatus(event.target.value as SalePaymentStatus)
          }
          className="h-10 rounded-lg border bg-white px-3 text-sm outline-none"
        >
          <option value="ALL">All payments</option>

          <option value="PAID">Paid</option>

          <option value="DUE">Due</option>
        </select>

        {/* Seller */}
        <select
          value={seller}
          onChange={(event) => setSeller(event.target.value)}
          className="h-10 rounded-lg border bg-white px-3 text-sm outline-none"
        >
          <option value="">All sellers</option>

          {sellers.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Period */}
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value as SalePeriod)}
          className="h-10 rounded-lg border bg-white px-3 text-sm outline-none"
        >
          <option value="today">Today</option>

          <option value="week">This week</option>

          <option value="month">This month</option>

          <option value="year">Year</option>

          <option value="custom">Custom range</option>
        </select>

        {/* Year */}
        {period === "year" && (
          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="h-10 rounded-lg border bg-white px-3 text-sm outline-none"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Custom Range */}
      {period === "custom" && (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="date"
              value={customFrom}
              onChange={(event) => setCustomFrom(event.target.value)}
              className="h-10 w-full rounded-lg border bg-white pl-10 pr-3 text-sm"
            />
          </div>

          <span className="text-sm text-muted-foreground">to</span>

          <div className="relative flex-1">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="date"
              value={customTo}
              onChange={(event) => setCustomTo(event.target.value)}
              className="h-10 w-full rounded-lg border bg-white pl-10 pr-3 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleFilters;
