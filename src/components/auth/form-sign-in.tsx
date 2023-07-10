"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { accountAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { popularDomains } from "@/lib/validators/schema";

const formSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (value) => {
        const parts = value.split("@");
        if (!parts[0] || !parts[1]) return false;

        const domain = parts[1];

        return popularDomains.includes(domain);
      },
      {
        message:
          "The domain of the email you entered is not available. Please use Gmail, Outlook, Yahoo, Apple, or any of the given social sign in options instead.",
      },
    ),
});

type createMagicURLParams = {
  email: string;
};

interface FormSignInProps {
  hasAccepted: boolean;
}

export function FormSignIn({ hasAccepted }: FormSignInProps) {
  const router = useRouter();

  // const hasAccepted = useAtomValue(termsAtom);
  const account = useAtomValue(accountAtom);

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["createMagicURL"],
    mutationFn: async ({ email }: createMagicURLParams) => await AppwriteService.createMagicURL(email),
    onSuccess: (_, variables) => {
      router.push(`/sign-in/verify?email=${variables.email}`);
    },
  });

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
      form.setError("email", {
        message: "Please accept the Terms and Conditions and Privacy Policy to proceed with the sign in.",
      });
      return;
    }

    if (account) {
      form.setError("email", {
        message: "You're currently logged in. Please log out before you try to sign in again.",
      });
      return;
    }

    mutate({ email: values.email });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid gap-4">
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

        <Button disabled={isLoading} aria-label="Sign in with Magic URL">
          {isLoading ? (
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
