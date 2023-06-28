"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { stripeBasicPlan, stripePremiumPlan, stripeUltimatePlan } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";

const formSchema = z.object({
  plan: z.string(),
});

async function getCheckoutURL(priceId?: string | null) {
  const jwt = await AppwriteService.createJWT();

  const fetchUrl = priceId ? `/api/stripe/subscription/${priceId}` : "/api/stripe/refill";

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const checkoutURL: { url: string } = await response.json();
  return checkoutURL;
}

export function CardUsage() {
  const [isPending, startTransition] = useTransition();
  const profile = useAtomValue(profileAtom);
  const router = useRouter();

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  const hasSubscription = profile ? profile.stripeSubscriptionId !== "none" : false;
  const stripePriceId = profile ? profile?.stripePriceId : null;

  const subQuery = useQuery({
    queryKey: ["subscriptonQuery", stripePriceId],
    queryFn: () => getCheckoutURL(stripePriceId),
    enabled: hasSubscription,
  });
  const subURL = subQuery.data ? subQuery.data.url : "#";

  const refillQuery = useQuery({
    queryKey: ["refillQuery"],
    queryFn: () => getCheckoutURL(),
    enabled: hasSubscription,
  });
  const refillURL = refillQuery.data ? refillQuery.data.url : "#";

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const promise = await getCheckoutURL(values.plan);

        if (promise) {
          console.log("card-usage.promise:", promise);

          toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(values.plan, null, 2)}</code>
              </pre>
            ),
          });

          router.push(promise.url);
        }
      } catch (error) {
        console.log("card-usage.error:", error);

        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(values.plan, null, 2)}</code>
            </pre>
          ),
        });
      }
    });
  }

  if (profile)
    return (
      <>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Usage</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-4 pb-0", hasSubscription && "pb-4")}>
          <Label className="flex flex-col space-y-2">
            <span>Remaining</span>
            <span className="font-normal leading-snug text-muted-foreground">{profile.credits} credits remaining</span>
          </Label>
          {!hasSubscription && (
            <Label className="flex flex-col space-y-2">
              <span>Valid until</span>
              <span className="font-normal leading-snug text-muted-foreground">
                {new Date(new Date(profile.$createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString()}
              </span>
            </Label>
          )}
        </CardContent>
        <CardFooter className="grid">
          {hasSubscription && (
            <Button aria-label="Add 50 more credits" asChild>
              <a href={refillURL} target={target}>
                <Icons.coins className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Add 50 more credits</span>
              </a>
            </Button>
          )}
        </CardFooter>

        <Separator orientation="horizontal" className="w-full" />

        <CardHeader className="pb-4">
          <CardTitle className="flex justify-between text-2xl">
            <span>Subscription</span>
            <Badge variant="outline">{profile.stripeStatus ?? "Inactive"}</Badge>
          </CardTitle>
        </CardHeader>
        {hasSubscription ? (
          <>
            <CardContent className="grid gap-4 pb-4">
              <Label className="flex flex-col space-y-2">
                <span>Current plan</span>
                <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
                  <div className="flex items-center">
                    {profile.stripeSubscriptionName === "Cherry plan" && (
                      <Icons.plan1 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    )}
                    {profile.stripeSubscriptionName === "Banana plan" && (
                      <Icons.plan2 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    )}
                    {profile.stripeSubscriptionName === "Watermelon plan" && (
                      <Icons.plan3 className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    )}
                    {profile.stripeSubscriptionName}
                  </div>
                </div>
              </Label>
              <Label className="flex flex-col space-y-2">
                <span>Renewal date</span>
                <span className="font-normal leading-snug text-muted-foreground">Fri, 21 Jul 2023</span>
              </Label>
            </CardContent>
            <CardFooter className="grid">
              <Button aria-label="Manage subscription" asChild>
                <a href={subURL} target={target}>
                  <Icons.manage className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Manage subscription</span>
                </a>
              </Button>
            </CardFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4 pb-4">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-3 gap-4"
                        >
                          <label
                            htmlFor="cherry"
                            className={cn(
                              "group relative flex select-none items-center gap-2 rounded-md border bg-popover p-3",
                              field.value === stripeBasicPlan
                                ? "text-primary border-primary"
                                : "hover:bg-accent hover:text-primary",
                            )}
                          >
                            <div className="hidden">
                              <RadioGroupItem id="cherry" value={stripeBasicPlan} />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <Icons.plan1 className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="grid gap-1">
                              <div className="text-sm font-semibold">Cherry</div>
                              <div className="text-sm text-muted-foreground">50 credits</div>
                            </div>
                            <Badge className="absolute right-2 top-2">$2</Badge>
                          </label>

                          <label
                            htmlFor="peach"
                            className={cn(
                              "group relative flex select-none items-center gap-2 rounded-md border bg-popover p-3",
                              field.value === stripePremiumPlan
                                ? "text-primary border-primary"
                                : "hover:bg-accent hover:text-primary",
                            )}
                          >
                            <div className="hidden">
                              <RadioGroupItem id="peach" value={stripePremiumPlan} />
                            </div>
                            <div>
                              <Icons.plan2 className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="grid gap-1">
                              <div className="text-sm font-semibold">Peach</div>
                              <div className="text-sm text-muted-foreground">200 credits</div>
                            </div>
                            <Badge className="absolute right-2 top-2">$4</Badge>
                          </label>

                          <label
                            htmlFor="melon"
                            className={cn(
                              "group relative flex select-none items-center gap-2 rounded-md border bg-popover p-3",
                              field.value === stripeUltimatePlan
                                ? "text-primary border-primary"
                                : "hover:bg-accent hover:text-primary",
                            )}
                          >
                            <div className="hidden">
                              <RadioGroupItem id="melon" value={stripeUltimatePlan} />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <Icons.plan3 className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="grid gap-1">
                              <div className="text-sm font-semibold">Melon</div>
                              <div className="text-sm text-muted-foreground">600 credits</div>
                            </div>
                            <Badge className="absolute right-2 top-2">$10</Badge>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="grid">
                <Button disabled={isPending}>
                  {/* TODO: isPending is not loading */}
                  {isPending ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Icons.sprout className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  Subscribe
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </>
    );

  return null;
}