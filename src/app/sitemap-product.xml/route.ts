import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  let baseUrl = `${url.protocol}//${url.host}`;
  if (baseUrl.includes("0.0.0.0") || process.env.NODE_ENV === "production") {
    baseUrl = "https://elakarbazar.com";
  }
  const currentDate = new Date().toISOString();

  try {
    const [rows]: any = await pool.query("SELECT slug FROM products WHERE slug IS NOT NULL AND slug != ''");
    const urls = rows.map((row: any) => `  <url>
    <loc>${baseUrl}/product/${row.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
