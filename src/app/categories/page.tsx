import type { Metadata } from "next";
import Link from "next/link";
import pool from "@/lib/db";
import { Home, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import CategoryProductsFilter from "@/components/CategoryProductsFilter";

export const metadata: Metadata = {
  title: "সব পণ্য ও বই | Elakar Bazar",
  description:
    "Elakar Bazar-এ সব পণ্য ও বই এক জায়গায়। রেটিং অনুযায়ী সাজানো — ভালো রিভিউ পাওয়া পণ্যগুলো উপরে। ফিল্টার করুন ক্যাটাগরি, দাম ও রেটিং দিয়ে।",
  keywords: ["all products", "books", "electronics", "elakar bazar", "categories"],
  openGraph: {
    title: "সব পণ্য ও বই | Elakar Bazar",
    description: "সব পণ্য ও বই এক জায়গায়, রেটিং অনুযায়ী সাজানো।",
    url: "https://elakarbazar.com/categories",
    type: "website",
  },
  alternates: { canonical: "https://elakarbazar.com/categories" },
};

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    price?: string;
    rating?: string;
    sort?: string;
    discount?: string;
  }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const resolvedParams = await searchParams;

  const pageParam     = Number(resolvedParams.page)     || 1;
  const queryParam    = resolvedParams.query             || "";
  const priceParam    = resolvedParams.price             || null;
  const ratingParam   = resolvedParams.rating            || "";
  const sortParam     = resolvedParams.sort              || "rating";
  const discountParam = resolvedParams.discount          || "";

  let dbProducts: Product[]                              = [];
  let childCategories: { id: number; name: string }[]   = [];
  let allCategories: { id: number; parent_id: number | null; name: string }[] = [];
  let totalCount    = 0;
  let maxPriceLimit = 5000;

  try {
    // 1. Mother categories for sidebar (since we are on the root categories page, mother categories act as childCategories)
    const [motherRows] = await pool.query(
      "SELECT id, display_name AS name FROM categories WHERE parent_id = 100000 ORDER BY display_name ASC"
    );
    childCategories = motherRows as { id: number; name: string }[];

    // 2. Fetch all categories
    const [allCatsRows] = await pool.query(
      "SELECT id, parent_id, display_name as name FROM categories"
    );
    allCategories = allCatsRows as any[];

    // 3. Max price for slider
    const [maxPriceRows] = await pool.query(
      "SELECT MAX(current_price) AS max_price FROM products"
    );
    const maxPriceVal = (maxPriceRows as any[])[0]?.max_price;
    maxPriceLimit = maxPriceVal ? Math.ceil(Number(maxPriceVal)) : 5000;

    // 4. Build product query dynamically to prevent placeholder mismatches
    let selectList = "p.*, a.name AS author_name, pub.name AS publisher_name";
    const selectParams: any[] = [];
    const whereClauses: string[] = ["1=1"];
    const whereParams: any[] = [];
    const countWhereParams: any[] = [];

    // Query Search filter (Advanced Tokenized Typo-Tolerant Search)
    if (queryParam.trim() !== "") {
      const searchWords = queryParam.trim().split(/\s+/).filter(w => w.length > 0);
      
      if (searchWords.length > 0) {
        const norm = (col: string) => {
          return `REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(${col}), 'ঈ', 'ই'), 'ী', 'ি'), 'ঊ', 'উ'), 'ূ', 'ু'), 'ড়', 'র'), 'ঢ়', 'র'), 'ণ', 'ন'), 'ষ', 'শ')`;
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

        const scoreParts: string[] = [];
        
        // 1. Boost exact full title/english_title matches
        scoreParts.push(`(CASE WHEN ${norm('p.title')} = ? OR ${norm('p.english_title')} = ? THEN 150 ELSE 0 END)`);
        selectParams.push(normStr(queryParam), normStr(queryParam));

        // 2. Boost exact substring matches
        scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? THEN 80 ELSE 0 END)`);
        selectParams.push(`%${normStr(queryParam)}%`, `%${normStr(queryParam)}%`);

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
          if (!normStr(queryParam).includes(acc)) {
            scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? THEN -120 ELSE 0 END)`);
            selectParams.push(`%${acc}%`);
          }
        });

        // 3. Tokenized matching
        searchWords.forEach((word) => {
          const wordNorm = normStr(word);
          const weight = Math.max(word.length, 1);
          
          // Substring match: weight * 12 points
          scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('pub.name')} LIKE ? THEN ${weight * 12} ELSE 0 END)`);
          selectParams.push(`%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`);

          // Prefix/Full-word match boost: weight * 8 points extra (starts with or space before)
          scoreParts.push(`(CASE WHEN ${norm('p.title')} LIKE ? OR ${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('pub.name')} LIKE ? OR ${norm('pub.name')} LIKE ? THEN ${weight * 8} ELSE 0 END)`);
          selectParams.push(`${wordNorm}%`, `% ${wordNorm}%`, `${wordNorm}%`, `% ${wordNorm}%`, `${wordNorm}%`, `% ${wordNorm}%`, `${wordNorm}%`, `% ${wordNorm}%`);
        });

        const relevanceScoreSql = `(${scoreParts.join(" + ")})`;
        selectList += `, ${relevanceScoreSql} as relevance_score`;

        // Match condition: all word tokens must match title, english_title, author, or publisher
        const tokenClauses = searchWords.map(() => {
          return `(${norm('p.title')} LIKE ? OR ${norm('p.english_title')} LIKE ? OR ${norm('a.name')} LIKE ? OR ${norm('pub.name')} LIKE ?)`;
        });
        whereClauses.push(`(${tokenClauses.join(" OR ")})`);
        
        searchWords.forEach((word) => {
          const wordNorm = normStr(word);
          whereParams.push(`%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`);
          countWhereParams.push(`%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`, `%${wordNorm}%`);
        });
      }
    }

    if (priceParam) {
      whereClauses.push("p.current_price <= ?");
      whereParams.push(Number(priceParam));
      countWhereParams.push(Number(priceParam));
    }

    if (ratingParam.trim() !== "") {
      const ratingsList = ratingParam.split(",").map(Number).filter((r) => !isNaN(r));
      if (ratingsList.length > 0) {
        const clauses = ratingsList.map(() => "p.average_rating >= ?").join(" OR ");
        whereClauses.push(`(${clauses})`);
        whereParams.push(...ratingsList);
        countWhereParams.push(...ratingsList);
      }
    }

    if (discountParam.trim() !== "") {
      const discountMin = Number(discountParam);
      if (!isNaN(discountMin) && discountMin > 0) {
        whereClauses.push("p.original_price > p.current_price AND ((p.original_price - p.current_price) / p.original_price) * 100 >= ?");
        whereParams.push(discountMin);
        countWhereParams.push(discountMin);
      }
    }

    // Final count query
    const countSql = `
      SELECT COUNT(*) AS count
      FROM products p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN publishers pub ON p.publisher_id = pub.id
      WHERE ${whereClauses.join(" AND ")}
    `;
    const countParams = countWhereParams;

    // Final product query
    let sql = `
      SELECT ${selectList}
      FROM products p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN publishers pub ON p.publisher_id = pub.id
      WHERE ${whereClauses.join(" AND ")}
    `;

    // Sort ordering (Default to relevance when query is present)
    let orderSql = "";
    if (queryParam.trim() !== "") {
      orderSql = " relevance_score DESC, ";
    }

    if (sortParam === "rating") {
      sql += ` ORDER BY ${orderSql} p.total_reviews DESC, p.average_rating DESC`;
    } else if (sortParam === "price-low") {
      sql += ` ORDER BY ${orderSql} p.current_price ASC`;
    } else if (sortParam === "price-high") {
      sql += ` ORDER BY ${orderSql} p.current_price DESC`;
    } else if (sortParam === "newest") {
      sql += ` ORDER BY ${orderSql} p.id DESC`;
    } else {
      sql += ` ORDER BY ${orderSql} p.total_reviews DESC, p.average_rating DESC`;
    }

    const ITEMS_PER_PAGE = 60;
    const offset = (pageParam - 1) * ITEMS_PER_PAGE;
    sql += " LIMIT ? OFFSET ?";
    
    const queryParams = [...selectParams, ...whereParams, ITEMS_PER_PAGE, offset];

    const [countRows]   = await pool.query(countSql, countParams);
    totalCount = (countRows as any[])[0]?.count || 0;

    const [productRows] = await pool.query(sql, queryParams);
    dbProducts = (productRows as any[]).map((row) => {
      const discountPct =
        row.original_price && row.current_price
          ? Math.round(
              ((Number(row.original_price) - Number(row.current_price)) /
                Number(row.original_price)) * 100
              )
          : 0;

      return {
        id:             String(row.id),
        slug:           row.slug,
        title:          row.title,
        price:          row.current_price  ? `৳ ${Math.round(Number(row.current_price))}`  : "N/A",
        originalPrice:  row.original_price ? `৳ ${Math.round(Number(row.original_price))}` : "",
        discount:       discountPct > 0    ? `${discountPct}% ছাড়`                          : "",
        rating:         row.average_rating ? String(row.average_rating) : "0",
        reviews:        row.total_reviews  ? String(row.total_reviews)  : "0",
        image:          row.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
        category:       row.product_type   || "book",
        author:         row.author_name    || undefined,
        description:    row.description    || "",
        highlights:     row.highlights     ? JSON.parse(row.highlights)     : [],
        specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
        categoryId:     row.category_id    ? Number(row.category_id)        : undefined,
        stockStatus:    row.stock_status   || undefined,
        isPreorder:     row.is_preorder === 1 || row.is_preorder === true || false,
      } as Product;
    });
  } catch (error) {
    console.error("CategoriesPage DB error:", error);
  }

  return (
    <div className="w-full bg-zinc-50/50 min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 mb-6 font-semibold flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5 text-zinc-400" />
            <span>হোম</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
          <span className="text-zinc-800 font-bold">সব পণ্য ও বই</span>
        </nav>

        <CategoryProductsFilter
          initialProducts={dbProducts}
          categoryName="সব পণ্য ও বই"
          categoryId={0}
          childCategories={childCategories}
          allCategories={allCategories}
          totalCount={totalCount}
          maxPriceLimit={maxPriceLimit}
          currentPageParam={pageParam}
          queryParam={queryParam}
          priceParam={priceParam}
          ratingParam={ratingParam}
          sortParam={sortParam}
          discountParam={discountParam}
        />
      </div>
    </div>
  );
}
