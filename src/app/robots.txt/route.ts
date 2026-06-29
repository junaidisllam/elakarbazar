import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  let baseUrl = `${url.protocol}//${url.host}`;
  if (baseUrl.includes("0.0.0.0") || process.env.NODE_ENV === "production") {
    baseUrl = "https://elakarbazar.com";
  }

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
