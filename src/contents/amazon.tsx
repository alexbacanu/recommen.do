import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import cssText from "data-text:@/styles/globals.css";
import { useEffect, useState } from "react";

import { Init } from "@/components/_init/init-auth";
import PromptCard from "@/components/extension/prompt-card";
import { Icons } from "@/components/ui/icons";
import { Toaster } from "@/components/ui/toaster";
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

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const divElement = document.querySelector("div.s-search-results");

  if (!divElement) {
    throw new Error("div with classname 's-search-results' not found");
  }

  const scriptTags = divElement.querySelectorAll("div");

  if (scriptTags[3]) {
    console.log("scriptTags[3] found");
    return scriptTags[3];
  }
  if (scriptTags[2]) {
    console.log("scriptTags[2] found");
    return scriptTags[2];
  }
  if (scriptTags[1]) {
    console.log("scriptTags[1] found");
    return scriptTags[1];
  }

  if (!scriptTags[0]) {
    throw new Error("scriptTags[0] not found");
  }

  return scriptTags[0];
};

const amazonProductData = () => {
  const currentOrigin = window?.location.origin;

  const productElements = document.querySelectorAll("div.s-result-item");
  const products = [];

  for (const element of productElements) {
    const identifier = element.getAttribute("data-asin");
    const image = element.querySelector(".s-image")?.getAttribute("src");
    const link = element.querySelector(".a-link-normal.s-no-outline")?.getAttribute("href");
    const name = element.querySelector(".a-color-base.a-text-normal")?.textContent?.trim();
    const price = element.querySelector("span.a-price > span.a-offscreen")?.textContent?.trim() ?? "unknown";
    const reviews = element.querySelector(".a-size-base.s-underline-text")?.textContent?.trim() ?? "0";
    const stars = element.querySelector(".a-icon-alt")?.textContent?.trim() ?? "0";
    const source = "amazon";

    // Check if all required fields are present and valid
    if (identifier && image && link && name) {
      products.push({
        identifier,
        image,
        link: currentOrigin + link,
        name,
        price,
        reviews,
        stars,
        source,
      });
    }
  }

  return products;
};

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-amazon";

export default function AmazonContent() {
  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const products = amazonProductData();

  return (
    <div className="w-full">
      <ReactQueryProvider>
        <Init />
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
