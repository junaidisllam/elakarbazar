import Link from "next/link";
import { 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  CheckCircle2,
  Home,
  ChevronRight,
  Clock,
  XCircle
} from "lucide-react";
import { Product } from "@/data/products";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import ProductTabs from "@/components/ProductTabs";
import ProductReviews from "@/components/ProductReviews";
import ProductFAQs from "@/components/ProductFAQs";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductHighlights from "@/components/ProductHighlights";
import pool from "@/lib/db";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const [rows] = await pool.query(
      `SELECT p.title, p.english_title, p.meta_description, p.description, p.cover_image_url, p.product_type, a.name as author_name
       FROM products p
       LEFT JOIN authors a ON p.author_id = a.id
       WHERE p.slug = ? LIMIT 1`,
      [decodedSlug]
    );
    const productRows = rows as any[];
    if (productRows.length > 0) {
      const row = productRows[0];
      
      // Dynamic Title: 
      // Book: "বইয়ের নাম: লেখকের নাম - Book English Title: Author English Name | elakarbazar.com"
      // Non-book: "পণ্য নাম - দাম ও অফার | elakarbazar.com"
      let titleStr = "";
      if (row.product_type === 'book') {
        const authorPart = row.author_name ? `: ${row.author_name}` : "";
        const hasEnglishTitle = row.english_title && row.english_title.trim() !== "";
        const containsBengali = hasEnglishTitle && /[\u0980-\u09FF]/.test(row.english_title);
        const englishPart = (hasEnglishTitle && !containsBengali) ? ` - ${row.english_title}` : "";
        titleStr = `${row.title}${authorPart}${englishPart} | Elakarbazar.com`;
      } else {
        titleStr = row.title;
      }

      // Meta Description
      const desc = row.meta_description || (row.description
        ? row.description.substring(0, 160) + "..."
        : `${row.title} এর সেরা অফার ও দাম জানুন আমাদের ওয়েবসাইট থেকে।`);

      return {
        title: titleStr,
        description: desc,
        alternates: {
          canonical: `https://elakarbazar.com/product/${slug}`,
        },
        openGraph: {
          title: titleStr,
          description: desc,
          images: [{ url: row.cover_image_url || "", width: 600, height: 800, alt: row.title }],
          type: "website",
          siteName: "এলাকার বাজার",
        },
        twitter: {
          card: "summary_large_image",
          title: titleStr,
          description: desc,
          images: [row.cover_image_url || ""],
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-video-preview": -1,
            "max-snippet": -1,
          },
        },
      };
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }

  return {
    title: "পণ্য বিস্তারিত | এলাকার বাজার",
    description: "এলাকার বাজার থেকে পণ্যের সেরা অফার ও দাম জানুন।",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Await params as per Next.js 15/16 Server Component conventions
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch product from database by slug
  let product: Product | null = null;
  let productIdNum = 0;
  try {
    const [rows] = await pool.query(`
      SELECT p.*, a.name as author_name, c.display_name as category_name
      FROM products p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [decodedSlug]);

    const productRows = rows as any[];
    if (productRows.length > 0) {
      const row = productRows[0];
      productIdNum = row.id;
      const discountPercentage = row.original_price && row.current_price
        ? Math.round(((Number(row.original_price) - Number(row.current_price)) / Number(row.original_price)) * 100)
        : 0;

      let finalUrl = row.affiliate_link || "";

      product = {
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
        reviewSummary: row.review_summary || undefined,
        affiliate_link: finalUrl || undefined,
        categoryName: row.category_name || undefined,
        categoryId: row.category_id || undefined,
        stockStatus: row.stock_status || undefined,
        isPreorder: row.is_preorder === 1 || row.is_preorder === true || false,
        variants: row.variants ? JSON.parse(row.variants) : undefined,
      };
    }
  } catch (error) {
    console.error("Database query error for product detail:", error);
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-800">পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
        <p className="text-zinc-500 text-sm">হয়তো পণ্যটি আমাদের তালিকা থেকে সরিয়ে নেওয়া হয়েছে.</p>
        <Link href="/">
          <button className="bg-primary text-white font-bold px-6 py-2 rounded-xl border-none outline-none cursor-pointer">
            হোম পেজে ফিরে যান
          </button>
        </Link>
      </div>
    );
  }

  // Fetch gallery images, reviews, Q&As
  let dbGalleryImages: string[] = [];
  let dbReviews: any[] = [];
  let dbFaqs: any[] = [];

  try {
    // 1. Fetch gallery images
    const [imagesRows] = await pool.query(
      "SELECT image_url FROM product_images WHERE product_id = ?",
      [productIdNum]
    );
    dbGalleryImages = (imagesRows as any[]).map(row => row.image_url);
    if (product.image) {
      dbGalleryImages = [product.image, ...dbGalleryImages.filter(img => img !== product.image)];
    }

    // 2. Fetch reviews
    const [reviewsRows] = await pool.query(
      "SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC",
      [productIdNum]
    );
    const reviewsList = reviewsRows as any[];
    
    // Fetch review images
    let reviewImagesMap: Record<number, string[]> = {};
    if (reviewsList.length > 0) {
      const reviewIds = reviewsList.map(r => r.id);
      try {
        const [imagesRows] = await pool.query(
          "SELECT review_id, image_url FROM review_images WHERE review_id IN (?)",
          [reviewIds]
        );
        (imagesRows as any[]).forEach(row => {
          if (!reviewImagesMap[row.review_id]) {
            reviewImagesMap[row.review_id] = [];
          }
          reviewImagesMap[row.review_id].push(row.image_url);
        });
      } catch (imgErr) {
        console.error("Error fetching review images:", imgErr);
      }
    }

    dbReviews = reviewsList.map(row => ({
      name: row.username || 'Anonymous',
      rating: Number(row.rating || 5),
      date: row.review_date || new Date(row.created_at).toLocaleDateString('bn-BD'),
      text: row.comment || '',
      helpful: Number(row.likes || 0),
      images: reviewImagesMap[row.id] || [],
      profilePicture: row.profile_picture || null
    }));

    // 3. Fetch questions and answers
    const [qaRows] = await pool.query(
      "SELECT * FROM questions_and_answers WHERE product_id = ? ORDER BY id DESC",
      [productIdNum]
    );
    dbFaqs = (qaRows as any[]).map(row => ({
      q: row.question || '',
      a: row.answer || ''
    }));
  } catch (err) {
    console.error("Error fetching product sub-tables:", err);
  }

  // Get similar products from database (same product_type/category, excluding current product)
  let similarProducts: Product[] = [];
  try {
    const [similarRows] = await pool.query(`
      SELECT p.*, a.name as author_name 
      FROM products p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.product_type = ? AND p.id != ?
      ORDER BY p.id DESC
      LIMIT 20
    `, [product.category, productIdNum]);

    similarProducts = (similarRows as any[]).map(row => {
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
        reviewSummary: row.review_summary || undefined,
      };
    });
  } catch (err) {
    console.error("Error fetching similar products:", err);
  }

  // Determine dynamic stock display
  let stockLabel = "স্টকে আছে";
  let stockColor = "text-emerald-600";
  let StockIcon = CheckCircle2;

  if (product.isPreorder) {
    stockLabel = "প্রি-অর্ডার (Pre-order)";
    stockColor = "text-blue-600";
    StockIcon = Clock;
  } else if (
    product.stockStatus && 
    (product.stockStatus.toLowerCase().includes("out of stock") || 
     product.stockStatus.toLowerCase().includes("stock out") || 
     product.stockStatus.toLowerCase().includes("out of print") ||
     product.stockStatus.toLowerCase().includes("অফ স্টক") ||
     product.stockStatus.toLowerCase().includes("স্টক আউট"))
  ) {
    stockLabel = "স্টক আউট (Stock Out)";
    stockColor = "text-rose-600";
    StockIcon = XCircle;
  } else if (product.stockStatus) {
    stockLabel = product.stockStatus
      .replace(/In Stock/g, "স্টকে আছে")
      .replace(/only/g, "মাত্র")
      .replace(/copies left/g, "টি বাকি আছে")
      .replace(/copies available/g, "টি উপলব্ধ আছে")
      .replace(/copy left/g, "টি বাকি আছে");
  }

  // Parse rating value and determine styling based on rating ranking
  const getRatingNumber = (ratingStr: string): number => {
    if (!ratingStr) return 0;
    const banglaToEnglish: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    let cleanStr = ratingStr;
    for (const [bn, en] of Object.entries(banglaToEnglish)) {
      cleanStr = cleanStr.replace(new RegExp(bn, 'g'), en);
    }
    const match = cleanStr.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const ratingVal = getRatingNumber(product.rating);
  const ratingStyle = ratingVal >= 4.5 
    ? { container: "bg-emerald-50 border-emerald-200 text-emerald-700", star: "fill-emerald-500 text-emerald-500" }
    : ratingVal >= 4.0
      ? { container: "bg-amber-50 border-amber-200 text-amber-700", star: "fill-amber-400 text-amber-400" }
      : { container: "bg-rose-50 border-rose-200 text-rose-700", star: "fill-rose-500 text-rose-500" };

  const priceNumeric = product.price ? parseFloat(product.price.replace(/[^\d]/g, "")) || 0 : 0;
  
  // 1. Product JSON-LD Schema
  const schemaData: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.description || product.title,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.author || "Elakar Bazar"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://elakarbazar.com/product/${product.slug}`,
      "priceCurrency": "BDT",
      "price": priceNumeric,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stockStatus?.toLowerCase().includes("out") 
        ? "https://schema.org/OutOfStock" 
        : "https://schema.org/InStock"
    }
  };

  // Populate aggregateRating if rating and reviews are present
  if (product.rating && parseFloat(product.rating) > 0 && product.reviews && parseInt(product.reviews) > 0) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // Populate individual reviews in schema
  if (dbReviews && dbReviews.length > 0) {
    schemaData.review = dbReviews.slice(0, 5).map((r: any) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.name || "Anonymous"
      },
      "datePublished": r.date || new Date().toISOString().split('T')[0],
      "reviewBody": r.text || "",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": String(r.rating || 5),
        "bestRating": "5",
        "worstRating": "1"
      }
    }));
  }

  // 2. FAQPage JSON-LD Schema
  const faqSchema = dbFaqs && dbFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dbFaqs.map((f: any) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  } : null;

  return (
    <main className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 mb-4 px-4 sm:px-0 font-medium">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>হোম</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
          <Link href={product.categoryId ? `/category/${product.categoryId}` : `/?category=${product.category}`} className="hover:text-primary transition-colors">
            {product.category === 'book' ? 'বই কালেকশন' : 
             product.category === 'calculator' ? 'ক্যালকুলেটর' :
             product.category === 'fan' ? 'মিনি ফ্যান' :
             product.category === 'watch' ? 'ঘড়ি কালেকশন' :
             product.category === 'headphone' ? 'প্রিমিয়াম হেডফোন' :
             (product.category === 'product' && product.categoryName) ? product.categoryName : 'অন্যান্য'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
          <span className="text-zinc-800 font-bold truncate max-w-[150px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-none border-x-0 border-y border-zinc-200 sm:rounded-3xl sm:border p-4 sm:p-6 lg:p-8 shadow-none sm:shadow-sm mb-6 sm:mb-12 items-start">
          
          {/* Left Column: Product Image Gallery */}
          <div className="md:col-span-5 w-full">
            <ProductImageGallery
              primaryImage={product.image}
              title={product.title}
              category={product.category}
              discount={product.discount}
              galleryImages={dbGalleryImages.length > 0 ? dbGalleryImages : undefined}
              isPreorder={product.isPreorder}
            />
          </div>

          {/* Right Column: Product Information */}
          <div className="md:col-span-7 flex flex-col gap-3 justify-start">
            
            {/* Category Tag */}
            <div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category === 'book' ? 'বই কালেকশন' : 
                 product.category === 'calculator' ? 'ক্যালকুলেটর' :
                 product.category === 'fan' ? 'মিনি ফ্যান' :
                 product.category === 'watch' ? 'ঘড়ি কালেকশন' :
                 product.category === 'headphone' ? 'প্রিমিয়াম হেডফোন' :
                 (product.category === 'product' && product.categoryName) ? product.categoryName : 'অন্যান্য'}
              </span>
            </div>

            {/* Title & Author */}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-900 leading-tight">
                {product.title}
              </h1>
              {product.author && (
                <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                  {product.category === 'product' ? 'Brand' : 'লেখক'}: <span className="text-zinc-800 font-bold">{product.author}</span>
                </p>
              )}
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className={`flex items-center gap-1 border px-2 py-0.5 rounded-lg ${ratingStyle.container}`}>
                <Star className={`h-3.5 w-3.5 ${ratingStyle.star}`} />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-zinc-400 font-medium">({product.reviews} টি কাস্টমার রিভিউ)</span>
              <span className="text-zinc-300">|</span>
              <span className={`${stockColor} font-bold flex items-center gap-1`}>
                <StockIcon className="h-3.5 w-3.5" /> {stockLabel}
              </span>
            </div>

            {/* Pricing Section */}
            {/* Highlights Section */}
            {product.highlights && product.highlights.length > 0 && (
              <ProductHighlights highlights={product.highlights} />
            )}

            {/* Action buttons and Quantity selectors (Client side) */}
            <ProductActions 
              productId={product.id}
              productTitle={product.title}
              productCategory={product.category}
              affiliate_link={product.affiliate_link} 
              variants={product.variants}
              defaultPrice={product.price}
              defaultOriginalPrice={product.originalPrice}
              defaultDiscount={product.discount}
              defaultStockLabel={stockLabel}
              defaultStockColor={stockColor}
              isPreorder={product.isPreorder}
            />

            {/* Services / Selling Points */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4 mt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-zinc-700 font-bold">
                <Truck className="h-4 w-4 text-primary" />
                <span>দ্রুত ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-700 font-bold">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>৭ দিনের রিটার্ন</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-700 font-bold">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>১০০% অথেনটিক</span>
              </div>
            </div>

          </div>
        </div>

        {/* Sub-sections stretch full width on mobile like native app */}
        <div className="px-0 sm:px-0">
          {/* Product Information Tabs (Summary & Specs) */}
          <ProductTabs product={product} />

          {/* Review & Rating Section */}
          <section className="w-full flex flex-col gap-6 mt-12 mb-12">
            <div className="border-b border-zinc-200 pb-3 px-4 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-sans">
                রিভিউ ও রেটিং (Review & Rating)
              </h2>
            </div>
            <ProductReviews product={product} dbReviews={dbReviews} />
          </section>

          {/* Q/A Section */}
          <section className="w-full flex flex-col gap-6 mt-12 mb-12">
            <div className="border-b border-zinc-200 pb-3 px-4 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-sans">
                প্রশ্ন ও উত্তর (Q/A)
              </h2>
            </div>
            <ProductFAQs product={product} dbFaqs={dbFaqs} />
          </section>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <section className="w-full flex flex-col gap-6 mt-4">
              <div className="flex items-center justify-between px-4 sm:px-2">
                <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">
                  সাদৃশ্যপূর্ণ পণ্যসমূহ (Similar Products)
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0">
                {similarProducts.map((item, index) => (
                  <ProductCard key={index} {...item} />
                ))}
              </div>
            </section>
          )}
        </div>

      </div>
    </main>
  );
}
