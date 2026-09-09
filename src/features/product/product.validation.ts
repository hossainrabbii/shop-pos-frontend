import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  categoryId: z.string().min(1, "Category is required"),
  purchasePrice: z.coerce.number().min(0, "Purchase price cannot be negative"),
  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
  quantity: z.coerce
    .number()
    .int()
    .min(0, "Quantity cannot be negative")
    .default(0),
  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Threshold cannot be negative")
    .default(5),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
});

// Explicit input and output types for React Hook Form harmony
export type ProductInput = z.input<typeof productSchema>;
export type ProductFormData = z.output<typeof productSchema>;
