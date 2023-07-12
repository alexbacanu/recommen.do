import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { ebayProductsAtom } from "@/lib/atoms/extension";

export default function EbayProducts() {
  const setProducts = useSetAtom(ebayProductsAtom);

  const { data } = useQuery({
    queryKey: ["retrieveEbayProducts"],
    queryFn: () => {
      const productElements = document.querySelectorAll("ul.srp-results > li.s-item");
      const products = [];

      for (const element of productElements) {
        const identifier = element.id;
        const image = element.querySelector("div.image-treatment img")?.getAttribute("src");
        const link = element.querySelector("a.s-item__link")?.getAttribute("href");
        const name = element.querySelector("div.s-item__title span")?.textContent?.trim();
        const price = element.querySelector("span.s-item__price")?.textContent?.trim() ?? "unknown";
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
