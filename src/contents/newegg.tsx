import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import cssText from "data-text:@/styles/globals.css";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Init } from "@/components/_init/init-auth";
import NeweggProducts from "@/components/extension/newegg-products";
import PromptCard from "@/components/extension/prompt-card";
import { Icons } from "@/components/ui/icons";
import { Toaster } from "@/components/ui/toaster";
import { neweggProductsAtom } from "@/lib/atoms/extension";
import ReactQueryProvider from "@/lib/providers/react-query";

export const config: PlasmoCSConfig = {
  matches: ["https://www.newegg.com/p*", "https://www.newegg.ca/p*", "https://www.newegg.com/global/*/p*"],
};

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

// @ts-expect-error plasmo expects defined
export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  console.log("hello");
  return document.querySelector("div.list-tools-bar");
};

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-newegg";

export default function NeweggContent() {
  const products = useAtomValue(neweggProductsAtom);

  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <ReactQueryProvider>
        <Init />
        <NeweggProducts />
        {!isLoading && isPromptShown === false && (
          <button
            className="fixed bottom-[14px] right-[14px] rounded-full bg-gradient-to-r from-rose-500/70 to-cyan-500/70 p-[2px]"
            onClick={() => void setIsPromptShown(true)}
          >
            <Icons.logo className="h-[32px] w-[32px] rounded-full bg-popover p-[2px]" aria-label="recommen.do logo" />
          </button>
        )}

        {!isLoading && isPromptShown === true && (
          <PromptCard products={products} onClose={() => void setIsPromptShown(false)} />
        )}
      </ReactQueryProvider>
      <Toaster />
    </div>
  );
}
