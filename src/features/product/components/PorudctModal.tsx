"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   productSchema,
//   ProductInput,
//   ProductFormData,
// } from "@/schemas/product.schema";
// import { Product, CategoryOption } from "@/types/product.interface";
import { X } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ProductFormData, ProductInput, productSchema } from "../product.validation";
import { CategoryOption, Product } from "../product.type";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  editingProduct: Product | null;
  categories: CategoryOption[];
  isSubmitting: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories,
  isSubmitting,
}: ProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput, any, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: 0,
      lowStockThreshold: 5,
      description: "",
      image: "",
    },
  });

  // FIX: Reset form values dynamically whenever modal opens or editingProduct changes!
  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name || "",
        categoryId: editingProduct.categoryId?._id || "",
        purchasePrice: editingProduct.purchasePrice ?? 0,
        sellingPrice: editingProduct.sellingPrice ?? 0,
        quantity: editingProduct.quantity ?? 0,
        lowStockThreshold: editingProduct.lowStockThreshold ?? 5,
        description: editingProduct.description || "",
        image: editingProduct.image || "",
      });
    } else {
      reset({
        name: "",
        categoryId: categories[0]?._id || "",
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: 0,
        lowStockThreshold: 5,
        description: "",
        image: "",
      });
    }
  }, [editingProduct, categories, isOpen, reset]);

  const handleFormSubmit: SubmitHandler<ProductFormData> = async (data) => {
    await onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs px-4 overflow-y-auto py-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-6 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-bold text-slate-900 text-base">
            {editingProduct ? "Edit Product Item" : "Add New Product Stock"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g., Wireless Mechanical Keyboard"
              className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs"
            />
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("categoryId")}
              className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-rose-600 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Purchase Price (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("purchasePrice")}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium border-slate-300"
              />
              {errors.purchasePrice && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Selling Price (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("sellingPrice")}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium border-slate-300"
              />
              {errors.sellingPrice && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.sellingPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Initial Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                {...register("quantity")}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium border-slate-300"
              />
              {errors.quantity && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Low Stock Alert Level
              </label>
              <input
                type="number"
                {...register("lowStockThreshold")}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium border-slate-300"
              />
              {errors.lowStockThreshold && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors.lowStockThreshold.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              {...register("description")}
              placeholder="Product specs..."
              className="w-full px-4 py-2.5 bg-white text-slate-900 border rounded-lg text-sm font-medium border-slate-300 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <div className="w-36">
              <LoadingButton
                isLoading={isSubmitting}
                loadingText="Saving..."
                type="submit"
              >
                {editingProduct ? "Update Changes" : "Save Product"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
