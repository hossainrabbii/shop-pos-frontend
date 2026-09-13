"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Power,
  AlertTriangle,
} from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Category, CategoryFormData } from "../category.type";
import { categorySchema } from "../category.validation";
import {
  createCategory,
  fetchCategoryList,
  updateCategory,
} from "../category.service";

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Custom Confirmation Modal States with dynamic messaging
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "activate" | "deactivate";
    targetCategory: Category | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: "activate",
    targetCategory: null,
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Fetch all categories on load
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCategoryList();
      setCategories(response.data || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Modal for Create or Edit
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setValue("name", category.name);
      setValue("description", category.description || "");
    } else {
      setEditingCategory(null);
      reset({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  // Submit Form (Create or Update)
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const response = await updateCategory(editingCategory._id, data);
        toast.success(response?.message || "Category updated successfully");
      } else {
        const response = await createCategory(data);
        toast.success(response?.message || "Category created successfully");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Confirmation Modal for Status Toggle
  const promptStatusToggle = (category: Category) => {
    const willBeActive = !category.isActive;
    setConfirmModal({
      isOpen: true,
      title: willBeActive ? "Activate Category" : "Deactivate Category",
      message: willBeActive
        ? `Are you sure you want to activate "${category.name}"? It will become visible and available for use in product listings.`
        : `Are you sure you want to deactivate "${category.name}"? It will be hidden from active inventory operations.`,
      actionType: willBeActive ? "activate" : "deactivate",
      targetCategory: category,
    });
  };

  // Execute Confirmed Status Change Action
  const handleExecuteAction = async () => {
    const { targetCategory, actionType } = confirmModal;
    if (!targetCategory) return;

    const newStatus = actionType === "activate";
    setIsActionLoading(true);
    try {
      const response = await updateCategory(targetCategory._id, {
        isActive: newStatus,
      });
      toast.success(
        response?.message || `Category ${actionType}d successfully`,
      );
      setConfirmModal({
        isOpen: false,
        title: "",
        message: "",
        actionType: "activate",
        targetCategory: null,
      });
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" /> Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize your shop stock by creating and maintaining item
            categories.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Categories Responsive View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            {/* <Loader2 className="w-8 h-8 animate-spin text-indigo-600" /> */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-xs font-semibold text-slate-400">
              Loading categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              No categories found
            </p>
            <p className="text-xs text-slate-400">
              Get started by creating your first catalog category.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Description</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {cat.name}
                      </td>
                      <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                        {cat.description || (
                          <span className="text-slate-300 italic">
                            No description
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {cat.isActive ? (
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
                          onClick={() => handleOpenModal(cat)}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition inline-flex items-center cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => promptStatusToggle(cat)}
                          className={`p-1.5 rounded-lg transition inline-flex items-center cursor-pointer ${
                            cat.isActive
                              ? "bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600"
                              : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600"
                          }`}
                          title={
                            cat.isActive
                              ? "Deactivate Category"
                              : "Activate Category"
                          }
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="p-4 space-y-3 hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cat.description || (
                          <span className="text-slate-300 italic">
                            No description
                          </span>
                        )}
                      </p>
                    </div>
                    {cat.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold shrink-0">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => promptStatusToggle(cat)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        cat.isActive
                          ? "bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700"
                          : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />{" "}
                      {cat.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-bold text-slate-900 text-base">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g., Electronics & Gadgets"
                  className="w-full px-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs"
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Description{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  placeholder="Brief details about this product category..."
                  className="w-full px-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 shadow-xs resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <div className="w-36">
                  <LoadingButton
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    type="submit"
                  >
                    {editingCategory ? "Update Changes" : "Create Category"}
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog Modal for Activate / Deactivate */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                confirmModal.actionType === "activate"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="font-bold text-slate-900 text-base">
                {confirmModal.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setConfirmModal({
                    isOpen: false,
                    title: "",
                    message: "",
                    actionType: "activate",
                    targetCategory: null,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <div className="w-full">
                <LoadingButton
                  isLoading={isActionLoading}
                  loadingText="Processing..."
                  onClick={handleExecuteAction}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold text-white transition ${
                    confirmModal.actionType === "activate"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  Confirm
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
