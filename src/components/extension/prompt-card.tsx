import type { ChatGPTMessage, OpenAIRequest, OpenAISettings, Product } from "~/lib/types";
import type { ChangeEvent } from "react";

import { useStorage } from "@plasmohq/storage/hook";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";

import { Init } from "~/components/layout/init";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { filterMessage } from "~/lib/helpers/filterMessage";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface PromptCardProps {
  products: Product[];
}

const initialMessage: ChatGPTMessage[] = [
  { role: "system", content: "You are ShopAssistantGPT, an advisor on what to buy given some products" },
];
const initialProduct = { identifier: "" };

export default function PromptCard({ products }: PromptCardProps) {
  const { createJWT } = useAppwrite();

  const [openaiSettings] = useStorage<OpenAISettings>("openaiSettings");
  const [, setSelectedProduct] = useState<Product>(initialProduct);

  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessage);
  const [prompt, setPrompt] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  let jwt: string;
  const aiRequest = async (openaiRequest: OpenAIRequest) => {
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }
    console.log(jwt);

    const response = await fetch("http://localhost:1947/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: SuperJSON.stringify({ openaiSettings, openaiRequest }),
    });

    console.log("response:", response);

    if (!response.ok) {
      const errorMessage = await response.text();
      setErrorText(errorMessage);
      const errorCode = response.status;
      throw new Error(`${errorCode}: ${errorMessage}`);
    }

    const { body } = response;
    console.log("body:", body);
    if (!body) {
      return;
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let lastMessage = "";
    let productFound = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunkValue = decoder.decode(value);
      lastMessage = lastMessage + chunkValue;
      setMessages([{ role: "assistant", content: lastMessage }]);

      if (lastMessage.indexOf('"reason": "') === -1 || productFound) {
        continue;
      }

      const regex = /"identifier": "(\w+)"/;
      const match = lastMessage.match(regex);

      if (!match || typeof match[1] === "undefined") {
        continue;
      }

      const identifier = match[1];
      const chosenProduct = openaiRequest.products.find((product) => product.identifier === identifier);

      if (typeof chosenProduct === "undefined") {
        continue;
      }

      setSelectedProduct(chosenProduct);
      productFound = true;
    }
  };

  const { mutate, isLoading, isSuccess, isError } = useMutation({
    mutationKey: ["submit"],
    mutationFn: aiRequest,
  });

  return (
    <section id="prompt_card" className="w-full p-4">
      <Init />
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>PickAssistant AI</CardTitle>
          <CardDescription>AI assistant to help you pick the best product for you.</CardDescription>
        </CardHeader>

        <CardFooter>
          <div className="flex space-x-2">
            {/* <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate({ products, prompt });
              }}
            >
              <Input
                value={prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPrompt(e.target.value);
                }}
                type="text"
                placeholder="Best budget iPhone"
              />
              <Button variant="secondary" type="submit" className="shrink-0">
                Send
              </Button>
            </form> */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate({ products, prompt });
              }}
            >
              <input
                value={prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPrompt(e.target.value);
                }}
                type="text"
                placeholder="What are you looking for?"
              />
              <button type="submit">Recommend</button>
            </form>
          </div>
        </CardFooter>
      </Card>

      <Card className="mx-auto">
        <div className="flex">
          <div className="hidden p-4 lg:block">
            <img
              className="h-auto w-32 rounded-xl object-cover"
              src="https://images.unsplash.com/photo-1671726203390-cdc4354ee2eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Image Description"
            />
          </div>
          <CardHeader className="pl-0">
            <CardTitle>Product Name</CardTitle>
            <CardDescription>
              <span>Product price:</span>
              <span>Product link:</span>
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <div>
            {messages.map(({ content }, index) => (
              <div key={index}>{filterMessage(content)}</div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button>Go to product</Button>
        </CardFooter>
      </Card>
    </section>
  );
}
