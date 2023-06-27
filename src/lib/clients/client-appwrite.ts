import type { AppwriteProfile } from "@/lib/types/types";

import { Account, Avatars, Client, Databases, ID, Query } from "appwrite";

import { appwriteEndpoint, appwriteProject, appwriteUrl } from "@/lib/envClient";

const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

let jwt: string;
export const AppwriteService = {
  getAccount: async () => {
    const response = await account.get();
    console.log("client-appwrite.getAccount:", response);

    return response;
  },

  getAccountInitials: (name: string) => {
    const defaultBackground = name === "r e" ? "6366f1" : undefined;

    const response = avatars.getInitials(name, 128, 128, defaultBackground);
    console.log("client-appwrite.getAccountInitials:", response);

    return response;
  },

  getProfile: async () => {
    const { documents } = await databases.listDocuments<AppwriteProfile>("main", "profile", [Query.limit(1)]);
    console.log("client-appwrite.getProfile:", documents[0]);

    return documents[0];
  },

  createOauth2: async (provider: string) => {
    const redirectUrl = `${appwriteUrl}/profile`; //todo: maybe do something here

    const response = account.createOAuth2Session(provider, redirectUrl, redirectUrl);
    console.log("client-appwrite.createOauth2:", response);

    return response;
  },

  createMagicURL: async (email: string) => {
    const response = await account.createMagicURLSession(ID.unique(), email, `${appwriteUrl}/sso-callback`);
    console.log("client-appwrite.createMagicURL:", response);

    return response;
  },

  updateMagicURL: async (userId: string, secret: string) => {
    const response = await account.updateMagicURLSession(userId, secret);
    console.log("client-appwrite.updateMagicURL:", response);

    return response;
  },

  createJWT: async () => {
    if (!jwt) {
      const jwtObject = await account.createJWT();
      jwt = jwtObject.jwt;
    }
    console.log("client-appwrite.createJWT:", jwt);

    return jwt;
  },

  signOut: async () => {
    const response = await account.deleteSession("current");
    console.log("client-appwrite.signOut:", response);

    return response;
  },
};
