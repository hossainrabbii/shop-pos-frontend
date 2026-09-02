'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Package, ShoppingCart, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

export default function DashboardHomePage() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome back, {user?.name || 'Admin'}! 👋</h1>
          <p className="text-xs text-slate-500 mt-0.5">Here is a real-time snapshot of your shop performance today.</p>
        </div>
        <Link
          href="/dashboard/pos"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition shadow-sm inline-flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Open POS Terminal
        </Link>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Revenue</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">$0.00</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 pt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +0% from yesterday
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Products</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-1">Managed in inventory</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-1">Active catalogs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Low Stock Alerts</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-amber-600 font-medium pt-1">Requires attention</p>
        </div>
      </div>
    </div>
  );
}