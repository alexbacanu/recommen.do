"use client";

import type { ScrapedProduct } from "@/lib/types/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { useAtomValue } from "jotai";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
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
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: async () => {
      const jwt = await AppwriteService.createJWT();

      await fetch(`${appwriteUrl}/api/appwrite/history`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    },
    onSuccess: () => {
      toast({
        description: "History successfully deleted.",
      });
      queryClient.invalidateQueries(["profile"]);
    },
    onError: async (error) => {
      if (error instanceof AppwriteException) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      if (error instanceof Error) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      console.error(error);
    },
  });

  if (profile)
    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl">History</CardTitle>
        </CardHeader>
        <CardContent className="mb-4 grid max-h-[25rem] gap-4 overflow-y-auto lg:mb-8">
          <div className="grid gap-y-4">
            {hasHistory ? (
              profile.history.map((item, index) => {
                const product: ScrapedProduct = JSON.parse(item);

                return (
                  <Link key={index} href={product.link} target={target}>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarImage src={product.image} alt="Avatar" />
                        <AvatarFallback>RE</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="line-clamp-1 pr-2 text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.stars} / {product.reviews} reviews
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-base font-medium">
                        {product.price}
                      </Badge>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="grid gap-16">
                <div className="text-base">
                  <p>You did not get any recommendations yet.</p>
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
            <Button disabled={isLoading || isSuccess} aria-label="Delete all history" onClick={() => mutate()}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Icons.remove className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {isSuccess ? "Success" : "Delete all history"}
            </Button>
          )}
        </CardFooter>
      </>
    );

  return null;
}
