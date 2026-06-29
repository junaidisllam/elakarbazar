"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SearchAutocomplete from "./SearchAutocomplete";

const StarIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface CategoryItem {
  id: number;
  name: string;
}

interface AllCategoryItem {
  id: number;
  parent_id: number | null;
  name: string;
}

interface CategoryProductsFilterProps {
  initialProducts: Product[];
  categoryName: string;
  categoryId: number;
  childCategories: CategoryItem[];
  allCategories: AllCategoryItem[];
  totalCount: number;
  maxPriceLimit: number;
  currentPageParam: number;
  queryParam: string;
  priceParam: string | null;
  ratingParam: string;
  sortParam: string;
  discountParam?: string;
}

const ITEMS_PER_PAGE = 60;

export default function CategoryProductsFilter({
  initialProducts,
  categoryName,
  categoryId,
  childCategories = [],
  allCategories = [],
  totalCount,
  maxPriceLimit,
  currentPageParam,
  queryParam,
  priceParam,
  ratingParam,
  sortParam,
  discountParam = ""
}: CategoryProductsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local state for debounced/temporary search and price slider input
  const [searchVal, setSearchVal] = useState(queryParam);
  const [tempPrice, setTempPrice] = useState<number>(priceParam ? Number(priceParam) : maxPriceLimit);

  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isRatingExpanded, setIsRatingExpanded] = useState(true);
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // Sync temp state with url query parameters when they change externally
  const [localRatings, setLocalRatings] = useState<number[]>([]);
  const [localSort, setLocalSort] = useState(sortParam);
  const [localDiscount, setLocalDiscount] = useState(discountParam || "");

  useEffect(() => {
    setSearchVal(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setTempPrice(priceParam ? Number(priceParam) : maxPriceLimit);
  }, [priceParam, maxPriceLimit]);

  useEffect(() => {
    if (!ratingParam) {
      setLocalRatings([]);
    } else {
      setLocalRatings(ratingParam.split(",").map(Number).filter(r => !isNaN(r)));
    }
  }, [ratingParam]);

  useEffect(() => {
    setLocalSort(sortParam);
  }, [sortParam]);

  useEffect(() => {
    setLocalDiscount(discountParam || "");
  }, [discountParam]);

  // Helper to push updated search parameters to Next.js router
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    
    // Always reset page to 1 when filters (other than page) are updated
    if (!updates.hasOwnProperty("page")) {
      params.set("page", "1");
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Toggle ratings array and update URL
  const toggleRating = (stars: number, skipUrlUpdate = false) => {
    let nextRatings: number[];
    if (localRatings.includes(stars)) {
      nextRatings = localRatings.filter(r => r !== stars);
    } else {
      nextRatings = [...localRatings, stars];
    }
    // Update local state instantly!
    setLocalRatings(nextRatings);
    if (!skipUrlUpdate) {
      updateUrlParams({ rating: nextRatings.length > 0 ? nextRatings.join(",") : null });
    }
  };

  // Search input handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ query: searchVal });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Defer smooth scroll to next animation frame to prevent forced reflows during React commit updates
  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const frameId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(frameId);
  }, [currentPageParam]);

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      
      {/* Top Filter, Search & Result Counter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
        
        {/* Results Counter */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-extrabold text-zinc-800 leading-none">
            {totalCount} Result <span className="text-zinc-400 font-medium">({totalCount} টি পণ্য পাওয়া গেছে)</span>
          </span>
        </div>

        {/* Search & Sort Panel */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 md:flex-initial md:justify-end">
          {/* Search inside category */}
          <div className="relative w-full sm:w-60 md:w-72">
            <SearchAutocomplete
              value={searchVal}
              onChange={setSearchVal}
              onSubmit={(val) => updateUrlParams({ query: val })}
              placeholder="ক্যাটাগরির ভেতরে খুঁজুন..."
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex sm:hidden items-center justify-center gap-2 border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-50 cursor-pointer flex-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>ফিল্টার</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 flex-1 sm:flex-initial">
              <ArrowUpDown className="h-4 w-4 text-zinc-400 absolute right-3 pointer-events-none" />
              <select
                value={localSort}
                onChange={(e) => {
                  setLocalSort(e.target.value);
                  updateUrlParams({ sort: e.target.value });
                }}
                aria-label="Sort products by option"
                className="appearance-none w-full sm:w-48 pl-4 pr-10 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 bg-white cursor-pointer outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              >
                <option value="newest">Best Seller (সর্বশেষ)</option>
                <option value="price-low">দাম: কম থেকে বেশি</option>
                <option value="price-high">দাম: বেশি থেকে কম</option>
                <option value="rating">রেটিং: উচ্চ থেকে নিম্ন</option>
              </select>
            </div>
          </div>
        </form>

      </div>

      {/* Active Filter Chips */}
      {(queryParam || priceParam || ratingParam) && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-bold text-zinc-400 mr-1 select-none">প্রযুক্ত ফিল্টার:</span>
          
          {/* Search Query Chip */}
          {queryParam && (
            <div className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200/85 text-zinc-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
              <span>খুঁজুন: "{queryParam}"</span>
              <button
                onClick={() => {
                  setSearchVal("");
                  updateUrlParams({ query: null });
                }}
                className="hover:text-rose-600 ml-1 font-bold border-none bg-transparent p-0 cursor-pointer text-[10px]"
              >
                ✕
              </button>
            </div>
          )}

          {/* Price Chip */}
          {priceParam && (
            <div className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200/85 text-zinc-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
              <span>দাম: ৳ {Number(priceParam).toLocaleString("bn-BD")} এর নিচে</span>
              <button
                onClick={() => {
                  setTempPrice(maxPriceLimit);
                  updateUrlParams({ price: null });
                }}
                className="hover:text-rose-600 ml-1 font-bold border-none bg-transparent p-0 cursor-pointer text-[10px]"
              >
                ✕
              </button>
            </div>
          )}

          {/* Ratings Chips */}
          {ratingParam && ratingParam.split(",").map((starsStr) => {
            const stars = Number(starsStr);
            if (isNaN(stars)) return null;
            return (
              <div key={stars} className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200/85 text-zinc-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
                <span>{stars}★ বা বেশি</span>
                <button
                  onClick={() => {
                    const nextRatings = localRatings.filter(r => r !== stars);
                    setLocalRatings(nextRatings);
                    updateUrlParams({ rating: nextRatings.length > 0 ? nextRatings.join(",") : null });
                  }}
                  className="hover:text-rose-600 ml-1 font-bold border-none bg-transparent p-0 cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {/* Clear All Link */}
          <button
            onClick={() => {
              setSearchVal("");
              setTempPrice(maxPriceLimit);
              setLocalRatings([]);
              updateUrlParams({
                query: null,
                price: null,
                rating: null,
                page: "1"
              });
            }}
            className="text-xs font-black text-rose-600 hover:underline cursor-pointer border-none bg-transparent p-1 ml-1"
          >
            সব মুছুন
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Filters (Desktop Only) */}
        <div className="hidden md:flex md:col-span-1 flex-col gap-5">
          
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold text-zinc-900 uppercase tracking-wider">Filter (ফিল্টার)</h2>
            {(localRatings.length > 0 || queryParam !== "" || priceParam !== null || discountParam) && (
              <button
                onClick={() => {
                  setSearchVal("");
                  setLocalRatings([]);
                  setTempPrice(maxPriceLimit);
                  setLocalDiscount("");
                  updateUrlParams({
                    query: null,
                    price: null,
                    rating: null,
                    discount: null,
                    page: "1"
                  });
                }}
                className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 px-3 py-1 rounded-lg cursor-pointer transition-colors outline-none flex items-center gap-1 shadow-sm"
              >
                <span>ফিল্টার মুছুন</span>
              </button>
            )}
          </div>

          {/* Sub-categories Accordion */}
          {childCategories.length > 0 && (
            <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-zinc-300/80">
              <button
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                className="w-full flex items-center justify-between p-5 font-extrabold text-zinc-800 text-sm border-none bg-transparent outline-none cursor-pointer"
              >
                <span>Category (ক্যাটাগরি)</span>
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isCategoryExpanded ? "rotate-180" : ""}`} />
              </button>
              
              {isCategoryExpanded && (
                <div className="px-5 pb-5 flex flex-col gap-1.5 max-h-60 overflow-y-auto no-scrollbar border-t border-zinc-100 pt-4 animate-in fade-in duration-200">
                  {childCategories.map((cat) => {
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex items-center justify-between cursor-pointer group py-2 px-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                      >
                        <span className="text-xs font-bold leading-relaxed truncate text-zinc-650 group-hover:text-primary transition-colors select-none">
                          {cat.name}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-zinc-400 group-hover:text-primary transition-all -rotate-90 group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Price Range Accordion */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-zinc-300/80">
            <button
              onClick={() => setIsPriceExpanded(!isPriceExpanded)}
              className="w-full flex items-center justify-between p-5 font-extrabold text-zinc-800 text-sm border-none bg-transparent outline-none cursor-pointer"
            >
              <span>Price (দাম)</span>
              <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isPriceExpanded ? "rotate-180" : ""}`} />
            </button>

            {isPriceExpanded && (
              <div className="px-5 pb-5 flex flex-col gap-4 border-t border-zinc-100 pt-4 animate-in fade-in duration-200">
                <div className="flex flex-col gap-1.5">
                  <input
                    type="range"
                    min="0"
                    max={maxPriceLimit}
                    value={tempPrice}
                    onChange={(e) => setTempPrice(Number(e.target.value))}
                    onMouseUp={() => updateUrlParams({ price: String(tempPrice) })}
                    onTouchEnd={() => updateUrlParams({ price: String(tempPrice) })}
                    className="w-full accent-primary cursor-pointer h-1.5 bg-zinc-100 rounded-lg appearance-none"
                  />
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 px-0.5">
                    <span>৳ ০</span>
                    <span>৳ {maxPriceLimit.toLocaleString("bn-BD")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                  <span className="text-[11px] text-zinc-500 font-bold">সর্বোচ্চ বাজেট:</span>
                  <span className="text-primary text-sm font-black">৳ {tempPrice.toLocaleString("bn-BD")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Rating Accordion */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-zinc-300/80">
            <button
              onClick={() => setIsRatingExpanded(!isRatingExpanded)}
              className="w-full flex items-center justify-between p-5 font-extrabold text-zinc-800 text-sm border-none bg-transparent outline-none cursor-pointer"
            >
              <span>Rating (রেটিং)</span>
              <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isRatingExpanded ? "rotate-180" : ""}`} />
            </button>

            {isRatingExpanded && (
              <div className="px-5 pb-5 flex flex-col gap-2.5 border-t border-zinc-100 pt-4 animate-in fade-in duration-200">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const isChecked = localRatings.includes(stars);
                  return (
                    <div
                      key={stars}
                      onClick={() => toggleRating(stars)}
                      className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                        isChecked
                          ? "bg-primary border-primary text-white scale-105"
                          : "border-zinc-300 bg-white group-hover:border-primary/50"
                      }`}>
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 flex-1">
                        {Array.from({ length: stars }).map((_, i) => (
                          <StarIcon key={i} className="h-3.5 w-3.5 text-amber-500" />
                        ))}
                        {Array.from({ length: 5 - stars }).map((_, i) => (
                          <StarIcon key={i} className="h-3.5 w-3.5 text-zinc-200 fill-zinc-200/50" />
                        ))}
                      </div>
                      <span className={`text-xs font-bold leading-relaxed select-none transition-colors ${
                        isChecked ? "text-primary" : "text-zinc-600 group-hover:text-zinc-800"
                      }`}>
                        {stars}★ বা বেশি
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Discount Accordion */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-zinc-300/80">
            <button
              onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
              className="w-full flex items-center justify-between p-5 font-extrabold text-zinc-800 text-sm border-none bg-transparent outline-none cursor-pointer"
            >
              <span>Discount (ছাড়)</span>
              <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isDiscountExpanded ? "rotate-180" : ""}`} />
            </button>

            {isDiscountExpanded && (
              <div className="px-5 pb-5 flex flex-col gap-2.5 border-t border-zinc-100 pt-4 animate-in fade-in duration-200">
                {[10, 20, 30, 40, 50].map((pct) => {
                  const isChecked = localDiscount === String(pct);
                  return (
                    <div
                      key={pct}
                      onClick={() => {
                        const val = isChecked ? null : String(pct);
                        setLocalDiscount(val || "");
                        updateUrlParams({ discount: val });
                      }}
                      className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                        isChecked
                          ? "bg-primary border-primary text-white scale-105"
                          : "border-zinc-300 bg-white group-hover:border-primary/50"
                      }`}>
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-bold leading-relaxed select-none transition-colors ${
                        isChecked ? "text-primary font-black" : "text-zinc-600 group-hover:text-zinc-800"
                      }`}>
                        {pct}% বা বেশি ছাড়
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Product Grid */}
        <div className="md:col-span-3 relative">
          {isPending && (
            <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-4 relative flex-shrink-0">
              <div className="absolute top-0 h-full bg-primary rounded-full" style={{
                animation: "loading-slide 1.2s infinite ease-in-out",
                width: "35%"
              }} />
              <style>{`
                @keyframes loading-slide {
                  0% { left: -35%; }
                  50% { left: 35%; }
                  100% { left: 100%; }
                }
              `}</style>
            </div>
          )}

          {initialProducts.length > 0 ? (
            <div className="flex flex-col gap-8">
              <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isPending ? "opacity-75" : ""}`}>
                {initialProducts.map((product, index) => (
                  <ProductCard key={product.id} {...product} priority={index < 4} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (() => {
                const delta = 4;
                const pages: (number | "...")[] = [];
                const left = Math.max(2, currentPageParam - delta);
                const right = Math.min(totalPages - 1, currentPageParam + delta);

                pages.push(1);
                if (left > 2) pages.push("...");
                for (let i = left; i <= right; i++) pages.push(i);
                if (right < totalPages - 1) pages.push("...");
                if (totalPages > 1) pages.push(totalPages);

                return (
                  <div className="flex items-center justify-center gap-1 mt-8 flex-nowrap overflow-x-auto pb-1">
                    {/* Prev Button */}
                    <button
                      onClick={() => updateUrlParams({ page: String(Math.max(currentPageParam - 1, 1)) })}
                      disabled={currentPageParam === 1}
                      className="h-9 px-3.5 rounded-lg text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300 disabled:opacity-35 disabled:pointer-events-none cursor-pointer transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                    >
                      ‹ পূর্ববর্তী
                    </button>

                    {/* Page Numbers */}
                    {pages.map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-9 w-8 flex items-center justify-center text-zinc-400 text-sm flex-shrink-0 select-none"
                        >
                          ···
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => updateUrlParams({ page: String(page) })}
                          className={`h-9 w-9 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex-shrink-0 flex items-center justify-center ${
                            page === currentPageParam
                              ? "bg-primary border-primary text-white shadow-md scale-105"
                              : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300"
                          }`}
                        >
                          {(page as number).toLocaleString("bn-BD")}
                        </button>
                      )
                    )}

                    {/* Next Button */}
                    <button
                      onClick={() => updateUrlParams({ page: String(Math.min(currentPageParam + 1, totalPages)) })}
                      disabled={currentPageParam === totalPages}
                      className="h-9 px-3.5 rounded-lg text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300 disabled:opacity-35 disabled:pointer-events-none cursor-pointer transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                    >
                      পরবর্তী ›
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 text-zinc-500 font-bold shadow-sm">
              দুঃখিত, এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি!
            </div>
          )}
        </div>

      </div>

      {/* Sticky Mobile Filter/Sort Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-3.5 flex gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition-all cursor-pointer border-none"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>ফিল্টার</span>
        </button>
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition-all cursor-pointer border-none"
        >
          <ArrowUpDown className="h-4 w-4 text-zinc-500" />
          <span>সাজান</span>
        </button>
      </div>

      {/* Custom styles for mobile drawers */}
      <style>{`
        @keyframes drawer-slide-up {
          from { transform: translate3d(0, 100%, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      {/* Mobile Drawer Backdrops */}
      {(isMobileFiltersOpen || isMobileSortOpen) && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden animate-in fade-in duration-200"
          onClick={() => {
            setIsMobileFiltersOpen(false);
            setIsMobileSortOpen(false);
          }}
        />
      )}

      {/* Mobile Sort Sheet */}
      {isMobileSortOpen && (
        <div 
          className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-8 px-5 pt-3"
          style={{ animation: "drawer-slide-up 0.25s ease-out" }}
        >
          <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto my-2" />
          <div className="flex items-center justify-between py-2 mb-4">
            <span className="text-base font-extrabold text-zinc-950">সাজান (Sort By)</span>
            <button onClick={() => setIsMobileSortOpen(false)} className="text-zinc-400 font-bold text-xs p-1 border-none bg-transparent outline-none cursor-pointer">বন্ধ করুন</button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { value: "newest", label: "Best Seller (সর্বশেষ)" },
              { value: "price-low", label: "দাম: কম থেকে বেশি" },
              { value: "price-high", label: "দাম: বেশি থেকে কম" },
              { value: "rating", label: "রেটিং: উচ্চ থেকে নিম্ন" }
            ].map((opt) => {
              const isActive = localSort === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setLocalSort(opt.value);
                    updateUrlParams({ sort: opt.value });
                    setIsMobileSortOpen(false);
                  }}
                  className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-all border-none flex items-center justify-between cursor-pointer ${
                    isActive ? "bg-primary/5 text-primary" : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Filters Sheet */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col max-h-[85vh]"
          style={{ animation: "drawer-slide-up 0.25s ease-out" }}
        >
          <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto my-3 flex-shrink-0" />
          <div className="flex items-center justify-between px-5 pb-3 border-b border-zinc-100 flex-shrink-0">
            <span className="text-base font-extrabold text-zinc-950 font-black">ফিল্টারসমূহ</span>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="text-zinc-400 font-bold text-xs p-1 border-none bg-transparent outline-none cursor-pointer">বন্ধ করুন</button>
          </div>
          
          {/* Scrollable Filters */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28 no-scrollbar">
            {/* Subcategories (if any) */}
            {childCategories.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Category (ক্যাটাগরি)</h4>
                <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth snap-x">
                  {childCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="snap-start flex-shrink-0 flex items-center justify-center px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 active:bg-zinc-100 transition-all no-underline text-xs font-bold text-zinc-700 whitespace-nowrap"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Price Slider */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Price (দাম)</h4>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100/80 space-y-3">
                <input
                  type="range"
                  min="0"
                  max={maxPriceLimit}
                  value={tempPrice}
                  onChange={(e) => setTempPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                />
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 px-0.5">
                  <span>৳ ০</span>
                  <span>৳ {maxPriceLimit.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-200/50">
                  <span className="text-[11px] text-zinc-500 font-bold">সর্বোচ্চ বাজেট:</span>
                  <span className="text-primary text-sm font-black">৳ {tempPrice.toLocaleString("bn-BD")}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Rating (রেটিং)</h4>
              <div className="grid grid-cols-1 gap-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const isChecked = localRatings.includes(stars);
                  return (
                    <div
                      key={stars}
                      onClick={() => toggleRating(stars, true)}
                      className={`flex items-center gap-3 cursor-pointer py-2.5 px-3 rounded-xl border transition-all ${
                        isChecked 
                          ? "bg-primary/5 border-primary/30" 
                          : "bg-zinc-50 border-zinc-150 hover:bg-zinc-100"
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                        isChecked
                          ? "bg-primary border-primary text-white scale-105"
                          : "border-zinc-300 bg-white"
                      }`}>
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 flex-1">
                        {Array.from({ length: stars }).map((_, i) => (
                          <StarIcon key={i} className="h-3.5 w-3.5 text-amber-500" />
                        ))}
                        {Array.from({ length: 5 - stars }).map((_, i) => (
                          <StarIcon key={i} className="h-3.5 w-3.5 text-zinc-200 fill-zinc-200/50" />
                        ))}
                      </div>
                      <span className={`text-xs font-bold leading-none select-none transition-colors ${
                        isChecked ? "text-primary font-black" : "text-zinc-650"
                      }`}>
                        {stars}★ বা বেশি
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Discount */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Discount (ছাড়)</h4>
              <div className="grid grid-cols-1 gap-2">
                {[10, 20, 30, 40, 50].map((pct) => {
                  const isChecked = localDiscount === String(pct);
                  return (
                    <div
                      key={pct}
                      onClick={() => {
                        setLocalDiscount(isChecked ? "" : String(pct));
                      }}
                      className={`flex items-center gap-3 cursor-pointer py-2.5 px-3 rounded-xl border transition-all ${
                        isChecked 
                          ? "bg-primary/5 border-primary/30" 
                          : "bg-zinc-50 border-zinc-150 hover:bg-zinc-100"
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                        isChecked
                          ? "bg-primary border-primary text-white scale-105"
                          : "border-zinc-300 bg-white"
                      }`}>
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-bold leading-none select-none transition-colors ${
                        isChecked ? "text-primary font-black" : "text-zinc-650"
                      }`}>
                        {pct}% বা বেশি ছাড়
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Drawer Actions */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-zinc-100 p-4 flex gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setSearchVal("");
                setTempPrice(maxPriceLimit);
                setLocalRatings([]);
                setLocalDiscount("");
                updateUrlParams({
                  query: null,
                  price: null,
                  rating: null,
                  discount: null,
                  page: "1"
                });
                setIsMobileFiltersOpen(false);
              }}
              disabled={!(localRatings.length > 0 || queryParam !== "" || priceParam !== null || discountParam !== "")}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 disabled:opacity-50 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            >
              মুছে ফেলুন
            </button>
            <button
              onClick={() => {
                updateUrlParams({
                  price: String(tempPrice),
                  rating: localRatings.length > 0 ? localRatings.join(",") : null,
                  discount: localDiscount ? localDiscount : null
                });
                setIsMobileFiltersOpen(false);
              }}
              className="flex-[2] bg-primary text-white py-3 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              প্রয়োগ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
