import { cache } from "react";

import { account } from "~/lib/clients/appwrite";

export const useAppwrite = () => {
  const getAccount = cache(async () => {
    try {
      const response = await account.get();
      console.log("getAccountSuccess:", response);
      return response;
    } catch (error) {
      console.log("getAccountError:", error);
      return null;
    }
  });

  return { getAccount };
};
