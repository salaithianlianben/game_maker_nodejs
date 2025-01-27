import { z } from "zod";

const addGameProviderSchema = z.object({
  name: z.string().min(1, "Name is required"), // Name must be a non-empty string
  game_category_id: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val); // Parse if it's a stringified array
      } catch {
        return null; // Invalid JSON
      }
    }
    return val;
  }, z.array(z.number()).optional()),
});

const updateGameProviderSchema = z.object({
  name: z.string().optional(),
  game_category_id: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return undefined;
      }
    }
    return val;
  }, z.array(z.number()).optional()),
  is_active: z
    .preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    }, z.boolean())
    .optional(),
  order_number: z
    .preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    }, z.number())
    .optional(),
});

export { addGameProviderSchema, updateGameProviderSchema };
