"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { useAccount } from "@/lib/hooks/use-account";

const formSchema = z.object({
  newEmail: z.string().email(),
  confirmNewEmail: z.string().email(),
  currentPassword: z.string().min(8),
});

type UpdatePasswordParams = {
  newEmail: string;
  currentPassword: string;
};

export function FormAccountEmail() {
  const { signOut } = useAccount();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updateEmail"],
    mutationFn: ({ newEmail, currentPassword }: UpdatePasswordParams) =>
      AppwriteService.updateEmail(newEmail, currentPassword),
    onSuccess: () => {
      toast.success("Email successfully updated. You have been logged out.");
      signOut();
    },
    onError: async (error) => {
      if (error instanceof AppwriteException) {
        toast.error(error.message);
      }

      console.error(error);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
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

        <Button type="submit" disabled={isLoading || isSuccess}>
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
