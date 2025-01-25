import z from "zod";

const updateUserSchema = z.object({
  name: z.string().optional(),
  is_active: z.string().optional(),
});

const createUserLogSchema = z.object({
  user_id: z.string().min(1, {
    message: "user_id is required",
  }),
  ip_address: z.string().min(1, {
    message: "ip_address is required",
  }),
});

export { updateUserSchema, createUserLogSchema };
