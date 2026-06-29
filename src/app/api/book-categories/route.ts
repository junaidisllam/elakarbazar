import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, display_name as name FROM categories WHERE parent_id = 1 ORDER BY display_name ASC"
    );
    return NextResponse.json(
      { categories: rows },
      {
        headers: {
          "Cache-Control": "public, max-age=5184000, s-maxage=5184000, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch book categories:", error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
