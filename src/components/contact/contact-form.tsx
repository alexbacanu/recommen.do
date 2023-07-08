"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { appwriteUrl } from "@/lib/envClient";
import { ResendValidator } from "@/lib/validators/schema";

export function FormContact() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // 0. Define your mutation.
  const { mutate, isLoading, isSuccess, isError } = useMutation({
    mutationKey: ["updateEmail"],
    mutationFn: async ({ ...values }: z.infer<typeof ResendValidator>) => {
      const response = await fetch(`${appwriteUrl}/api/resend`, {
        method: "POST",
        body: JSON.stringify({ ...values }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data);
      }

      return response;
    },
    onSuccess: () => {
      toast({
        description: "Email sent succesfully.",
      });

      setTitle("Thank you for reaching out!");
      setMessage("We have received your message and will get in touch as soon as possible!");
      setOpen(true);
    },
    onError: async (error) => {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }

      console.error(error);
      setTitle("Something went wrong");
      setMessage("Unfortunately, your message was not sent. Please try again later.");
      setOpen(true);
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
            <FormItem className="mt-2 flex items-center gap-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked as boolean)} />
              </FormControl>
              <FormLabel className="text-foreground">
                I agree with{" "}
                <Link href="/privacy" className="text-primary">
                  Privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-primary">
                  Terms and conditions
                </Link>
              </FormLabel>
              <FormMessage className="h-[1rem]" />
              {/* <FormDescription>You need to agree with our terms before continuing.</FormDescription> */}
            </FormItem>
          )}
        />

        <Button disabled={isLoading || isSuccess} aria-label="Send email" className="mt-4">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.send className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {isSuccess ? "Email sent" : "Send email"}
        </Button>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              {isError ? "I understand" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
