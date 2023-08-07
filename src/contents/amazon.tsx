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
    "https://www.amazon.ae/*",
    "https://www.amazon.ca/*",
    "https://www.amazon.cn/*",
    "https://www.amazon.co.jp/*",
    "https://www.amazon.co.uk/*",
    "https://www.amazon.com.au/*",
    "https://www.amazon.com.be/*",
    "https://www.amazon.com.br/*",
    "https://www.amazon.com.mx/*",
    "https://www.amazon.com.tr/*",
    "https://www.amazon.com/*",
    "https://www.amazon.de/*",
    "https://www.amazon.eg/*",
    "https://www.amazon.es/*",
    "https://www.amazon.fr/*",
    "https://www.amazon.in/*",
    "https://www.amazon.it/*",
    "https://www.amazon.nl/*",
    "https://www.amazon.pl/*",
    "https://www.amazon.sa/*",
    "https://www.amazon.se/*",
    "https://www.amazon.sg/*",
  ],
};

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

// @ts-expect-error plasmo expects defined
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  const scriptElements = document.querySelector("div.s-search-results > link");

  // await 500 ms, amazon page changes alot in the first seconds
  await new Promise((resolve) => setTimeout(resolve, 500));

  // main inline target
  if (scriptElements) {
    return scriptElements;
  }

  // fallback
  return document.querySelector("div.s-search-results > div[data-cel-widget='search_result_0']");
};

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-amazon";

export default function AmazonContent() {
  const products = useAtomValue(amazonProductsAtom);

  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", true);
  const [userAgreed] = useStorage<boolean>("userAgreed");
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
        {userAgreed && !isLoading && isPromptShown === false && (
          <button
            className="fixed bottom-[14px] right-[14px] rounded-full bg-gradient-to-r from-rose-500/70 to-cyan-500/70 p-[2px]"
            onClick={() => void setIsPromptShown(true)}
          >
            <Icons.logo className="h-[32px] w-[32px] rounded-full bg-popover p-[2px]" aria-label="recommen.do logo" />
          </button>
        )}

        {userAgreed && !isLoading && isPromptShown === true && (
          <PromptCard products={products} onClose={() => void setIsPromptShown(false)} />
        )}
      </ReactQueryProvider>
      <Toaster />
    </div>
  );
}
