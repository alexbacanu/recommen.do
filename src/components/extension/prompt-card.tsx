import type { ScrapedProduct } from "@/lib/types/types";

import { useStorage } from "@plasmohq/storage/hook";
import BrowserDetector from "browser-dtector";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PromptForm } from "@/components/extension/prompt-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { profileAtom } from "@/lib/atoms/auth";
import { appwriteUrl } from "@/lib/envClient";

interface PromptCardProps {
  products: ScrapedProduct[] | undefined;
  onClose: () => void;
}

export default function PromptCard({ products, onClose }: PromptCardProps) {
  const profile = useAtomValue(profileAtom);
  const [userApiKey] = useStorage<string>("userApiKey");

  const [browser, setBrowser] = useState<BrowserDetector>();

  useEffect(() => {
    const browser = new BrowserDetector(window.navigator.userAgent);
    setBrowser(browser);
  }, []);

  const parsedUA = browser?.parseUserAgent();
  const browserName = parsedUA?.name;

  return (
    <div className="grid w-full p-[16px]">
      <Card className="relative rounded-[12px]">
        <div className="absolute inset-[-0.125px] -z-10 rounded-[12px] bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>

        <CardHeader className="gap-y-[6px] rounded-[12px] p-[16px] lg:p-[16px]">
          <CardTitle className="flex items-center gap-[16px] text-[24px]">
            <Link href={appwriteUrl} className="flex items-center gap-[16px] pl-[8px]">
              <Icons.logo className="mt-[2px] h-[28px] w-[28px]" aria-label="recommen.do logo" />
              <span>recommen.do</span>
            </Link>

            {!!userApiKey && !!profile && (
              <Badge variant="outline" size="fixed">
                API Key detected
              </Badge>
            )}
            {!userApiKey && profile && (
              <Badge variant="outline" size="fixed">
                {profile.credits === 0 && (
                  <Icons.alert className="mr-[8px] h-[16px] w-[16px] text-orange-500" aria-hidden="true" />
                )}
                {profile.credits} recommendations available
              </Badge>
            )}
            {browserName === "Brave" && !profile && (
              <Badge variant="outline" className="border-orange-500 text-orange-500" size="fixed">
                <Icons.alert className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
                For the extension to work, please disable Brave Shields
              </Badge>
            )}
          </CardTitle>

          <MinimizeButton onClose={onClose} />
        </CardHeader>

        <CardContent className="grid gap-[16px] p-[16px] pt-0 lg:p-[16px] lg:pt-0">
          <PromptForm products={products} />
        </CardContent>
      </Card>
    </div>
  );
}

function MinimizeButton({ onClose }: { onClose: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-0 top-0 z-10">
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={onClose}
              className="m-[8px] text-muted-foreground/70"
            >
              <Icons.minimize className="h-[16px] w-[16px]" aria-hidden="true" />
              <span className="sr-only">Minimize prompt card</span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="rounded-[10px] px-[12px] py-[6px] text-[12px]">
          <p>Minimize</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
