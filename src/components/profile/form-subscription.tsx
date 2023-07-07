"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl, stripeBasicPlan, stripePremiumPlan, stripeUltimatePlan } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";

const formSchema = z.object({
  plan: z.string(),
});

type GetSubscribeURLarams = {
  priceId: string;
};

export function FormSubscription() {
  const { toast } = useToast();

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["getSubscribeURL"],
    mutationFn: async ({ priceId }: GetSubscribeURLarams) => {
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
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values?.plan === "") {
      form.setError("plan", {
        message: "You need to select a valid plan.",
      });
      return;
    }

    mutate({ priceId: values.plan });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormControl>
                  <RadioGroup
                    // defaultValue={stripeBasicPlan}
                    onValueChange={field.onChange}
                    className="grid gap-2 sm:grid-cols-3 md:grid-cols-1"
                  >
                    <Label
                      htmlFor={stripeBasicPlan}
                      className={cn(
                        "group relative flex select-none items-center gap-2 rounded-md border bg-popover p-3",
                        field.value === stripeBasicPlan
                          ? "border-primary text-primary"
                          : "hover:border-primary/30 hover:text-primary",
                      )}
                    >
                      <div className="hidden">
                        <RadioGroupItem id={stripeBasicPlan} value={stripeBasicPlan} />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Icons.plan1 className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="grid gap-1">
                        <div className="text-sm font-semibold">Cherry</div>
                        <div className="text-sm text-muted-foreground">50 recommendations</div>
                      </div>
                      <Badge className="absolute right-2 top-2">$2</Badge>
                    </Label>

                    <Label
                      htmlFor={stripePremiumPlan}
                      className={cn(
                        "group relative flex select-none items-center gap-2 rounded-md border bg-popover p-3",
                        field.value === stripePremiumPlan
                          ? "border-primary text-primary"
                          : "hover:border-primary/30 hover:text-primary",
                      )}
                    >
                      <div className="hidden">
                        <RadioGroupItem id={stripePremiumPlan} value={stripePremiumPlan} />
                      </div>
                      <div>
                        <Icons.plan2 className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="grid gap-1">
                        <div className="text-sm font-semibold">Grape</div>
                        <div className="text-sm text-muted-foreground">200 recommendations</div>
                      </div>
                      <Badge className="absolute right-2 top-2">$4</Badge>
                    </Label>

                    <Label
                      htmlFor={stripeUltimatePlan}
                      className={cn(
                        "group relative flex select-none items-center gap-2 rounded-md border bg-popover p-3",
                        field.value === stripeUltimatePlan
                          ? "border-primary text-primary"
                          : "hover:border-primary/30 hover:text-primary",
                      )}
                    >
                      <div className="hidden">
                        <RadioGroupItem id={stripeUltimatePlan} value={stripeUltimatePlan} />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Icons.plan3 className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="grid gap-1">
                        <div className="text-sm font-semibold">Pomelo</div>
                        <div className="text-sm text-muted-foreground">600 recommendations</div>
                      </div>
                      <Badge className="absolute right-2 top-2">$10</Badge>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="grid">
          <Button disabled={isLoading} aria-label="Subscribe">
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icons.sprout className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Subscribe
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
