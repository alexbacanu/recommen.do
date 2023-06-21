import type { Profile } from "~/lib/types";
import type { Models } from "appwrite/types/models";

import { atom } from "jotai";

export const accountAtom = atom<null | Models.User<Models.Preferences>>(null);
export const profileAtom = atom<null | Profile>(null);

export const isLoadingAtom = atom<boolean>(true);

export const jwtAtom = atom<null | Models.Jwt>(null);
