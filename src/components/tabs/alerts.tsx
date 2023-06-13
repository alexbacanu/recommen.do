"use client";

import type { OpenAISettings } from "~/lib/types";
import type { Models } from "appwrite";

import { useStorage } from "@plasmohq/storage/hook";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface AlertsProps {
  profile: Models.Document;
}

export function Alerts({ profile }: AlertsProps) {
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
