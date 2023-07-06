"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStorage } from "@plasmohq/storage/hook";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/helpers/utils";

const formSchema = z.object({
  userApiKey: z
    .string()
    .regex(/^[a-zA-Z0-9\-_\s]*$/, { message: "Invalid characters!" })
    .trim()
    .optional(),
});

export function FormAPIKey() {
  const [userApiKey, setUserApiKey, { remove }] = useStorage<string>("userApiKey", "");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userApiKey: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.userApiKey) return;

    setUserApiKey(values.userApiKey);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          defaultValue={userApiKey}
          name="userApiKey"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormLabel>OpenAI API Key</FormLabel>
                <Badge variant="outline" className={cn("capitalize", !!userApiKey && "border-lime-400")}>
                  {!!userApiKey ? "Active" : "Inactive"}
                </Badge>
              </div>

              <FormControl>
                <Input className={cn(!!userApiKey && "hidden")} disabled={!!userApiKey} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {!!userApiKey ? (
          <Button
            type="button"
            variant="destructive"
            aria-label="Remove key"
            onClick={() => {
              form.reset();
              remove();
            }}
          >
            <Icons.remove className="mr-2 h-4 w-4" aria-hidden="true" />
            Remove key
          </Button>
        ) : (
          <Button aria-label="Add key">
            <Icons.key className="mr-2 h-4 w-4" aria-hidden="true" />
            Add key
          </Button>
        )}
      </form>
    </Form>
  );
}
