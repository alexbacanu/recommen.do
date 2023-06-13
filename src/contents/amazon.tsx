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
  const productNodes = document.querySelectorAll("div.s-result-item");
  const products = [];

  for (const el of productNodes) {
    if (el.classList.contains("AdHolder") || !el.classList.contains("s-asin")) {
      continue; // skip this element
    }

    const identifier = el.getAttribute("data-asin");

    const imageEl = el.querySelector(".s-image");
    const linkEl = el.querySelector(".a-link-normal.s-underline-link-text.s-link-style");
    const nameEl = el.querySelector(".a-color-base.a-text-normal");
    const priceEl = el.querySelector(".a-price .a-offscreen");
    const reviewsEl = el.querySelector(".a-size-base.s-underline-text");
    const starsEl = el.querySelector(".a-icon-alt");

    if (identifier && imageEl && linkEl && nameEl && reviewsEl && starsEl) {
      const product = {
        identifier,
        image: imageEl.getAttribute("src") || "",
        link: linkEl.getAttribute("href") || "",
        name: nameEl.textContent?.trim(),
        price: priceEl?.textContent?.trim() || "unknown",
        reviews: reviewsEl.textContent?.trim(),
        stars: starsEl.textContent?.trim(),
      };

      products.push(product);
    }
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
