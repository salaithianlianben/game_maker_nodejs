import { z } from "zod";

const depositPaymentRequestSchema = z.object({
  agent_payment_account_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "agent_payment_account_id must be a valid number",
    }),
  reference_code_suffix: z
    .string()
    .min(6, {
      message: "reference_code_suffix must be exactly 6 characters long",
    })
    .max(6, {
      message: "reference_code_suffix must be exactly 6 characters long",
    }),

  amount: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "amount must be a valid decimal number",
    })
    .refine((val) => val > 0, {
      message: "amount must be greater than 0",
    }),
});

const withdrawPaymentRequestSchema = z.object({
  payment_gateway_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "payment_gateway_id is required",
    }),
  account_number: z.string().min(1, {
    message: "account_number is required",
  }),

  account_name: z.string().min(1, {
    message: "account_name is required",
  }),

  amount: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "amount must be a valid decimal number",
    })
    .refine((val) => val > 0, {
      message: "amount must be greater than 0",
    }),
});

const updateRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
});

export {
  depositPaymentRequestSchema,
  withdrawPaymentRequestSchema,
  updateRequestSchema,
};
