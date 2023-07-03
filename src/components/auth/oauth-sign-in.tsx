"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { termsAtom } from "@/lib/atoms/legal";
import { AppwriteService } from "@/lib/clients/client-appwrite";

const oauthProviders = [
  { name: "Google", strategy: "google", icon: "google" },
  { name: "Github", strategy: "github", icon: "github" },
  { name: "Twitter", strategy: "twitter", icon: "twitter" },
] satisfies {
  name: string;
  strategy: string;
  icon: keyof typeof Icons;
}[];

export function OAuthSignIn() {
  const hasAccepted = useAtomValue(termsAtom);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  async function oauthSignIn(provider: string) {
    if (!hasAccepted) {
      // toast({
      //   title: "Error",
      //   description: "Please accept the Terms and conditions and Privacy Policy to proceed with sign-in.",
      //   variant: "destructive",
      // });
      return;
    }

    try {
      setIsLoading(provider);
      await AppwriteService.createOauth2(provider);

      console.log("oauth-sign-in.success");
    } catch (error) {
      setIsLoading(null);

      console.log("oauth-sign-in.error:", JSON.stringify(error));
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
