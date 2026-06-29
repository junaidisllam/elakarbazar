import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get("q") || "";

    if (queryParam.trim() === "") {
      return NextResponse.json({ products: [], categories: [], authors: [], publishers: [] });
    }

    const searchWords = queryParam.trim().split(/\s+/).filter(w => w.length > 0);
    if (searchWords.length === 0) {
      return NextResponse.json({ products: [], categories: [], authors: [], publishers: [] });
    }

    const norm = (col: string) => {
      return col;
    };

    const normStr = (str: string) => {
      return str
        .toLowerCase()
        .replace(/ঈ/g, 'ই')
        .replace(/ী/g, 'ি')
        .replace(/ঊ/g, 'উ')
        .replace(/ূ/g, 'ু')
        .replace(/ড়/g, 'র')
        .replace(/ঢ়/g, 'র')
        .replace(/ণ/g, 'ন')
        .replace(/ষ/g, 'শ')
        .replace(/স/g, 'শ');
    };

    const queryNorm = normStr(queryParam);

    // Define SQL queries
    const catSql = `
      SELECT id, display_name AS name, slug
      FROM categories
      WHERE ${norm('display_name')} LIKE ?
      LIMIT 3
    `;

    const authorSql = `
      SELECT id, name, image_url
      FROM authors
      WHERE ${norm('name')} LIKE ?
      LIMIT 3
    `;

    const pubSql = `
      SELECT id, name, image_url
      FROM publishers
      WHERE ${norm('name')} LIKE ?
      LIMIT 3
    `;

    // Build matching products query variables
    let selectList = "p.id, p.title, p.slug, p.cover_image_url, p.current_price, p.original_price, a.name AS author_name";
    const selectParams: any[] = [];
    const whereClauses: string[] = ["1=1"];
    const whereParams: any[] = [];
    const scoreParts: string[] = [];
    
    // Boost exact full title matches
    // Boost exact matches of title/english_title
    scoreParts.push(`(CASE WHEN ${norm('p.title')} = ? OR ${norm('p.english_title')} = ? THEN 150 ELSE 0 END)`);
    selectParams.push(queryNorm, queryNorm);

    // Boost exact substring matches
    scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? THEN 80 ELSE 0 END)`);
    selectParams.push(`%${queryNorm}%`, `%${queryNorm}%`);

    // Boost exact matches of any single query term in the title/english_title
    searchWords.forEach((word) => {
      const wordNorm = normStr(word);
      if (wordNorm.length > 2) {
        scoreParts.push(`(CASE WHEN ${norm('p.title')} = ? OR ${norm('p.english_title')} = ? THEN 100 ELSE 0 END)`);
        selectParams.push(wordNorm, wordNorm);
      }
    });

    // Accessory/Part keyword demotion (negative boost)
    const accessories = ["strap", "battery", "glass", "cover", "protector", "case", "pad", "liquid", "bag", "charger", "cable", "স্ট্র্যাপ", "ব্যাটারি", "গ্লাস", "কভার", "ব্যাগ", "চার্জার", "ক্যাবল"];
    accessories.forEach((acc) => {
      if (!queryNorm.includes(acc)) {
        scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? THEN -120 ELSE 0 END)`);
        selectParams.push(`%${acc}%`);
      }
    });

    // Tokenized matching
    searchWords.forEach((word) => {
      const wordNorm = normStr(word);
      const weight = Math.max(word.length, 1);
      
      // Substring match
      scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('pub.name')} LIKE ? THEN ${weight * 12} ELSE 0 END)`);
      selectParams.push(`%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`);

      // Prefix/Full-word match boost
      scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? OR ${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('pub.name')} LIKE ? OR ${norm('pub.name')} LIKE ? THEN ${weight * 8} ELSE 0 END)`);
      selectParams.push(`${wordNorm}%`, `% ${wordNorm}%`, `${wordNorm}%`, `% ${wordNorm}%`, `${wordNorm}%`, `% ${wordNorm}%`, `${wordNorm}%`, `% ${wordNorm}%`);
    });

    const relevanceScoreSql = `(${scoreParts.join(" + ")})`;
    selectList += `, ${relevanceScoreSql} as relevance_score`;

    // Match condition
    const tokenClauses = searchWords.map(() => {
      return `(${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('pub.name')} LIKE ?)`;
    });
    whereClauses.push(`(${tokenClauses.join(" OR ")})`);
    
    searchWords.forEach((word) => {
      const wordNorm = normStr(word);
      whereParams.push(`%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`);
    });

    const sql = `
      SELECT ${selectList}
      FROM products p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN publishers pub ON p.publisher_id = pub.id
      WHERE ${whereClauses.join(" AND ")}
      ORDER BY relevance_score DESC
      LIMIT 5
    `;

    // Execute queries concurrently to optimize performance
    const [catRes, authorRes, pubRes, prodRes] = await Promise.all([
      pool.query(catSql, [`%${queryNorm}%`]),
      pool.query(authorSql, [`%${queryNorm}%`]),
      pool.query(pubSql, [`%${queryNorm}%`]),
      pool.query(sql, [...selectParams, ...whereParams])
    ]);

    const [catRows] = catRes;
    const [authorRows] = authorRes;
    const [pubRows] = pubRes;
    const [rows] = prodRes;

    const categories = (catRows as any[]).map(row => ({
      id: String(row.id),
      name: row.name,
      slug: row.slug,
    }));

    const authors = (authorRows as any[]).map(row => ({
      id: String(row.id),
      name: row.name,
      image: row.image_url || null,
    }));

    const publishers = (pubRows as any[]).map(row => ({
      id: String(row.id),
      name: row.name,
      image: row.image_url || null,
    }));

    const products = (rows as any[]).map((row) => {
      const coverImage = row.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop';
      // Optimize image load times by replacing larger cover size with tiny autocomplete dimension
      const smallImage = coverImage.replace('/130X186/', '/45X64/');

      return {
        id: String(row.id),
        title: row.title,
        slug: row.slug,
        image: smallImage,
        price: row.current_price ? Math.round(Number(row.current_price)) : null,
        originalPrice: row.original_price ? Math.round(Number(row.original_price)) : null,
        author: row.author_name || null,
      };
    });

    return NextResponse.json({ products, categories, authors, publishers });
  } catch (error) {
    console.error("Autocomplete search failed:", error);
    return NextResponse.json({ products: [], categories: [], authors: [], publishers: [] }, { status: 500 });
  }
}
