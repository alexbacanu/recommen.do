"use client";

import type Stripe from "stripe";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

import { FormSubscription } from "@/components/profile/form-subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";

type GetManageURLParams = {
  priceId?: string;
};

export function CardSubscription() {
  const profile = useAtomValue(profileAtom);

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const hasSubscription = profile ? profile.stripeSubscriptionId !== "none" : false;

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["getManageURL"],
    mutationFn: async ({ priceId }: GetManageURLParams) => {
      if (!priceId) {
        toast.error("You don't have an active subscription");
        return;
      }

      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/stripe/subscription/${priceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const checkoutUrl: { url: string } = await response.json();
      return checkoutUrl.url;
    },
    onSuccess: (data) => {
      window.open(data, target);
    },
    onError: async (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.error(error);
    },
  });

  const { data } = useQuery({
    queryKey: ["retrieveSubscriptions"],
    queryFn: async () => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/stripe/subscription/retrieve`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const subscriptionList: Stripe.Plan = await response.json();
      return subscriptionList;
    },
    enabled: !!hasSubscription,
    retry: 1,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (profile)
    return (
      <>
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl">
            <span>Subscription</span>
            <Badge variant="outline" className={cn("capitalize", hasSubscription && "border-lime-400")}>
              {profile.stripeStatus ?? "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        {hasSubscription ? (
          <>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="grid gap-4">
                <Label className="flex flex-col gap-y-2">
                  <span>Current plan</span>
                  <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                    <div className="flex items-center">
                      {profile.stripeSubscriptionName === "Cherry plan" && (
                        <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                      )}
                      {profile.stripeSubscriptionName === "Grape plan" && (
                        <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                      )}
                      {profile.stripeSubscriptionName === "Melon plan" && (
                        <Icons.plan3 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                      )}
                      {profile.stripeSubscriptionName}
                    </div>
                  </div>
                </Label>
                <Label className="flex flex-col gap-y-2">
                  <span>End date</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    {profile.stripeCurrentPeriodEnd && new Date(profile.stripeCurrentPeriodEnd).toUTCString()}
                  </span>
                </Label>
              </div>
              {!!data?.id && (
                <div className="grid gap-4">
                  <Label className="flex flex-col gap-y-2">
                    <span>Next month</span>
                    <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                      <div className="flex items-center">
                        {data.metadata?.name === "Cherry plan" && (
                          <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {data.metadata?.name === "Grape plan" && (
                          <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {data.metadata?.name === "Melon plan" && (
                          <Icons.plan3 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {data.metadata?.name}
                      </div>
                    </div>
                  </Label>
                  <Label className="flex flex-col gap-y-2">
                    <span>Start date</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      {profile.stripeCurrentPeriodEnd && new Date(profile.stripeCurrentPeriodEnd).toUTCString()}
                    </span>
                  </Label>
                </div>
              )}
            </CardContent>
            <CardFooter className="grid">
              <Button
                onClick={() => mutate({ priceId: profile.stripePriceId })}
                disabled={isLoading || isSuccess}
                aria-label="Manage subscription"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Icons.manage className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {isSuccess ? "Success" : "Manage subscription"}
              </Button>
            </CardFooter>
          </>
        ) : (
          <FormSubscription />
        )}

        {/* <Separator orientation="horizontal" className="w-full" /> */}
      </>
    );

  return <LoadingPage />;
}
