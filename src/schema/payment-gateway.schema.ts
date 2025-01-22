import { z } from "zod";

const paymentGatewaySchema = z.object({
  name: z.string().min(1, "name is required")
});

export { paymentGatewaySchema }