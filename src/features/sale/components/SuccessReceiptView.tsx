"use client";
import { CheckCircle2 } from "lucide-react";
import ThermalReceipt from "@/components/modules/sale/ThermalReceipt/ThermalReceiptProps";

interface SuccessReceiptViewProps {
  receiptData: any;
  onReset: () => void;
}

export default function SuccessReceiptView({
  receiptData,
  onReset,
}: SuccessReceiptViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="mb-6 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Sale Created Successfully!
        </h2>
        <p className="text-sm text-gray-500">
          Invoice{" "}
          <span className="font-semibold text-gray-700">
            {receiptData.invoiceNumber}
          </span>{" "}
          has been generated.
        </p>
      </div>

      <div className="mb-6 shadow-md rounded-xl overflow-hidden bg-white p-4">
        <ThermalReceipt receiptData={receiptData} />
      </div>

      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition cursor-pointer shadow-sm"
        >
          Print Receipt
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition cursor-pointer shadow-sm"
        >
          Create Another Sale
        </button>
      </div>
    </div>
  );
}
