"use client";
import { useFormContext } from "react-hook-form";
import { FileDown } from "lucide-react";

interface PaymentSummarySectionProps {
  subtotal: number;
  totalAmount: number;
  dueAmount: number;
  isSubmitting: boolean;
  onDownloadDraft: () => void;
}

export default function PaymentSummarySection({
  subtotal,
  totalAmount,
  dueAmount,
  isSubmitting,
  onDownloadDraft,
}: PaymentSummarySectionProps) {
  const { register } = useFormContext();

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
      <h2 className="font-bold text-gray-900 text-lg border-b pb-3">
        Payment summary
      </h2>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span className="font-semibold text-gray-900">
          BDT {subtotal.toLocaleString()}
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Discount
        </label>
        <input
          type="number"
          min={0}
          {...register("discount", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        />
      </div>

      <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
        <span>Total</span>
        <span>BDT {totalAmount.toLocaleString()}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paid amount
        </label>
        <input
          type="number"
          min={0}
          {...register("paidAmount", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        />
      </div>

      <div className="flex justify-between items-center bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
        <span className="text-sm font-medium text-amber-900">Due</span>
        <span className="font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded text-sm">
          BDT {dueAmount.toLocaleString()}
        </span>
      </div>

      {dueAmount > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due commitment (months)
          </label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 1"
            {...register("dueCommitmentMonths", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
          />
        </div>
      )}

      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Processing sale..." : "Create sale & Print"}
        </button>

        <button
          type="button"
          onClick={onDownloadDraft}
          className="w-full flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 py-2.5 rounded-lg font-medium hover:bg-indigo-100 transition cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Draft (Products Subtotal)</span>
        </button>
      </div>
    </div>
  );
}