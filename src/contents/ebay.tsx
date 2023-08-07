import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoGetStyle } from "plasmo";

import { useStorage } from "@plasmohq/storage/hook";
import cssText from "data-text:@/styles/globals.css";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Init } from "@/components/_init/init-auth";
import EbayProducts from "@/components/extension/ebay-products";
import PromptCard from "@/components/extension/prompt-card";
import { Icons } from "@/components/ui/icons";
import { Toaster } from "@/components/ui/toaster";
import { ebayProductsAtom } from "@/lib/atoms/extension";
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

// @ts-expect-error plasmo expects defined
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return document.querySelector("div.srp-controls");
};

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline-ebay";

export default function EbayContent() {
  const products = useAtomValue(ebayProductsAtom);

  const [isPromptShown, setIsPromptShown] = useStorage<boolean>("promptStatus", true);
  const [userAgreed] = useStorage<boolean>("userAgreed");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <ReactQueryProvider>
        <Init />
        <EbayProducts />
        {userAgreed && !isLoading && isPromptShown === false && (
          <button
            className="fixed bottom-[14px] right-[14px] rounded-full bg-gradient-to-r from-rose-500/70 to-cyan-500/70 p-[2px]"
            onClick={() => void setIsPromptShown(true)}
          >
            <Icons.logo className="h-[32px] w-[32px] rounded-full bg-popover p-[2px]" aria-label="recommen.do logo" />
          </button>
        )}

        {userAgreed && !isLoading && isPromptShown === true && (
          <PromptCard products={products} onClose={() => void setIsPromptShown(false)} />
        )}
      </ReactQueryProvider>
      <Toaster />
    </div>
  );
}
