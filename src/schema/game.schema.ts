import { z } from "zod";

const createGameSchema = z.object({
  name: z.string().min(1, "name is required"),
  code: z.string().min(1, "code is required"),
  game_provider_id: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.number().min(1, {
      message: "game_provider_id is required.",
    })
  ),
  game_category_id: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.number().min(1, {
      message: "game_category_id is required.",
    })
  ),
  image_path: z.string().optional()
});

const updateGameSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  game_provider_id: z
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
  game_category_id: z
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
});

export { createGameSchema, updateGameSchema };
