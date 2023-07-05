import type { ScrapedProduct } from "@/lib/types/types";

import { useStorage } from "@plasmohq/storage/hook";
import logo from "data-base64:~assets/icon.png";
import { useAtomValue } from "jotai";

import { PromptForm } from "@/components/extension/prompt-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { profileAtom } from "@/lib/atoms/auth";

interface PromptCardProps {
  products: ScrapedProduct[];
  onClose: () => void;
}

export default function PromptCard({ products, onClose }: PromptCardProps) {
  const profile = useAtomValue(profileAtom);
  const [userApiKey] = useStorage<string>("userApiKey");

  return (
    <div className="grid w-full p-4">
      <Card className="relative">
        <div className="absolute inset-[-0.125px] -z-10 rounded-[12px] bg-gradient-to-r from-rose-500/30 to-cyan-500/30 blur"></div>

        <CardHeader className="lg:p-4">
          <CardTitle className="flex items-center gap-4 text-2xl">
            <img src={logo} height={32} width={32} alt="recommen.do logo" className="rounded-full" />
            <span>recommen.do</span>

            {userApiKey && profile && <Badge variant="outline">API Key detected</Badge>}
            {!userApiKey && profile && <Badge variant="outline">{profile.credits} recommendations remaining</Badge>}
          </CardTitle>

          <MinimizeButton onClose={onClose} />
        </CardHeader>

        {/* <Separator orientation="horizontal" className="w-full" /> */}

        <CardContent className="grid gap-4 lg:p-4 lg:pt-0">
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
        <TooltipContent side="top">
          <p>Minimize</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
