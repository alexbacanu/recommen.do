import type { AppwriteAccount, AppwriteProfile } from "@/lib/types/types";

import { atom } from "jotai";

const accountAtom = atom<null | false | AppwriteAccount>(null);
const profileAtom = atom<null | false | AppwriteProfile>(null);

export { accountAtom, profileAtom };
