import "server-only";

import type { OpenAIStreamPayload } from "~/lib/types";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";

import { createParser } from "eventsource-parser";

import { createAppwriteClient } from "~/lib/clients/appwrite-server";
import { openaiKey, openaiOrg } from "~/lib/envServer";

const OpenAIStream = async (
  payload: OpenAIStreamPayload,
  token: string,
  key: string = openaiKey,
  org: string = openaiOrg,
) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;
  let accumulatedText = "";
  let creditsSubtracted = false;

  const pattern = /^{\s*"(identifier)/;

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
    ...(org && { "OpenAI-Organization": org }),
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(payload),
  });

  if (response.status !== 200) {
    const errorMessage = response.statusText;
    const errorCode = response.status;
    throw new Error(`${errorCode}: ${errorMessage}`);
  }

  let profieId: string;
  let profileCredits: number;

  if (key === openaiKey) {
    // Get user profile based on JWT
    const { sdkDatabases } = createAppwriteClient(token);
    const { documents: profiles } = await sdkDatabases.listDocuments("main", "profile");
    const profile = profiles[0];

    if (!profile) {
      console.log("openai.stream:", "Profile missing");
      return new Response("Cannot find profile for this token", {
        status: 404,
      });
    }

    profieId = profile.$id;
    profileCredits = profile.credits;

    if (profile.credits < 1) {
      const errorMessage = "Not enough credits";
      const errorCode = 429;
      throw new Error(`${errorCode}: ${errorMessage}`);
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = async (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            console.log("openai.ts: Stream done");
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";

            if (key === openaiKey) {
              if (counter < 10 && pattern.test(accumulatedText) && !creditsSubtracted) {
                const { sdkDatabases } = createAppwriteClient();

                console.log("openai.ts: Credits subtracted");
                creditsSubtracted = true;

                // Update profile from stripe event
                await sdkDatabases.updateDocument("main", "profile", profieId, {
                  credits: profileCredits - 1,
                });
              }

              if (!creditsSubtracted) {
                accumulatedText += text;
                console.log(`openai.ts: accumulatedText: ${accumulatedText.replace("\n", "")}`);
              }

              if (counter >= 10 && !creditsSubtracted) {
                const errorMessage = "ChatGPT doesn't respect prompt format";
                const errorCode = 422;
                throw new Error(`${errorCode}: ${errorMessage}`);
              }
            }

            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (error) {
            console.log(`openai.ts: Stream error: ${error}`);
            controller.error(error);
          }
        }
      };

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);

      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export { OpenAIStream };
