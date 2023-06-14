"use client";

import { useSetAtom } from "jotai";

import { accountAtom, isLoadingAtom, profileAtom } from "~/lib/atoms/appwrite";
import { account, databases } from "~/lib/clients/appwrite-client";
import { appwriteUrl } from "~/lib/envClient";

export const useAppwrite = () => {
  const setAccount = useSetAtom(accountAtom);
  const setProfile = useSetAtom(profileAtom);

  const setLoading = useSetAtom(isLoadingAtom);

  const getAccount = async () => {
    try {
      setLoading(true);
      const response = await account.get();
      if (response) {
        setAccount(response);
      }
      console.log("getAccountSuccess:", response);
    } catch (error) {
      setAccount(null);
      console.log("getAccountError:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async () => {
    try {
      const response = await account.createVerification(`${appwriteUrl}/profile`);
      console.log("verifyAccountSuccess:", response);
    } catch (error) {
      console.log("verifyAccountError:", error);
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const { documents } = await databases.listDocuments("main", "profile");
      if (documents.length !== 0 && documents[0]) {
        setProfile(documents[0]);
      }
      console.log("getProfileSuccess:", documents[0]);
    } catch (error) {
      setProfile(null);
      console.log("getProfileError:", error);
    } finally {
      setLoading(false);
    }
  };

  const createJWT = async () => {
    try {
      const jwt = await account.createJWT();
      console.log("createJWTSuccess:", jwt);
      return jwt;
    } catch (error) {
      console.log("createJWTError", error);
      return { jwt: "" };
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current");
      setAccount(null);
      setProfile(null);
      console.log("signOutSuccess");
    } catch (error) {
      setAccount(null);
      setProfile(null);
      console.log("signOutError:", error);
    }
  };

  return { getAccount, verifyAccount, getProfile, createJWT, signOut };
};
