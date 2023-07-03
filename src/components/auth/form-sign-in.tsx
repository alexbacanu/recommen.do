"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { accountAtom } from "@/lib/atoms/auth";
import { termsAtom } from "@/lib/atoms/legal";
import { AppwriteService } from "@/lib/clients/client-appwrite";

const popularDomains = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
];

const formSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (value) => {
        const parts = value.split("@");
        if (!parts[0] || !parts[1]) return false;

        const domain = parts[1];
        // const dotCount = parts[0].split(".").length - 1;

        return popularDomains.includes(domain);
      },
      {
        message: "Invalid email format, use Gmail, Outlook, Yahoo, Apple or Social Logins",
      },
    ),
});

export function FormSignIn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasAccepted = useAtomValue(termsAtom);
  const account = useAtomValue(accountAtom);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!hasAccepted) {
      // toast({
      //   title: "Error",
      //   description: "Please accept the Terms and conditions and Privacy Policy to proceed with sign-in.",
      //   variant: "destructive",
      // });
      return;
    }

    if (account) {
      // toast({
      //   title: "Error",
      //   description: "You are already signed in. Please sign out before signing in again.",
      //   variant: "destructive",
      // });
      return;
    }

    startTransition(async () => {
      try {
        const promise = await AppwriteService.createMagicURL(values.email);

        if (promise) {
          console.log("form-sign-in.promise:", promise);
          router.push(`/sign-in/verify?email=${values.email}`);
        }
      } catch (error) {
        console.log("form-sign-in.error:", error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button aria-label="Sign in with Magic URL" disabled={isPending}>
          {/* TODO: isPending is not loading */}
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.login className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Sign in with Magic URL
        </Button>
      </form>
    </Form>
  );
}
