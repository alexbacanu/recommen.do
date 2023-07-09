"use client";

import type { APIResponse } from "@/lib/types/types";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { FormSubscription } from "@/components/profile/form-subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";

type GetManageURLParams = {
  priceId?: string;
};

export function CardSubscription() {
  const { toast } = useToast();
  const profile = useAtomValue(profileAtom);

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const hasSubscription = profile ? profile.stripeSubscriptionId !== "none" : false;

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["getManageURL"],
    mutationFn: async ({ priceId }: GetManageURLParams) => {
      if (!priceId) {
        throw new Error("You don't have an active subscription");
      }

      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/stripe/subscription/${priceId}`, {
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

      const data = (await response.json()) as APIResponse;

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      return data.plan;
    },
    enabled: hasSubscription,
    retry: 2,
  });

  const showSingleMonth = profile && !!data && profile.stripeSubscriptionName === data.metadata?.name;
  const showCanceledMonth = profile && !!data && !data.id;
  const showBothMonth = profile && !!data && !!data.id && profile.stripeSubscriptionName !== data.metadata?.name;

  if (profile)
    return (
      <>
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl">
            <span>Subscription</span>
            <div className="flex items-center">
              <Badge variant="outline" className={cn("capitalize", hasSubscription && "border-lime-400")}>
                {profile.stripeStatus ?? "Inactive"}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        {hasSubscription ? (
          <>
            <CardContent className="grid gap-4">
              {showSingleMonth && (
                <div className="grid gap-4">
                  <Label className="flex flex-col gap-y-2">
                    <span>Active now</span>
                    <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                      <div className="flex items-center">
                        {profile.stripeSubscriptionName === "Cherry plan" && (
                          <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName === "Grape plan" && (
                          <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName === "Pomelo plan" && (
                          <Icons.plan3 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName}
                      </div>
                    </div>
                  </Label>
                  <Label className="flex flex-col gap-y-2">
                    <span>Renewal date</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      {profile.stripeCurrentPeriodEnd && new Date(profile.stripeCurrentPeriodEnd).toUTCString()}
                    </span>
                  </Label>
                </div>
              )}

              {showCanceledMonth && (
                <div className="grid gap-4">
                  <Label className="flex flex-col gap-y-2">
                    <span>Active now</span>
                    <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                      <div className="flex items-center">
                        {profile.stripeSubscriptionName === "Cherry plan" && (
                          <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName === "Grape plan" && (
                          <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName === "Pomelo plan" && (
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
                  <Label className="flex flex-col gap-y-2">
                    <span>Starting next billing cycle</span>
                    <span className="font-normal leading-snug text-muted-foreground">Subscription cancelled</span>
                  </Label>
                </div>
              )}

              {showBothMonth && (
                <div className="grid gap-4">
                  <Label className="flex flex-col gap-y-2">
                    <span>Active now</span>
                    <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                      <div className="flex items-center">
                        {profile.stripeSubscriptionName === "Cherry plan" && (
                          <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName === "Grape plan" && (
                          <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {profile.stripeSubscriptionName === "Pomelo plan" && (
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
                  <Label className="flex flex-col gap-y-2">
                    <span>Starting next billing cycle</span>
                    <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                      <div className="flex items-center">
                        {data.metadata?.name === "Cherry plan" && (
                          <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {data.metadata?.name === "Grape plan" && (
                          <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {data.metadata?.name === "Pomelo plan" && (
                          <Icons.plan3 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                        )}
                        {data.metadata?.name}
                      </div>
                    </div>
                  </Label>
                </div>
              )}
            </CardContent>
            <CardFooter className="grid">
              <Button
                onClick={() => mutate({ priceId: profile.stripePriceId })}
                disabled={isLoading}
                aria-label="Manage subscription"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Icons.manage className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Manage subscription
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
