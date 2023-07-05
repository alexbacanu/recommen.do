"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";

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
        description: "Password successfully updated.",
      });
      // toast.success("Password successfully updated.");
      router.push(`${appwriteUrl}/profile`);
    },
    onError: async (error) => {
      if (error instanceof AppwriteException) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      if (error instanceof Error) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      console.error(error);
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
        message: "The passwords entered do not match.",
      });
      return;
    }

    mutate({ confirmPassword: values.confirmPassword });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
