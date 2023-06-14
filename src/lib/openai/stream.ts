import "server-only";

import type { OpenAIStreamPayload, Profile } from "~/lib/types";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";

import { createParser } from "eventsource-parser";

import { appwriteClientService, appwriteServerService } from "~/lib/clients/appwrite-server";
import { openaiKey, openaiOrg } from "~/lib/envServer";

const getProfile = async (token: string) => {
  // Get user profile based on JWT
  const { sdkDatabases } = appwriteClientService(token);
  const { documents: profiles } = await sdkDatabases.listDocuments<Profile>("main", "profile");
  return profiles[0];
};

const updateCredits = async (profileId: string, profileCredits: number, usage: number) => {
  const { sdkServerDatabases } = appwriteServerService();

  await sdkServerDatabases.updateDocument("main", "profile", profileId, {
    credits: profileCredits - 1,
    usage: usage + 1,
  });
};

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

  const profile = await getProfile(token);

  let profileId: string;
  let profileCredits: number;
  let profileUsage: number;

  if (key === openaiKey) {
    if (!profile) {
      console.log("openai.stream:", "Profile missing");
      return new Response("Cannot find profile for this token", {
        status: 404,
      });
    }

    profileId = profile.$id;
    profileCredits = profile.credits;
    profileUsage = profile.usage;

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
            console.log("openai.ts: Stream event", json.choices[0].delta);
            const text = json.choices[0].delta?.content || "";

            if (key === openaiKey) {
              if (counter < 15 && pattern.test(accumulatedText) && !creditsSubtracted) {
                creditsSubtracted = true;

                updateCredits(profileId, profileCredits, profileUsage);
              }

              if (true) {
                accumulatedText += text;
                console.log(`openai.ts: accumulatedText: ${accumulatedText.replace("\n", "")}`);
              }

              if (counter >= 15 && !creditsSubtracted) {
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
