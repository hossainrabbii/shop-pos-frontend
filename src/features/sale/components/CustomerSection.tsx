"use client";
import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";

export default function CustomerSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
        <User className="w-5 h-5 text-gray-500" />
        <h2>Customer</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("customer.name")}
            placeholder="Customer full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
          />
          {(errors.customer as any)?.name && (
            <p className="text-red-500 text-xs mt-1">
              {(errors.customer as any).name.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            {...register("customer.phone")}
            placeholder="01XXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
          />
          {(errors.customer as any)?.phone && (
            <p className="text-red-500 text-xs mt-1">
              {(errors.customer as any).phone.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          {...register("customer.address")}
          rows={2}
          placeholder="House, road, area, city"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
