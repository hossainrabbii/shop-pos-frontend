import { z } from "zod";

// Basic phone regex (allows optional '+' and 10 to 14 digits)
const phoneRegex = /^\+?[0-9]{10,14}$/;

export const shopFormSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters").max(100),
  logo: z.string().optional(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^01\d{9}$/,
      "Phone number must start with 01 and contain exactly 11 digits",
    ),

  alternativePhone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Please enter a valid alternative phone number",
    }),

  // Strict email validation (enforces '@' and proper domain structure)
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Please enter a valid email address containing '@'",
    }),

  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  website: z.string().optional(),
  receiptFooter: z.string().max(200).optional(),
});

export type IShopFormValues = z.infer<typeof shopFormSchema>;
