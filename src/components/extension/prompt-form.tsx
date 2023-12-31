"use client";

import type { APIResponse, ScrapedProduct } from "@/lib/types/types";
import type { FullProductValidator } from "@/lib/validators/apiSchema";
import type { ChatGPTMessage } from "@/lib/validators/schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStorage } from "@plasmohq/storage/hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { filterMessage } from "@/lib/helpers/utils";

const formSchema = z.object({
  prompt: z.string().min(0).max(128).optional(),
});

interface PromptFormProps {
  products: ScrapedProduct[] | undefined;
}

interface UpdateNameParams {
  products?: ScrapedProduct[];
  prompt?: string;
}

const initialProduct = {
  identifier: "none",
  image: "none",
  link: "none",
  name: "unknown",
  price: "unknown",
  reviews: "0",
  stars: "0",
  source: "",
};
const initialMessage: ChatGPTMessage[] = [
  { role: "system", content: "You are ShopAssistantGPT, an advisor on what to buy given some products" },
];

export function PromptForm({ products }: PromptFormProps) {
  const profile = useAtomValue(profileAtom);

  const [userApiKey] = useStorage<string>("userApiKey");

  const [ready, setReady] = useState(true);
  const [product, setSelectedProduct] = useState<ScrapedProduct>(initialProduct);
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessage);

  const queryClient = useQueryClient();

  // 0. Define your mutation.
  const { mutate: insertHistory } = useMutation({
    mutationKey: ["insertHistory"],
    mutationFn: async ({ product }: { product: z.infer<typeof FullProductValidator> }) => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/appwrite/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(product),
      });

      const data = (await response.json()) as APIResponse;

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      return data;
    },
  });

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess, isError, reset } = useMutation({
    mutationKey: ["getRecommendation"],
    mutationFn: async (payload: UpdateNameParams) => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          apiKey: userApiKey,
          payload: payload,
        }),
      });

      if (response.status !== 200) {
        const data = (await response.json()) as APIResponse;

        throw new Error(data.message);
      }

      const { body } = response;
      if (!body) {
        throw new Error("Failed to retrieve response. Please try again later.");
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
        if (typeof match?.[1] === "undefined") {
          continue;
        }

        const identifier = match[1];
        const chosenProduct = products?.find((product) => product.identifier === identifier);
        if (typeof chosenProduct === "undefined") {
          continue;
        }

        setSelectedProduct(chosenProduct);
        productFound = true;

        !!profile && profile.saveHistory && insertHistory({ product: chosenProduct });
        void queryClient.invalidateQueries(["profile"]);
      }
    },

    onSuccess: () => {
      setReady(true);
    },

    onMutate: () => {
      if (ready === false) return;
      setReady(false);
    },

    onSettled: () => {
      setReady(true);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ products: products, prompt: values.prompt });
  }

  const handleReset = () => {
    reset();
    form.reset();

    void queryClient.invalidateQueries(["profile"]);

    setSelectedProduct(initialProduct);
    setMessages(initialMessage);
  };

  const showForm = !isLoading && !isSuccess;
  const showSkeleton = !isSuccess && product.identifier === "none";
  const withoutCredits = !!profile && profile.credits < 1 && !userApiKey;

  useEffect(() => {
    void handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userApiKey]);

  return (
    <>
      {isError && (
        <Form {...form}>
          <form className="flex items-center gap-[16px]">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      disabled
                      placeholder={
                        !!userApiKey ? "🙈 There was an error, please check your API key." : "🙈 There was an error."
                      }
                      className="h-[36px] rounded-[10px] px-[12px] py-[4px] text-[14px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" size="fixed" onClick={() => void handleReset()} aria-label="Return to search">
              <Icons.undo className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
              Return to search
            </Button>
          </form>
        </Form>
      )}

      {!profile && !isError && (
        <Form {...form}>
          <form className="flex items-center gap-[16px]">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      disabled
                      placeholder="What are you searching for?"
                      className="h-[36px] rounded-[10px] px-[12px] py-[4px] text-[14px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="fixed" asChild>
              <Link href={`${appwriteUrl}/sign-in`} aria-label="Sign in">
                <Icons.login className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
                Sign in
              </Link>
            </Button>
          </form>
        </Form>
      )}

      {profile && !isError && showForm && (
        <Form {...form}>
          <form
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            className="flex items-center gap-[16px]"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      placeholder="What are you searching for?"
                      className="h-[36px] rounded-[10px] px-[12px] py-[4px] text-[14px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="fixed" disabled={isLoading || !ready || withoutCredits} aria-label="Send">
              {isLoading ? (
                <Icons.spinner className="mr-[8px] h-[16px] w-[16px] animate-spin" aria-hidden="true" />
              ) : (
                <Icons.send className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
              )}
              Send
            </Button>
          </form>
        </Form>
      )}

      {profile && !isError && !showForm && (
        <div>
          <div className="grid grid-cols-[144px_1fr] gap-x-[16px]">
            <div className="pb-[8px]">
              {showSkeleton ? (
                <Skeleton className="mx-auto h-full w-[144px]" />
              ) : (
                <Link href={product.link} aria-label={`Go to product ${product.name} page`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="mx-auto max-h-[160px] rounded-[12px] object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                </Link>
              )}
            </div>
            <div className="space-y-3 pb-[8px]">
              <div className="space-y-1">
                {showSkeleton ? (
                  <Skeleton className="h-[32px] w-1/2" />
                ) : (
                  <Link
                    href={product.link}
                    aria-label={`Go to product ${product.name} page`}
                    className="line-clamp-1 space-y-1 text-[22px] font-semibold leading-tight"
                  >
                    {product.name}
                  </Link>
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
                    {product.price !== "unknown" && <p className="text-[18px] text-primary">Price: {product.price}</p>}
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
          <div className="grid grid-cols-[144px_1fr] gap-x-[16px]">
            <div className="pt-[8px]">
              {showSkeleton ? (
                <Skeleton className="mx-auto h-[40px] w-[144px]" />
              ) : (
                <div className="mx-auto text-center">
                  <Button size="fixed" asChild>
                    <Link href={product.link} aria-label={`Go to product ${product.name} page`}>
                      <Icons.link className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
                      See product
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="pt-[8px]">
              {showSkeleton ? (
                <Skeleton className="h-[40px] w-[144px]" />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="fixed"
                  onClick={() => void handleReset()}
                  aria-label="Return to search"
                >
                  <Icons.undo className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
                  Return to search
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
