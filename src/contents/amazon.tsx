import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import logo from "data-base64:~assets/icon.png";
import cssText from "data-text:@/styles/globals.css";
import { useEffect, useState } from "react";

import { Init } from "@/components/_init/init-auth";
import PromptCard from "@/components/extension/prompt-card";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/providers/react-query";

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.amazon.ae/s*",
    "https://www.amazon.ca/s*",
    "https://www.amazon.cn/s*",
    "https://www.amazon.co.jp/s*",
    "https://www.amazon.co.uk/s*",
    "https://www.amazon.com.au/s*",
    "https://www.amazon.com.be/s*",
    "https://www.amazon.com.br/s*",
    "https://www.amazon.com.mx/s*",
    "https://www.amazon.com.tr/s*",
    "https://www.amazon.com/s*",
    "https://www.amazon.de/s*",
    "https://www.amazon.eg/s*",
    "https://www.amazon.es/s*",
    "https://www.amazon.fr/s*",
    "https://www.amazon.in/s*",
    "https://www.amazon.it/s*",
    "https://www.amazon.nl/s*",
    "https://www.amazon.pl/s*",
    "https://www.amazon.sa/s*",
    "https://www.amazon.se/s*",
    "https://www.amazon.sg/s*",
  ],
};

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const searchResultsContainer = document.querySelector("div.s-result-item[data-index]");
  if (!searchResultsContainer) {
    throw new Error("No search results container found");
  }
  return searchResultsContainer;
};

const amazonProductData = () => {
  const currentOrigin = window?.location.origin;

  const productElements = document.querySelectorAll("div.s-result-item");
  const products = [];

  for (const element of productElements) {
    const identifier = element.getAttribute("data-asin");
    const image = element.querySelector(".s-image")?.getAttribute("src");
    const link = `${currentOrigin}${element.querySelector(".a-link-normal.s-no-outline")?.getAttribute("href")}`;
    const name = element.querySelector(".a-color-base.a-text-normal")?.textContent?.trim();
    const price = element.querySelector("span.a-price > span.a-offscreen")?.textContent?.trim() || "unknown";
    const reviews = element.querySelector(".a-size-base.s-underline-text")?.textContent?.trim() || "0";
    const stars = element.querySelector(".a-icon-alt")?.textContent?.trim() || "0";
    const source = "amazon";

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

export const getShadowHostId = () => "plasmo-inline-amazon";

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
  console.log(products);

  return (
    <div className="w-full">
      <ReactQueryProvider>
        <Init />
        {!isLoading && isPromptShown === false && (
          <button
            className="fixed bottom-[14px] right-[14px] rounded-full bg-gradient-to-r from-rose-500/70 to-cyan-500/70 p-[2px]"
            onClick={() => setIsPromptShown(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} height={32} width={32} alt="recommen.do logo" className="rounded-full" />
          </button>
        )}

        {!isLoading && isPromptShown === true && (
          <PromptCard products={products} onClose={() => setIsPromptShown(false)} />
        )}
      </ReactQueryProvider>
      <Toaster />
    </div>
  );
}
