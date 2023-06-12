// OpenAI
export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stream: boolean;
  n: number;
  stop?: string[];
  user?: string;
}

export interface OpenAISettings {
  apiKey: undefined | string;
  orgName: undefined | string;
}

export interface OpenAIRequest {
  products: Product[];
  prompt: string;
}

// Products
export interface Product {
  identifier: string;
  image?: string;
  link?: string;
  name?: string;
  price?: string;
  reviews?: string;
  stars?: string;
}

export interface Products {
  products: Product[];
}

// API
export interface APIRequest {
  json: {
    jwt: string;
    openaiSettings: OpenAISettings;
    openaiRequest: OpenAIRequest;
  };
}
