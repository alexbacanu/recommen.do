import { NextResponse } from "next/server";

import { resendKey } from "@/lib/envServer";
import { corsHeaders } from "@/lib/helpers/cors";
import { ResendValidator } from "@/lib/validators/schema";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, subject, message, terms } = ResendValidator.parse(body);

  if (!terms) {
    return NextResponse.json("You must accept the terms and conditions and privacy policy in order to contact us.", {
      status: 401,
      headers: corsHeaders,
    });
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

  const data = await res.json();

  if (res.status !== 200) {
    return NextResponse.json(data.message, { status: res.status });
  }

  return NextResponse.json("api.resend.status: OK");
}
