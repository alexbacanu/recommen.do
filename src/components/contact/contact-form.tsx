"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { appwriteUrl } from "@/lib/envClient";
import { ResendValidator } from "@/lib/validators/schema";

export function FormContact() {
  const { toast } = useToast();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["updateEmail"],
    mutationFn: async ({ ...values }: z.infer<typeof ResendValidator>) => {
      await fetch(`${appwriteUrl}/api/resend`, {
        method: "POST",
        body: JSON.stringify({ ...values }),
      });
    },
    onSuccess: () => {
      toast({
        description: "Email sent succesfully.",
      });
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof ResendValidator>>({
    resolver: zodResolver(ResendValidator),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      terms: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof ResendValidator>) {
    console.log("values:", values);
    if (!values.terms) {
      form.setError("terms", {
        message: "You must accept the terms and conditions and privacy policy.",
      });
      return;
    }

    mutate({ ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea className="bg-background" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked as boolean)} />
              </FormControl>
              <FormLabel>
                I agree with{" "}
                <Link href="/privacy" className="text-primary">
                  Privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-primary">
                  Terms and conditions
                </Link>
              </FormLabel>
            </FormItem>
          )}
        />

        <Button disabled={isLoading || isSuccess} aria-label="Send email">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.save className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {isSuccess ? "Email sent" : "Send email"}
        </Button>
      </form>
    </Form>
  );
}
