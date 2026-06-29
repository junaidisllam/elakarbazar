import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [mothers] = await pool.query(`
      SELECT id, display_name AS name, slug
      FROM categories
      WHERE parent_id = 100000
      ORDER BY display_name ASC
    `);

    const [children] = await pool.query(`
      SELECT id, display_name AS name, slug, parent_id
      FROM categories
      WHERE parent_id IS NOT NULL AND parent_id != 0 AND parent_id != 100000
      ORDER BY display_name ASC
    `);

    const mothersArr = mothers as any[];
    const childrenArr = children as any[];

    const grouped = mothersArr.map((m) => ({
      ...m,
      children: childrenArr.filter((c) => c.parent_id === m.id),
    }));

    return NextResponse.json({ categories: grouped });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}