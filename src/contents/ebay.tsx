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
  const divElement = document.querySelector("div.srp-controls");

  if (!divElement) {
    throw new Error("div with classname 'srp-controls' not found");
  }

  return divElement;
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

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-ebay";

export default function EbayContent() {
  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const products = ebayProductData();

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
