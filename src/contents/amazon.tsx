import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import cssText from "data-text:@/styles/globals.css";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Init } from "@/components/_init/init-auth";
import AmazonProducts from "@/components/extension/amazon-products";
import PromptCard from "@/components/extension/prompt-card";
import { Icons } from "@/components/ui/icons";
import { Toaster } from "@/components/ui/toaster";
import { amazonProductsAtom } from "@/lib/atoms/extension";
import ReactQueryProvider from "@/lib/providers/react-query";

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.amazon.ae/*s?k=*",
    "https://www.amazon.ca/*s?k=*",
    "https://www.amazon.cn/*s?k=*",
    "https://www.amazon.co.jp/*s?k=*",
    "https://www.amazon.co.uk/*s?k=*",
    "https://www.amazon.com.au/*s?k=*",
    "https://www.amazon.com.be/*s?k=*",
    "https://www.amazon.com.br/*s?k=*",
    "https://www.amazon.com.mx/*s?k=*",
    "https://www.amazon.com.tr/*s?k=*",
    "https://www.amazon.com/*s?k=*",
    "https://www.amazon.de/*s?k=*",
    "https://www.amazon.eg/*s?k=*",
    "https://www.amazon.es/*s?k=*",
    "https://www.amazon.fr/*s?k=*",
    "https://www.amazon.in/*s?k=*",
    "https://www.amazon.it/*s?k=*",
    "https://www.amazon.nl/*s?k=*",
    "https://www.amazon.pl/*s?k=*",
    "https://www.amazon.sa/*s?k=*",
    "https://www.amazon.se/*s?k=*",
    "https://www.amazon.sg/*s?k=*",
  ],
};

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

// @ts-expect-error plasmo expects defined
export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const firstInlineSelector = document.querySelector("div.s-search-results > link");

  // main inline target
  if (firstInlineSelector) {
    return firstInlineSelector;
  }

  // fallback
  return document.querySelector("div.s-search-results > div[data-asin]");
};

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-amazon";

export default function AmazonContent() {
  const products = useAtomValue(amazonProductsAtom);

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
        <AmazonProducts />
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
