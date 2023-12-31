"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AppwriteService } from "@/lib/clients/client-appwrite";

const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

interface CardAccountProps {
  searchParams: {
    userId: string;
    secret: string;
  };
}

export function FormForgot({ searchParams }: CardAccountProps) {
  const { toast } = useToast();
  const router = useRouter();
  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updateRecovery"],
    mutationFn: async ({ confirmPassword }: { confirmPassword: string }) =>
      await AppwriteService.updateRecovery(searchParams.userId, searchParams.secret, confirmPassword),
    onSuccess: () => {
      toast({
        description: "Password updated successfully.",
      });

      router.push("/profile");
    },
    onSettled: (data, error) => {
      if (!!error) router.push("/");
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values?.password !== values?.confirmPassword) {
      form.setError("confirmPassword", {
        message: "The passwords do not match.",
      });
      return;
    }

    mutate({ confirmPassword: values.confirmPassword });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid gap-4">
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
