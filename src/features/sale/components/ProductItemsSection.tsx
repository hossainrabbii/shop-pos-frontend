"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Product } from "@/features/sale/sale.type";

interface ProductItemsSectionProps {
  products: Product[];
  isLoadingProducts: boolean;
}

export default function ProductItemsSection({
  products,
  isLoadingProducts,
}: ProductItemsSectionProps) {
  const { control, register, watch, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items") || [];
  const selectedProductIds = watchedItems
    .map((item: any) => item.productId)
    .filter(Boolean);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <ShoppingCart className="w-5 h-5 text-gray-500" />
          <h2>Products</h2>
        </div>
        <button
          type="button"
          onClick={() =>
            append({ productId: "", quantity: 1, warrantyMonths: undefined })
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

          return (
            <div
              key={field.id}
              className="p-3 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
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

              <div className="w-26">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Qty
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentQty > 1) {
                        setValue(`items.${index}.quantity`, currentQty - 1, {
                          shouldValidate: true,
                        });
                      }
                    }}
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
                    onClick={() =>
                      setValue(`items.${index}.quantity`, currentQty + 1, {
                        shouldValidate: true,
                      })
                    }
                    className="px-2.5 py-2 text-gray-500 hover:bg-gray-100 transition border-l border-gray-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

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
    </div>
  );
}
