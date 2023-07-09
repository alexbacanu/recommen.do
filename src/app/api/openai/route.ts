import type { AppwriteProfile, ChatGPTMessage } from "@/lib/types/types";

import { OpenAIStream } from "ai";
import { AppwriteException } from "appwrite";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { AppwriteException as AppwriteExceptionNode } from "node-appwrite";
import { Configuration, OpenAIApi } from "openai-edge";
import { z } from "zod";

import { appwriteImpersonate, appwriteServer } from "@/lib/clients/server-appwrite";
import { openaiKey } from "@/lib/envServer";
import { OpenAIRequestValidator } from "@/lib/validators/apiSchema";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

const cors = {
  "Access-Control-Allow-Origin": "https://www.amazon.com",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function OPTIONS() {
  return NextResponse.json(
    {
      message: "OK",
    },
    {
      headers: cors,
    },
  );
}

// 1. ✅ Auth
// 2. ❌ Permissions
// 3. ✅ Input
// 4. ✅ Secure
// 5. ➖ Rate limiting
export async function POST(request: Request) {
  try {
    // 🫴 Get Body
    const body = (await request.json()) as z.infer<typeof OpenAIRequestValidator>;
    const { payload, apiKey } = OpenAIRequestValidator.parse(body); // 3️⃣

    // 🫴 Get Authorization
    const authHeader = headers().get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          message: "JWT token missing. Please verify and retry.",
        },
        {
          status: 401, // Unauthorized
          headers: cors,
        },
      );
    }

    // 🫴 Get Profile
    const { impersonateDatabases } = appwriteImpersonate(token);
    const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
    const profile = profiles[0];

    if (!profile) {
      return NextResponse.json(
        {
          message: "Profile not found. Please verify your details.",
        },
        {
          status: 404, // Not Found
          headers: cors,
        },
      );
    }

    // ❔ Check for credits
    if (!apiKey && profile.credits < 1) {
      return NextResponse.json(
        {
          message: "Not enough recommendations. You need at least 1 recommendation.",
        },
        {
          status: 401, // Unauthorized
          headers: cors,
        },
      );
    }

    // ⚙️ Configure OpenAI
    const config = new Configuration({
      apiKey: apiKey || openaiKey,
    });
    const openai = new OpenAIApi(config);
    const messages: ChatGPTMessage[] = [
      // {
      //   role: "system",
      //   content: `
      //      You will be provided with a list of products, each with an identifier. Your task is to recommend the most suitable product based on the following question: "Which product stands out as the best choice for its intended purpose, based on customer reviews and ratings?"
      //      Ensure that the recommended products include all relevant information necessary for making a decision - in other words, don't suggest products without important context. Provide the output in JSON format as shown below:
      //      {"product": "..."}
      //   `,
      // },
      {
        role: "system",
        content: `You will be provided with a list of products, each with an identifier. Your task is to recommend the top-rated product for a given purpose, considering a wide range of categories similar to what an Amazon product expert might ask: "Which product stands out as the best choice for its intended purpose, based on customer reviews and ratings?"

        ${payload.prompt ? `Make sure the recommended product matches the user inputs: ${payload.prompt}.` : ""}

        Ensure that the recommended product include all relevant information necessary for making a decision - in other words, don't suggest products without important context. Limit your response to around 200 words. Provide the output in JSON format as shown below:

        {"identifier": "...", "reason": "..."}`,
      },
      {
        role: "user",
        content: JSON.stringify(payload.products),
      },
    ];
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      temperature: 0.2,
      stream: true,
      messages,
    });

    // ➖ Subtract 1 credit on proper response format
    const pattern = /^{\s*"(identifier)/;

    const accumulatedTokens: string[] = [];
    let stopTesting = false;

    const stream = OpenAIStream(response, {
      // This callback is called for each token in the stream
      onToken: async (token: string) => {
        if (!apiKey && !stopTesting) {
          // Add the token to the accumulated tokens
          accumulatedTokens.push(token);

          // Check if the pattern is present in the first 20 accumulated tokens
          if (accumulatedTokens.length <= 20 && pattern.test(accumulatedTokens.join(""))) {
            stopTesting = true;

            // Subtract 1 credit from the user
            const { serverDatabases } = appwriteServer();

            await serverDatabases.updateDocument("main", "profile", profile.$id, {
              credits: profile.credits - 1,
              usage: (profile.usage ?? 0) + 1,
            });
          } else if (accumulatedTokens.length > 20) {
            stopTesting = true;

            // Throw error if the pattern is not found in the first 20 tokens
            throw new Error("Invalid response format. Your recommendations are not affected.");
          }
        }
      },
    });

    // ✅ Everything OK
    return new NextResponse(stream, { headers: cors });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400, // Bad Request
          headers: cors,
        },
      );
    }

    if (error instanceof AppwriteException) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.code,
          headers: cors,
        },
      );
    }

    if (error instanceof AppwriteExceptionNode) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.code ? error.code : 500,
          headers: cors,
        },
      );
    }

    if (error instanceof Error) {
      const statusCodeReg = error.message.match(/Received status code: (\d+)/);
      const statusCode = statusCodeReg && statusCodeReg[1];

      if (statusCode === "401") {
        return NextResponse.json(
          {
            message: "Invalid OpenAI API key. Please check your OpenAI API key and try again.",
          },
          {
            status: 500, // Internal Server Error
            headers: cors,
          },
        );
      }

      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: statusCode ? parseInt(statusCode) : 500,
          headers: cors,
        },
      );
    }

    // ❌ Everything NOT OK
    console.log(error);
    return NextResponse.json(
      {
        message: "OpenAI issues on our end. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
        headers: cors,
      },
    );
  }
}
