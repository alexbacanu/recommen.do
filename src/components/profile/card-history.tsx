"use client";

import type { APIResponse } from "@/lib/types/types";
import type { ActionValidator, FullProductValidator } from "@/lib/validators/apiSchema";
import type { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";

export function CardHistory() {
  const { toast } = useToast();
  const profile = useAtomValue(profileAtom);
  const queryClient = useQueryClient();

  const extensionDetected = !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const hasHistory = !!profile && profile?.history?.length > 0;

  // 0. Define your mutation.
  const { mutate: toggleHistory, isLoading: toggleHistoryLoading } = useMutation({
    mutationKey: ["toggleHistory"],
    mutationFn: async () => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/appwrite/history`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = (await response.json()) as APIResponse;

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });

      void queryClient.invalidateQueries(["profile"]);
    },
  });

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: async ({ index }: { index: z.infer<typeof ActionValidator> }) => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/appwrite/history`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(index),
      });

      const data = (await response.json()) as APIResponse;

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });

      void queryClient.invalidateQueries(["profile"]);
    },
  });

  if (profile)
    return (
      <>
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl">
            <span>History</span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      id="toggle-history"
                      disabled={toggleHistoryLoading}
                      checked={profile.saveHistory}
                      onClick={() => toggleHistory()}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {profile.saveHistory ? (
                    <p>Disable history for this account</p>
                  ) : (
                    <p>Enable history for this account</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="mb-4 grid max-h-[25rem] gap-4 overflow-y-auto lg:mb-8">
          <div className="flex flex-col gap-y-4">
            {hasHistory ? (
              profile.history
                .slice(0)
                .reverse()
                .map((item, index) => {
                  const product = JSON.parse(item) as z.infer<typeof FullProductValidator>;

                  return (
                    <div key={index} className="flex items-start justify-between">
                      <Link href={product.link} target={target}>
                        <div className="flex items-center gap-x-2">
                          <Avatar className="h-10 w-10 rounded-sm">
                            <AvatarImage src={product.image} className="object-contain" alt="Avatar" />
                            <AvatarFallback>
                              {product.source ? product.source.slice(0, 2).toUpperCase() : "RE"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="space-y-0.5">
                            <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
                            {product.stars !== "0" && (
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {product.stars} / {product.reviews} reviews
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="text-destructive">
                        <Button
                          disabled={isLoading}
                          variant="ghost"
                          size="icon"
                          aria-label="Delete this entry"
                          onClick={() => mutate({ index: index })}
                        >
                          <Icons.remove className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="grid gap-16">
                <div className="text-center text-base">
                  <p>There are no items to display.</p>
                </div>

                <div className="mx-auto">
                  <Icons.cart className="h-48 w-48 text-muted-foreground/50" strokeWidth={1.5} aria-hidden="true" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="grid">
          {hasHistory && (
            <Button
              disabled={isLoading}
              aria-label="Delete all history"
              onClick={() => mutate({ index: "clearHistory" })}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Icons.remove className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Delete all history
            </Button>
          )}
        </CardFooter>
      </>
    );

  return null;
}
