"use client";

import type { Models } from "appwrite";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface AlertsProps {
  profile: Models.Document;
}

export function Alerts({ profile }: AlertsProps) {
  return (
    <>
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
