import { z } from "zod";

// api/resend
export const EmailValidator = z.object({
  name: z.string().min(1).max(128),
  email: z.string().email(),
  subject: z.string().min(1).max(128),
  message: z.string().min(1).max(10000),
  terms: z.boolean().default(false),
});

// api/appwrite/history
export const FullProductValidator = z.object({
  identifier: z.string(),
  image: z.string(),
  link: z.string(),
  name: z.string(),
  price: z.string(),
  reviews: z.string(),
  stars: z.string(),
  source: z.string(),
});
export const ActionValidator = z.union([z.number().int().min(0).max(25), z.literal("clearHistory")]);

// api/openai
export const LiteProductValidator = z.object({
  identifier: z.string(),
  name: z.string(),
  price: z.string(),
  reviews: z.string(),
  stars: z.string(),
});
export const OpenAIPayloadValidator = z.object({
  products: z.array(LiteProductValidator),
  prompt: z.string().optional(),
});
export const OpenAIRequestValidator = z.object({
  payload: OpenAIPayloadValidator,
  apiKey: z.string().optional(),
});
