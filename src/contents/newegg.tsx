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
  matches: ["https://www.newegg.com/p*", "https://www.newegg.ca/p*", "https://www.newegg.com/global/*/p*"],
};

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const divElement = document.querySelector("div.list-tools-bar");

  if (!divElement) {
    throw new Error("div with classname 'list-tools-bar' not found");
  }

  return divElement;
};

const neweggProductData = () => {
  const productElements = document.querySelectorAll("div.item-cell");
  const products = [];

  for (const element of productElements) {
    const identifier = element.querySelector("div.item-container")?.getAttribute("id");
    const image = element.querySelector("a.item-img img")?.getAttribute("src");
    const link = element.querySelector("a.item-title")?.getAttribute("href");
    const name = element.querySelector("a.item-title")?.textContent?.trim();
    const price = element.querySelector("li.price-current")?.textContent?.trim() ?? "unknown";
    const reviews = element.querySelector("span.item-rating-num")?.textContent?.trim() ?? "0";
    const stars = element.querySelector("i.rating")?.getAttribute("aria-label")?.trim() ?? "0";
    const source = "newegg";

    // Check if all required fields are present and valid
    if (identifier && image && link && name) {
      products.push({
        identifier,
        image,
        link,
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

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-newegg";

export default function NeweggContent() {
  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const products = neweggProductData();

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
