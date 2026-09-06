import { z } from "zod";

export const createSaleValidation = z.object({
  customer: z.object({
    name: z
      .string()
      .min(2, "Customer name must be at least 2 characters")
      .max(100),
    phone: z.string().max(30).optional().or(z.literal("")),
    address: z.string().max(300).optional().or(z.literal("")),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        warrantyMonths: z.coerce.number().min(0).optional(),
      }),
    )
    .min(1, "At least one product is required"),
  discount: z.coerce.number().min(0, "Discount cannot be negative").default(0),
  paidAmount: z.coerce.number().min(0, "Paid amount cannot be negative"),
  dueCommitmentMonths: z.coerce.number().min(0).optional(),
});

export type CreateSaleFormData = z.infer<typeof createSaleValidation>;
