import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteClientService } from "~/lib/clients/appwrite-server";

// export async function GET() {
//   return NextResponse.json(
//     { status: "OK" },
//     {
//       headers: {
//         // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       },
//     },
//   );
// }

export async function GET(request: Request) {
  // Get searchParams from URL
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  if (!userId || !secret) {
    console.log("appwrite:", "Search params userId or secret missing");
    return new Response("Search params userId or secret missing", {
      status: 400,
    });
  }

  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("stripe.subscription:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
    });
  }

  // Update user verification
  const { sdkAccount } = appwriteClientService(token);
  const promise = await sdkAccount.updateVerification(userId, secret);
  console.log("appwrite.promise:", promise);

  if (!promise) {
    console.log("appwrite:", "Update verification failed");
    return new Response("Update verification failed", {
      status: 500,
    });
  }

  console.log("appwrite:", "Update verification success");
  return NextResponse.json({ status: "OK" });
}
