"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Loader2, LayoutGrid, User, Store, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface SuggestionProduct {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number | null;
  originalPrice: number | null;
  author: string | null;
}

interface SuggestionCategory {
  id: string;
  name: string;
  slug: string;
}

interface SuggestionAuthorPublisher {
  id: string;
  name: string;
  image: string | null;
}

interface NavigableItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  type: "product" | "category" | "author" | "publisher";
  slug?: string;
  price?: number | null;
  originalPrice?: number | null;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const POPULAR_TAGS = [
  "হুমায়ূন আহমেদ",
  "ক্যালকুলেটর",
  "ইসলামি বই",
  "সায়েন্স ফিকশন",
  "ভর্তি প্রস্তুতি",
  "English Grammar"
];

export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder = "Search deals...",
  className = "",
}: SearchAutocompleteProps) {
  const [data, setData] = useState<{
    products: SuggestionProduct[];
    categories: SuggestionCategory[];
    authors: SuggestionAuthorPublisher[];
    publishers: SuggestionAuthorPublisher[];
  }>({ products: [], categories: [], authors: [], publishers: [] });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Viewport detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autofocus mobile input when modal slides in
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 150);
    }
  }, [isMobileSearchOpen]);

  // Debounce API calls
  useEffect(() => {
    if (!value.trim()) {
      setData({ products: [], categories: [], authors: [], publishers: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(value.trim())}`);
        const result = await res.json();
        setData({
          products: result.products || [],
          categories: result.categories || [],
          authors: result.authors || [],
          publishers: result.publishers || [],
        });
      } catch (error) {
        console.error("Autocomplete fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  // Click outside detection (Desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build navigable items
  const navigableItems = useMemo(() => {
    const items: NavigableItem[] = [];

    data.categories.forEach((c) => {
      items.push({
        id: `cat-${c.id}`,
        title: c.name,
        type: "category",
        slug: String(c.id),
      });
    });

    data.authors.forEach((a) => {
      items.push({
        id: `auth-${a.id}`,
        title: a.name,
        image: a.image,
        type: "author",
      });
    });

    data.publishers.forEach((p) => {
      items.push({
        id: `pub-${p.id}`,
        title: p.name,
        image: p.image,
        type: "publisher",
      });
    });

    data.products.forEach((p) => {
      items.push({
        id: `prod-${p.id}`,
        title: p.title,
        subtitle: p.author || undefined,
        image: p.image,
        type: "product",
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
      });
    });

    return items;
  }, [data]);

  const handleItemSelect = (item: NavigableItem) => {
    setIsOpen(false);
    setIsMobileSearchOpen(false);
    if (item.type === "product") {
      router.push(`/product/${item.slug}`);
    } else if (item.type === "category") {
      router.push(`/category/${item.slug}`);
    } else if (item.type === "author" || item.type === "publisher") {
      router.push(`/categories?query=${encodeURIComponent(item.title)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < navigableItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < navigableItems.length) {
        e.preventDefault();
        handleItemSelect(navigableItems[activeIndex]);
      } else if (value.trim() && onSubmit) {
        e.preventDefault();
        setIsOpen(false);
        setIsMobileSearchOpen(false);
        onSubmit(value.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const getGlobalIndex = (id: string) => {
    return navigableItems.findIndex((item) => item.id === id);
  };

  const hasSuggestions = navigableItems.length > 0;

  // Handle mobile focus trigger
  const handleTriggerFocus = () => {
    if (isMobile) {
      setIsMobileSearchOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (!isMobile) {
              onChange(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }
          }}
          onFocus={handleTriggerFocus}
          onClick={handleTriggerFocus}
          onKeyDown={handleKeyDown}
          readOnly={isMobile} // Input acts as a modal trigger on mobile viewports
          className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-10 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700 cursor-pointer md:cursor-text"
        />
        {!isMobile && isLoading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
          </div>
        )}
      </div>

      {/* Desktop Autocomplete Panel */}
      {!isMobile && isOpen && (hasSuggestions || isLoading) && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl border border-zinc-100 bg-white/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 dark:border-zinc-800 dark:bg-zinc-900/95 max-h-[420px] overflow-y-auto custom-scrollbar">
          {isLoading && !hasSuggestions ? (
            <div className="flex items-center justify-center py-8 text-xs text-zinc-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>লোডিং...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Category Results */}
              {data.categories.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-xs font-extrabold text-zinc-400 dark:text-zinc-500 px-3 py-1.5 uppercase tracking-wider">
                    ক্যাটাগরিসমূহ
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {data.categories.map((c) => {
                      const itemId = `cat-${c.id}`;
                      const globalIdx = getGlobalIndex(itemId);
                      const isActive = globalIdx === activeIndex;
                      return (
                        <div
                          key={itemId}
                          onClick={() => handleItemSelect(navigableItems[globalIdx])}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-150 ${
                            isActive
                              ? "bg-primary/5 text-primary font-bold"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <LayoutGrid className="h-4 w-4 text-zinc-400" />
                          <span className="text-xs sm:text-sm">{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Author & Publisher Results */}
              {(data.authors.length > 0 || data.publishers.length > 0) && (
                <div>
                  <div className="text-[10px] sm:text-xs font-extrabold text-zinc-400 dark:text-zinc-500 px-3 py-1.5 uppercase tracking-wider border-t border-zinc-100/50 pt-2.5">
                    লেখক ও প্রকাশক
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {data.authors.map((a) => {
                      const itemId = `auth-${a.id}`;
                      const globalIdx = getGlobalIndex(itemId);
                      const isActive = globalIdx === activeIndex;
                      return (
                        <div
                          key={itemId}
                          onClick={() => handleItemSelect(navigableItems[globalIdx])}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-150 ${
                            isActive
                              ? "bg-primary/5 text-primary font-bold"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <div className="relative h-6 w-6 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                            {a.image ? (
                              <img
                                src={a.image}
                                alt={a.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-3.5 w-3.5 text-zinc-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm">{a.name} <span className="text-[10px] text-zinc-400 font-normal">(লেখক)</span></span>
                        </div>
                      );
                    })}
                    {data.publishers.map((p) => {
                      const itemId = `pub-${p.id}`;
                      const globalIdx = getGlobalIndex(itemId);
                      const isActive = globalIdx === activeIndex;
                      return (
                        <div
                          key={itemId}
                          onClick={() => handleItemSelect(navigableItems[globalIdx])}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-150 ${
                            isActive
                              ? "bg-primary/5 text-primary font-bold"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <div className="relative h-6 w-6 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Store className="h-3.5 w-3.5 text-zinc-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm">{p.name} <span className="text-[10px] text-zinc-400 font-normal">(প্রকাশক)</span></span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Results */}
              {data.products.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-xs font-extrabold text-zinc-400 dark:text-zinc-500 px-3 py-1.5 uppercase tracking-wider border-t border-zinc-100/50 pt-2.5">
                    পণ্যসমূহ
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {data.products.map((p) => {
                      const itemId = `prod-${p.id}`;
                      const globalIdx = getGlobalIndex(itemId);
                      const isActive = globalIdx === activeIndex;
                      return (
                        <div
                          key={itemId}
                          onClick={() => handleItemSelect(navigableItems[globalIdx])}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-150 ${
                            isActive
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold truncate">
                              {p.title}
                            </h4>
                            {p.author && (
                              <p className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                                {p.author}
                              </p>
                            )}
                          </div>

                          {p.price && (
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs sm:text-sm font-extrabold text-primary">
                                ৳{p.price}
                              </span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <p className="text-[10px] text-zinc-400 line-through">
                                  ৳{p.originalPrice}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Sliding Full-Screen Search Modal (Right-to-Left Transition via React Portal) */}
      {isMobile && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-white flex flex-col transition-transform duration-300 ease-out"
          style={{
            transform: isMobileSearchOpen ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          {isMobileSearchOpen && (
            <>
              {/* Header Row Form (Allows Virtual Keyboard Enter Submission) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (value.trim() && onSubmit) {
                    setIsMobileSearchOpen(false);
                    onSubmit(value.trim());
                  }
                }}
                className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-100/80 bg-white flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-zinc-50 active:scale-95 transition-all text-zinc-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    ref={mobileInputRef}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                      setActiveIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-9 text-sm text-zinc-800 outline-none focus:border-primary focus:bg-white transition-all"
                  />
                  {value.trim() !== "" && (
                    <button
                      type="button"
                      onClick={() => onChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                
                {onSubmit && value.trim() !== "" && (
                  <button
                    type="submit"
                    className="text-xs font-bold text-primary px-2 py-2"
                  >
                    খুঁজুন
                  </button>
                )}
              </form>

              {/* Search Content */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-zinc-50/30">
                {isLoading && !hasSuggestions ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs">লোডিং...</span>
                  </div>
                ) : hasSuggestions ? (
                  <div className="flex flex-col gap-4">
                    {/* Categories */}
                    {data.categories.length > 0 && (
                      <div className="bg-white rounded-2xl p-3 border border-zinc-100 shadow-sm">
                        <div className="text-[10px] font-extrabold text-zinc-400 px-1 pb-2 uppercase tracking-wider">
                          ক্যাটাগরিসমূহ
                        </div>
                        <div className="flex flex-col">
                          {data.categories.map((c) => {
                            const itemId = `cat-${c.id}`;
                            const globalIdx = getGlobalIndex(itemId);
                            return (
                              <div
                                key={itemId}
                                onClick={() => handleItemSelect(navigableItems[globalIdx])}
                                className="flex items-center gap-3 py-3 px-1 border-b border-zinc-50 last:border-b-0 active:bg-zinc-50/60 rounded-xl"
                              >
                                <LayoutGrid className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm font-semibold text-zinc-800">{c.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Authors & Publishers */}
                    {(data.authors.length > 0 || data.publishers.length > 0) && (
                      <div className="bg-white rounded-2xl p-3 border border-zinc-100 shadow-sm">
                        <div className="text-[10px] font-extrabold text-zinc-400 px-1 pb-2 uppercase tracking-wider">
                          লেখক ও প্রকাশক
                        </div>
                        <div className="flex flex-col">
                          {data.authors.map((a) => {
                            const itemId = `auth-${a.id}`;
                            const globalIdx = getGlobalIndex(itemId);
                            return (
                              <div
                                key={itemId}
                                onClick={() => handleItemSelect(navigableItems[globalIdx])}
                                className="flex items-center gap-3 py-3 px-1 border-b border-zinc-50 last:border-b-0 active:bg-zinc-50/60 rounded-xl"
                              >
                                <div className="relative h-7 w-7 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                                  {a.image ? (
                                    <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <User className="h-4 w-4 text-zinc-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </div>
                                <span className="text-sm font-semibold text-zinc-800">{a.name} <span className="text-[10px] text-zinc-400 font-normal">(লেখক)</span></span>
                              </div>
                            );
                          })}
                          {data.publishers.map((p) => {
                            const itemId = `pub-${p.id}`;
                            const globalIdx = getGlobalIndex(itemId);
                            return (
                              <div
                                key={itemId}
                                onClick={() => handleItemSelect(navigableItems[globalIdx])}
                                className="flex items-center gap-3 py-3 px-1 border-b border-zinc-50 last:border-b-0 active:bg-zinc-50/60 rounded-xl"
                              >
                                <div className="relative h-7 w-7 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                                  {p.image ? (
                                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Store className="h-4 w-4 text-zinc-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </div>
                                <span className="text-sm font-semibold text-zinc-800">{p.name} <span className="text-[10px] text-zinc-400 font-normal">(প্রকাশক)</span></span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Products */}
                    {data.products.length > 0 && (
                      <div className="bg-white rounded-2xl p-3 border border-zinc-100 shadow-sm">
                        <div className="text-[10px] font-extrabold text-zinc-400 px-1 pb-2 uppercase tracking-wider">
                          পণ্যসমূহ
                        </div>
                        <div className="flex flex-col gap-1">
                          {data.products.map((p) => {
                            const itemId = `prod-${p.id}`;
                            const globalIdx = getGlobalIndex(itemId);
                            return (
                              <div
                                key={itemId}
                                onClick={() => handleItemSelect(navigableItems[globalIdx])}
                                className="flex items-center gap-3 py-2 px-1 border-b border-zinc-50 last:border-b-0 active:bg-zinc-50 rounded-xl"
                              >
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-100">
                                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-zinc-800 truncate">{p.title}</h4>
                                  {p.author && <p className="text-[10px] text-zinc-400 truncate mt-0.5">{p.author}</p>}
                                </div>
                                {p.price && (
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-xs font-extrabold text-primary">৳{p.price}</span>
                                    {p.originalPrice && p.originalPrice > p.price && (
                                      <p className="text-[9px] text-zinc-400 line-through">৳{p.originalPrice}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty Search / Popular Searches State */
                  <div className="py-2">
                    <div className="text-xs font-extrabold text-zinc-400 mb-3 px-1 uppercase tracking-wider">
                      জনপ্রিয় অনুসন্ধান
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            onChange(tag);
                            if (mobileInputRef.current) {
                              mobileInputRef.current.value = tag;
                            }
                          }}
                          className="px-4 py-2 bg-white hover:bg-zinc-50 active:scale-95 border border-zinc-100 text-zinc-700 text-xs rounded-full transition-all font-semibold shadow-sm"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
