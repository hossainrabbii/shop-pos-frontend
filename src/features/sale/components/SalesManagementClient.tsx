"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { ISale } from "@/types/sale.types";
import { fetchUser } from "@/services/User";
import { fetchSalesList } from "@/features/sale/sale.service";

export default function SalesManagementClient() {
  const [sales, setSales] = useState<ISale[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination state
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [selectedSeller, setSelectedSeller] = useState<string>("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch Sellers/Users list on initial component mount
  useEffect(() => {
    const fetchSellersData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken") || "";
        const response = await fetchUser(accessToken);

        const usersList = response?.data || response || [];
        setSellers(Array.isArray(usersList) ? usersList : []);
      } catch (err) {
        console.error("Failed to fetch sellers list", err);
      }
    };

    fetchSellersData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, paymentStatus, selectedSeller]);

  // Fetch data when page or filters change
  useEffect(() => {
    loadSalesData();
  }, [page, search, paymentStatus, selectedSeller]);

  const loadSalesData = async () => {
    try {
      setLoading(true);

      const limit = 10;

      const salesRes = await fetchSalesList({
        page,
        limit,
        search: search || undefined,
        paymentStatus: paymentStatus || undefined,
        soldBy: selectedSeller || undefined,
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
    <div className="h-screen rounded-2xl border border-slate-200 flex flex-col px-6 py-3 space-y-4 bg-white text-slate-900 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0"></div>

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

      {/* Scrollable Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-semibold text-slate-400">
              Loading sales records...
            </p>
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 space-y-2 flex-1">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              No sales transactions found.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-xs">
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="px-2.5 py-3">Invoice</th>
                  <th className="px-2.5 py-3">Customer</th>
                  <th className="px-2.5 py-3">Sold by</th>
                  <th className="px-2.5 py-3">Total</th>
                  <th className="px-2.5 py-3">Paid</th>
                  <th className="px-2.5 py-3">Due</th>
                  <th className="px-2.5 py-3">Date</th>
                  <th className="px-2.5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {sales.map((sale) => {
                  const sellerName =
                    typeof sale.soldBy === "object" && sale.soldBy !== null
                      ? sale.soldBy.name
                      : "N/A";

                  return (
                    <tr
                      key={sale._id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="p-2.5 text-slate-500 text-[11px]">
                        {sale.invoiceNumber}
                      </td>
                      <td className="p-2.5">
                        <div className="font-medium text-slate-800">
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
                          <span className="bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                            BDT {sale.dueAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">
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
                })}
              </tbody>
            </table>
          </div>
        )}
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
  );
}
