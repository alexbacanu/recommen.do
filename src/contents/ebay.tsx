import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";

import cssText from "data-text:~/styles/globals.css";

import PromptCard from "~/components/extension/prompt-card";
import ReactQueryContext from "~/lib/providers/react-query";

export const config: PlasmoCSConfig = {
  matches: [
    "https://ar.ebay.com/sch/*",
    "https://bo.ebay.com/sch/*",
    "https://br.ebay.com/sch/*",
    "https://by.ebay.com/sch/*",
    "https://cl.ebay.com/sch/*",
    "https://co.ebay.com/sch/*",
    "https://cr.ebay.com/sch/*",
    "https://do.ebay.com/sch/*",
    "https://ec.ebay.com/sch/*",
    "https://gt.ebay.com/sch/*",
    "https://hn.ebay.com/sch/*",
    "https://il.ebay.com/sch/*",
    "https://kz.ebay.com/sch/*",
    "https://mx.ebay.com/sch/*",
    "https://ni.ebay.com/sch/*",
    "https://pa.ebay.com/sch/*",
    "https://pe.ebay.com/sch/*",
    "https://pr.ebay.com/sch/*",
    "https://pt.ebay.com/sch/*",
    "https://py.ebay.com/sch/*",
    "https://ru.ebay.com/sch/*",
    "https://sv.ebay.com/sch/*",
    "https://uy.ebay.com/sch/*",
    "https://ve.ebay.com/sch/*",
    "https://www.ebay.at/sch/*",
    "https://www.ebay.be/sch/*",
    "https://www.ebay.ca/sch/*",
    "https://www.ebay.ch/sch/*",
    "https://www.ebay.cn/sch/*",
    "https://www.ebay.co.jp/sch/*",
    "https://www.ebay.co.kr/sch/*",
    "https://www.ebay.co.uk/sch/*",
    "https://www.ebay.com.au/sch/*",
    "https://www.ebay.com.hk/sch/*",
    "https://www.ebay.com.my/sch/*",
    "https://www.ebay.com.sg/sch/*",
    "https://www.ebay.com.tw/sch/*",
    "https://www.ebay.com/sch/*",
    "https://www.ebay.de/sch/*",
    "https://www.ebay.es/sch/*",
    "https://www.ebay.fr/sch/*",
    "https://www.ebay.ie/sch/*",
    "https://www.ebay.in/sch/*",
    "https://www.ebay.it/sch/*",
    "https://www.ebay.nl/sch/*",
    "https://www.ebay.ph/sch/*",
    "https://www.ebay.pl/sch/*",
  ],
};

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const searchResultsContainer = document.querySelector("div.srp-controls");
  if (!searchResultsContainer) {
    throw new Error("No search results container found");
  }
  return searchResultsContainer;
};

const ebayProductData = () => {
  const productNodes = document.querySelectorAll("li.s-item");
  const products = [];

  for (const el of productNodes) {
    const identifier = el.id;

    if (!identifier) {
      continue; // skip this element
    }

    const imageEl = el.querySelector("div.image-treatment img");
    const linkEl = el.querySelector("a.s-item__link");
    const nameEl = el.querySelector("div.s-item__title span");
    const priceEl = el.querySelector("span.s-item__price");
    // const reviewsEl = el.querySelector("span.item-rating-num");
    // const starsEl = el.querySelector("i.rating");

    const product = {
      identifier: identifier || "none",
      image: imageEl?.getAttribute("src") || "none",
      link: linkEl?.getAttribute("href") || "none",

      name: nameEl?.textContent?.trim() || "unknown",
      price: priceEl?.textContent?.trim() || "unknown",

      reviews: "0",
      stars: "0",
    };

    products.push(product);
  }

  return products;
};

export default function EbayContent() {
  const products = ebayProductData();

  return (
    <ReactQueryContext>
      <PromptCard products={products} size="md" />
    </ReactQueryContext>
  );
}
