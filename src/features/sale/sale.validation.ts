import z from "zod";

export const createSaleValidation = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^01\d{9}$/,
        "Phone number must start with 01 and contain exactly 11 digits",
      ),
    address: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Minimum quantity is 1"),
        warrantyMonths: z.number().optional(),
      }),
    )
    .min(1, "At least one product is required"),
  discount: z.number().min(0).optional(),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),

  // Cleaned up preprocess with explicit number type casting
  dueCommitmentMonths: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null || Number.isNaN(val)) {
      return undefined;
    }
    return Number(val);
  }, z.number().optional()),
}) as z.ZodType<{
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    warrantyMonths?: number;
  }>;
  discount?: number;
  paidAmount: number;
  dueCommitmentMonths?: number;
}>;
