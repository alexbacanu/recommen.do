import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";

import cssText from "data-text:~/styles/globals.css";

import PromptCard from "~/components/extension/prompt-card";
import ReactQueryContext from "~/lib/providers/react-query";

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
  const currentUrl = window.location.origin;

  const productNodes = document.querySelectorAll("div.s-result-item");
  const products = [];

  for (const el of productNodes) {
    const identifier = el.getAttribute("data-asin");

    if (!identifier) {
      continue; // skip this element
    }

    const imageEl = el.querySelector(".s-image");
    const linkEl = el.querySelector(".a-link-normal.s-underline-link-text.s-link-style");

    if (linkEl?.getAttribute("href") === "#") {
      continue; // skip this element
    }

    const nameEl = el.querySelector(".a-color-base.a-text-normal");
    const priceEl = el.querySelector(".a-price .a-offscreen");
    const reviewsEl = el.querySelector(".a-size-base.s-underline-text");
    const starsEl = el.querySelector(".a-icon-alt");

    const product = {
      identifier: identifier || "none",
      image: imageEl?.getAttribute("src") || "none",
      link: `${currentUrl}/${linkEl?.getAttribute("href")}` || "none",

      name: nameEl?.textContent?.trim() || "unknown",
      price: priceEl?.textContent?.trim() || "unknown",

      reviews: reviewsEl?.textContent?.trim() || "0",
      stars: starsEl?.textContent?.trim() || "0",
    };

    products.push(product);
  }

  return products;
};

export default function AmazonContent() {
  const products = amazonProductData();
  console.log("products:", products);

  return (
    <ReactQueryContext>
      <PromptCard products={products} />
    </ReactQueryContext>
  );
}
