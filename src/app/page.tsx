import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { allProducts, Product } from "@/data/products";
import ExploreProducts from "@/components/ExploreProducts";
import PromoSlider from "@/components/PromoSlider";
import ProductSlider from "@/components/ProductSlider";
import pool from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "এলাকার বাজার - রকমারির সেরা অফার, ডিসকাউন্ট ও কুপন",
  description: "এলাকার বাজার ওয়েবসাইটে রকমারির লক্ষাধিক বই, গ্যাজেট, ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য আকর্ষণীয় ডিসকাউন্ট কুপন ও প্রমো কোডসহ সাশ্রয়ী মূল্যে অর্ডার করুন।",
  openGraph: {
    title: "এলাকার বাজার - রকমারির সেরা অফার, ডিসকাউন্ট ও কুপন",
    description: "এলাকার বাজার ওয়েবসাইটে রকমারির লক্ষাধিক বই, গ্যাজেট, ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য আকর্ষণীয় ডিসকাউন্ট কুপন ও প্রমো কোডসহ সাশ্রয়ী মূল্যে অর্ডার করুন।",
    type: "website",
  },
};

export default async function Home() {
  let sliderImages: string[] = [];
  try {
    const [sliderRows] = await pool.query('SELECT image_path FROM sliders ORDER BY order_num ASC, id DESC');
    sliderImages = (sliderRows as any[]).map(row => row.image_path);
  } catch (error) {
    console.error("Slider fetch error:", error);
  }

  if (sliderImages.length === 0) {
    sliderImages = [
      "/sliders/1.jpg",
      "/sliders/2.jpg",
      "/sliders/3.jpg",
      "/sliders/4.jpg",
      "/sliders/5.jpg",
      "/sliders/6.jpg",
    ];
  }

  // Fetch products from database
  let dbProducts: Product[] = [];
  try {
    const [rows] = await pool.query(`
      SELECT p.*, a.name as author_name 
      FROM products p
      LEFT JOIN authors a ON p.author_id = a.id
      ORDER BY p.id DESC
      LIMIT 100
    `);

    dbProducts = (rows as any[]).map(row => {
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
        specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
        stockStatus: row.stock_status || undefined,
        isPreorder: row.is_preorder === 1 || row.is_preorder === true || false,
      };
    });
  } catch (error) {
    console.error("Database query error:", error);
  }

  // Fetch dynamic sections from database
  let homepageSections: Array<{ id: number; title: string; products: Product[]; categoryIds?: number[] }> = [];
  try {
    const [sectionsRows] = await pool.query('SELECT * FROM homepage_sections WHERE is_active = 1 ORDER BY order_num ASC');
    const sections = sectionsRows as any[];

    for (const section of sections) {
      let catIds: number[] = [];
      if (typeof section.category_ids === 'string') {
        catIds = JSON.parse(section.category_ids);
      } else if (Array.isArray(section.category_ids)) {
        catIds = section.category_ids;
      }

      let sectionProducts: Product[] = [];
      if (catIds && catIds.length > 0) {
        const [prodRows] = await pool.query(`
          SELECT p.*, a.name as author_name 
          FROM products p
          LEFT JOIN authors a ON p.author_id = a.id
          WHERE p.category_id IN (?)
          ORDER BY p.id DESC
          LIMIT ?
        `, [catIds, Number(section.limit_num || 15)]);

        sectionProducts = (prodRows as any[]).map(row => {
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
            specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
            stockStatus: row.stock_status || undefined,
            isPreorder: row.is_preorder === 1 || row.is_preorder === true || false,
          };
        });
      }

      // Fallback to mock products if no database records exist for the category
      if (sectionProducts.length === 0) {
        const titleLower = section.title.toLowerCase();
        if (titleLower.includes('ক্যালকুলেটর') || titleLower.includes('calculator')) {
          sectionProducts = allProducts.filter(p => p.category === "calculator");
        } else if (titleLower.includes('ফ্যান') || titleLower.includes('fan')) {
          sectionProducts = allProducts.filter(p => p.category === "fan");
        } else if (titleLower.includes('ঘড়ি') || titleLower.includes('clock') || titleLower.includes('watch')) {
          sectionProducts = allProducts.filter(p => p.category === "watch");
        } else if (titleLower.includes('হেডফোন') || titleLower.includes('headphone')) {
          sectionProducts = allProducts.filter(p => p.category === "headphone");
        } else {
          sectionProducts = dbProducts.slice(0, section.limit_num);
        }
      }

      homepageSections.push({
        id: section.id,
        title: section.title,
        products: sectionProducts,
        categoryIds: catIds,
      });
    }
  } catch (error) {
    console.error("Homepage sections query error:", error);
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "এলাকার বাজার",
    "url": "https://elakarbazar.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://elakarbazar.com/?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-white font-sans pt-4 pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <main className="flex w-full max-w-7xl flex-col items-stretch gap-8 px-4 sm:px-6 lg:px-8">

        {/* Slider Section */}
        <section className="w-full">
          <PromoSlider images={sliderImages} />
        </section>

        {homepageSections.map((section) => {
          const firstCatId = section.categoryIds && section.categoryIds.length > 0 ? section.categoryIds[0] : null;
          return (
            <section key={section.id} className="w-full flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">
                  {section.title}
                </h2>
                {firstCatId ? (
                  <Link
                    href={`/category/${firstCatId}`}
                    className="group flex items-center gap-1.5 text-xs font-bold text-primary bg-transparent hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-full transition-colors duration-200 border border-primary/40 hover:border-primary cursor-pointer min-w-0 h-auto"
                  >
                    সবগুলো দেখুন
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    className="group flex items-center gap-1.5 text-xs font-bold text-primary bg-transparent hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-full transition-colors duration-200 border border-primary/40 hover:border-primary cursor-pointer min-w-0 h-auto"
                  >
                    সবগুলো দেখুন
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="w-full">
                <ProductSlider products={section.products} />
              </div>
            </section>
          );
        })}

      </main>
    </div>
  );
}
