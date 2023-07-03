"use client";

import type { AppwriteAccount } from "@/lib/types/types";

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

const formSchema = z.object({
  oldPassword: z.string().optional(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

interface CardAccountProps {
  account: AppwriteAccount;
}

type UpdatePasswordParams = {
  newPassword: string;
  oldPassword?: string;
};

export function FormAccountPassword({ account }: CardAccountProps) {
  // const { signOut } = useAccount();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: ({ newPassword, oldPassword }: UpdatePasswordParams) =>
      AppwriteService.updatePassword(newPassword, oldPassword),
    onSuccess: () => {
      toast.success("Password successfully updated.");
      // signOut();
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
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (account.passwordUpdate !== "" && values.oldPassword === "") {
      form.setError("oldPassword", {
        message: "Please enter your current password.",
      });
      return;
    }

    if (values?.password !== values?.confirmPassword) {
      form.setError("confirmPassword", {
        message: "The passwords entered do not match.",
      });
      return;
    }

    mutate({ newPassword: values.password, oldPassword: values.oldPassword });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
        {account.passwordUpdate !== "" && (
          <FormField
            control={form.control}
            name="oldPassword"
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
        )}

        <div className="grid gap-y-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
