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
  displayName: z.string().min(0).max(128).trim(),
});

interface CardAccountProps {
  account: AppwriteAccount;
}

interface UpdateNameParams {
  newName: string;
}

export function FormAccountName({ account }: CardAccountProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updateName"],
    mutationFn: async ({ newName }: UpdateNameParams) => await AppwriteService.updateName(newName),
    onSuccess: () => {
      toast({
        description: "Name updated successfully.",
      });

      void queryClient.invalidateQueries(["account"]);
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
        message: "Please provide a name.",
      });
      return;
    }

    if (values?.displayName === account.name) {
      form.setError("displayName", {
        message: "The name must be different from the current name.",
      });
      return;
    }

    mutate({ newName: values.displayName });
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid gap-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New name</FormLabel>
              <FormControl>
                <Input placeholder={account.name} {...field} />
              </FormControl>
              {/* <FormDescription className="text-xs">This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading || isSuccess} aria-label="Change name">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.save className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {isSuccess ? "Success" : "Change name"}
        </Button>
      </form>
    </Form>
  );
}
