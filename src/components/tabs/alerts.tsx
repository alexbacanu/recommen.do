"use client";

import type { OpenAISettings } from "~/lib/types";
import type { Models } from "appwrite";

import { useStorage } from "@plasmohq/storage/hook";
import { useAtom } from "jotai";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import LoadingSpinner from "~/components/ui/loading";
import { isLoadingAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface AlertsProps {
  account: Models.User<Models.Preferences>;
  profile: Models.Document | null;
}

export function Alerts({ account, profile }: AlertsProps) {
  const { signOut, createJWT, verifyAccount } = useAppwrite();
  const [loading, setLoading] = useAtom(isLoadingAtom);

  const initialTitle = "Your account is not activated!";
  const initialMessage = "You cannot use this service until you have verified your email address.";
  const initialButtonMessage = "Send verification email";

  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);
  const [buttonMessage, setButtonMessage] = useState(initialButtonMessage);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const ableToVerify = userId && secret;

  useEffect(() => {
    if (ableToVerify && !loading) {
      setTitle("Just one more step!");
      setMessage("You will be redirected to the login page in a few seconds.");
      setButtonMessage("Click here to complete the verification");
      handleVerification();
    }
  }, []);

  let jwt: string;
  const handleVerification = async () => {
    if (!userId || !secret) {
      verifyAccount();
      setTitle("Email on the way");
      setMessage(
        "Email verification sent! Please check your inbox or spam folder, the email should arrive in a few minutes.",
      );
      setButtonMessage("Check your email");
      setButtonDisabled(true);
      return;
    }
    setLoading(true);

    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    const verifyEmail = await fetch(`/api/appwrite/verify?userId=${userId}&secret=${secret}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (verifyEmail.status === 200) {
      setButtonDisabled(true);
      signOut().then(() => {
        window.location.href = "https://recommendo.authui.site/";
      });
    }

    // setLoading(false);
    // window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  const [openaiSettings, setOpenaiSettings, { remove }] = useStorage<OpenAISettings>("openaiSettings", {
    apiKey: undefined,
    orgName: undefined,
  });

  const apiKeyDetected = !!openaiSettings?.apiKey;

  if (loading) return <LoadingSpinner />;

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

      {account && !account.emailVerification && (
        <Alert
          className="flex items-center justify-between gap-x-4"
          variant={buttonDisabled || ableToVerify ? "default" : "warning"}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{title}</AlertTitle>
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
            <AlertTitle>You are running low on recommendations!</AlertTitle>
          </div>
          {/* <AlertDescription>You are running low on recommendations!</AlertDescription> */}
        </Alert>
      )}

      {/* {!profile && (
        <Alert className="flex items-center justify-between gap-x-4" variant="warning">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Activation needed!</AlertTitle>
            </div>
            <AlertDescription>{message}</AlertDescription>
          </div>
          <Button onClick={() => handleVerification()} disabled={buttonDisabled || loading}>
            {buttonMessage}
          </Button>
        </Alert>
      )} */}

      {/* {profile && profile.credits < 10 && (
        <Alert variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
          </div>
          <AlertDescription>You are running low on recommendations!</AlertDescription>
        </Alert>
      )} */}
    </>
  );
}
