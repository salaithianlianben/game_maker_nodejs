import { z } from "zod";

const baseAgentSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  name: z.string().min(1, "Name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in a valid international format"
    ),
});

const agentSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  name: z.string().min(1, "Name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in a valid international format"
    ),
  referral_code: z.string().min(1, "Phone number is required"),
});

const agentPaymentAccountCreation = z.object({
  payment_gateway_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "payment_gateway_id must be a valid number",
    }),
  account_name: z.string().min(1, "account_name is required"),
  account_number: z.string().min(1, "account_number is required"),
});

export { baseAgentSchema, agentSchema, agentPaymentAccountCreation };
