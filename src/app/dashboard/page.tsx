"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Package, AlertTriangle, ReceiptText } from "lucide-react";

export default function DashboardHomePage() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome back, {user?.name || ""} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Here is a real-time snapshot of your shop performance today.
          </p>
        </div>

        <Link
          href="/dashboard/sales/new-sale"
          className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          <ReceiptText className="w-4 h-4 text-slate-300" /> New Sale
        </Link>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Today's Revenue
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">৳0.00</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              ৳
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Products
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Categories
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Low Stock Alerts
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
