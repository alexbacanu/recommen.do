"use client";

import type { OpenAISettings } from "~/lib/schema";
import type { Profile } from "~/lib/types";

import { useStorage } from "@plasmohq/storage/hook";
import { useQuery } from "@tanstack/react-query";

import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { appwriteUrl } from "~/lib/envClient";
import { AppwriteService } from "~/lib/helpers/appwrite-service";
import { cn } from "~/lib/helpers/cn";

interface SubscriptionProps {
  profile: Profile;
}

interface CustomWindow extends Window {
  next: unknown;
}
declare const window: CustomWindow;

let jwt: string;
async function getCheckoutURL(priceId?: string) {
  if (!jwt) {
    const jwtObject = await AppwriteService.createJWT();
    jwt = jwtObject.jwt;
  }

  const fetchUrl = priceId ? `${appwriteUrl}/api/stripe/subscription/${priceId}` : `${appwriteUrl}/api/stripe/refill`;

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const checkoutURL: { url: string } = await response.json();
  return checkoutURL;
}

export function Subscription({ profile }: SubscriptionProps) {
  const [openaiSettings] = useStorage<OpenAISettings>("openaiSettings", {
    apiKey: undefined,
    orgName: undefined,
  });

  const extensionDetected = !window.next;
  const target = extensionDetected ? "_blank" : "_self";

  const apiKeyDetected = !!openaiSettings?.apiKey;
  const hasSubscription = profile.stripeSubscriptionName !== null;

  const subQuery = useQuery({
    queryKey: ["subscriptonQuery", profile.stripePriceId],
    queryFn: () => getCheckoutURL(profile.stripePriceId),
    enabled: hasSubscription,
  });
  const subURL = subQuery.data ? subQuery.data.url : "#";

  const refillQuery = useQuery({
    queryKey: ["refillQuery"],
    queryFn: () => getCheckoutURL(),
    enabled: hasSubscription,
  });
  const refillURL = refillQuery.data ? refillQuery.data.url : "#";

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
          <div className="text-xl font-semibold text-muted-foreground">{profile.credits}</div>
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
        <CardFooter className="text-sm text-muted-foreground">
          {hasSubscription ? "Will automatically renew every month" : ""}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-muted-foreground">{hasSubscription ? "Active" : "Inactive"}</div>
          <div className="text-sm text-muted-foreground">{hasSubscription ? `Owner: ${profile.email}` : ""}</div>
        </CardContent>
        {hasSubscription ? (
          <CardFooter className="grid grid-cols-2 gap-4">
            <a
              href={refillURL}
              target={target}
              className={buttonVariants({ variant: "outline", size: "lg", className: "text-center" })}
            >
              {refillQuery.isLoading ? "Loading..." : "Add 50 more recommendations"}
            </a>
            <a
              href={subURL}
              target={target}
              className={buttonVariants({ variant: "outline", size: "lg", className: "text-center" })}
            >
              {subQuery.isLoading ? "Loading..." : "Manage subscription"}
            </a>
          </CardFooter>
        ) : (
          <CardFooter className="grid grid-cols-1">
            <a
              href={`${appwriteUrl}/#pricing`}
              target={target}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View subscription options
            </a>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
