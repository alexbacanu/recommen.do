import type { Models } from "appwrite/types/models";

import { atom } from "jotai";

export const accountAtom = atom<null | Models.User<Models.Preferences>>(null);
