"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Shield,
  HandCoins,
  Clock,
  X,
  MapPinHouse,
} from "lucide-react";
import { toast } from "sonner";
import { addSalePayment, getSingleSale } from "@/features/sale/sale.service";

type Props = {
  saleId: string;
};

export default function SaleDetailsClient({ saleId }: Props) {
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  const loadSale = async () => {
    try {
      setLoading(true);
      const response = await getSingleSale(saleId);

      const saleData = response?.data || response;
      setSale(saleData);
      // Initialize modal amount default to total due
      if (saleData?.dueAmount) {
        setPaymentAmount(saleData.dueAmount);
      }
    } catch (error) {
      console.error("Failed to load sale details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (saleId) {
      loadSale();
    }
  }, [saleId]);

  const handleOpenModal = () => {
    if (sale?.dueAmount) {
      setPaymentAmount(sale.dueAmount);
    }
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleId || paymentAmount === "" || Number(paymentAmount) <= 0) return;

    try {
      setSubmitting(true);
      const res = await addSalePayment(saleId, Number(paymentAmount));

      if (res?.success) {
        setIsModalOpen(false);
        await loadSale();
        toast.success(res?.message || "Payment received successfully.");
      } else {
        setIsModalOpen(false);
        await loadSale();
        toast.warning(res?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting payment:", err);
      toast.error("An error occurred while processing the payment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium text-xs">
        Loading invoice details...
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="p-8 text-center text-rose-500 font-medium text-xs">
        Sale invoice not found.
      </div>
    );
  }

  const isPaid = sale.dueAmount === 0;

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen text-slate-900 font-sans max-w-7xl mx-auto relative">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {sale.invoiceNumber}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isPaid ? "Paid" : "Due"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(sale.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              ,{" "}
              {new Date(sale.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>·</span>
            <span>Sold by {sale.soldBy?.name || "N/A"}</span>
          </div>
        </div>

        {sale.dueAmount > 0 && (
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <HandCoins className="w-4 h-4 text-slate-300" /> Receive payment
          </button>
        )}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Customer, Items, and Payment History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <User className="w-4 h-4 text-slate-700" /> Customer
            </div>
            <div className="space-y-1 pt-1">
              <div className="text-sm font-bold text-slate-900">
                {sale.customer?.name || "Walk-in Customer"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {sale.customer?.phone || "No phone number provided"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPinHouse className="w-3.5 h-3.5 text-slate-400" />
                <span>{sale.customer?.address || "No address provided"}</span>
              </div>
            </div>
          </div>

          {/* Items Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Product</th>
                    <th className="p-4 text-right">Unit price</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {sale.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {item.product?.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{item.product?.sku}</span>
                          {item.warrantyMonths && (
                            <span className="flex items-center gap-1">
                              <span>•</span>
                              <Shield className="w-3 h-3 text-slate-400" />
                              {item.warrantyMonths} mo warranty
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-700">
                        BDT {item.unitPrice?.toLocaleString()}
                      </td>
                      <td className="p-4 text-center font-semibold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900">
                        BDT {item.subtotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Payment history
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Amount</th>
                    <th className="p-4">Received by</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {sale.payments && sale.payments.length > 0 ? (
                    sale.payments.map((payment: any) => (
                      <tr
                        key={payment._id}
                        className="hover:bg-slate-50/50 transition"
                      >
                        <td className="p-4 font-bold text-slate-900">
                          BDT {payment.amount?.toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">
                          {payment.receivedBy?.name || "N/A"}
                        </td>
                        <td className="p-4 text-slate-500 text-[11px]">
                          {new Date(payment.paidAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                          {", "}
                          {new Date(payment.paidAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-6 text-slate-400"
                      >
                        No payment history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Totals Summary Card */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900">Totals</h3>

            <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">
                  BDT {sale.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-bold text-rose-600">
                  - BDT {sale.discount?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-black text-slate-900 text-sm">
                  BDT {sale.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Paid</span>
                <span className="font-bold text-slate-800">
                  BDT {sale.paidAmount?.toLocaleString()}
                </span>
              </div>

              {sale.dueAmount > 0 && (
                <div className="mt-4 p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      Due
                    </span>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-md text-xs shadow-2xs">
                      BDT {sale.dueAmount?.toLocaleString()}
                    </span>
                  </div>
                  {sale.dueCommitmentMonths && (
                    <p className="text-[11px] text-amber-800/80 font-normal leading-relaxed">
                      Customer committed to clear the due within{" "}
                      {sale.dueCommitmentMonths} months.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Receive Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Receive payment
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Outstanding due:{" "}
                <span className="font-bold text-slate-800">
                  BDT {sale.dueAmount?.toLocaleString()}
                </span>{" "}
                on invoice {sale.invoiceNumber}.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  max={sale.dueAmount}
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#0B132B] hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Processing..." : "Confirm payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
