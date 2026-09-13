"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Store,
  Building2,
  Save,
  ShieldCheck,
  UserCheck,
  ReceiptText,
} from "lucide-react";
import {
  IShopFormValues,
  shopFormSchema,
} from "@/features/shop/shop.validation";
import {
  createShopSettings,
  getShopSettings,
  updateShopSettings,
} from "@/features/shop/shop.service";

interface UserProfile {
  name: string;
  email: string;
  role?: string;
}

export default function WorkspaceClient() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasShopRecord, setHasShopRecord] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      alternativePhone: "",
      email: "",
      address: "",
      city: "",
      website: "",
      receiptFooter: "Thank you for your purchase!",
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from storage", e);
      }
    }

    const fetchShopData = async () => {
      try {
        const data = await getShopSettings();
        if (data) {
          reset({
            name: data.name || "",
            phone: data.phone || "",
            alternativePhone: data.alternativePhone || "",
            email: data.email || "",
            address: data.address || "",
            city: data.city || "",
            website: data.website || "",
            receiptFooter: data.receiptFooter || "Thank you for your purchase!",
          });
          setHasShopRecord(true);
        }
        console.log(data);
      } catch (error) {
        console.log("No shop data found yet:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchShopData();
  }, [reset]);

  const onSubmit = async (data: IShopFormValues) => {
    setIsLoading(true);
    try {
      if (hasShopRecord) {
        await updateShopSettings(data);
        toast.success("Workspace settings updated successfully!");
      } else {
        await createShopSettings(data);
        setHasShopRecord(true);
        toast.success("Workspace settings created successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to save workspace settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" /> Workspace & Store
            Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your company profile and control the details printed on
            customer invoices and receipts.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <ReceiptText className="w-4 h-4" /> Live Receipt Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-indigo-600" /> General Store
            Information
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. ShopPOS Enterprise"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Email
                </label>
                <input
                  type="text"
                  {...register("email")}
                  placeholder="support@shoppos.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
                />
                {errors.email && (
                  <p className="text-[10px] text-rose-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Phone
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
                />
                {errors.phone && (
                  <p className="text-[10px] text-rose-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alternative Phone
                </label>
                <input
                  type="text"
                  {...register("alternativePhone")}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
                />
                {errors.alternativePhone && (
                  <p className="text-[10px] text-rose-500 mt-1">
                    {errors.alternativePhone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Region
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="e.g. Dhaka"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
                />
                {errors.city && (
                  <p className="text-[10px] text-rose-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  {...register("website")}
                  placeholder="https://yourstore.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
                />
                {errors.website && (
                  <p className="text-[10px] text-rose-500 mt-1">
                    {errors.website.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Physical Store Address
              </label>
              <textarea
                rows={2}
                {...register("address")}
                placeholder="Full street address or storefront location"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600 resize-none"
              ></textarea>
              {errors.address && (
                <p className="text-[10px] text-rose-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt Footer Message
              </label>
              <input
                type="text"
                {...register("receiptFooter")}
                placeholder="Thank you for your purchase!"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-700 focus:border-indigo-600"
              />
              {errors.receiptFooter && (
                <p className="text-[10px] text-rose-500 mt-1">
                  {errors.receiptFooter.message}
                </p>
              )}
              <span className="text-[10px] text-slate-400 mt-1 block">
                Printed at the very bottom of customer checkout receipts.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving Settings..." : "Save Workspace Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Logged In User
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser?.name
                    ? currentUser.name.charAt(0).toUpperCase()
                    : "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name || "Administrator"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentUser?.email || "admin@shop.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                  Access Level:
                </span>
                <span className="font-bold text-slate-900 uppercase bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                  {currentUser?.role || "Owner / Admin"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <h3 className="text-xs font-bold tracking-wider text-indigo-300 uppercase mb-2">
              Receipt Integration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Any changes made to your store name, contact numbers, or address
              will instantly sync to your print receipts and invoice headers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
