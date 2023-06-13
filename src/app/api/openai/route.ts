import type { APIRequest, ChatGPTMessage, OpenAIStreamPayload } from "~/lib/types";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import SuperJSON from "superjson";

import { OpenAIStream } from "~/lib/openai/stream";
import { productSchema } from "~/lib/schema";

// export const runtime = "edge";

export async function GET() {
  return NextResponse.json(
    { status: "OK" },
    {
      headers: {
        // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}
export async function OPTIONS() {
  return NextResponse.json(
    { status: "OK" },
    {
      headers: {
        // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("stripe.subscription:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
    });
  }

  // Get request body
  const { json }: APIRequest = await request.json();
  const { openaiSettings, openaiRequest } = json;

  console.log(openaiRequest);

  const isBodyValid = productSchema.safeParse(openaiRequest.products);

  console.log(isBodyValid);

  if (!isBodyValid.success) {
    const errorMessage = "Invalid request body";
    const errorCode = 400;
    return new NextResponse(errorMessage, { status: errorCode });
  }

  const validatedData = isBodyValid.data;

  // ChatGPT options
  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: "You are ShopAssistantGPT, an assistant for selecting a single product from a list of products.",
    },
    {
      role: "user",
      content: `Recommend a product from this list that matches these inputs: ${
        openaiRequest.prompt
      }. Make sure to format your response as a JSON object with ONLY two subobjects, 'identifier' and 'reason'. The 'reason' subobject should be between 200-300 words. If you can't find a product with the inputs provided, recommend another product from the list. The product list is: ${SuperJSON.stringify(
        validatedData,
      )}.`,
    },
  ];
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  // Create stream response
  let stream;
  try {
    stream = await OpenAIStream(payload, token, openaiSettings?.apiKey, openaiSettings?.orgName);
  } catch (error) {
    const errorMessage = (error as Error).message;
    const errorCodeMatch = errorMessage.match(/^\d+/);
    const errorCode = errorCodeMatch ? parseInt(errorCodeMatch[0]) : 400;
    return new NextResponse(errorMessage, { status: errorCode });
  }
  return new NextResponse(stream, {
    status: 200,
    headers: {
      // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
