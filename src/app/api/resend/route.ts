import { NextResponse } from "next/server";
import { z } from "zod";

import { resendKey } from "@/lib/envServer";
import { EmailValidator } from "@/lib/validators/apiSchema";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ResendBody = {
  status: string;
  message: string;
  action: string;
};

// 1. ❌ Auth
// 2. ❌ Permissions
// 3. ✅ Input
// 4. ➖ Secure
// 5. ➖ Rate limiting
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as z.infer<typeof EmailValidator>;
    const { name, email, subject, message, terms } = EmailValidator.parse(body); // 3️⃣

    if (!terms) {
      return NextResponse.json(
        {
          message: "Please accept our Terms and Privacy Policy to contact us.",
        },
        {
          status: 403, // Unauthorized
        },
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Contact Form <hey@recommen.do>`,
        to: "hey@recommen.do",
        subject: subject,
        html: `<p><strong>From</strong>: ${name} <${email}></p>
      <p><strong>Message</strong>: ${message}</p>`,
      }),
    });

    if (res.status !== 200) {
      const data = (await res.json()) as ResendBody;

      return NextResponse.json(
        {
          message: data.message,
        },
        {
          status: res.status,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Your email was sent successfully.",
      },
      {
        status: res.status,
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
        },
      );
    }

    console.log(error);
    return NextResponse.json(
      {
        message: "Email issues on our end. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
