"use client";

import { AppwriteException } from "appwrite";
import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { accountAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";

const oauthProviders = [
  { name: "Google", strategy: "google", icon: "google" },
  { name: "Github", strategy: "github", icon: "github" },
  { name: "Facebook", strategy: "facebook", icon: "facebook" },
] satisfies {
  name: string;
  strategy: string;
  icon: keyof typeof Icons;
}[];

interface OAuthSignInProps {
  hasAccepted: boolean;
}

export function OAuthSignIn({ hasAccepted }: OAuthSignInProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // const hasAccepted = useAtomValue(termsAtom);
  const account = useAtomValue(accountAtom);

  async function oauthSignIn(provider: string) {
    if (!hasAccepted) {
      toast({
        description: "You must accept the Terms and Conditions and Privacy Policy to proceed with sign-in.",
      });
      // toast.error("You must accept the Terms and Conditions and Privacy Policy to proceed with sign-in.");

      return;
    }

    if (account) {
      toast({
        description: "You are already signed in. Please sign out before signing in again.",
      });
      // toast.error("You are already signed in. Please sign out before signing in again.");
      return;
    }

    try {
      setIsLoading(provider);

      await AppwriteService.createOauth2(provider);
    } catch (error) {
      setIsLoading(null);

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
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            key={provider.strategy}
            variant="outline"
            aria-label={`Sign in with ${provider.name}`}
            className="w-full sm:w-auto"
            onClick={() => void oauthSignIn(provider.strategy)}
          >
            {isLoading === provider.strategy ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
