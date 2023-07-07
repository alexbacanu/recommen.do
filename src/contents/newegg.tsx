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
  const productElements = document.querySelectorAll("div.item-cell");
  const products = [];

  for (const element of productElements) {
    const identifier = element.querySelector("div.item-container")?.getAttribute("id");
    const image = element.querySelector("a.item-img img")?.getAttribute("src");
    const link = element.querySelector("a.item-title")?.getAttribute("href");
    const name = element.querySelector("a.item-title")?.textContent?.trim();
    const price = element.querySelector("li.price-current")?.textContent?.trim() || "unknown";
    const reviews = element.querySelector("span.item-rating-num")?.textContent?.trim() || "0";
    const stars = element.querySelector("i.rating")?.getAttribute("aria-label")?.trim() || "0";

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
      });
    }
  }

  return products;
};

export const getShadowHostId = () => "plasmo-inline-newegg";

export default function NeweggContent() {
  const [isPromptHidden, setIsPromptHidden] = useStorage<boolean>("promptStatus");
  const products = neweggProductData();
  console.log(products);

  return (
    <>
      <ReactQueryProvider>
        <Init />
        {isPromptHidden === true && (
          <button
            className="fixed bottom-[14px] right-[14px] rounded-full bg-gradient-to-r from-rose-500/70 to-cyan-500/70 p-[2px]"
            onClick={() => setIsPromptHidden((prevState) => !prevState)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} height={32} width={32} alt="recommen.do logo" className="rounded-full" />
          </button>
        )}

        {isPromptHidden === false && <PromptCard products={products} onClose={() => setIsPromptHidden(true)} />}
      </ReactQueryProvider>
      <Toaster />
    </>
  );
}
