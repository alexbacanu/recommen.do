"use client";

import type { OpenAISettings } from "~/lib/types";
import type { Models } from "appwrite";

import { useStorage } from "@plasmohq/storage/hook";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface AlertsProps {
  profile: Models.Document | null;
}

export function Alerts({ profile }: AlertsProps) {
  const { signOut, createJWT, verifyAccount } = useAppwrite();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setMessage("Your account is not activated!");
      setButtonMessage("Send verification email");
    }

    if (userId || secret) {
      setMessage("Click to verify your email!");
      setButtonMessage("Verify email");
    }
  }, [userId, secret]);

  let jwt: string;
  const handleVerification = async () => {
    if (!userId || !secret) {
      verifyAccount();
      setMessage("Email verification sent!");
      setButtonMessage("Check your email");
      setButtonDisabled(true);
      return;
    }
    setLoading(true);

    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    const verifyEmail = await fetch(`/api/appwrite?userId=${userId}&secret=${secret}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (verifyEmail.status === 200) {
      setMessage("Email verified, please login again!");
      setButtonDisabled(true);
      signOut();
    }

    console.log(verifyEmail);
    setLoading(false);
    // window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  const [openaiSettings, setOpenaiSettings, { remove }] = useStorage<OpenAISettings>("openaiSettings", {
    apiKey: undefined,
    orgName: undefined,
  });

  const apiKeyDetected = !!openaiSettings?.apiKey;

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
      {!profile && (
        <Alert className="flex items-center justify-between gap-x-4" variant="warning">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
            </div>
            <AlertDescription>{message}</AlertDescription>
          </div>
          <Button onClick={() => handleVerification()} disabled={buttonDisabled || loading}>
            {buttonMessage}
          </Button>
        </Alert>
      )}
      {profile && profile.credits < 10 && (
        <Alert variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
          </div>
          <AlertDescription>You are running low on recommendations!</AlertDescription>
        </Alert>
      )}
    </>
  );
}
