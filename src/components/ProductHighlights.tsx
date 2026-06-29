"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductHighlights({ highlights }: { highlights: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Decide whether to show "See More" toggle button statically/server-side based on content size
  const shouldShowButton = highlights.length > 3 || highlights.join("").length > 150;

  return (
    <div className="mt-1 flex flex-col w-full relative">
      <div className="text-xs sm:text-sm font-medium text-zinc-500 flex items-start gap-1.5">
        <span className="font-bold text-zinc-700 flex-shrink-0 mt-0.5">Highlights:</span>
        <div className="flex-1 relative">
          <div
            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden relative ${
              shouldShowButton && !isExpanded ? "max-h-[120px]" : "max-h-[2000px]"
            }`}
          >
            <ul className="list-disc pl-4 flex flex-col gap-1.5 text-zinc-700 font-medium">
              {highlights.map((highlight, index) => (
                <li key={index} className="leading-relaxed">{highlight}</li>
              ))}
            </ul>

            {/* Gradient Overlay for collapsed state */}
            {shouldShowButton && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            )}
          </div>

          {/* See More / See Less Button */}
          {shouldShowButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-primary hover:text-primary/85 font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer border-none bg-transparent outline-none self-start py-1 transition-colors duration-200 active:scale-95"
            >
              {isExpanded ? (
                <>
                  <span>সংক্ষিপ্ত করুন</span>
                  <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                </>
              ) : (
                <>
                  <span>আরও দেখুন (See More)</span>
                  <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
