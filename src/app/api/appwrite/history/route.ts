import type { AppwriteProfile, ScrapedProduct } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";
import { z } from "zod";

import { appwriteImpersonate, appwriteServer } from "@/lib/clients/server-appwrite";
import { ActionValidator, FullProductValidator } from "@/lib/validators/apiSchema";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function OPTIONS() {
  return NextResponse.json(
    {
      message: "OK",
    },
    {
      headers: cors,
    },
  );
}

// 1. ✅ Auth
// 2. ❌ Permissions
// 3. ❌ Input
// 4. ➖ Secure
// 5. ➖ Rate limiting
export async function PATCH() {
  try {
    // 🫴 Get Authorization
    const authHeader = headers().get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          message: "The JWT token is missing. Please check and try again.",
        },
        {
          status: 401, // Unauthorized
        },
      );
    }

    // 🫴 Get Profile
    const { impersonateDatabases } = appwriteImpersonate(token);
    const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
    const profile = profiles[0];

    if (!profile) {
      return NextResponse.json(
        {
          message: "We couldn't find your profile. Please sign out and retry.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // ☀️ Update Profile with history toggle
    const { serverDatabases } = appwriteServer();
    await serverDatabases.updateDocument("main", "profile", profile.$id, {
      saveHistory: !profile.saveHistory,
    });

    // ✅ Everything OK
    return NextResponse.json({
      message: "History settings have been successfully changed.",
    });
  } catch (error) {
    if (error instanceof AppwriteException) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.code ? error.code : 500,
        },
      );
    }

    // ❌ Everything NOT OK
    console.log(error);
    return NextResponse.json(
      {
        message: "We're experiencing issues with toggling your history. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}

// 1. ✅ Auth
// 2. ❌ Permissions
// 3. ✅ Input
// 4. ✅ Secure
// 5. ➖ Rate limiting
export async function POST(request: Request) {
  try {
    // 🫴 Get Body
    const body = (await request.json()) as z.infer<typeof FullProductValidator>;
    const validatedProduct = FullProductValidator.parse(body); // 3️⃣

    // 🫴 Get Authorization
    const authHeader = headers().get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          message: "The JWT token is missing. Please check and try again.",
        },
        {
          status: 401, // Unauthorized
          headers: cors,
        },
      );
    }

    // 🫴 Get Profile
    const { impersonateDatabases } = appwriteImpersonate(token);
    const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
    const profile = profiles[0];

    if (!profile) {
      return NextResponse.json(
        {
          message: "We couldn't find your profile. Please sign out and retry.",
        },
        {
          status: 404, // Not Found
          headers: cors,
        },
      );
    }

    // 🫴 Get current history
    const historyArray = Array.isArray(profile.history) ? [...profile.history] : [];

    // ➖ Remove the first item if the array length >= 25
    if (historyArray.length >= 25) {
      historyArray.shift();
    }

    // ➕ Add validated product in history array
    historyArray.push(JSON.stringify(validatedProduct));

    // ☀️ Update Appwrite Profile
    const { serverDatabases } = appwriteServer();

    await serverDatabases.updateDocument("main", "profile", profile.$id, {
      history: historyArray,
    });

    // ✅ Everything OK
    return NextResponse.json(
      {
        message: "Successfully added a new entry to your history.",
      },
      {
        headers: cors,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400, // Bad Request
          headers: cors,
        },
      );
    }

    if (error instanceof AppwriteException) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.code ? error.code : 500,
          headers: cors,
        },
      );
    }

    // ❌ Everything NOT OK
    console.log(error);
    return NextResponse.json(
      {
        message: "We're experiencing issues with updating your history. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
        headers: cors,
      },
    );
  }
}

// 1. ✅ Auth
// 2. ❌ Permissions
// 3. ✅ Input
// 4. ➖ Secure
// 5. ➖ Rate limiting
export async function DELETE(request: Request) {
  try {
    // 🫴 Get Body
    const body = (await request.json()) as z.infer<typeof ActionValidator>;
    const validatedAction = ActionValidator.parse(body); // 3️⃣

    // 🫴 Get Authorization
    const authHeader = headers().get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          message: "The JWT token is missing. Please check and try again.",
        },
        {
          status: 401, // Unauthorized
        },
      );
    }

    // 🫴 Get Profile
    const { impersonateDatabases } = appwriteImpersonate(token);
    const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
    const profile = profiles[0];

    if (!profile) {
      return NextResponse.json(
        {
          message: "We couldn't find your profile. Please sign out and retry.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // 🫴 Get current history
    const historyArray = Array.isArray(profile.history) ? [...profile.history] : [];

    // ☀️ Update Appwrite Profile
    const { serverDatabases } = appwriteServer();

    if (validatedAction === "clearHistory") {
      await serverDatabases.updateDocument("main", "profile", profile.$id, {
        history: null,
      });

      return NextResponse.json({
        message: "History was deleted successfully.",
      });
    }

    // ☀️ Update Appwrite Profile
    const filteredArray = historyArray.filter((item) => {
      const parsedItem = JSON.parse(item) as ScrapedProduct;

      return parsedItem.identifier !== validatedAction;
    });

    await serverDatabases.updateDocument("main", "profile", profile.$id, {
      history: filteredArray,
    });

    // ✅ Everything OK
    return NextResponse.json({
      message: "Item was deleted successfully.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400, // Bad Request
        },
      );
    }

    if (error instanceof AppwriteException) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.code ? error.code : 500,
        },
      );
    }

    // ❌ Everything NOT OK
    console.log(error);
    return NextResponse.json(
      {
        message: "We're experiencing issues with deleting your history. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
