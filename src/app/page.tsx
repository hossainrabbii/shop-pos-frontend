import Link from 'next/link';
import { ShoppingCart, ShieldCheck, ArrowRight, Zap, BarChart3, Store } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">ShopPOS Enterprise</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" /> Trusted & Secure Shop Management
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            The Modern Point of Sale & <span className="text-indigo-600">Inventory Solution</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Built for reliability, speed, and absolute accuracy. Manage your retail business, track categories, handle lightning-fast checkouts, and secure your daily revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition shadow-sm inline-flex items-center justify-center gap-2"
            >
              Launch Your Shop <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-700 font-medium px-8 py-3 rounded-xl transition border border-slate-300 shadow-xs inline-flex items-center justify-center"
            >
              Access Portal
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Lightning POS Terminal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optimized checkout flow with instant cart calculations, barcode scanning support, and accurate change-due calculation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Category & Stock Control</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Organize inventory items seamlessly with real-time stock validations, structured hierarchies, and instant lookups.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Secure & Robust Backend</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Token rotation architecture, secure session modeling, and complete audit readiness built for growing businesses.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ShopPOS Enterprise System. All rights reserved.</p>
      </footer>
    </div>
  );
}