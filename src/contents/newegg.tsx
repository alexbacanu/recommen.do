import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import logo from "data-base64:~assets/icon.png";
import cssText from "data-text:@/styles/globals.css";

import { Init } from "@/components/_init/init-auth";
import PromptCard from "@/components/extension/prompt-card";
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
  const searchResultsContainer = document.querySelector("div.list-tools-bar");
  if (!searchResultsContainer) {
    throw new Error("No search results container found");
  }
  return searchResultsContainer;
};

const neweggProductData = () => {
  const productNodes = document.querySelectorAll("div.item-cell");
  const products = [];

  for (const el of productNodes) {
    const identifier = el.querySelector("div.item-container");

    if (!identifier) {
      continue; // skip this element
    }

    const imageEl = el.querySelector("a.item-img img");
    const linkEl = el.querySelector("a.item-title");
    const nameEl = el.querySelector("a.item-title");
    const priceEl = el.querySelector("li.price-current");
    const reviewsEl = el.querySelector("span.item-rating-num");
    const starsEl = el.querySelector("i.rating");

    if (!!identifier) {
      const product = {
        identifier: identifier?.getAttribute("id") || "none",
        image: imageEl?.getAttribute("src") || "none",
        link: linkEl?.getAttribute("href") || "none",
        name: nameEl?.textContent?.trim() || "unknown",
        price: priceEl?.textContent?.trim() || "unknown",
        reviews: reviewsEl?.textContent?.trim() || "0",
        stars: starsEl?.getAttribute("aria-label") || "0",
      };

      products.push(product);
    }
  }

  return products;
};

export const getShadowHostId = () => "plasmo-inline-newegg";

export default function NeweggContent() {
  const [isPromptHidden, setIsPromptHidden] = useStorage<boolean>("promptStatus");
  const products = neweggProductData();

  return (
    <>
      <Init />
      <ReactQueryProvider>
        {isPromptHidden ? (
          <button
            className="fixed bottom-[14px] right-[14px] rounded-full bg-gradient-to-r from-rose-500/70 to-cyan-500/70 p-0.5"
            onClick={() => setIsPromptHidden((prevState) => !prevState)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} height={32} width={32} alt="recommen.do logo" className="rounded-full" />
          </button>
        ) : (
          <PromptCard products={products} onClose={() => setIsPromptHidden(true)} />
        )}
      </ReactQueryProvider>
      <Toaster />
    </>
  );
}
