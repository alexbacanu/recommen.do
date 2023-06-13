"use client";

import { useAtomValue } from "jotai";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { profileAtom } from "~/lib/atoms/appwrite";

export function Alerts() {
  const profile = useAtomValue(profileAtom);

  return (
    <section id="alerts" className="flex flex-col gap-2">
      {profile && profile.credits < 10 && (
        <Alert variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
          </div>
          <AlertDescription>You are running low on recommendations!</AlertDescription>
        </Alert>
      )}
      {/* <Alert variant="warning">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
        </div>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
        </div>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert> */}
    </section>
  );
}
