import { z } from "zod";

// Scraped product
export const LiteProductValidator = z.object({
  identifier: z.string(),
  name: z.string(),
  price: z.string(),
  reviews: z.string(),
  stars: z.string(),
});

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

// OpenAI
export const OpenAIRequestValidator = z.object({
  products: z.array(LiteProductValidator),
  prompt: z.string().optional(),
});
export type OpenAIRequest = z.infer<typeof OpenAIRequestValidator>;

export const OpenAIPayloadValidator = z.object({
  apiKey: z.string().optional(),
  request: OpenAIRequestValidator,
});
export type OpenAIPayload = z.infer<typeof OpenAIPayloadValidator>;

export const ChatGPTAgentValidator = z.enum(["user", "system", "assistant"]);
export type ChatGPTAgent = z.infer<typeof ChatGPTAgentValidator>;

export const ChatGPTMessageValidator = z.object({
  role: ChatGPTAgentValidator,
  content: z.string(),
});
export type ChatGPTMessage = z.infer<typeof ChatGPTMessageValidator>;

export const OpenAIStreamPayloadValidator = z.object({
  model: z.string(),
  messages: z.array(ChatGPTMessageValidator),
  temperature: z.number(),
  max_tokens: z.number(),
  top_p: z.number(),
  frequency_penalty: z.number(),
  presence_penalty: z.number(),
  stream: z.boolean(),
  n: z.number(),
  stop: z.array(z.string()).optional(),
  user: z.string().optional(),
});
export type OpenAIStreamPayload = z.infer<typeof OpenAIStreamPayloadValidator>;

// Search Params
export const SSOCallbackSchema = z.object({
  searchParams: z
    .object({
      userId: z.string().optional(),
      secret: z.string().optional(),
    })
    .optional(),
});
export type SSOCallback = z.infer<typeof SSOCallbackSchema>;

// Resend
export const ResendValidator = z.object({
  name: z.string().min(1).max(128),
  email: z.string().email(),
  subject: z.string().min(1).max(128),
  message: z.string().min(1).max(10000),
  terms: z.boolean().default(false),
});

export const popularDomains = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
];
