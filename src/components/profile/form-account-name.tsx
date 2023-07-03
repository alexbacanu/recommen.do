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
import { useAccount } from "@/lib/hooks/use-account";

const formSchema = z.object({
  displayName: z.string().min(0).max(128),
});

interface CardAccountProps {
  account: AppwriteAccount;
}

type UpdateNameParams = {
  newName: string;
};

export function FormAccountName({ account }: CardAccountProps) {
  const { fetchAccount } = useAccount();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updateName"],
    mutationFn: ({ newName }: UpdateNameParams) => AppwriteService.updateName(newName),
    onSuccess: () => {
      toast.success("Name successfully updated.");
      fetchAccount();
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
      displayName: account.name,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values?.displayName === "") {
      form.setError("displayName", {
        message: "Please provide a display name.",
      });
      return;
    }

    if (values?.displayName === account.name) {
      form.setError("displayName", {
        message: "The display name must be different from the current name.",
      });
      return;
    }

    mutate({ newName: values.displayName });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder={account.name} {...field} />
              </FormControl>
              {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
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
