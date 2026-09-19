"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Store,
  LayoutDashboard,
  Layers,
  Package,
  LogOut,
  Menu,
  X,
  BadgePoundSterling,
  ChartNoAxesCombined,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Calendar as CalendarIcon,
  Building2,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client to prevent hydration mismatch
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => clearInterval(timer);
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
    {
      name: "Statistics",
      href: "/dashboard/statistics",
      icon: ChartNoAxesCombined,
    },
  ];

  const renderSidebarContent = (isCollapsed = false) => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Logo Area */}
        <div className="h-16 border-b border-slate-200 flex items-center px-4 gap-2 overflow-hidden">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shrink-0">
            <Store className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-slate-900 tracking-tight truncate">
              ShopPOS Enterprise
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / User Badge */}
      <div className="p-3 border-t border-slate-200">
        {!isCollapsed && (
          <div className="px-1 mb-1">
            <a
              href="https://hossainrabbi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-all group"
            >
              <img
                src="/hossainlogo.webp"
                alt="Developer"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden">
                <a
                  href="https://hossainrabbi.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-400 underline hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 font-medium"
                >
                  <span>Developed by Hossain Rabbi</span>
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </a>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-100 text-slate-700 hover:text-rose-600 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  // Format full day name and date
  const formattedDate = currentTime
    ? currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <AuthGuard>
      <div className="h-screen bg-slate-100 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0 transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {renderSidebarContent(isSidebarCollapsed)}
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
              {renderSidebarContent(false)}
            </div>
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Top Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-40 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 md:hidden transition cursor-pointer"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title={
                  isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
                }
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </button>

              {/* Full Day Date & Clock Display */}
              <div className="hidden lg:inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                  {formattedDate || "Loading..."}
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5 font-mono text-slate-900">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {formattedTime || "--:--:--"}
                </span>
              </div>
            </div>

            {/* Workspace Link with Icon */}
            <div className="text-xs font-semibold">
              <Link
                href="/dashboard/workspace"
                className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                <Building2 className="w-4 h-4" />
                <span>Workspace Profile</span>
              </Link>
            </div>
          </header>

          {/* Scrollable Page Content View */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0 bg-slate-100">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
