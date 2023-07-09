"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { useAccount } from "@/lib/hooks/use-account";
import { popularDomains } from "@/lib/validators/schema";

const formSchema = z.object({
  newEmail: z
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
          "This email domain is currently unavailable for sign-up. Please sign up using Gmail, Outlook, Yahoo or Apple.",
      },
    ),
  confirmNewEmail: z
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
          "This email domain is currently unavailable for sign-up. Please sign up using Gmail, Outlook, Yahoo or Apple.",
      },
    ),
  currentPassword: z.string().min(8),
});

type UpdateEmailParams = {
  newEmail: string;
  currentPassword: string;
};

export function FormAccountEmail() {
  const { toast } = useToast();
  const { signOut } = useAccount();

  const extensionDetected = !!window && !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updateEmail"],
    mutationFn: async ({ newEmail, currentPassword }: UpdateEmailParams) =>
      await AppwriteService.updateEmail(newEmail, currentPassword),
    onSuccess: () => {
      toast({
        description: "Email successfully updated. You have been logged out.",
      });
      signOut();
      window.open(`${appwriteUrl}/email-changed`, target);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: "",
      confirmNewEmail: "",
      currentPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values?.newEmail !== values?.confirmNewEmail) {
      form.setError("confirmNewEmail", {
        message: "The emails entered do not match.",
      });
      return;
    }

    mutate({ newEmail: values.newEmail, currentPassword: values.currentPassword });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid gap-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-y-2">
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isLoading || isSuccess} aria-label="Save changes">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.save className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {isSuccess ? "Success" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
