import type { ScrapedProduct } from "@/lib/types/types";

import { useStorage } from "@plasmohq/storage/hook";
import logo from "data-base64:~assets/icon.png";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { browserName } from "react-device-detect";

import { PromptForm } from "@/components/extension/prompt-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { profileAtom } from "@/lib/atoms/auth";
import { appwriteUrl } from "@/lib/envClient";

interface PromptCardProps {
  products: ScrapedProduct[];
  onClose: () => void;
}

export default function PromptCard({ products, onClose }: PromptCardProps) {
  const profile = useAtomValue(profileAtom);
  const [userApiKey] = useStorage<string>("userApiKey");

  return (
    <div className="grid w-full p-[16px]">
      <Card className="relative rounded-[12px]">
        <div className="absolute inset-[-0.125px] -z-10 rounded-[12px] bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>

        <CardHeader className="gap-y-[6px] rounded-[12px] p-[16px] lg:p-[16px]">
          <CardTitle className="flex items-center gap-[16px] text-[24px]">
            <Link href={appwriteUrl} className="flex items-center gap-[16px] pl-[8px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} height={32} width={32} alt="recommen.do logo" className="rounded-full" />
              <span>recommen.do</span>
            </Link>

            {userApiKey && profile && (
              <Badge variant="outline" size="fixed">
                API Key detected
              </Badge>
            )}
            {!userApiKey && profile && (
              <>
                <Badge variant="outline" size="fixed">
                  {profile.credits === 0 && (
                    <Icons.alert className="mr-[8px] h-[16px] w-[16px] text-orange-500" aria-hidden="true" />
                  )}
                  {profile.credits} recommendations remaining
                </Badge>
                {browserName === "Brave" && (
                  <Badge variant="outline" className="border-orange-500 text-orange-500" size="fixed">
                    <Icons.alert className="mr-[8px] h-[16px] w-[16px]" aria-hidden="true" />
                    To make the extension work, please disable Brave Shields
                  </Badge>
                )}
              </>
            )}
          </CardTitle>

          <MinimizeButton onClose={onClose} />
        </CardHeader>

        {/* <Separator orientation="horizontal" className="w-full" /> */}

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
          <Button
            variant="ghost"
            type="button"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0 z-10 m-[8px] text-muted-foreground/70"
          >
            <Icons.minimize className="h-[16px] w-[16px]" aria-hidden="true" />
            <span className="sr-only">Minimize prompt card</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="rounded-[10px] px-[12px] py-[6px] text-[12px]">
          <p>Minimize</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
