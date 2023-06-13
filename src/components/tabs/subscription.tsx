"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { profileAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

export function Subscription() {
  const profile = useAtomValue(profileAtom);
  const [refillLoading, setRefillLoading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);
  const { createJWT } = useAppwrite();

  const hasSubscription = profile && profile.stripeSubscriptionName;
  const canRefill = profile;

  let jwt: string;

  const handleSubscribe = async (priceId: string) => {
    setManageLoading(true);
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    console.log("jwt:", jwt);

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

    console.log("jwt:", jwt);

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
    <section id="subscription" className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-8">
      <Card>
        <CardHeader>
          <CardTitle className="">Usage</CardTitle>
          {/* <CardDescription>Check your recommendations usage</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">{profile ? profile.credits : 0}</div>
          <div className="text-sm text-muted-foreground">Recommendations remaining</div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {/* <Button onClick={() => handleRefill()} disabled={!!profile}>
            Buy 50 extra credits
          </Button> */}
          Only successful recommendations are processed
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="">Details</CardTitle>
          {/* <CardDescription>Check your recommendations usage</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">
            {hasSubscription ? profile.stripeSubscriptionName : "Free"}
          </div>
          <div className="text-sm text-muted-foreground/80">
            {hasSubscription
              ? `Renew date: ${new Date(profile.stripeCurrentPeriodEnd).toUTCString()}`
              : "No subscription"}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground/80">
          {/* <Button onClick={() => handleRefill()} disabled={!!profile}>
            Buy 50 extra credits
          </Button> */}
          Will automatically renew every month
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="">Subscription</CardTitle>
          {/* <CardDescription>Check your recommendations usage</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">{hasSubscription && profile.name}</div>
          <div className="text-sm text-muted-foreground/80">Owner: {hasSubscription && profile.email}</div>
          {/* <div className="text-sm text-muted-foreground">
            {hasSubscription
              ? `Renew date: ${new Date(profile.stripeCurrentPeriodEnd).toUTCString()}`
              : "No subscription"}
          </div> */}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button size="lg" variant="outline" onClick={() => handleRefill()} disabled={refillLoading || !canRefill}>
            {refillLoading ? "Loading..." : "Add 50 extra recommendations"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleSubscribe(profile.stripePriceId)}
            disabled={manageLoading || !canRefill}
          >
            {manageLoading ? "Loading..." : "Manage plan"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
