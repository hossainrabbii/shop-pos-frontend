import { getShopSettings } from "@/features/shop/shop.service";
import React, { useEffect, useState } from "react";

interface ThermalReceiptProps {
  receiptData: {
    invoiceNumber: string;
    createdAt: string;
    customer?: { name: string; phone?: string; address?: string };
    soldBy?: { name: string };
    items: Array<{
      product: { name: string; sku?: string };
      quantity: number;
      unitPrice: number;
      warrantyMonths?: number;
      subtotal: number;
    }>;
    subTotal?: number; // Optional if provided directly by backend
    discount?: number; // Optional discount amount
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    dueCommitmentMonths?: number;
  };
  shopInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
    receiptFooter?: string;
  };
}

export default function ThermalReceipt({
  receiptData,
  shopInfo,
}: ThermalReceiptProps) {
  const [fetchedShop, setFetchedShop] = useState<any>(null);

  useEffect(() => {
    // Only fetch if shopInfo prop wasn't passed down externally
    if (!shopInfo) {
      const fetchShop = async () => {
        try {
          const response = await getShopSettings();
          if (response) {
            setFetchedShop(response);
          }
        } catch (error) {
          console.log(
            "Could not load shop settings from backend, using default demo values.",
            error,
          );
        }
      };
      fetchShop();
    }
  }, [shopInfo]);

  // Merge shopInfo prop, backend fetched shop, or fallback demo info
  const activeShop = shopInfo ||
    fetchedShop || {
      name: "YOUR SHOP NAME",
      address: "123 Market Road, Dhaka",
      phone: "+880 1700-000000",
      website: "",
      receiptFooter: "Thank you for your purchase!",
    };

  // Automatically calculate subtotal from items if receiptData.subTotal isn't explicitly passed
  const calculatedSubTotal =
    receiptData.subTotal !== undefined
      ? receiptData.subTotal
      : receiptData.items.reduce((acc, item) => acc + item.subtotal, 0);

  // Calculate discount if not explicitly passed
  const discountAmount =
    receiptData.discount !== undefined
      ? receiptData.discount
      : Math.max(0, calculatedSubTotal - receiptData.totalAmount);

  return (
    <div className="flex flex-col items-center">
      {/* Printable Receipt Container (Width-constrained to standard 80mm thermal paper) */}
      <div
        id="thermal-receipt"
        className="w-[80mm] p-2 bg-white text-black font-mono text-[11px] leading-tight select-none"
      >
        {/* Header - Shop Info */}
        <div className="text-center space-y-0.5 mb-2">
          {activeShop.name && (
            <h1 className="text-sm font-bold uppercase tracking-wider">
              {activeShop.name}
            </h1>
          )}
          {activeShop.address && (
            <p className="text-[10px] text-zinc-600">{activeShop.address}</p>
          )}
          {activeShop.phone && (
            <p className="text-[10px] text-zinc-600">
              Phone: {activeShop.phone}
            </p>
          )}
          {activeShop.website && (
            <p className="text-[10px] text-zinc-600">{activeShop.website}</p>
          )}
        </div>

        <div className="border-b border-black border-dashed my-1" />

        {/* Invoice & Date/Time in Same Row / Meta Data */}
        <div className="space-y-0.5 text-[10px] mb-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              Inv: {receiptData.invoiceNumber}
            </span>
            <span>
              {new Date(receiptData.createdAt || Date.now()).toLocaleString()}
            </span>
          </div>

          <div className="border-b border-black border-dotted my-1" />

          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-semibold">
              {receiptData.customer?.name || "Walk-in"}
            </span>
          </div>
          {receiptData.customer?.phone && (
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{receiptData.customer.phone}</span>
            </div>
          )}
          {receiptData.customer?.address && (
            <div className="flex justify-between">
              <span>Address:</span>
              <span className="text-right truncate max-w-[150px]">
                {receiptData.customer.address}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Served By:</span>
            <span>{receiptData.soldBy?.name || "Staff"}</span>
          </div>
        </div>

        <div className="border-b border-black border-dashed my-1" />

        {/* Items Table Header */}
        <div className="flex justify-between font-bold border-b border-black pb-1 mb-1 text-[10px]">
          <span className="w-5/12">ITEM</span>
          <span className="w-2/12 text-center">QTY</span>
          <span className="w-2/12 text-right">PRICE</span>
          <span className="w-3/12 text-right">TOTAL</span>
        </div>

        {/* Items List with Optional Warranty Info */}
        <div className="space-y-1.5 mb-2">
          {receiptData.items?.map((item, idx) => {
            const hasWarranty =
              item.warrantyMonths !== undefined && item.warrantyMonths > 0;

            return (
              <div
                key={idx}
                className="flex flex-col text-[10px] border-b border-gray-100 pb-1"
              >
                <div className="flex justify-between items-start">
                  <span className="w-5/12 truncate pr-1 font-medium">
                    {item.product?.name}
                  </span>
                  <span className="w-2/12 text-center">{item.quantity}</span>
                  <span className="w-2/12 text-right">{item.unitPrice}</span>
                  <span className="w-3/12 text-right font-semibold">
                    {item.subtotal}
                  </span>
                </div>
                {hasWarranty && (
                  <div className="text-[9px] text-zinc-500 italic mt-0.5">
                    Warranty: {item.warrantyMonths} Month(s)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-b border-black border-dashed my-1" />

        {/* Summary Totals (Includes Subtotal, Discount, Total, Paid, Due) */}
        <div className="space-y-1 text-[10px] mb-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>BDT {calculatedSubTotal.toLocaleString()}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-zinc-700">
              <span>Discount:</span>
              <span>- BDT {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-black border-dotted pt-1">
            <span>Total Amount:</span>
            <span className="font-bold">
              BDT {receiptData.totalAmount?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Paid Amount:</span>
            <span>BDT {receiptData.paidAmount?.toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-bold border-t border-black pt-1 mt-1">
            <span>Due Amount:</span>
            <span>BDT {receiptData.dueAmount?.toLocaleString()}</span>
          </div>
        </div>

        {/* Due Commitments at the bottom of the receipt */}
        {receiptData.dueAmount > 0 && receiptData.dueCommitmentMonths && (
          <div className="text-[10px] text-center border border-black border-dashed p-1 rounded my-2 bg-zinc-50">
            <span className="font-semibold">Due Commitment: </span>
            <span>
              To be paid within {receiptData.dueCommitmentMonths} Month(s).
            </span>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center text-[10px] space-y-1 mt-4 pt-2 border-t border-black border-dashed">
          <p className="font-semibold">
            {activeShop.receiptFooter || "Thank you for your purchase!"}
          </p>
        </div>
      </div>

      {/* Global CSS to strip margins and page elements when triggered via window.print() */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt,
          #thermal-receipt * {
            visibility: visible;
          }
          #thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            margin: 0;
            padding: 4mm;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
