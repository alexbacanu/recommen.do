"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStorage } from "@plasmohq/storage/hook";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { profileAtom } from "@/lib/atoms/auth";
import { appwriteUrl } from "@/lib/envClient";
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

  const profile = useAtomValue(profileAtom);
  const hasSubscription = profile ? profile.stripeSubscriptionId !== "none" : false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userApiKey: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.userApiKey) return;

    await setUserApiKey(values.userApiKey);
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid gap-4">
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
        ) : hasSubscription ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" aria-label="Add key" disabled={!form.watch("userApiKey")}>
                <Icons.key className="mr-2 h-4 w-4" aria-hidden="true" />
                Add key
              </Button>
            </DialogTrigger>
            <DialogContent className="gap-8">
              <DialogHeader className="gap-4 text-left">
                <DialogTitle>Before you proceed</DialogTitle>
                <DialogDescription>
                  We have noticed that you have an active subscription. The recommendations you consume using your
                  OpenAI API Key are not subtracted from your available recommendations. Having an active subscription
                  is not mandatory in order to use your own OpenAI API Key.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="grid grid-cols-2 gap-4">
                <Button onClick={(...args) => void form.handleSubmit(onSubmit)(...args)}>I understand</Button>

                <Button variant="outline" asChild>
                  <Link href={`${appwriteUrl}/faq`} target="_blank">
                    Learn more
                  </Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button type="submit" aria-label="Add key" disabled={!form.watch("userApiKey")}>
            <Icons.key className="mr-2 h-4 w-4" aria-hidden="true" />
            Add key
          </Button>
        )}
      </form>
    </Form>
  );
}
