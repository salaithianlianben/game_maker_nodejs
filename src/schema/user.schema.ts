import z from "zod";

const updateUserSchema = z.object({
  name: z.string().optional(),
  is_active: z.string().optional(),
});

export { updateUserSchema };
