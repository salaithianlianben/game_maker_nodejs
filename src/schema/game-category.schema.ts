import { z } from "zod";

const createGameCategory = z.object({
  name: z.string().min(1, {
    message: "name is required.",
  }),
  // image_path: z.string().optional(),
});

const updateGameCategory = z.object({
  name: z.string().optional(),
  is_active: z.string().transform((val) => Boolean(val)).optional(),
  order_number: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
});

export { createGameCategory, updateGameCategory };
