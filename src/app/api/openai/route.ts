import type { ChatGPTMessage } from "~/lib/schema";
import type { Profile } from "~/lib/types";

import { OpenAIStream } from "ai";
import { Query } from "appwrite";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { z } from "zod";

import { appwriteClientService, appwriteServerService } from "~/lib/clients/appwrite-server";
import { openaiKey } from "~/lib/envServer";
import { OpenAIPayloadValidator } from "~/lib/schema";

const corsHeaders = {
  // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response("OK", {
    status: 200,
    headers: corsHeaders,
  });
}

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Read JWT from Authorization header
    const authHeader = headers().get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return new Response("Authentication required. Please login to access this feature.", {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Get request body
    const body = await req.json();
    console.log("api/openai: Request body", body);
    const { settings, request } = OpenAIPayloadValidator.parse(body);

    // Get user profile
    const { sdkDatabases } = appwriteClientService(token);
    const { documents: profiles } = await sdkDatabases.listDocuments<Profile>("main", "profile", [Query.limit(1)]);
    const profile = profiles[0];

    if (!profile) {
      return new Response("Email verification required. Please verify your email to proceed.", {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Check for user credits
    if (typeof settings?.apiKey === "undefined") {
      if (profile.credits < 1) {
        return new Response("Insufficient recommendations. You need at least 1 recommendation credit to proceed.", {
          status: 401,
          headers: corsHeaders,
        });
      }
    }

    // Set OpenAI Settings
    const config = new Configuration({
      apiKey: settings?.apiKey || openaiKey,
    });
    const openai = new OpenAIApi(config);

    // ChatGPT options
    const messages: ChatGPTMessage[] = [
      {
        role: "system",
        content: "You are ShopAssistantGPT, an assistant for selecting a single product from a list of products.",
      },
      {
        role: "user",
        content: `Recommend a product from this list that matches these inputs: ${
          request.prompt
        }. Make sure to format your response as a JSON object with ONLY two subobjects, 'identifier' and 'reason'. The 'reason' subobject should be between 200-300 words. If you can't find a product with the inputs provided, recommend another product from the list. The product list is: ${JSON.stringify(
          request.products,
        )}.`,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    const pattern = /^{\s*"(identifier)/;

    const accumulatedTokens: string[] = [];
    let stopTesting = false;

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      // This callback is called for each token in the stream
      onToken: async (token: string) => {
        if (typeof settings?.apiKey === "undefined" && !stopTesting) {
          // Add the token to the accumulated tokens
          accumulatedTokens.push(token);

          // Check if the pattern is present in the first 20 accumulated tokens
          if (accumulatedTokens.length <= 20 && pattern.test(accumulatedTokens.join(""))) {
            stopTesting = true;

            // Subtract 1 credit from the user
            const { sdkServerDatabases } = appwriteServerService();
            await sdkServerDatabases.updateDocument("main", "profile", profile.$id, {
              credits: profile.credits - 1,
              usage: profile.usage + 1,
            });
          } else if (accumulatedTokens.length > 20) {
            stopTesting = true;

            // Throw error if the pattern is not found in the first 20 tokens
            throw new Error("Invalid response format. Your recommendations are not affected.");
          }
        }
      },
    });

    // Respond with the stream
    return new NextResponse(stream, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    // console.log(error);
    // console.log(typeof error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: 422,
        headers: corsHeaders,
      });
    }

    if (error instanceof Error) {
      const statusCodeReg = error.message.match(/Received status code: (\d+)/);
      const statusCode = statusCodeReg && statusCodeReg[1];

      if (statusCode === "401")
        return new Response("Invalid API key. Please check your API key and try again.", {
          status: 401,
          headers: corsHeaders,
        });

      return new Response(error.message, {
        status: statusCode ? parseInt(statusCode) : 500,
        headers: corsHeaders,
      });
    }

    return new Response("Unable to retrieve response from OpenAI. Please try again later.", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
