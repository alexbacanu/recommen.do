import { z } from "zod";

// OpenAI receives only items from the schema
export const productSchema = z.array(
  z.object({
    identifier: z.string(),
    name: z.string().optional(),
    price: z.string().optional(),
    reviews: z.string().optional(),
    stars: z.string().optional(),
  }),
);

// Form schema when submitting api key in user settings
export const openAiSchema = z.object({
  apiKey: z.string(),
  orgName: z.string().optional(),
});
