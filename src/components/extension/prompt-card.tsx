import type { ChatGPTMessage, OpenAIPayload, OpenAIRequest, OpenAISettings } from "~/lib/schema";
import type { Product } from "~/lib/types";

import { useStorage } from "@plasmohq/storage/hook";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";

import { Init } from "~/components/layout/init";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { profileAtom } from "~/lib/atoms/appwrite";
import { appwriteUrl } from "~/lib/envClient";
import { cn } from "~/lib/helpers/cn";
import { filterMessage } from "~/lib/helpers/filterMessage";
import { useAppwrite } from "~/lib/helpers/use-appwrite";
import { toast } from "~/lib/helpers/use-toast";

interface PromptCardProps {
  products: Product[];
}

const initialProduct = {
  identifier: "none",
  image: "none",
  link: "none",
  name: "unknown",
  price: "unknown",
  reviews: "0",
  stars: "0",
};

const initialMessage: ChatGPTMessage[] = [
  { role: "system", content: "You are ShopAssistantGPT, an advisor on what to buy given some products" },
];

export default function PromptCard({ products }: PromptCardProps) {
  const { createJWT, getProfile } = useAppwrite();
  const [openaiSettings] = useStorage<OpenAISettings>("openaiSettings");

  const [prompt, setPrompt] = useState("");
  const [hasRead, setHasRead] = useState(true);
  const profile = useAtomValue(profileAtom);

  const [product, setSelectedProduct] = useState<Product>(initialProduct);

  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessage);

  let jwt: string;
  const getRecommendationFn = async (request: OpenAIRequest) => {
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    const payload: OpenAIPayload = {
      settings: openaiSettings,
      request: request,
    };

    const response = await fetch(`${appwriteUrl}/api/openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    const { body } = response;
    if (!body) {
      throw new Error("Failed to retrieve response from the server.");
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

      if (response.status !== 200) {
        throw new Error(chunkValue);
      }

      lastMessage = lastMessage + chunkValue;
      setMessages([{ role: "assistant", content: lastMessage }]);

      if (lastMessage.indexOf('"reason": "') === -1 || productFound) {
        continue;
      }

      const regex = /"identifier":\s*"([^"]+)"/;
      const match = lastMessage.match(regex);

      if (!match || typeof match[1] === "undefined") {
        continue;
      }

      const identifier = match[1];
      const chosenProduct = products.find((product) => product.identifier === identifier);

      if (typeof chosenProduct === "undefined") {
        continue;
      }

      setSelectedProduct(chosenProduct);
      productFound = true;
    }
  };

  const handleError = (error: Error | unknown) => {
    const description = error instanceof Error ? error.message : JSON.stringify(error);

    toast({
      title: "Error",
      description,
      variant: "destructive",
    });
  };

  const {
    mutate: getRecommendation,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useMutation({
    mutationFn: getRecommendationFn,
    onError: handleError,
  });

  const handleReset = async () => {
    reset();
    getProfile();
    setSelectedProduct(initialProduct);
    setMessages(initialMessage);
  };

  const showForm = !isLoading && !isSuccess && !isError;
  const showSkeleton = product.identifier === "none";

  return (
    <section id="prompt_card" className={cn("m-4 min-w-[400px]")}>
      <Init />
      {showForm && (
        <div className="group relative">
          <div className="absolute inset-[-0.005rem] rounded-xl bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>
          <div className="relative flex flex-row gap-6 rounded-lg bg-white p-6 leading-none ring-1 ring-muted-foreground/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={cn("mb-2 text-xl font-semibold leading-none text-fuchsia-600")}>recommen.do</h3>
                <p className="text-muted-foreground">Make choosing easier - with your personal AI assistant</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                getRecommendation({ products, prompt });
              }}
              className="flex grow items-center gap-x-2"
            >
              <Input
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                type="text"
                placeholder={`${profile ? profile.credits : "?"} recommendations available`}
                className="border-muted-foreground/40 placeholder:opacity-50"
              />
              <Button isLoading={isLoading} variant="secondary" type="submit" className="shrink-0">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}

      {(isLoading || isSuccess) && (
        <>
          <div className="group relative">
            <div className="absolute inset-[-0.005rem] rounded-xl bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>
            <div className="relative flex flex-col gap-4 rounded-lg bg-white p-6 leading-none ring-1 ring-muted-foreground/20">
              <div className="grid grid-cols-[144px_1fr] gap-x-4">
                <div className="w-full pb-2">
                  {showSkeleton ? (
                    <Skeleton className="mx-auto h-full w-36" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="mx-auto h-auto rounded-lg object-cover" src={product.image} alt={product.name} />
                  )}
                </div>
                <div className="space-y-3 pb-2">
                  <div className="space-y-1">
                    {showSkeleton ? (
                      <Skeleton className="h-8 w-1/2" />
                    ) : (
                      <div className={cn("space-y-1 text-xl font-semibold text-fuchsia-600")}>{product.name}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {showSkeleton ? (
                      <>
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </>
                    ) : (
                      <>
                        <p className="text-primary">Price: {product.price}</p>
                        <p className="text-primary">
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
              <div className="grid grid-cols-[144px_1fr] gap-x-4">
                <div className="w-full pt-2">
                  {showSkeleton ? (
                    <Skeleton className="mx-auto h-10 w-36" />
                  ) : (
                    <div className="mx-auto w-full text-center">
                      <a
                        href={product.link}
                        className={buttonVariants({
                          variant: "secondary",
                          className: "w-full",
                        })}
                      >
                        See product
                      </a>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  {showSkeleton ? (
                    <Skeleton className="h-10 w-36" />
                  ) : (
                    <Button variant="outline" onClick={() => handleReset()} className="w-36 text-primary">
                      Return to search
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
