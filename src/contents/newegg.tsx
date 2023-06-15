import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";

import cssText from "data-text:~/styles/globals.css";

import PromptCard from "~/components/extension/prompt-card";
import ReactQueryContext from "~/lib/providers/react-query";

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

export default function NeweggContent() {
  const products = neweggProductData();

  return (
    <ReactQueryContext>
      <PromptCard products={products} size={"xl"} />
    </ReactQueryContext>
  );
}
