import { NextResponse } from "next/server";

import { resendKey } from "@/lib/envServer";
import { ResendValidator } from "@/lib/validators/schema";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const corsHeaders = {
  // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  const { name, email, subject, message, terms } = ResendValidator.parse(body);
  console.log(name, email, subject, message, terms);

  if (!terms) {
    return new Response("You must accept the terms and conditions and privacy policy in order to contact us.", {
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
      from: `${name} <${email}>`,
      to: ["hey@recommen.do"],
      subject: `Contact Form: ${subject}`,
      html: message,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    return NextResponse.json(data);
  }

  return NextResponse.json(body);
}
