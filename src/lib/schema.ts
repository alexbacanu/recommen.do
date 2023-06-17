import { z } from "zod";

// Scraped product
export const ProductValidator = z.object({
  identifier: z.string(),
  // image: z.string(),
  // link: z.string(),
  name: z.string(),
  price: z.string(),
  reviews: z.string(),
  stars: z.string(),
});

// OpenAI
export const OpenAISettingsValidator = z.object({
  apiKey: z.string().optional(),
  orgName: z.string().optional(),
});
export type OpenAISettings = z.infer<typeof OpenAISettingsValidator>;

export const OpenAIRequestValidator = z.object({
  products: z.array(ProductValidator),
  prompt: z.string().optional(),
});
export type OpenAIRequest = z.infer<typeof OpenAIRequestValidator>;

export const OpenAIPayloadValidator = z.object({
  settings: OpenAISettingsValidator,
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
