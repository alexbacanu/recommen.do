"use client";

import { useAtomValue } from "jotai";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { accountAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

export function Alerts() {
  const account = useAtomValue(accountAtom);
  const { signOut } = useAppwrite();

  return (
    <>
      <Alert variant="default">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
        </div>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
      <Alert variant="warning">
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
      </Alert>
    </>
  );
}
