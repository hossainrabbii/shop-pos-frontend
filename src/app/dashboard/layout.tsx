"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Store,
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  BadgePoundSterling,
  ChartNoAxesCombined,
} from "lucide-react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Categories", href: "/dashboard/categories", icon: Layers },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Sales", href: "/dashboard/sales", icon: BadgePoundSterling },
    { name: "Statistics", href: "/dashboard/statistics", icon: ChartNoAxesCombined },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Logo Area */}
        <div className="h-16 border-b border-slate-200 flex items-center px-6 gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Store className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            ShopPOS Enterprise
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / User Badge */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
          <p className="text-xs font-bold text-slate-900 truncate">
            {user?.name || "Administrator"}
          </p>
          <p className="text-[10px] text-slate-500 truncate">
            {user?.email || "admin@shop.com"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-100 text-slate-700 hover:text-rose-600 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100 flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/50 backdrop-blur-xs">
            <div className="w-64 bg-white h-full shadow-2xl flex flex-col relative animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
              {renderSidebarContent()}
            </div>
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 md:hidden transition cursor-pointer"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Session Active
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-600">
              Workspace:{" "}
              <span className="text-slate-900 font-bold">Main Branch</span>
            </div>
          </header>

          {/* Page Content View */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
