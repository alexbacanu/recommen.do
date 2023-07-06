import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { appwriteImpersonate, appwriteServer } from "@/lib/clients/server-appwrite";
import { FullProductValidator } from "@/lib/validators/schema";

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
    console.log("api.appwrite.history:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Get current profile
  const { impersonateDatabases } = appwriteImpersonate(token);
  const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("api.appwrite.history:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  // Update the newly created customer in appwrite
  const { serverDatabases } = appwriteServer();

  await serverDatabases.updateDocument("main", "profile", profile.$id, {
    saveHistory: !profile.saveHistory,
  });

  console.log("api.appwrite.history:", "OK");
  return NextResponse.json({ status: "OK" });
}

export async function POST(request: Request) {
  const body = await request.json();

  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("api.appwrite.history:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const validatedProduct = FullProductValidator.parse(body);

  if (!validatedProduct) {
    console.log("api.appwrite.history:", "Body missing");
    return new Response("Body missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Get current profile
  const { impersonateDatabases } = appwriteImpersonate(token);
  const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("api.appwrite.history:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  // Get the existing history array and add the validated product to it
  const historyArray = Array.isArray(profile.history) ? profile.history : [];

  // Remove the first item if the array length exceeds 25
  if (historyArray.length >= 25) {
    historyArray.shift();
  }

  historyArray.push(JSON.stringify(validatedProduct));

  // Update the newly created customer in appwrite
  const { serverDatabases } = appwriteServer();

  await serverDatabases.updateDocument("main", "profile", profile.$id, {
    history: historyArray,
  });

  console.log("api.appwrite.history:", "OK");
  return NextResponse.json({ status: "OK" });
}

export async function PUT(request: Request) {
  const body = await request.json();

  const bodyValidator = z.union([z.number().int().min(0).max(25).optional(), z.literal("clearHistory")]);
  const validatedBody = bodyValidator.parse(body);

  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("api.appwrite.history.put:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Get current profile
  const { impersonateDatabases } = appwriteImpersonate(token);
  const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("api.appwrite.history.put:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  const fullHistory: string[] = profile.history;

  // Update the newly created customer in appwrite
  const { serverDatabases } = appwriteServer();

  if (validatedBody === "clearHistory") {
    await serverDatabases.updateDocument("main", "profile", profile.$id, {
      history: null,
    });
  }
  if (typeof validatedBody === "number") {
    const filteredArray = fullHistory.filter((_, index) => index !== validatedBody);

    await serverDatabases.updateDocument("main", "profile", profile.$id, {
      history: filteredArray,
    });
  }

  console.log("api.appwrite.history.put:", "OK");
  return NextResponse.json({ status: "OK" });
}
