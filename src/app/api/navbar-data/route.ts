import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Query top 30 authors by book count
    const [authorRows] = await pool.query(`
      SELECT a.name 
      FROM authors a
      INNER JOIN products p ON p.author_id = a.id
      GROUP BY a.id, a.name
      ORDER BY COUNT(p.id) DESC
      LIMIT 30
    `);

    // Query top 30 publishers by product count
    const [publisherRows] = await pool.query(`
      SELECT pub.name 
      FROM publishers pub
      INNER JOIN products p ON p.publisher_id = pub.id
      GROUP BY pub.id, pub.name
      ORDER BY COUNT(p.id) DESC
      LIMIT 30
    `);

    return NextResponse.json({
      authors: (authorRows as any[]).map(row => row.name),
      publishers: (publisherRows as any[]).map(row => row.name),
    });
  } catch (error) {
    console.error("Failed to fetch navbar dynamic data:", error);
    return NextResponse.json({ authors: [], publishers: [] }, { status: 500 });
  }
}
