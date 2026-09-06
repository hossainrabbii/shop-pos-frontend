import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),
  phone: z
    .string({
      required_error: "Customer phone number is required",
    })
    .trim()
    .regex(/^01\d{9}$/, "Phone number must start with 01 and contain exactly 11 digits"),
  address: z.string().trim().max(300, "Address cannot exceed 300 characters").optional(),
});

export const saleItemValidationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  warrantyMonths: z.number().min(0, "Warranty cannot be negative").optional(),
});

export const createSaleValidation = z.object({
  customer: customerSchema,
  items: z.array(saleItemValidationSchema).min(1, "At least one product is required"),
  discount: z.number().min(0, "Discount cannot be negative").optional(),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),
  dueCommitmentMonths: z.number().min(0, "Due commitment cannot be negative").optional(),
});

export const addSalePaymentValidation = z.object({
  amount: z.number().positive("Payment amount must be greater than 0"),
});

export const getAllSalesValidation = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  paymentStatus: z.enum(["PAID", "DUE"]).optional(),
  soldBy: z.string().trim().optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
});