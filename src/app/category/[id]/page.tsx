import Link from "next/link";
import { BookOpen, Home, ChevronRight } from "lucide-react";
import pool from "@/lib/db";
import { Product } from "@/data/products";
import CategoryProductsFilter from "@/components/CategoryProductsFilter";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
    price?: string;
    rating?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const categoryIdNum = Number(id) || 0;

  try {
    const [rows] = await pool.query(
      `SELECT display_name FROM categories WHERE id = ? LIMIT 1`,
      [categoryIdNum]
    );
    const categoryRows = rows as any[];
    if (categoryRows.length > 0) {
      const name = categoryRows[0].display_name;
      const canonicalUrl = `https://elakarbazar.com/category/${id}`;
      return {
        title: `${name} কালেকশন - দাম ও অফার | এলাকার বাজার`,
        description: `এলাকার বাজার থেকে ${name} ক্যাটাগরির সেরা পণ্যগুলোর দাম ও আকর্ষণীয় ডিসকাউন্ট অফার জানুন।`,
        keywords: [name, `${name} দাম`, `${name} price in Bangladesh`, "elakar bazar", "এলাকার বাজার"],
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title: `${name} কালেকশন - দাম ও অফার | এলাকার বাজার`,
          description: `এলাকার বাজার থেকে ${name} ক্যাটাগরির সেরা পণ্যগুলোর দাম ও আকর্ষণীয় ডিসকাউন্ট অফার জানুন।`,
          url: canonicalUrl,
          type: "website",
          siteName: "এলাকার বাজার",
        },
        twitter: {
          card: "summary_large_image",
          title: `${name} কালেকশন - দাম ও অফার | এলাকার বাজার`,
          description: `এলাকার বাজার থেকে ${name} ক্যাটাগরির সেরা পণ্যগুলোর দাম ও আকর্ষণীয় ডিসকাউন্ট অফার জানুন।`,
        },
      };
    }
  } catch (error) {
    console.error("Metadata generation error for category:", error);
  }

  return {
    title: "ক্যাটাগরি কালেকশন | এলাকার বাজার",
    description: "এলাকার বাজার থেকে বিভিন্ন ক্যাটাগরির পণ্যের সেরা অফার ও ডিসকাউন্ট রেট জানুন।",
    alternates: {
      canonical: `https://elakarbazar.com/category/${id}`,
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const { id } = await params;
  const categoryIdNum = Number(id) || 0;

  // Await searchParams for Next.js 15 conventions
  const resolvedSearchParams = await searchParams;
  const pageParam = Number(resolvedSearchParams.page) || 1;
  const queryParam = resolvedSearchParams.query || "";
  const priceParam = resolvedSearchParams.price || null;
  const ratingParam = resolvedSearchParams.rating || "";
  const sortParam = resolvedSearchParams.sort || "newest";

  let dbProducts: Product[] = [];
  let categoryName = "ক্যাটাগরি";
  let childCategories: { id: number; name: string }[] = [];
  let allCategories: { id: number; parent_id: number | null; name: string }[] = [];
  let totalCount = 0;
  let maxPriceLimit = 2000;

  let ancestryChain: { id: number; name: string }[] = [];

  try {
    // 1. Fetch recursive category ancestry chain (Root down to Self)
    const [ancestryRows] = await pool.query(`
      WITH RECURSIVE CategoryAncestry AS (
        SELECT id, parent_id, display_name, 1 AS depth FROM categories WHERE id = ?
        UNION ALL
        SELECT c.id, c.parent_id, c.display_name, ca.depth + 1 FROM categories c
        INNER JOIN CategoryAncestry ca ON c.id = ca.parent_id
      )
      SELECT id, display_name as name FROM CategoryAncestry ORDER BY depth DESC
    `, [categoryIdNum]);
    ancestryChain = ancestryRows as { id: number; name: string }[];
    if (ancestryChain.length > 0) {
      categoryName = ancestryChain[ancestryChain.length - 1].name;
    }

    // 2. Fetch recursive category tree IDs
    const [treeRows] = await pool.query(`
      WITH RECURSIVE CategoryTree AS (
        SELECT id FROM categories WHERE id = ?
        UNION ALL
        SELECT c.id FROM categories c
        INNER JOIN CategoryTree ct ON c.parent_id = ct.id
      )
      SELECT id FROM CategoryTree
    `, [categoryIdNum]);
    const categoryIds = (treeRows as any[]).map(row => row.id);

    // 3. Fetch direct child categories
    const [childRows] = await pool.query(
      "SELECT id, display_name as name FROM categories WHERE parent_id = ?",
      [categoryIdNum]
    );
    childCategories = childRows as any[];

    // 4. Fetch all categories
    const [allCatsRows] = await pool.query(
      "SELECT id, parent_id, display_name as name FROM categories"
    );
    allCategories = allCatsRows as any[];

    if (categoryIds.length > 0) {
      // 5. Fetch max price dynamically for filtering
      const [maxPriceRows] = await pool.query(
        "SELECT MAX(current_price) as max_price FROM products WHERE category_id IN (?)",
        [categoryIds]
      );
      const maxPriceVal = (maxPriceRows as any[])[0]?.max_price;
      maxPriceLimit = maxPriceVal ? Math.ceil(Number(maxPriceVal)) : 2000;

      // 6. Build Server Side Query filters dynamically to prevent placeholder mismatches
      let selectList = "p.*, a.name as author_name, pub.name as publisher_name";
      const selectParams: any[] = [];
      const whereClauses: string[] = ["p.category_id IN (?)"];
      const whereParams: any[] = [categoryIds];
      const countWhereParams: any[] = [categoryIds];

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

      // Price range filter
      if (priceParam) {
        whereClauses.push("p.current_price <= ?");
        whereParams.push(Number(priceParam));
        countWhereParams.push(Number(priceParam));
      }

      // Ratings filter (OR mapping)
      if (ratingParam.trim() !== "") {
        const ratingsList = ratingParam.split(",").map(Number).filter(r => !isNaN(r));
        if (ratingsList.length > 0) {
          const ratingClauses = ratingsList.map(() => "p.average_rating >= ?").join(" OR ");
          whereClauses.push(`(${ratingClauses})`);
          whereParams.push(...ratingsList);
          countWhereParams.push(...ratingsList);
        }
      }

      // Final count query
      const countSql = `
        SELECT COUNT(*) as count 
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

      if (queryParam.trim() !== "" && sortParam === "newest") {
        sql += " ORDER BY relevance_score DESC";
      } else if (sortParam === "price-low") {
        sql += ` ORDER BY ${orderSql} p.current_price ASC`;
      } else if (sortParam === "price-high") {
        sql += ` ORDER BY ${orderSql} p.current_price DESC`;
      } else if (sortParam === "rating") {
        sql += ` ORDER BY ${orderSql} p.total_reviews DESC, p.average_rating DESC`;
      } else {
        sql += ` ORDER BY ${orderSql} p.id DESC`; // default newest
      }

      // Pagination Offset and limit
      const itemsPerPage = 60;
      const offset = (pageParam - 1) * itemsPerPage;
      sql += " LIMIT ? OFFSET ?";

      const queryParams = [...selectParams, ...whereParams, itemsPerPage, offset];

      // Execute Queries
      const [countRows] = await pool.query(countSql, countParams);
      totalCount = (countRows as any[])[0]?.count || 0;

      const [productRows] = await pool.query(sql, queryParams);
      dbProducts = (productRows as any[]).map(row => {
        const discountPercentage = row.original_price && row.current_price
          ? Math.round(((Number(row.original_price) - Number(row.current_price)) / Number(row.original_price)) * 100)
          : 0;

        return {
          id: String(row.id),
          slug: row.slug,
          title: row.title,
          price: row.current_price ? `৳ ${Math.round(Number(row.current_price))}` : 'N/A',
          originalPrice: row.original_price ? `৳ ${Math.round(Number(row.original_price))}` : '',
          discount: discountPercentage > 0 ? `${discountPercentage}% ছাড়` : '',
          rating: row.average_rating ? String(row.average_rating) : '0',
          reviews: row.total_reviews ? String(row.total_reviews) : '0',
          image: row.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
          category: row.product_type || 'book',
          author: row.author_name || undefined,
          description: row.description || '',
          highlights: row.highlights ? JSON.parse(row.highlights) : [],
          specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
          categoryId: row.category_id ? Number(row.category_id) : undefined,
          stockStatus: row.stock_status || undefined,
          isPreorder: row.is_preorder === 1 || row.is_preorder === true || false,
        };
      });
    }
  } catch (error) {
    console.error("Database query error for category detail:", error);
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": ancestryChain.map((cat, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": cat.name,
      "item": `https://elakarbazar.com/category/${cat.id}`
    }))
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} কালেকশন - দাম ও অফার | এলাকার বাজার`,
    "description": `এলাকার বাজার থেকে ${categoryName} ক্যাটাগরির সেরা পণ্যগুলোর দাম ও আকর্ষণীয় ডিসকাউন্ট অফার জানুন।`,
    "url": `https://elakarbazar.com/category/${id}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": dbProducts.length,
      "itemListElement": dbProducts.map((prod, index) => {
        const rawPrice = prod.price ? Number(prod.price.replace(/[^\d]/g, "")) : null;
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": prod.title,
            "image": prod.image,
            "url": `https://elakarbazar.com/product/${prod.slug}`,
            "offers": rawPrice ? {
              "@type": "Offer",
              "priceCurrency": "BDT",
              "price": rawPrice,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": prod.stockStatus === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
            } : undefined
          }
        };
      })
    }
  };

  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 mb-6 font-semibold flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5 text-zinc-400" />
            <span>হোম</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
          <Link href="/categories" className="hover:text-primary transition-colors">
            <span>ক্যাটাগরি</span>
          </Link>
          {ancestryChain.map((cat, idx) => {
            const isLast = idx === ancestryChain.length - 1;
            return (
              <span key={cat.id} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                {isLast ? (
                  <span className="text-zinc-800 font-bold">{cat.name}</span>
                ) : (
                  <Link href={`/category/${cat.id}`} className="hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {/* Filter and Products Grid Component */}
        <CategoryProductsFilter 
          initialProducts={dbProducts} 
          categoryName={categoryName}
          categoryId={categoryIdNum}
          childCategories={childCategories}
          allCategories={allCategories}
          totalCount={totalCount}
          maxPriceLimit={maxPriceLimit}
          currentPageParam={pageParam}
          queryParam={queryParam}
          priceParam={priceParam}
          ratingParam={ratingParam}
          sortParam={sortParam}
        />

      </div>
    </div>
  );
}
