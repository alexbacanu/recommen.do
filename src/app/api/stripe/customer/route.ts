import { createHmac } from "crypto";
import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteServer } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { appwriteUrl } from "@/lib/envClient";
import { appwriteWebhookKey } from "@/lib/envServer";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

// 1. ❌ Auth
// 2. ✅ Permissions
// 3. ❌ Input
// 4. ✅ Secure
// 5. ➖ Rate limiting
export async function POST(request: Request) {
  try {
    // 🫴 Get Body
    const body = (await request.json()) as AppwriteProfile;

    if (!body) {
      return NextResponse.json(
        {
          message: "Please provide a body.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // 🚦 Verify Signature
    const payload = `${appwriteUrl}/api/stripe/customer${JSON.stringify(body)}`;
    const signature = headers().get("X-Appwrite-Webhook-Signature");
    const token = createHmac("sha1", appwriteWebhookKey).update(payload).digest("base64");

    if (signature !== token) {
      return NextResponse.json(
        {
          message: "Webhook signature is invalid.",
        },
        {
          status: 401, // Not Found
        },
      );
    }

    // ➕ Create Stripe Customer
    const stripe = getStripeInstance();
    const customer = await stripe.customers.create({
      email: body.email,
      name: body.name,
    });

    // ☀️ Update Appwrite Profile
    const { serverDatabases } = appwriteServer();
    await serverDatabases.updateDocument("main", "profile", body.$id, {
      stripeCustomerId: customer.id,
    });

    // ✅ Everything OK
    return NextResponse.json({
      message: "Stripe customer created successfully.",
    });
  } catch (error) {
    // ❌ Everything NOT OK
    console.log(error);
    return NextResponse.json(
      {
        message: "Server issue on our end. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
