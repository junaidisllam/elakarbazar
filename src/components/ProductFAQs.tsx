"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Product } from "@/data/products";

export interface FAQData {
  q: string;
  a: string;
}

interface ProductFAQsProps {
  product: Product;
  dbFaqs?: FAQData[];
}

export default function ProductFAQs({ product, dbFaqs }: ProductFAQsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const allFaqs = dbFaqs || [];

  let parsedSummary: any = null;
  if (product.reviewSummary) {
    try {
      let cleaned = product.reviewSummary.trim();
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = JSON.parse(cleaned);
      }
      parsedSummary = JSON.parse(cleaned);
    } catch (e) {
      parsedSummary = null;
    }
  }

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 4);

  return (
    <div className="w-full bg-white rounded-none border-x-0 border-y border-zinc-200 sm:rounded-2xl sm:border shadow-none sm:shadow-sm p-4 sm:p-6 flex flex-col gap-6">
      {/* AI Q&A Summary Block */}
      {parsedSummary && parsedSummary.qa_summary && parsedSummary.qa_summary.key_answers && parsedSummary.qa_summary.key_answers.length > 0 && (
        <div className="relative overflow-hidden rounded-xl p-[2px] shadow-md bg-zinc-200/60">
          <div className="comet-glow" />
          <div className="relative z-10 bg-white p-3.5 sm:p-5 rounded-[10px] flex flex-col gap-3.5 w-full h-full">
            <div className="flex items-center gap-1.5 sm:gap-2 pb-2.5 border-b border-zinc-100">
              <Sparkles className="h-5 w-5 text-violet-650 flex-shrink-0 animate-pulse" />
              <span className="font-extrabold text-violet-850 tracking-wide text-sm sm:text-base">
                AI প্রশ্নোত্তর সারাংশ (AI Q&A Summary)
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-0.5">
                {parsedSummary.qa_summary.key_answers.map((ans: string, i: number) => {
                  const topic = parsedSummary.qa_summary.common_topics?.[i] || "প্রশ্ন";
                  return (
                    <div key={i} className="flex flex-col gap-1 text-xs sm:text-sm bg-zinc-50/80 border border-zinc-200/50 p-3 sm:p-3.5 rounded-xl shadow-sm">
                      <span className="font-extrabold text-zinc-500 flex items-center gap-1">
                        📌 {topic}
                      </span>
                      <span className="font-bold text-zinc-800 leading-relaxed mt-0.5">{ans}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <input
          type="text"
          placeholder="প্রশ্ন বা উত্তর দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm outline-none focus:border-primary transition-colors text-zinc-800 font-medium"
        />
      </div>

      {/* FAQ Open List */}
      <div className="flex flex-col divide-y divide-zinc-100">
        {visibleFaqs.length > 0 ? (
          visibleFaqs.map((faq, index) => (
            <div 
              key={index} 
              className="py-5 flex flex-col gap-2.5 first:pt-0 last:pb-0 content-visibility-lazy gpu-layer"
            >
              <div className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary text-[11px] font-extrabold px-2 py-0.5 rounded flex-shrink-0 mt-0.5">প্রশ্ন</span>
                <h4 className="font-extrabold text-zinc-800 text-sm sm:text-base leading-relaxed">
                  {faq.q}
                </h4>
              </div>
              <div className="flex items-start gap-2 pl-0 sm:pl-10">
                <span className="bg-zinc-100 text-zinc-600 text-[11px] font-extrabold px-2 py-0.5 rounded flex-shrink-0 mt-0.5">উত্তর</span>
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-500 font-medium text-sm">
            দুঃখিত, কোনো প্রশ্ন উত্তর পাওয়া যায়নি।
          </div>
        )}
      </div>

      {!showAll && filteredFaqs.length > 4 && (
        <div className="flex justify-center mt-6 pt-6 border-t border-zinc-100">
          <button 
            onClick={() => setShowAll(true)}
            className="bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold px-6 py-2.5 rounded-xl border border-zinc-200 cursor-pointer text-sm transition-colors outline-none flex items-center justify-center gap-1.5"
          >
            আরও প্রশ্ন উত্তর দেখুন
          </button>
        </div>
      )}
    </div>
  );
}
