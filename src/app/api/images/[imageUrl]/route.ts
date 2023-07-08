import { NextResponse } from "next/server";

import { corsHeaders } from "@/lib/helpers/cors";

export const runtime = "edge";
export const revalidate = "force-cache";
export const fetchCache = "force-cache";
// export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { imageUrl: string } }) {
  // Get priceId from slug
  const { imageUrl } = params;
  console.log(imageUrl);

  if (!imageUrl) {
    console.log("api.images:", "ImageURL missing");
    return new Response("ImageURL missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const { imageUrl } = params;
    console.log(imageUrl);
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("There was an error", {
      status: 500,
    });
  }
}
