import type { AppwriteProfile } from "@/lib/types/types";

import { Account, Avatars, Client, Databases, ID, Query } from "appwrite";

import { appwriteEndpoint, appwriteProject, appwriteUrl } from "@/lib/envClient";

const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const AppwriteService = {
  getAccount: async () => {
    const response = await account.get();

    return response;
  },

  getAccountInitials: (name: string) => {
    const defaultBackground = name === "r e" ? "6366f1" : undefined;

    const response = avatars.getInitials(name, 128, 128, defaultBackground);

    return response;
  },

  getProfile: async () => {
    const { documents } = await databases.listDocuments<AppwriteProfile>("main", "profile", [Query.limit(1)]);

    return documents[0];
  },

  listSessions: async () => {
    const response = await account.listSessions();

    return response;
  },

  createOauth2: (provider: string) => {
    const redirectUrl = `${appwriteUrl}/profile`; //todo: maybe do something here

    const response = account.createOAuth2Session(provider, redirectUrl, redirectUrl);

    return response;
  },

  createMagicURL: async (email: string) => {
    const response = await account.createMagicURLSession(ID.unique(), email, `${appwriteUrl}/sso-callback`);

    return response;
  },

  updateMagicURL: async (userId: string, secret: string) => {
    const response = await account.updateMagicURLSession(userId, secret);

    return response;
  },

  updateName: async (newName: string) => {
    const response = await account.updateName(newName);

    return response;
  },

  updatePassword: async (newPassword: string, oldPassword?: string) => {
    const response = await account.updatePassword(newPassword, oldPassword);

    return response;
  },

  updateEmail: async (newEmail: string, currentPassword: string) => {
    const response = await account.updateEmail(newEmail, currentPassword);

    return response;
  },

  createRecovery: async (email: string) => {
    const response = await account.createRecovery(email, `${appwriteUrl}/forgot-callback`);

    return response;
  },

  updateRecovery: async (userId: string, secret: string, confirmPassword: string) => {
    const response = await account.updateRecovery(userId, secret, confirmPassword, confirmPassword);

    return response;
  },

  createVerification: async () => {
    const response = await account.createVerification(`${appwriteUrl}/email-callback`);

    return response;
  },

  updateVerification: async (userId: string, secret: string) => {
    const response = await account.updateVerification(userId, secret);

    return response;
  },

  createJWT: async () => {
    const jwtObject = await account.createJWT();

    return jwtObject.jwt;
  },

  signOut: async (id = "current") => {
    const response = await account.deleteSession(id);

    return response;
  },
};
