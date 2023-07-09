"use client";

import type { APIResponse } from "@/lib/types/types";

import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";

export function CardUsage() {
  const profile = useAtomValue(profileAtom);

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const hasSubscription = profile ? profile.stripeSubscriptionId !== "none" : false;

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["getRefillURL"],
    mutationFn: async () => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/stripe/refill`, {
        method: "GET",
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
      if (!data.url) return;
      window.open(data.url, target);
    },
  });

  if (profile)
    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl">Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Label className="flex flex-col gap-y-2">
            <span>Recommendations</span>
            <span className="font-normal leading-snug text-muted-foreground">{profile.credits} remaining</span>
          </Label>
          {!hasSubscription && profile.credits !== 0 && (
            <Label className="flex flex-col gap-y-2">
              <span>Valid until</span>
              <span className="line-clamp-1 font-normal leading-snug text-muted-foreground">
                {new Date(new Date(profile.$createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString()}
              </span>
            </Label>
          )}
        </CardContent>
        {hasSubscription && (
          <CardFooter className="grid">
            {profile.credits > 950 ? (
              <Button disabled>
                <Icons.coins className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Refill limit reached</span>
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={isLoading} aria-label="Add 50 more recommendations">
                    {isLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Icons.coins className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    Add 50 more recommendations
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Expiry date for extra recommendations</AlertDialogTitle>
                    <AlertDialogDescription>
                      These recommendations will expire at the end of your current billing cycle, on{" "}
                      <span className="text-primary">
                        {profile.stripeCurrentPeriodEnd && new Date(profile.stripeCurrentPeriodEnd).toUTCString()}
                      </span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="justify-between">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="default"
                      onClick={() => mutate()}
                      disabled={isLoading}
                      aria-label="Add 50 more recommendations"
                    >
                      {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Icons.coins className="mr-2 h-4 w-4" aria-hidden="true" />
                      )}
                      Add 50 more recommendations
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        )}

        <Separator orientation="horizontal" className="w-full" />
      </>
    );

  return <LoadingPage />;
}
