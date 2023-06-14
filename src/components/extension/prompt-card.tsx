import type { ChatGPTMessage, OpenAIRequest, OpenAISettings, Product } from "~/lib/types";
import type { ChangeEvent } from "react";

import { useStorage } from "@plasmohq/storage/hook";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import SuperJSON from "superjson";

import { Init } from "~/components/layout/init";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { profileAtom } from "~/lib/atoms/appwrite";
import { appwriteUrl } from "~/lib/envClient";
import { cn } from "~/lib/helpers/cn";
import { filterMessage } from "~/lib/helpers/filterMessage";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface PromptCardProps {
  products: Product[];
  size: "md" | "xl";
}

const initialMessage: ChatGPTMessage[] = [
  { role: "system", content: "You are ShopAssistantGPT, an advisor on what to buy given some products" },
];
const initialProduct = { identifier: "" };

export default function PromptCard({ products, size }: PromptCardProps) {
  const { createJWT, getProfile } = useAppwrite();
  const profile = useAtomValue(profileAtom);

  const [openaiSettings] = useStorage<OpenAISettings>("openaiSettings");
  const [product, setSelectedProduct] = useState<Product>(initialProduct);
  const [hasRead, setHasRead] = useState(true);

  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessage);
  const [prompt, setPrompt] = useState("");
  const [errorText, setErrorText] = useState("");

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  let jwt: string;
  const aiRequest = async (openaiRequest: OpenAIRequest) => {
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }
    // console.log(jwt);

    const response = await fetch(`${appwriteUrl}/api/openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: SuperJSON.stringify({ openaiSettings, openaiRequest }),
      mode: "cors",
    });

    console.warn("response:", response);

    if (!response.ok) {
      const errorMessage = await response.text();
      // console.log("errorMessage:", errorMessage);
      setErrorText(errorMessage);
      const errorCode = response.status;
      throw new Error(`${errorCode}: ${errorMessage}`);
    }

    const { body } = response;
    // console.log("body:", body);
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

      // console.log("match:", match);

      if (!match || typeof match[1] === "undefined") {
        continue;
      }

      const identifier = match[1];
      // console.log("identifier:", identifier);
      const chosenProduct = openaiRequest.products.find((product) => product.identifier === identifier);

      if (typeof chosenProduct === "undefined") {
        continue;
      }

      // console.log("chosenProduct:", chosenProduct);

      setSelectedProduct(chosenProduct);
      productFound = true;
    }
  };

  const { mutate, isLoading, isSuccess, isError, reset, error, failureReason, status } = useMutation({
    mutationKey: ["submit"],
    mutationFn: aiRequest,
  });

  // useEffect(() => {
  //   console.log("mutate_error", error);
  //   console.log("failureReason", failureReason);
  //   console.log("status", status);
  // }, [error, failureReason, status]);

  const handleReset = async () => {
    reset();
    getProfile();
    setSelectedProduct(initialProduct);
    setMessages(initialMessage);
  };

  const showForm = !isLoading && !isSuccess && !isError;
  const showSkeleton = product.identifier === "";

  return (
    <section id="prompt_card" className={cn("m-4 w-full min-w-[30%] max-w-[75%]", size === "xl" && "text-lg")}>
      <Init />
      {showForm && (
        <>
          <div className="group relative">
            <div className="absolute inset-[-0.005rem] rounded-xl bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>
            <div className="relative flex flex-row gap-6 rounded-lg bg-white p-6 leading-none ring-1 ring-muted-foreground/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={cn(
                      "mb-2 text-xl font-semibold leading-none text-fuchsia-600",
                      size === "xl" && "text-3xl",
                    )}
                  >
                    recommen.do
                  </h3>
                  <p className="text-muted-foreground">Make choosing easier - with your personal AI assistant</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate({ products, prompt });
                }}
                className="flex grow items-center gap-x-2"
              >
                <Input
                  value={prompt}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPrompt(e.target.value);
                  }}
                  type="text"
                  placeholder={`${profile ? profile.credits : "?"} recommendations available`}
                  className="border-muted-foreground/40 placeholder:opacity-50"
                />
                <Button variant="secondary" type="submit" className="shrink-0" disabled={!hasRead}>
                  {hasRead ? "Send" : "Response still generating..."}
                </Button>
              </form>
            </div>
          </div>
        </>
      )}

      {isError && (
        <Alert variant="destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {/* <AlertTitle>Heads up!</AlertTitle> */}
            <AlertDescription>
              An error occurred while processing your request. Please check browser console.
            </AlertDescription>
          </div>
        </Alert>
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
                      <div
                        className={cn("space-y-1 text-xl font-semibold text-fuchsia-600", size === "xl" && "text-3xl")}
                      >
                        {product.name}
                      </div>
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
                      <Button variant="secondary" asChild>
                        <a href={product.link} className="w-full">
                          See product
                        </a>
                      </Button>
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
