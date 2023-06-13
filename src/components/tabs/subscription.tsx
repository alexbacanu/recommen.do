"use client";

import type { OpenAISettings } from "~/lib/types";
import type { Models } from "appwrite";

import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/helpers/cn";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface SubscriptionProps {
  profile: Models.Document;
}

export function Subscription({ profile }: SubscriptionProps) {
  const [refillLoading, setRefillLoading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);

  const hasSubscription = profile && profile.stripeSubscriptionName;
  const canRefill = profile;

  const [openaiSettings, setOpenaiSettings, { remove }] = useStorage<OpenAISettings>("openaiSettings", {
    apiKey: undefined,
    orgName: undefined,
  });

  const apiKeyDetected = !!openaiSettings?.apiKey;

  const { createJWT } = useAppwrite();

  let jwt: string;

  const handleSubscribe = async (priceId: string) => {
    setManageLoading(true);
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    const getCheckoutURL = await fetch(`/api/stripe/subscription/${priceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const checkoutUrl = await getCheckoutURL.json();

    console.log("getCheckoutURL:", checkoutUrl);
    setManageLoading(false);
    window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  const handleRefill = async () => {
    setRefillLoading(true);
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    const getCheckoutURL = await fetch(`/api/stripe/refill`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const checkoutUrl = await getCheckoutURL.json();

    console.log("getCheckoutURL:", checkoutUrl);
    setRefillLoading(false);
    window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="subscription"
      className={cn("grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-8", apiKeyDetected && "opacity-30")}
    >
      <Card>
        <CardHeader>
          <CardTitle className="">Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">{profile ? profile.credits : 0}</div>
          <div className="text-sm text-muted-foreground">Recommendations remaining</div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">Only successful recommendations are processed</CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">
            {hasSubscription ? profile.stripeSubscriptionName : "Free"}
          </div>
          <div className="text-sm text-muted-foreground">
            {hasSubscription
              ? `Renew date: ${new Date(profile.stripeCurrentPeriodEnd).toUTCString()}`
              : "No subscription"}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">Will automatically renew every month</CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">{hasSubscription && profile.name}</div>
          <div className="text-sm text-muted-foreground">Owner: {hasSubscription && profile.email}</div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleRefill()}
            disabled={refillLoading || !canRefill || apiKeyDetected}
          >
            {refillLoading ? "Loading..." : "Add 50 extra recommendations"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleSubscribe(profile.stripePriceId)}
            disabled={manageLoading || !canRefill || apiKeyDetected}
          >
            {manageLoading ? "Loading..." : "Manage plan"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
