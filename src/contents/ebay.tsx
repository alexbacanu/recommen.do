import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import logo from "data-base64:~assets/icon.png";
import cssText from "data-text:@/styles/globals.css";

import { Init } from "@/components/_init/init-auth";
import PromptCard from "@/components/extension/prompt-card";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/providers/react-query";

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
  const productElements = document.querySelectorAll("ul.srp-results > li.s-item");
  const products = [];

  for (const element of productElements) {
    const identifier = element.id;
    const image = element.querySelector("div.image-treatment img")?.getAttribute("src");
    const link = element.querySelector("a.s-item__link")?.getAttribute("href");
    const name = element.querySelector("div.s-item__title span")?.textContent?.trim();
    const price = element.querySelector("span.s-item__price")?.textContent?.trim() || "unknown";
    const reviews = "0";
    const stars = "0";
    const source = "ebay";

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

export const getShadowHostId = () => "plasmo-inline-ebay";

export default function EbayContent() {
  const [isPromptHidden, setIsPromptHidden] = useStorage<boolean>("promptStatus");
  const products = ebayProductData();
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
