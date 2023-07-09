"use client";

import type { AppwriteAccount } from "@/lib/types/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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

type ForgotPasswordParams = {
  email: string;
};

export function FormAccountPassword({ account }: CardAccountProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: async ({ newPassword, oldPassword }: UpdatePasswordParams) =>
      await AppwriteService.updatePassword(newPassword, oldPassword),
    onSuccess: () => {
      toast({
        description: "Password successfully updated.",
      });
      queryClient.invalidateQueries(["account"]);
    },
  });

  // 0. Define your mutation.
  const {
    mutate: mutateForgot,
    isLoading: isLoadingForgot,
    isSuccess: isSuccessForgot,
  } = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: async ({ email }: ForgotPasswordParams) => await AppwriteService.createRecovery(email),
    onSuccess: () => {
      toast({
        description: "Email with password reset sent.",
      });
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
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid gap-4">
        {account.passwordUpdate !== "" && (
          <>
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      type="button"
                      onClick={() => mutateForgot({ email: account.email })}
                      className="h-auto p-0"
                      variant="link"
                      disabled={isLoadingForgot || isSuccessForgot}
                      aria-label="Forgot password?"
                    >
                      {isSuccessForgot ? "Check your email" : "Forgot password?"}
                    </Button>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
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
