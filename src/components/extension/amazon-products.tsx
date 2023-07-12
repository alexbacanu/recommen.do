import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { amazonProductsAtom } from "@/lib/atoms/extension";

export default function AmazonProducts() {
  const setProducts = useSetAtom(amazonProductsAtom);

  const { data } = useQuery({
    queryKey: ["retrieveAmazonProducts"],
    queryFn: () => {
      const currentOrigin = window?.location.origin;

      const productElements = document.querySelectorAll("div.s-result-item");
      const products = [];

      for (const element of productElements) {
        const identifier = element.getAttribute("data-asin");
        const image = element.querySelector(".s-image")?.getAttribute("src");
        const link = element.querySelector(".a-link-normal.s-no-outline")?.getAttribute("href");
        const name = element.querySelector(".a-color-base.a-text-normal")?.textContent?.trim();
        const price = element.querySelector("span.a-price > span.a-offscreen")?.textContent?.trim() ?? "unknown";
        const reviews = element.querySelector(".a-size-base.s-underline-text")?.textContent?.trim() ?? "0";
        const stars = element.querySelector(".a-icon-alt")?.textContent?.trim() ?? "0";
        const source = "amazon";

        // Check if all required fields are present and valid
        if (identifier && image && link && name) {
          products.push({
            identifier,
            image,
            link: currentOrigin + link,
            name,
            price,
            reviews,
            stars,
            source,
          });
        }
      }

      return products;
    },

    retry: 0,

    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 500,
  });

  useEffect(() => {
    data && setProducts(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return null;
}
