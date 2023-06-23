"use client";

import type { OpenAISettings } from "@/lib/schema";
import type { Models } from "appwrite";

import { useStorage } from "@plasmohq/storage/hook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { appwriteUrl } from "@/lib/envClient";
import { AppwriteService } from "@/lib/helpers/appwrite-service";
import { useAccount } from "@/lib/hooks/use-account";
import { useProfile } from "@/lib/hooks/use-profile";

interface CustomWindow extends Window {
  next: unknown;
}
declare const window: CustomWindow;

async function createVerification() {
  const response = await AppwriteService.createVerification();
  return response;
}

async function resolveVerification(userId?: string, secret?: string) {
  if (!userId || !secret) return;

  const jwt = await AppwriteService.createJWT();

  const response = await fetch(`${appwriteUrl}/api/appwrite/verify?userId=${userId}&secret=${secret}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const token: Models.Token = await response.json();
  return token;
}

export function Alerts() {
  const { account } = useAccount();
  const profile = useProfile();

  const [openaiSettings] = useStorage<OpenAISettings>("openaiSettings", {
    apiKey: undefined,
    orgName: undefined,
  });

  const extensionDetected = !window.next;
  const target = extensionDetected ? "_blank" : "_self";

  const apiKeyDetected = !!openaiSettings?.apiKey;
  const needsVerification = account && !account.emailVerification;
  const needsCredits = profile && profile.credits < 10;

  const [isEmailSent, setIsEmailSent] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createVerification"],
    mutationFn: createVerification,
    onSuccess: () => {
      setIsEmailSent(true);
    },
  });

  const searchParams = new URLSearchParams(window.location.search);

  const userId = searchParams.get("userId") || undefined;
  const secret = searchParams.get("secret") || undefined;

  const ableToVerify = userId && secret && !account?.emailVerification;

  const { isSuccess } = useQuery({
    queryKey: ["resolveVerification", userId, secret],
    queryFn: () => resolveVerification(userId, secret),
    enabled: !!ableToVerify,
  });

  useEffect(() => {
    if (isSuccess) {
      window.open(`${appwriteUrl}/profile`, target, "noopener,noreferrer");
    }
  }, [isSuccess, target]);

  if (ableToVerify) {
    return (
      <Alert variant="default">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Just one more step!</AlertTitle>
          </div>
          <AlertDescription>You will be redirected to the login page in a few seconds.</AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <>
      {apiKeyDetected && (
        <Alert variant="default">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>You are in API Key mode!</AlertTitle>
          </div>
          <AlertDescription>Your recommendations will not be counted towards your usage</AlertDescription>
        </Alert>
      )}

      {needsVerification &&
        (isEmailSent ? (
          <Alert variant="default">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Email on the way!</AlertTitle>
              </div>
              <AlertDescription>
                Email verification sent! Please check your inbox or spam folder, the email should arrive in a few
                minutes.
              </AlertDescription>
            </div>
          </Alert>
        ) : (
          <Alert variant="warning" className="flex items-center justify-between gap-x-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Your account is not activated!</AlertTitle>
              </div>
              <AlertDescription>
                You cannot use this service until you have verified your email address.
              </AlertDescription>
            </div>
            <Button onClick={() => mutate()} disabled={isLoading || isEmailSent}>
              Send verification email
            </Button>
          </Alert>
        ))}

      {needsCredits && (
        <Alert variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>You are running low on recommendations!</AlertTitle>
          </div>
          {/* <AlertDescription>Your recommendations will not be counted towards your usage</AlertDescription> */}
        </Alert>
      )}
    </>
  );
}
