"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Minus, User, ShoppingCart } from "lucide-react";
import { getProducts } from "@/services/Product";
import { createSaleService } from "@/services/sale.service";
import { toast } from "sonner";
// Import your actual createSale service here:
// import { createSaleService } from "@/services/Sale";

// --- 1. Zod Validation & Types ---
const createSaleValidation = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Minimum quantity is 1"),
        warrantyMonths: z.number().min(0).optional(),
      }),
    )
    .min(1, "At least one product is required"),
  discount: z.number().min(0).optional(),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),
  dueCommitmentMonths: z.number().min(1).optional(),
});

type SaleFormValues = z.infer<typeof createSaleValidation>;

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  isActive: boolean;
}

export default function CreateSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await getProducts(token as string);

        if (response?.success && Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(createSaleValidation),
    defaultValues: {
      customer: { name: "", phone: "", address: "" },
      items: [{ productId: "", quantity: 1, warrantyMonths: undefined }],
      discount: 0,
      paidAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch fields for calculations & duplicate prevention
  const watchedItems = watch("items") || [];
  const watchedDiscount = watch("discount") || 0;
  const watchedPaidAmount = watch("paidAmount") || 0;

  // Gather all currently selected product IDs to disable them in other dropdowns
  const selectedProductIds = watchedItems
    .map((item) => item.productId)
    .filter(Boolean);

  // Calculations
  const subtotal = watchedItems.reduce((acc, item) => {
    const product = products.find((p) => p._id === item.productId);
    if (!product) return acc;
    return acc + (product.sellingPrice || 0) * (item.quantity || 1);
  }, 0);

  const totalAmount = Math.max(0, subtotal - watchedDiscount);
  const dueAmount = Math.max(0, totalAmount - watchedPaidAmount);

  const onSubmit = async (data: SaleFormValues) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      // Format payload to match backend schema requirements (sending only productId and quantity per item, plus optional fields)
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

      console.log(payload, token);
      // Call your backend API service here
      const response = await createSaleService(payload, token);

      console.log("Submitting Payload to Backend:", payload);

      // Simulated success block (Uncomment when you link your real service)
      if (response.success) {
        toast.success(response?.message || "Sale created successfully!");
        reset();
      } else {
        toast.warning(response?.message || "Failed to create sale");

        // alert(response.message || "Failed to create sale");
      }

      // alert("Sale payload prepared successfully! Check console.");
    } catch (error: any) {
      console.error("Error creating sale:", error);
      alert(error?.message || "An error occurred while creating the sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>
        <p className="text-sm text-gray-500">
          Add customer details, products and payment to generate an invoice.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left 2 Columns: Customer & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
              <User className="w-5 h-5 text-gray-500" />
              <h2>Customer</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  {...register("customer.name")}
                  placeholder="Customer full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
                />
                {errors.customer?.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customer.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register("customer.phone")}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (optional)
              </label>
              <textarea
                {...register("customer.address")}
                rows={2}
                placeholder="House, road, area, city"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <ShoppingCart className="w-5 h-5 text-gray-500" />
                <h2>Products</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  append({
                    productId: "",
                    quantity: 1,
                    warrantyMonths: undefined,
                  })
                }
                className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add product
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const currentProductId = watchedItems[index]?.productId;
                const selectedProduct = products.find(
                  (p) => p._id === currentProductId,
                );
                const currentQty = watchedItems[index]?.quantity || 1;
                const itemSubtotal = selectedProduct
                  ? (selectedProduct.sellingPrice || 0) * currentQty
                  : 0;

                const handleDecrement = () => {
                  if (currentQty > 1) {
                    setValue(`items.${index}.quantity`, currentQty - 1, {
                      shouldValidate: true,
                    });
                  }
                };

                const handleIncrement = () => {
                  setValue(`items.${index}.quantity`, currentQty + 1, {
                    shouldValidate: true,
                  });
                };

                return (
                  <div
                    key={field.id}
                    className="p-2 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col md:flex-row gap-4 items-start md:items-center"
                  >
                    {/* Product Dropdown */}
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Product
                      </label>
                      <select
                        {...register(`items.${index}.productId`)}
                        disabled={isLoadingProducts}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 disabled:bg-gray-100"
                      >
                        <option value="" className="text-gray-400">
                          {isLoadingProducts
                            ? "Loading products..."
                            : "Select a product"}
                        </option>
                        {products.map((prod) => {
                          const isAlreadySelected =
                            selectedProductIds.includes(prod._id) &&
                            currentProductId !== prod._id;
                          const isOutOfStock = prod.quantity <= 0;

                          return (
                            <option
                              key={prod._id}
                              value={prod._id}
                              disabled={isOutOfStock || isAlreadySelected}
                              className={
                                isAlreadySelected
                                  ? "text-gray-400 bg-gray-100 italic"
                                  : "text-gray-700"
                              }
                            >
                              {prod.name} · BDT{" "}
                              {(prod.sellingPrice || 0).toLocaleString()}
                              {isOutOfStock
                                ? " (out of stock)"
                                : isAlreadySelected
                                  ? " (already added)"
                                  : ` (${prod.quantity} in stock)`}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Quantity Stepper (- 1 +) */}
                    <div className="w-26">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Qty
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={handleDecrement}
                          className="px-2.5 py-2 text-gray-500 hover:bg-gray-100 transition border-r border-gray-300 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          className="w-full text-center py-2 text-sm focus:outline-none text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={handleIncrement}
                          className="px-2.5 py-2 text-gray-500 hover:bg-gray-100 transition border-l border-gray-300 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Warranty */}
                    <div className="w-22">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Warranty (mo)
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="—"
                        {...register(`items.${index}.warrantyMonths`, {
                          valueAsNumber: true,
                        })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-gray-700 placeholder-gray-400"
                      />
                    </div>

                    {/* Price & Delete */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0">
                      <div className="text-right font-semibold text-sm text-gray-900 min-w-[90px]">
                        BDT {itemSubtotal.toLocaleString()}
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 p-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.items && (
              <p className="text-red-500 text-xs mt-2">
                {errors.items.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Payment Summary Sidebar */}
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
                placeholder="e.g. 3"
                {...register("dueCommitmentMonths", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isSubmitting ? "Creating sale..." : "Create sale"}
          </button>
        </div>
      </form>
    </div>
  );
}
