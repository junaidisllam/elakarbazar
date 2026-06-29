"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

interface ExploreProductsProps {
  initialProducts: Product[];
}

export default function ExploreProducts({ initialProducts }: ExploreProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = initialProducts.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="w-full flex flex-col gap-8 mt-12">
      {/* Title and Subtitle */}
      <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
          আপনার পছন্দের পণ্যটি খুঁজুন
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          বই কালেকশন, কুপন ডিল, ক্যালকুলেটর, পোর্টেবল ফ্যান, SMART ওয়াচ ও হেডফোনের এক বিশাল সংগ্রহ থেকে আপনার কাঙ্ক্ষিত পণ্যটি সহজে সার্চ ও ফিল্টার করুন।
        </p>
      </div>

      {/* Search and Category Filter Container */}
      <div className="flex flex-col gap-5 w-full">
        {/* 100% Width Stylized Search Box */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="এখানে পণ্যের নাম লিখে খুঁজুন..."
            aria-label="এখানে পণ্যের নাম লিখে খুঁজুন"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-12 pr-5 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        </div>

        {/* Category Filter Tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { label: "সব পণ্য", value: "All" },
            { label: "বই কালেকশন", value: "book" },
            { label: "ক্যালকুলেটর", value: "calculator" },
            { label: "মিনি ফ্যান", value: "fan" },
            { label: "স্মার্ট ওয়াচ", value: "watch" },
            { label: "হেডফোন", value: "headphone" },
            { label: "অন্যান্য", value: "other" }
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer min-w-0 h-auto border-none outline-none ${
                selectedCategory === cat.value
                  ? "bg-primary text-white shadow-sm shadow-primary/20 scale-102"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout of filtered items */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-4">
        {filteredProducts.slice(0, 24).map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-550 font-medium">
          দুঃখিত, আপনার খোঁজা পণ্যটি আমাদের তালিকায় পাওয়া যায়নি!
        </div>
      )}
    </section>
  );
}
