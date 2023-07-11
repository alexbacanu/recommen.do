import type { ScrapedProduct } from "@/lib/types/types";

import { atom } from "jotai";

const amazonProductsAtom = atom<undefined | ScrapedProduct[]>(undefined);
const ebayProductsAtom = atom<undefined | ScrapedProduct[]>(undefined);
const neweggProductsAtom = atom<undefined | ScrapedProduct[]>(undefined);

export { amazonProductsAtom, ebayProductsAtom, neweggProductsAtom };
