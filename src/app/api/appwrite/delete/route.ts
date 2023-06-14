import type { Profile } from "~/lib/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteClientService, appwriteServerService } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";

type Customer = {
  test: string;
};

export async function GET(request: Request) {
  // // Get searchParams from URL
  // const { searchParams } = new URL(request.url);

  // const userId = searchParams.get("userId");
  // const secret = searchParams.get("secret");

  // if (!userId || !secret) {
  //   console.log("appwrite:", "Search params userId or secret missing");
  //   return new Response("Search params userId or secret missing", {
  //     status: 400,
  //   });
  // }

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
  console.log(account);

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
  console.log(profile);

  if (!profile) {
    console.log("appwrite:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 500,
    });
  }

  // Delete stripe customer
  const stripe = getStripeInstance();
  const customer = await stripe.customers.del(profile.stripeCustomerId);
  console.log(customer);

  if (!customer) {
    console.log("appwrite:", "Delete stripe customer failed");
    // return new Response("Delete stripe customer failed", {
    //   status: 500,
    // });
  }

  // Delete profile in database
  const { sdkServerDatabases } = appwriteServerService();
  const profilePromise = await sdkServerDatabases.deleteDocument("main", "profile", profile.$id);
  console.log(profilePromise);

  if (!profilePromise) {
    console.log("appwrite:", "Delete appwrite profile failed");
    // return new Response("Delete appwrite profile failed", {
    //   status: 500,
    // });
  }

  // Delete appwrite account
  const { sdkServerUsers } = appwriteServerService();
  const accountPromise = await sdkServerUsers.delete(account.$id);
  console.log(accountPromise);

  if (!accountPromise) {
    console.log("appwrite:", "Delete appwrite account failed");
    // return new Response("Delete appwrite account failed", {
    //   status: 500,
    // });
  }

  console.log("appwrite:", "Delete account success");
  return NextResponse.json({ status: "OK" });
}
