import { z } from "zod";

const baseSchema = z.object({
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
  role_id: z.number(),
  phone_number: z.string().min(1, "Phone number is required"),
});


const playerSchema = baseSchema.extend({
  referral_code: z.string().min(1, "Referral code is required"),
});

// const userSchema = z.union([agentSchema, playerSchema]);
const registerSchema = baseSchema;
const ownerSchema = baseSchema;

const loginSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  username: z.string().min(1, "Username is required"),
});

const fileSchema = z.object({
  originalname: z.string().min(1, "File name is required"),
  mimetype: z
    .string()
    .refine(
      (type) =>
        ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(
          type
        ),
      "File must be a valid image type (JPEG, PNG, WEBP, SVG)"
    ),
  size: z.number().max(20 * 1024 * 1024, "File must be less than 20MB"),
});

const createOwnerSchema = z.object({
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

  site_name: z.string().min(1, "Site name is required"),

  site_url: z.string().url("Site URL must be valid").optional(),

  logo_path: z.string().optional(),
});

export {
  playerSchema,
  registerSchema,
  ownerSchema,
  loginSchema,
  createOwnerSchema,
};
export type PlayerType = z.infer<typeof playerSchema>;
export type OwnerType = z.infer<typeof baseSchema>;
export type NewOwnerInput = z.infer<typeof createOwnerSchema>;
