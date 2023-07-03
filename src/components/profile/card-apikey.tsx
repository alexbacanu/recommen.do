"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/helpers/utils";

const formSchema = z.object({
  userApiKey: z
    .string()
    .regex(/^[a-zA-Z0-9\-_\s]*$/, { message: "Invalid characters!" })
    .trim()
    .optional(),
});

export function CardAPIKey() {
  const [isPending, startTransition] = useTransition();

  const [userApiKey, setUserApiKey, { remove }] = useStorage<string | undefined>("userApiKey", "");
  const [isPromptHidden, setIsPromptHidden] = useStorage<boolean>("promptStatus");

  const extensionDetected = !window?.next;

  const apiKeyDetected = !!userApiKey;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values?.userApiKey === "") return;

    startTransition(async () => {
      try {
        setUserApiKey(values.userApiKey);
        console.log("card-apikey.success:");
      } catch (error) {
        console.log("card-apikey.error:", error);
      }
    });
  }

  function onReset() {
    remove();
    form.reset();
  }

  useEffect(() => {
    console.log("userApiKey:", userApiKey);
    console.log("userApiKey.type:", typeof userApiKey);
  }, [userApiKey]);

  if (extensionDetected)
    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl">
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Label className="flex flex-col gap-y-2">
            <span>Display</span>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-extension" className="font-normal leading-snug text-muted-foreground">
                Show extension inside pages
              </Label>
              <Switch
                id="show-extension"
                checked={!isPromptHidden}
                onClick={() => setIsPromptHidden((prevState) => !prevState)}
              />
            </div>
          </Label>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 pb-4">
                <FormField
                  control={form.control}
                  defaultValue={userApiKey}
                  name="userApiKey"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-x-2">
                        <FormLabel>OpenAI API Key</FormLabel>
                        <Badge variant="outline" className={cn("capitalize", apiKeyDetected && "border-lime-400")}>
                          {apiKeyDetected ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <FormControl>
                        <Input className={cn(apiKeyDetected && "hidden")} disabled={apiKeyDetected} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid">
                {apiKeyDetected ? (
                  <Button disabled={!apiKeyDetected} type="button" variant="destructive" onClick={() => onReset()}>
                    Clear key
                  </Button>
                ) : (
                  <Button disabled={isPending}>
                    {/* TODO: isPending is not loading */}
                    {isPending ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Icons.key className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    Add key
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>

        <Separator orientation="horizontal" className="w-full" />
      </>
    );

  return null;
}
