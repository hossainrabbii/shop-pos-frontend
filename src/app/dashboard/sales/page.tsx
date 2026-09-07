"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  ReceiptText,
  HandCoins,
  CircleAlert,
  TrendingUp,
  FileText,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { ISale } from "@/types/sale.types";
import { fetchSalesList } from "@/services/sale.service";
import { fetchUser } from "@/services/User";

export default function SalesManagementPage() {
  const [sales, setSales] = useState<ISale[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination state
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [statsPeriod, setStatsPeriod] = useState<
    "today" | "week" | "month" | "year" | "custom"
  >("month");

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [stats, setStats] = useState({
    totalSales: 0,
    collected: 0,
    due: 0,
    profit: 0,
    transactions: 0,
  });

  // Fetch Sellers/Users list on initial component mount
  useEffect(() => {
    const fetchSellersData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken") || "";
        const response = await fetchUser(accessToken);

        // Based on your console log structure: response.data is the array of users
        const usersList = response?.data || response || [];
        setSellers(Array.isArray(usersList) ? usersList : []);
      } catch (err) {
        console.error("Failed to fetch sellers list", err);
      }
    };

    fetchSellersData();
  }, []);

  // Reset page to 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [
    search,
    paymentStatus,
    selectedSeller,
    statsPeriod,
    selectedYear,
    fromDate,
    toDate,
  ]);

  // Fetch data when page or filters change
  useEffect(() => {
    loadSalesData();
  }, [
    page,
    search,
    paymentStatus,
    selectedSeller,
    statsPeriod,
    selectedYear,
    fromDate,
    toDate,
  ]);

  const loadSalesData = async () => {
    try {
      setLoading(true);

      const limit = 10;
      const accessToken = localStorage.getItem("accessToken") || "";

      const salesRes = await fetchSalesList(accessToken, {
        page,
        limit,
        search: search || undefined,
        paymentStatus: paymentStatus || undefined,
        soldBy: selectedSeller || undefined,
        from: statsPeriod === "custom" ? fromDate || undefined : undefined,
        to: statsPeriod === "custom" ? toDate || undefined : undefined,
      });

      // 1. Extract sales array correctly from data.sales
      const salesData = salesRes?.data?.sales || [];
      setSales(Array.isArray(salesData) ? salesData : []);

      // 2. Extract pagination object correctly from data.pagination
      const pagination = salesRes?.data?.pagination || {};

      const totalRecs = pagination.totalRecords || salesData.length;
      setTotalRecords(totalRecs);

      const calculatedTotalPages =
        pagination.totalPages || Math.ceil(totalRecs / limit);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      console.error("Failed to fetch sales data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 space-y-4 bg-white text-slate-900 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sales
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

      {/* Filters Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
        >
          <option value="">All payments</option>
          <option value="PAID">Paid</option>
          <option value="DUE">Due</option>
        </select>

        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
        >
          <option value="">All sellers</option>
          {sellers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sales Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Scrollable Table Content */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-xs">
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-2.5 py-2">Invoice</th>
                <th className="px-2.5 py-2">Customer</th>
                <th className="px-2.5 py-2">Sold by</th>
                <th className="px-2.5 py-2">Total</th>
                <th className="px-2.5 py-2">Paid</th>
                <th className="px-2.5 py-2">Due</th>
                <th className="px-2.5 py-2">Date</th>
                <th className="px-2.5 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    Loading sales records...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    No sales transactions found.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => {
                  const sellerName =
                    typeof sale.soldBy === "object" && sale.soldBy !== null
                      ? sale.soldBy.name
                      : "N/A";

                  return (
                    <tr
                      key={sale._id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="p-2.5 text-slate-900">
                        {sale.invoiceNumber}
                      </td>
                      <td className="p-2.5">
                        <div className="font text-slate-700">
                          {sale.customer?.name || "Walk-in Customer"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sale.customer?.phone || "No phone"}
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-700">{sellerName}</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        BDT {sale.totalAmount?.toLocaleString() || 0}
                      </td>
                      <td className="p-2.5 text-slate-600">
                        BDT {sale.paidAmount?.toLocaleString() || 0}
                      </td>
                      <td className="p-2.5">
                        {sale.dueAmount > 0 ? (
                          <span className="bg-orange-300 p-1 rounded-md">
                            BDT {sale.dueAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="bg-green-400 p-1 rounded-md">
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-500 text-[11px]">
                        {sale.createdAt
                          ? new Date(sale.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-2.5 text-right">
                        <Link
                          href={`/dashboard/sales/${sale._id}`}
                          className="inline-flex p-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg text-slate-600 transition border border-slate-100"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages} · {totalRecords} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
