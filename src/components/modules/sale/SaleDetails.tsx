"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { ISale } from "@/types/sale";
import {
  addSalePayment,
  getSaleById,
} from "@/services/Sale";

import {
  formatCurrency,
  formatSaleDate,
} from "./sale.utils";

interface Props {
  saleId: string | null;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const SaleDetails = ({
  saleId,
  onClose,
  onPaymentSuccess,
}: Props) => {
  const [sale, setSale] =
    useState<ISale | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  useEffect(() => {
    if (!saleId) {
      setSale(null);
      return;
    }

    const loadSale = async () => {
      try {
        setLoading(true);

        const result =
          await getSaleById(saleId);

        setSale(result);
      } finally {
        setLoading(false);
      }
    };

    loadSale();
  }, [saleId]);

  if (!saleId) {
    return null;
  }

  const handlePayment = async () => {
    if (!sale) return;

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      return;
    }

    if (amount > sale.dueAmount) {
      return;
    }

    try {
      setPaymentLoading(true);

      const updated =
        await addSalePayment(
          sale._id,
          { amount },
        );

      setSale(updated);
      setPaymentAmount("");

      onPaymentSuccess();
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">
              Sale Details
            </h2>

            {sale && (
              <p className="text-sm text-muted-foreground">
                {sale.invoiceNumber}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-muted-foreground">
            Loading sale...
          </div>
        ) : sale ? (
          <div className="space-y-6 p-6">
            {/* Customer */}
            <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 font-medium">
                  {sale.customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 font-medium">
                  {sale.customer.phone ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Date
                </p>

                <p className="mt-1 font-medium">
                  {formatSaleDate(
                    sale.createdAt,
                  )}
                </p>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="mb-3 font-semibold">
                Products
              </h3>

              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        Product
                      </th>

                      <th className="px-4 py-3 text-right">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-right">
                        Price
                      </th>

                      <th className="px-4 py-3 text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {sale.items.map(
                      (item, index) => {
                        const product =
                          typeof item.product ===
                          "string"
                            ? null
                            : item.product;

                        return (
                          <tr
                            key={`${sale._id}-${index}`}
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium">
                                {product?.name ||
                                  "Product"}
                              </div>

                              {product?.sku && (
                                <div className="text-xs text-muted-foreground">
                                  {product.sku}
                                </div>
                              )}

                              {item.warrantyMonths !==
                                undefined && (
                                <div className="text-xs text-muted-foreground">
                                  Warranty:{" "}
                                  {
                                    item.warrantyMonths
                                  }{" "}
                                  months
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {item.quantity}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {formatCurrency(
                                item.unitPrice,
                              )}
                            </td>

                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(
                                item.subtotal,
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="ml-auto max-w-sm space-y-2 rounded-xl border p-4">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  {formatCurrency(
                    sale.subtotal,
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <span>
                  -{" "}
                  {formatCurrency(
                    sale.discount,
                  )}
                </span>
              </div>

              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>

                <span>
                  {formatCurrency(
                    sale.totalAmount,
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Paid</span>

                <span>
                  {formatCurrency(
                    sale.paidAmount,
                  )}
                </span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Due</span>

                <span>
                  {formatCurrency(
                    sale.dueAmount,
                  )}
                </span>
              </div>
            </div>

            {/* Receive Payment */}
            {sale.dueAmount > 0 && (
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold">
                  Receive Due Payment
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Outstanding due:{" "}
                  {formatCurrency(
                    sale.dueAmount,
                  )}
                </p>

                <div className="mt-4 flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max={sale.dueAmount}
                    value={paymentAmount}
                    onChange={(event) =>
                      setPaymentAmount(
                        event.target.value,
                      )
                    }
                    placeholder="Payment amount"
                    className="h-10 flex-1 rounded-lg border px-3 text-sm"
                  />

                  <button
                    type="button"
                    disabled={
                      paymentLoading
                    }
                    onClick={
                      handlePayment
                    }
                    className="rounded-lg bg-black px-5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {paymentLoading
                      ? "Processing..."
                      : "Receive Payment"}
                  </button>
                </div>
              </div>
            )}

            {/* Payment history */}
            <div>
              <h3 className="mb-3 font-semibold">
                Payment History
              </h3>

              <div className="space-y-2">
                {sale.payments.map(
                  (payment, index) => {
                    const receiver =
                      typeof payment.receivedBy ===
                      "string"
                        ? payment.receivedBy
                        : payment.receivedBy.name;

                    return (
                      <div
                        key={`${sale._id}-payment-${index}`}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(
                              payment.amount,
                            )}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Received by{" "}
                            {receiver}
                          </p>
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {formatSaleDate(
                            payment.paidAt,
                          )}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SaleDetails;