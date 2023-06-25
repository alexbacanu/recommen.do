"use client";

import { useStorage } from "@plasmohq/storage/hook";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppwriteService } from "@/lib/clients/appwrite-service";
import { appwriteUrl } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";
import { useProfile } from "@/lib/hooks/use-profile";

async function getCheckoutURL(priceId?: string | null) {
  const jwt = await AppwriteService.createJWT();

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

export function Subscription() {
  const profile = useProfile();

  const [userApiKey] = useStorage<string | undefined>("userApiKey");

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const apiKeyDetected = !!userApiKey;
  const hasSubscription = profile && profile.stripeSubscriptionId !== "none";

  const subQuery = useQuery({
    queryKey: ["subscriptonQuery", profile?.stripePriceId],
    queryFn: () => getCheckoutURL(profile?.stripePriceId),
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
          <div className="text-xl font-semibold text-muted-foreground">{profile?.credits}</div>
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
              ? `Renew date: ${
                  profile.stripeCurrentPeriodEnd ? new Date(profile.stripeCurrentPeriodEnd).toUTCString() : "Unknown"
                }`
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
            <Button variant="outline" className="text-center" disabled={refillQuery.isLoading} asChild>
              <a href={refillURL} target={target}>
                Add 50 more recommendations
              </a>
            </Button>
            <Button variant="outline" className="text-center" disabled={subQuery.isLoading} asChild>
              <a href={subURL} target={target}>
                Manage subscription
              </a>
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="grid grid-cols-1">
            <Button variant="outline" asChild>
              <a href={`${appwriteUrl}/#pricing`} target={target}>
                View subscription options
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
