"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Power,
  AlertTriangle,
  Tag,
} from "lucide-react";

import { LoadingButton } from "@/components/ui/LoadingButton";
import { CategoryOption, Product } from "../product.type";
import {
  createProduct,
  fetchActiveCategories,
  fetchProducts,
  toggleProductStatus,
  updateProduct,
} from "../product.service";
import { ProductFormData } from "../product.validation";
import ProductModal from "./PorudctModal";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "activate" | "deactivate";
    targetProduct: Product | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: "activate",
    targetProduct: null,
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prodData, catData] = await Promise.all([
        fetchProducts(),
        fetchActiveCategories(),
      ]);

      setProducts(prodData?.data);

      setCategories(catData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, data);
        toast.success(res.message || "Product updated successfully");
      } else {
        const res = await createProduct(data);
        toast.success(res.message || "Product created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteStatusToggle = async () => {
    const { targetProduct, actionType } = confirmModal;
    if (!targetProduct) return;

    setIsActionLoading(true);
    try {
      const newStatus = actionType === "activate";
      await toggleProductStatus(targetProduct._id, newStatus);
      toast.success(`Product ${actionType}d successfully`);
      setConfirmModal({
        isOpen: false,
        title: "",
        message: "",
        actionType: "activate",
        targetProduct: null,
      });
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" /> Product Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage stock items, pricing, thresholds, and categories.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-xs font-semibold text-slate-400">
              Fetching product catalog...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              No products found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Product Details</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Pricing</th>
                    <th className="py-3.5 px-6">Stock Level</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {products.map((prod) => {
                    const isLowStock = prod.quantity <= prod.lowStockThreshold;
                    return (
                      <tr
                        key={prod._id}
                        className="hover:bg-slate-50/80 transition"
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">
                            {prod.name}
                          </div>
                          <div className="text-[11px] font-mono text-indigo-600 mt-0.5">
                            {prod.sku}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                            <Tag className="w-3 h-3 text-slate-400" />{" "}
                            {prod.categoryId?.name || "Unassigned"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-900 font-semibold">
                            ৳{prod.sellingPrice}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Cost: ৳{prod.purchasePrice}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-bold ${isLowStock ? "text-rose-600" : "text-slate-800"}`}
                          >
                            {prod.quantity} units {isLowStock && "(Low)"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {prod.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                title: prod.isActive
                                  ? "Deactivate Product"
                                  : "Activate Product",
                                message: `Are you sure you want to change status for "${prod.name}"?`,
                                actionType: prod.isActive
                                  ? "deactivate"
                                  : "activate",
                                targetProduct: prod,
                              })
                            }
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {products.map((prod) => (
                <div key={prod._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] font-mono text-indigo-600">
                        {prod.sku}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${prod.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {prod.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs bg-slate-50 p-2.5 rounded-xl text-slate-700">
                    <span>
                      Price: <strong>৳{prod.sellingPrice}</strong>
                    </span>
                    <span>
                      Stock:{" "}
                      <strong
                        className={
                          prod.quantity <= prod.lowStockThreshold
                            ? "text-rose-600"
                            : ""
                        }
                      >
                        {prod.quantity}
                      </strong>
                    </span>
                  </div>

                  <div className="flex gap-2 text-slate-700">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          title: prod.isActive ? "Deactivate" : "Activate",
                          message: `Change status of ${prod.name}?`,
                          actionType: prod.isActive ? "deactivate" : "activate",
                          targetProduct: prod,
                        })
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        prod.isActive
                          ? "bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700"
                          : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />{" "}
                      {prod.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingProduct={editingProduct}
        categories={categories}
        isSubmitting={isSubmitting}
      />

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
            <h2 className="font-bold text-slate-900 text-base">
              {confirmModal.title}
            </h2>
            <p className="text-xs text-slate-500">{confirmModal.message}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ ...confirmModal, isOpen: false })
                }
                className="py-2 border rounded-xl text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <LoadingButton
                isLoading={isActionLoading}
                loadingText="Processing..."
                onClick={handleExecuteStatusToggle}
                className="py-2 bg-indigo-600 text-white rounded-xl text-xs"
              >
                Confirm
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
