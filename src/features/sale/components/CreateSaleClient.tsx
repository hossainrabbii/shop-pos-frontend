"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileDown } from "lucide-react";
import { createSaleService } from "@/features/sale/sale.service";
import { createSaleValidation } from "@/features/sale/sale.validation";
import { Product } from "@/features/sale/sale.type";
import SuccessReceiptView from "@/features/sale/components/SuccessReceiptView";
import CustomerSection from "@/features/sale/components/CustomerSection";
import ProductItemsSection from "@/features/sale/components/ProductItemsSection";
import PaymentSummarySection from "@/features/sale/components/PaymentSummarySection";
import { fetchProducts } from "@/features/product/product.service";

type SaleFormValues = z.infer<typeof createSaleValidation>;

export default function CreateSaleClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await fetchProducts();
        if (response?.success && Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProductsData();
  }, []);

  const methods = useForm<SaleFormValues>({
    resolver: zodResolver(createSaleValidation),
    defaultValues: {
      customer: { name: "", phone: "", address: "" },
      items: [{ productId: "", quantity: 1, warrantyMonths: undefined }],
      discount: 0,
      paidAmount: 0,
    },
  });

  const { handleSubmit, watch, reset, getValues } = methods;
  const watchedItems = watch("items") || [];
  const watchedDiscount = watch("discount") || 0;
  const watchedPaidAmount = watch("paidAmount") || 0;

  const subtotal = watchedItems.reduce((acc, item) => {
    const product = products.find((p) => p._id === item.productId);
    if (!product) return acc;
    return acc + (product.sellingPrice || 0) * (item.quantity || 1);
  }, 0);

  const totalAmount = Math.max(0, subtotal - watchedDiscount);
  const dueAmount = Math.max(0, totalAmount - watchedPaidAmount);

  // Trigger browser print for the hidden draft template
  const handleDownloadDraft = () => {
    const currentValues = getValues();
    const activeItems = currentValues.items.filter((item) => item.productId);

    if (activeItems.length === 0) {
      toast.warning("Please select at least one product to download a draft.");
      return;
    }

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const onSubmit = async (data: SaleFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        customer: data.customer,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          ...(item.warrantyMonths !== undefined && item.warrantyMonths > 0
            ? { warrantyMonths: item.warrantyMonths }
            : {}),
        })),
        discount: data.discount || 0,
        paidAmount: data.paidAmount,
        ...(data.dueCommitmentMonths !== undefined
          ? { dueCommitmentMonths: data.dueCommitmentMonths }
          : {}),
      };

      const response = await createSaleService(payload);
      if (response?.success) {
        toast.success(response?.message || "Sale created successfully!");
        setReceiptData(response.data);
        setIsCompleted(true);
        reset();
      } else {
        toast.warning(response?.message || "Failed to create sale");
      }
    } catch (error: any) {
      console.error("Error creating sale:", error);
      toast.error(
        error?.message || "An error occurred while creating the sale.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted && receiptData) {
    return (
      <SuccessReceiptView
        receiptData={receiptData}
        onReset={() => {
          setIsCompleted(false);
          setReceiptData(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      {/* Hidden Printable Draft Template: Shop Info, Items, Warranty, Discount & Totals (No Customer) */}
      <div className="hidden print:block print:p-8 bg-white text-black font-sans">
        <div className="text-center pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">ShopPOS Enterprise</h2>
          <p className="text-xs text-gray-500 mt-0.5">Product Price Estimate / Quotation Draft</p>
          <p className="text-xs text-gray-500 mt-1">
            Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="border-b border-gray-300 text-xs font-semibold uppercase text-gray-700">
              <th className="py-2.5">Item / Product Name</th>
              <th className="py-2.5 text-center">Qty</th>
              <th className="py-2.5 text-center">Warranty</th>
              <th className="py-2.5 text-right">Unit Price</th>
              <th className="py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {watchedItems.map((item, index) => {
              const product = products.find((p) => p._id === item.productId);
              if (!product) return null;
              const unitPrice = product.sellingPrice || 0;
              const lineTotal = unitPrice * (item.quantity || 1);
              return (
                <tr key={index}>
                  <td className="py-3 font-medium text-gray-900">{product.name || "Product"}</td>
                  <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-center text-gray-600">
                    {item.warrantyMonths ? `${item.warrantyMonths} Months` : "No Warranty"}
                  </td>
                  <td className="py-3 text-right text-gray-600">BDT {unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">BDT {lineTotal.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end pt-4 border-t border-gray-300">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">BDT {subtotal.toLocaleString()}</span>
            </div>
            {watchedDiscount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount:</span>
                <span className="font-semibold text-rose-600">- BDT {watchedDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Amount:</span>
              <span>BDT {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-xs text-gray-400 border-t pt-4">
          This is a system-generated quotation draft. No customer details attached.
        </div>
      </div>

      {/* Normal Dashboard UI Screen */}
      <div className="print:hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>
            <p className="text-sm text-gray-500">
              Add customer details, products and payment to generate an invoice.
            </p>
          </div>
          
          {/* Download Draft Button */}
          <button
            type="button"
            onClick={handleDownloadDraft}
            className="inline-flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-100 transition cursor-pointer shadow-2xs w-fit"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Draft (No Customer)</span>
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) =>
              console.log("Form Validation Failed:", errors),
            )}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <CustomerSection />
              <ProductItemsSection
                products={products}
                isLoadingProducts={isLoadingProducts}
              />
            </div>

            <PaymentSummarySection
              subtotal={subtotal}
              totalAmount={totalAmount}
              dueAmount={dueAmount}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}