import type { ScrapedProduct } from "@/lib/types/types";
import type { ChatGPTMessage, OpenAIPayload, OpenAIRequest } from "@/lib/validators/schema";

import { useStorage } from "@plasmohq/storage/hook";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { cn, filterMessage } from "@/lib/helpers/utils";
import { useAccount } from "@/lib/hooks/use-account";

interface PromptCardProps {
  products: ScrapedProduct[];
  onClose: () => void;
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

export default function PromptCard({ products, onClose }: PromptCardProps) {
  const { fetchProfile } = useAccount();

  const profile = useAtomValue(profileAtom);

  const [userApiKey] = useStorage<string | undefined>("userApiKey");
  const [prompt, setPrompt] = useState("");
  const [hasRead, setHasRead] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [product, setSelectedProduct] = useState<ScrapedProduct>(initialProduct);
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessage);

  const getRecommendationFn = async (request: OpenAIRequest) => {
    const jwt = await AppwriteService.createJWT();

    const payload: OpenAIPayload = {
      apiKey: userApiKey,
      request: request,
    };

    const response = await fetch("/api/openai", {
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
    reset,
  } = useMutation({
    mutationFn: getRecommendationFn,
    onError: handleError,
  });

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);

    setPrompt("");
    fetchProfile();
  };

  const handleReset = async () => {
    reset();
    fetchProfile();
    setSelectedProduct(initialProduct);
    setMessages(initialMessage);
  };

  const showForm = !isLoading && !isSuccess;
  const showSkeleton = !isSuccess && product.identifier === "none";

  return (
    <section id="prompt_card" className="relative m-4 w-full min-w-[700px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={isRefreshing}
              className="absolute right-0 z-10 m-[4px] h-auto px-[6px] py-[4px] text-muted-foreground/70"
            >
              <Icons.minimize className="h-[16px] w-[16px]" aria-hidden="true" />
              <span className="sr-only">Minimize prompt card</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Minimize</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showForm && (
        <div className="group relative">
          <div className="absolute inset-[-0.125px] rounded-[12px] bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>
          <div className="relative flex flex-row gap-[24px] rounded-[12px] bg-white p-[24px] leading-none ring-1 ring-muted-foreground/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-[8px] text-[22px] font-semibold leading-none text-fuchsia-600">recommen.do</h3>
                <p className="text-[14px] text-muted-foreground">
                  Make choosing easier - with your personal AI assistant
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                getRecommendation({ products, prompt });
              }}
              className="flex grow items-center gap-x-[8px]"
            >
              <div className="relative flex grow items-center">
                <Input
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                  }}
                  type="text"
                  placeholder={
                    !!userApiKey
                      ? "looking for any specific features?"
                      : profile
                      ? `${profile?.credits ?? 0} recommendations available`
                      : "please login to get recommendations"
                  }
                  className="pl-[36px]"
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleRefresh()}
                        disabled={isRefreshing || !profile}
                        className="absolute left-0 top-1/2 ml-[6px] h-auto -translate-y-1/2 p-[6px] text-muted-foreground/70"
                      >
                        <Icons.refresh
                          className={cn("h-[14px] w-[14px]", isRefreshing && "animate-spin")}
                          aria-hidden="true"
                        />
                        <span className="sr-only">Refresh recommendations</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Refresh</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button variant="default" type="submit" disabled={isLoading || !profile || !hasRead}>
                {hasRead ? "Send" : "Generating..."}
              </Button>
            </form>
          </div>
        </div>
      )}

      {!showForm && (
        <>
          <div className="group relative">
            <div className="absolute inset-[-0.125px] rounded-[12px] bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>
            <div className="relative flex flex-col gap-[16px] rounded-[12px] bg-white p-[24px] leading-none ring-1 ring-muted-foreground/20">
              <div className="grid grid-cols-[144px_1fr] gap-x-[16px]">
                <div className="pb-[8px]">
                  {showSkeleton ? (
                    <Skeleton className="mx-auto h-full w-[144px]" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="mx-auto max-h-[160px] rounded-[12px] object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="space-y-3 pb-[8px]">
                  <div className="space-y-1">
                    {showSkeleton ? (
                      <Skeleton className="h-[32px] w-1/2" />
                    ) : (
                      <div className={cn("space-y-1 text-[22px] font-semibold text-fuchsia-600 line-clamp-1")}>
                        {product.name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {showSkeleton ? (
                      <>
                        <Skeleton className="h-[16px] w-1/4" />
                        <Skeleton className="h-[16px] w-1/4" />
                      </>
                    ) : (
                      <>
                        {product.price !== "unknown" && (
                          <p className="text-[18px] text-primary">Price: {product.price}</p>
                        )}
                        {!product.stars.startsWith("0") && (
                          <p className="text-[18px] text-primary">
                            Reviews: {product.stars} from {product.reviews} reviews
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="space-y-1">
                    {showSkeleton ? (
                      <>
                        <Skeleton className="h-[16px] w-full" />
                        <Skeleton className="h-[16px] w-full" />
                        <Skeleton className="h-[16px] w-1/2" />
                      </>
                    ) : (
                      <>
                        {messages.map(({ content }, index) => (
                          <div key={index} className="text-[14px] text-muted-foreground">
                            {filterMessage(content)}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[144px_1fr] gap-x-4">
                <div className="pt-[8px]">
                  {showSkeleton ? (
                    <Skeleton className="mx-auto h-[40px] w-[144px]" />
                  ) : (
                    <div className="mx-auto text-center">
                      <Button variant="default" className="w-full" asChild>
                        <a href={product.link}>See product</a>
                      </Button>
                    </div>
                  )}
                </div>
                <div className="pt-[8px]">
                  {showSkeleton ? (
                    <Skeleton className="h-[40px] w-[144px]" />
                  ) : (
                    <Button variant="outline" onClick={() => handleReset()}>
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
