"use client";

import { useStorage } from "@plasmohq/storage/hook";

import { FormAPIKey } from "@/components/profile/form-apikey";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function CardAPIKey() {
  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", (v) => (v === undefined ? true : v));
  const extensionDetected = !!window && !window?.next;

  if (extensionDetected)
    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl">
            <span>Settings</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <Label className="flex flex-col gap-y-2">
            <span>Display</span>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-extension" className="font-normal leading-snug text-muted-foreground">
                Show extension inside pages
              </Label>
              <Switch
                id="show-extension"
                checked={isPromptShown}
                onClick={() => setIsPromptShown((prevState) => !prevState)}
              />
            </div>
          </Label>

          <FormAPIKey />
        </CardContent>

        <Separator orientation="horizontal" className="w-full" />
      </>
    );

  return <LoadingPage />;
}
