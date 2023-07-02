"use client";

import { useSetAtom } from "jotai";

import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";

export const useAccount = () => {
  const setAccount = useSetAtom(accountAtom);
  const setProfile = useSetAtom(profileAtom);

  const fetchAccount = async () => {
    try {
      const response = await AppwriteService.getAccount();
      console.log("use-account.fetchAccount.success:", response);

      setAccount(response);
      return response;
    } catch (error) {
      console.log("use-account.fetchAccount.error:", error);

      setAccount(false);
      return false;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await AppwriteService.getProfile();

      if (!response) {
        throw new Error("Profile not found");
      }

      console.log("use-account.fetchProfile.success:", response);
      setProfile(response);
      return response;
    } catch (error) {
      console.log("use-account.fetchProfile.error:", error);

      setProfile(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AppwriteService.signOut();
      console.log("use-account.signOut.success");
    } catch (error) {
      console.log("use-account.signOut.error:", error);
    } finally {
      await Promise.all([fetchAccount(), fetchProfile()]);
    }
  };

  return { fetchAccount, fetchProfile, signOut };
};
