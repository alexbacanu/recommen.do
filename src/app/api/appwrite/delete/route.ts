import type { Profile } from "@/lib/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteClientService, appwriteServerService } from "@/lib/clients/appwrite-server";
import { getStripeInstance } from "@/lib/clients/stripe-server";

const corsHeaders = {
  // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return NextResponse.json({ message: "OK" }, { headers: corsHeaders });
}

export async function GET() {
  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("stripe.subscription:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Get current user
  const { sdkAccount } = appwriteClientService(token);
  const account = await sdkAccount.get();

  if (!account) {
    console.log("appwrite:", "Get current account failed");
    return new Response("Get current account failed", {
      status: 500,
      headers: corsHeaders,
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
      headers: corsHeaders,
    });
  }

  // Delete stripe customer
  if (profile.stripeCustomerId) {
    const stripe = getStripeInstance();
    await stripe.customers.del(profile.stripeCustomerId);
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
  return NextResponse.json(
    { status: "OK" },
    {
      headers: corsHeaders,
    },
  );
}
