import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteImpersonate, appwriteServer } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";

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
    console.log("api.appwrite.delete:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Get current user
  const { impersonateAccount } = appwriteImpersonate(token);
  const account = await impersonateAccount.get();

  if (!account) {
    console.log("api.appwrite.delete:", "Get current account failed");
    return new Response("Get current account failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  // Get current profile
  const { impersonateDatabases } = appwriteImpersonate(token);
  const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("api.appwrite.delete:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  // Delete stripe customer
  if (profile.stripeCustomerId) {
    const stripe = getStripeInstance();
    await stripe.customers.del(profile.stripeCustomerId);
  }

  // Delete profile in database
  const { serverDatabases } = appwriteServer();
  const profilePromise = await serverDatabases.deleteDocument("main", "profile", profile.$id);

  if (!profilePromise) {
    console.log("api.appwrite.delete:", "Delete appwrite profile failed");
  }

  // Delete appwrite account
  const { serverUsers } = appwriteServer();
  const accountPromise = await serverUsers.delete(account.$id);

  if (!accountPromise) {
    console.log("api.appwrite.delete:", "Delete appwrite account failed");
  }

  console.log("api.appwrite.delete:", "Delete account success");
  return NextResponse.json(
    { status: "OK" },
    {
      headers: corsHeaders,
    },
  );
}
