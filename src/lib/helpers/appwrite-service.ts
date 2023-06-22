import type { Profile } from "~/lib/types";

import { Account, Client, Databases, Query } from "appwrite";

import { appwriteEndpoint, appwriteProject, appwriteUrl } from "~/lib/envClient";

const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);

const account = new Account(client);
const databases = new Databases(client);

let jwt: string;
export const AppwriteService = {
  getAccount: async () => {
    const user = await account.get();
    console.log("getAccount:", user);

    if (user) {
      return user;
    }
    return null;
  },

  getProfile: async () => {
    const { documents } = await databases.listDocuments<Profile>("main", "profile", [Query.limit(1)]);
    console.log("getProfile:", documents[0]);

    if (documents.length > 0) {
      return documents[0];
    }
    return null;
  },

  createJWT: async () => {
    if (!jwt) {
      const jwtObject = await account.createJWT();
      jwt = jwtObject.jwt;
      console.log("createJWT:", jwt);
    }

    return jwt;
  },

  createVerification: async () => {
    const user = await account.createVerification(`${appwriteUrl}/profile`);
    console.log("createVerification:", user);

    if (user) {
      return user;
    }
    return null;
  },

  // setOAuth2: async (provider: string) => {
  //   const user = account.createOAuth2Session(provider, "http://localhost:1947/api/appwrite/auth");
  //   console.log("setOAuth2:", user);

  //   if (user) {
  //     return user;
  //   }
  //   return null;
  // },

  setSession: async (hash: string) => {
    const authCookies: Record<string, string> = {};
    authCookies["a_session_" + appwriteProject] = hash;
    client.headers["X-Fallback-Cookies"] = JSON.stringify(authCookies);
  },

  signOut: async () => {
    await account.deleteSession("current");
  },
};
