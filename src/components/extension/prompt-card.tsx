import type { ChatGPTMessage, OpenAIRequest, OpenAISettings, Product } from "~/lib/types";
import type { ChangeEvent } from "react";

import { useStorage } from "@plasmohq/storage/hook";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";

import { Init } from "~/components/layout/init";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
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
  const [product, setSelectedProduct] = useState<Product>(initialProduct);
  const [hasRead, setHasRead] = useState(true);

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
      mode: "cors",
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
      setHasRead(done);

      const chunkValue = decoder.decode(value);
      lastMessage = lastMessage + chunkValue;
      setMessages([{ role: "assistant", content: lastMessage }]);

      if (lastMessage.indexOf('"reason": "') === -1 || productFound) {
        continue;
      }

      const regex = /"identifier":\s*"([^"]+)"/;
      const match = lastMessage.match(regex);

      console.log("match:", match);

      if (!match || typeof match[1] === "undefined") {
        continue;
      }

      const identifier = match[1];
      console.log("identifier:", identifier);
      const chosenProduct = openaiRequest.products.find((product) => product.identifier === identifier);

      if (typeof chosenProduct === "undefined") {
        continue;
      }

      console.log("chosenProduct:", chosenProduct);

      setSelectedProduct(chosenProduct);
      productFound = true;
    }
  };

  const { mutate, isLoading, isSuccess, isError, reset } = useMutation({
    mutationKey: ["submit"],
    mutationFn: aiRequest,
  });

  const handleReset = async () => {
    reset();
    setSelectedProduct(initialProduct);
    setMessages(initialMessage);
  };

  const showForm = !isLoading && !isSuccess && !isError;
  const showSkeleton = product.identifier === "";

  return (
    <section id="prompt_card" className="w-full p-4">
      <Init />
      {showForm && (
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle>PickAssistant AI</CardTitle>
            <CardDescription>AI assistant to help you pick the best product for you.</CardDescription>
          </CardHeader>

          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate({ products, prompt });
              }}
              className="flex gap-x-2"
            >
              <Input
                value={prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPrompt(e.target.value);
                }}
                type="text"
                placeholder="Best budget iPhone"
              />
              <Button type="submit" className="shrink-0" disabled={!hasRead}>
                {hasRead ? "Send" : "Response still generating..."}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {isError && (
        <Alert variant="destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
          </div>
          <AlertDescription>You have no more recommendations!</AlertDescription>
        </Alert>
      )}

      {(isLoading || isSuccess) && (
        <Card>
          <div className="grid grid-cols-[192px_1fr] gap-x-4">
            <div className="p-6 pr-0 pb-2 w-full">
              {showSkeleton ? (
                <Skeleton className="mx-auto h-full w-36" />
              ) : (
                <img className="mx-auto h-auto rounded-lg object-cover" src={product.image} alt={product.name} />
              )}
            </div>
            <div className="p-6 pl-0 pb-2 space-y-3">
              <div className="space-y-1">
                {showSkeleton ? <Skeleton className="h-8 w-1/2" /> : <div className="space-y-1">{product.name}</div>}
              </div>
              <div className="space-y-1">
                {showSkeleton ? (
                  <>
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </>
                ) : (
                  <>
                    <p>Price: {product.price}</p>
                    <p>
                      Reviews: {product.stars} from {product.reviews} reviews
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-1">
                {showSkeleton ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </>
                ) : (
                  <>
                    {messages.map(({ content }, index) => (
                      <div key={index} className="text-muted-foreground">
                        {filterMessage(content)}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[192px_1fr] gap-x-4">
            <div className="p-6 pr-0 pt-2 w-full">
              {showSkeleton ? (
                <Skeleton className="mx-auto h-10 w-36" />
              ) : (
                <div className="mx-auto w-full text-center">
                  <Button asChild>
                    <a href={product.link} className="w-full">
                      See product
                    </a>
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6 pl-0 pt-2">
              {showSkeleton ? (
                <Skeleton className="h-10 w-36" />
              ) : (
                <Button variant="outline" onClick={() => handleReset()} className="w-36">
                  Return to search
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
