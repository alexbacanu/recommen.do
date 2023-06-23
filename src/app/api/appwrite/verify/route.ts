import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteClientService } from "@/lib/clients/appwrite-server";

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

export async function GET(request: Request) {
  // Get searchParams from URL
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  if (!userId || !secret) {
    console.log("appwrite.verify:", "Search params userId or secret missing");
    return NextResponse.json(
      { message: "Search params userId or secret missing" },
      { status: 400, headers: corsHeaders },
    );
  }

  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("appwrite.verify:", "JWT token missing");
    return NextResponse.json({ message: "JWT token missing" }, { status: 400, headers: corsHeaders });
  }

  try {
    // Update user verification
    const { sdkAccount } = appwriteClientService(token);
    const promise = await sdkAccount.updateVerification(userId, secret);

    if (!promise) {
      console.log("appwrite.verify:", "Update verification failed");
      return NextResponse.json({ message: "Update verification failed" }, { status: 400, headers: corsHeaders });
    }

    console.log("appwrite:", "Update verification success");
    return NextResponse.json({ message: "Update verification success" }, { headers: corsHeaders });
  } catch (error) {
    console.log("appwrite.verify:", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500, headers: corsHeaders });
  }
}
