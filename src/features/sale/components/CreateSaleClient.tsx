"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
      customer: {
        name: "",
        phone: "",
        address: "",
      },
      items: [
        {
          productId: "",
          quantity: 1,
          warrantyMonths: undefined,
        },
      ],
      discount: 0,
      paidAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = methods;

  const watchedItems = watch("items") || [];
  const watchedDiscount = watch("discount") || 0;
  const watchedPaidAmount = watch("paidAmount") || 0;

  // ---------------------------------------------------------
  // Calculate subtotal
  // ---------------------------------------------------------

  const subtotal = watchedItems.reduce((acc, item) => {
    const product = products.find(
      (p) => p._id === item.productId,
    );

    if (!product) return acc;

    return (
      acc +
      (product.sellingPrice || 0) * (item.quantity || 1)
    );
  }, 0);

  // ---------------------------------------------------------
  // Calculate gross profit BEFORE discount
  // ---------------------------------------------------------

  const grossProfitBeforeDiscount = watchedItems.reduce(
    (acc, item) => {
      const product = products.find(
        (p) => p._id === item.productId,
      );

      if (!product) return acc;

      const quantity = item.quantity || 1;

      const sellingPrice = product.sellingPrice || 0;
      const purchasePrice = product.purchasePrice || 0;

      const itemProfit =
        (sellingPrice - purchasePrice) * quantity;

      return acc + itemProfit;
    },
    0,
  );

  // ---------------------------------------------------------
  // Maximum discount allowed
  // ---------------------------------------------------------

  const maximumDiscount = Math.max(
    0,
    grossProfitBeforeDiscount,
  );

  // ---------------------------------------------------------
  // Gross profit AFTER discount
  // ---------------------------------------------------------

  const grossProfitAfterDiscount =
    grossProfitBeforeDiscount - watchedDiscount;

  // ---------------------------------------------------------
  // Total amount
  // ---------------------------------------------------------

  const totalAmount = Math.max(
    0,
    subtotal - watchedDiscount,
  );

  // ---------------------------------------------------------
  // Due amount
  // ---------------------------------------------------------

  const dueAmount = Math.max(
    0,
    totalAmount - watchedPaidAmount,
  );

  // ---------------------------------------------------------
  // Submit sale
  // ---------------------------------------------------------

  const onSubmit = async (data: SaleFormValues) => {
    /*
     * Prevent discount from being greater than
     * the gross profit of the current sale.
     */
    if (data.discount > maximumDiscount) {
      toast.error(
        `Discount cannot exceed BDT ${maximumDiscount.toLocaleString()}. This discount would result in a loss.`,
      );

      return;
    }

    /*
     * Extra protection:
     * Final gross profit must never be negative.
     */
    if (grossProfitAfterDiscount < 0) {
      toast.error(
        "This discount would result in a loss. Please reduce the discount.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        customer: data.customer,

        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,

          ...(item.warrantyMonths !== undefined &&
          item.warrantyMonths > 0
            ? {
                warrantyMonths: item.warrantyMonths,
              }
            : {}),
        })),

        discount: data.discount || 0,

        paidAmount: data.paidAmount,

        ...(data.dueCommitmentMonths !== undefined
          ? {
              dueCommitmentMonths:
                data.dueCommitmentMonths,
            }
          : {}),
      };

      const response = await createSaleService(payload);

      if (response?.success) {
        toast.success(
          response?.message ||
            "Sale created successfully!",
        );

        setReceiptData(response.data);
        setIsCompleted(true);

        reset();
      } else {
        toast.warning(
          response?.message ||
            "Failed to create sale",
        );
      }
    } catch (error: any) {
      console.error(
        "Error creating sale:",
        error,
      );

      toast.error(
        error?.message ||
          "An error occurred while creating the sale.",
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          New Sale
        </h1>

        <p className="text-sm text-gray-500">
          Add customer details, products and payment to
          generate an invoice.
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            onSubmit,
            (errors) =>
              console.log(
                "Form Validation Failed:",
                errors,
              ),
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
            grossProfit={grossProfitAfterDiscount}
            maximumDiscount={maximumDiscount}
            isSubmitting={isSubmitting}
          />
        </form>
      </FormProvider>
    </div>
  );
}