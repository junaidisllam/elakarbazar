"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import ProductSpecifications from "./ProductSpecifications";
import { FileText, ClipboardList } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "specs">("summary");
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { id: "summary" as const, label: "সারসংক্ষেপ (Summary)", icon: FileText },
    { id: "specs" as const, label: "স্পেসিফিকেশন (Specification)", icon: ClipboardList },
  ];

  const isLongDescription = product.description && (product.description.length > 300 || product.description.split('\n').length > 8);

  if (product.category === "product") {
    return (
      <div className="w-full flex flex-col gap-6 mt-8">
        {/* Specification Section */}
        <div>
          <ProductSpecifications product={product} />
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-none border-x-0 border-y border-zinc-200 sm:rounded-2xl sm:border p-4 sm:p-6 shadow-none sm:shadow-sm animate-fade-in">
          <h3 className="font-bold text-zinc-800 text-base mb-3.5">পণ্য সারসংক্ষেপ (Summary)</h3>
          <p className={`text-zinc-600 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line ${isLongDescription && !isExpanded ? "line-clamp-[8]" : ""}`}>
            {product.description}
          </p>
          {isLongDescription && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center gap-1.5 px-6 py-2 text-xs sm:text-sm font-bold text-primary border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary hover:text-white rounded-full transition-all duration-200 cursor-pointer outline-none shadow-sm"
              >
                {isExpanded ? "কম দেখুন" : "আরও দেখুন"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 mt-8">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-200 gap-2 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 px-2 text-sm sm:text-base font-bold transition-all relative border-none outline-none bg-transparent cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "text-primary" 
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="w-full transition-all duration-300">
        {activeTab === "summary" && (
          <div className="animate-fade-in bg-white rounded-none border-x-0 border-y border-zinc-200 sm:rounded-2xl sm:border p-4 sm:p-6 shadow-none sm:shadow-sm">
            <h3 className="font-bold text-zinc-800 text-base mb-3.5">পণ্য সারসংক্ষেপ (Summary)</h3>
            <p className={`text-zinc-600 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line ${isLongDescription && !isExpanded ? "line-clamp-[8]" : ""}`}>
              {product.description}
            </p>
            {isLongDescription && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-center gap-1.5 px-6 py-2 text-xs sm:text-sm font-bold text-primary border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary hover:text-white rounded-full transition-all duration-200 cursor-pointer outline-none shadow-sm"
                >
                  {isExpanded ? "কম দেখুন" : "আরও দেখুন"}
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "specs" && (
          <div className="animate-fade-in">
            <ProductSpecifications product={product} />
          </div>
        )}
      </div>
    </div>
  );
}
