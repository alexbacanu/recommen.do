import { useSetAtom } from "jotai";
import { cache } from "react";

import { accountAtom } from "~/lib/atoms/appwrite";
import { account } from "~/lib/clients/appwrite-client";

export const useAppwrite = () => {
  const setAccount = useSetAtom(accountAtom);

  const getAccount = cache(async () => {
    try {
      const response = await account.get();
      console.log("getAccountSuccess:", response);
      setAccount(response);
      return response;
    } catch (error) {
      console.log("getAccountError:", error);
      setAccount(null);
      return null;
    }
  });

  const signOut = cache(async () => {
    try {
      await account.deleteSession("current");
      console.log("signOutSuccess:");
      setAccount(null);
    } catch (error) {
      console.log("signOutError:", error);
    }
  });

  return { getAccount, signOut };
};
