import type { Profile } from "~/lib/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteClientService, appwriteServerService } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";

type Customer = {
  test: string;
};

export async function GET(request: Request) {
  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("stripe.subscription:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
    });
  }

  // Get current user
  const { sdkAccount } = appwriteClientService(token);
  const account = await sdkAccount.get();

  if (!account) {
    console.log("appwrite:", "Get current account failed");
    return new Response("Get current account failed", {
      status: 500,
    });
  }

  // Get current profile
  const { sdkDatabases } = appwriteClientService(token);
  const { documents: profiles } = await sdkDatabases.listDocuments<Profile>("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("appwrite:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 500,
    });
  }

  // Delete stripe customer
  const stripe = getStripeInstance();
  const customer = await stripe.customers.del(profile.stripeCustomerId);

  if (!customer) {
    console.log("appwrite:", "Delete stripe customer failed");
    // return new Response("Delete stripe customer failed", {
    //   status: 500,
    // });
  }

  // Delete profile in database
  const { sdkServerDatabases } = appwriteServerService();
  const profilePromise = await sdkServerDatabases.deleteDocument("main", "profile", profile.$id);

  if (!profilePromise) {
    console.log("appwrite:", "Delete appwrite profile failed");
    // return new Response("Delete appwrite profile failed", {
    //   status: 500,
    // });
  }

  // Delete appwrite account
  const { sdkServerUsers } = appwriteServerService();
  const accountPromise = await sdkServerUsers.delete(account.$id);

  if (!accountPromise) {
    console.log("appwrite:", "Delete appwrite account failed");
    // return new Response("Delete appwrite account failed", {
    //   status: 500,
    // });
  }

  console.log("appwrite:", "Delete account success");
  return NextResponse.json({ status: "OK" });
}
