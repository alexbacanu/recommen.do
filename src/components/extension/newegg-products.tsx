import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { neweggProductsAtom } from "@/lib/atoms/extension";

export default function NeweggProducts() {
  const setProducts = useSetAtom(neweggProductsAtom);

  const { data } = useQuery({
    queryKey: ["retrieveNeweggProducts"],
    queryFn: () => {
      const productElements = document.querySelectorAll("div.item-cell");
      const products = [];

      for (const element of productElements) {
        const identifier = element.querySelector("div.item-container")?.getAttribute("id");
        const image = element.querySelector("a.item-img img")?.getAttribute("src");
        const link = element.querySelector("a.item-title")?.getAttribute("href");
        const name = element.querySelector("a.item-title")?.textContent?.trim();
        const price = element.querySelector("li.price-current")?.textContent?.trim() ?? "unknown";
        const reviews = element.querySelector("span.item-rating-num")?.textContent?.trim() ?? "0";
        const stars = element.querySelector("i.rating")?.getAttribute("aria-label")?.trim() ?? "0";
        const source = "newegg";

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

  return <div>Hello</div>;
}
