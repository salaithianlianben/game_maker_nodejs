import { z } from "zod";

const depositSchema = z.object({
  amount: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "amount is required",
    })
    .refine((val) => val >= 10000, {
      message: "amount must be at least 10000",
    }),
  remark: z.string().optional(),
});

export { depositSchema }