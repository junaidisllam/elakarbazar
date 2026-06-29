"use client";

import { useState, useEffect, useRef } from "react";
import { Star, CheckCircle, ThumbsUp, Sparkles } from "lucide-react";
import { Product } from "@/data/products";

export interface ReviewData {
  name: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  images?: string[];
  profilePicture?: string | null;
}

// Review Item Component to handle dynamic text overflow and local expand state
function ReviewItem({
  review,
  idx,
  helpfulCounts,
  clickedHelpful,
  handleHelpfulClick,
  setActiveModalReview,
}: {
  review: ReviewData;
  idx: number;
  helpfulCounts: Record<number, number>;
  clickedHelpful: Record<number, boolean>;
  handleHelpfulClick: (idx: number) => void;
  setActiveModalReview: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isExpanded) return; // Do not recalculate when expanded, keep previous state
    
    const checkOverflow = () => {
      const element = textRef.current;
      if (element) {
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    // Check after a brief timeout to let layout settle
    const timer = setTimeout(checkOverflow, 50);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [review.text, isExpanded]);

  return (
    <div className="py-5 sm:py-6 flex flex-col gap-3 first:pt-2 last:pb-0 content-visibility-lazy gpu-layer">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
        <div className="flex gap-3 items-center">
          {/* Profile Picture with clear border and shadow */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-50 overflow-hidden flex-shrink-0 border-2 border-zinc-200/80 shadow-sm flex items-center justify-center">
            {review.profilePicture ? (
              <img 
                src={review.profilePicture} 
                alt={review.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-zinc-400 font-extrabold text-xs sm:text-sm">
                {review.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-zinc-800 text-sm sm:text-base leading-tight">{review.name}</span>
              <span className="bg-emerald-50/60 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100/80 flex-shrink-0">
                <CheckCircle className="h-2.5 w-2.5" /> ভেরিফাইড
              </span>
            </div>
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-[10px] sm:text-xs text-zinc-400 font-bold self-start sm:pt-1 pl-12 sm:pl-0">{review.date}</span>
      </div>

      <div className="pl-12 sm:pl-0">
        <p 
          ref={textRef}
          className={`text-zinc-600 text-sm sm:text-[15px] leading-relaxed font-normal transition-all duration-200 ${
            isExpanded ? "" : "line-clamp-4 md:line-clamp-3"
          }`}
        >
          {review.text}
        </p>
        {isOverflowing && (
          <button 
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-primary hover:text-primary-hover font-bold text-xs mt-1.5 inline-block border-none bg-transparent cursor-pointer outline-none"
          >
            {isExpanded ? "কম পড়ুন" : "আরও পড়ুন"}
          </button>
        )}
      </div>

      {/* Customer uploaded images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1 pl-12 sm:pl-0">
          {review.images.map((imgUrl, imgIdx) => (
            <div 
              key={imgIdx} 
              onClick={() => setActiveModalReview({
                images: review.images || [],
                name: review.name,
                rating: review.rating,
                profilePicture: review.profilePicture || null,
                currentIndex: imgIdx
              })}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50 flex items-center justify-center flex-shrink-0 cursor-zoom-in group"
            >
              <img 
                src={imgUrl} 
                alt={`Review Upload ${imgIdx + 1}`} 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-1.5 pl-12 sm:pl-0">
        <button 
          onClick={() => handleHelpfulClick(idx)}
          disabled={clickedHelpful[idx]}
          className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors border-none outline-none bg-transparent ${
            clickedHelpful[idx] ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>উপকারী লেগেছে ({review.helpful + (helpfulCounts[idx] || 0)})</span>
        </button>
      </div>
    </div>
  );
}

interface ProductReviewsProps {
  product: Product;
  dbReviews?: ReviewData[];
}

export default function ProductReviews({ product, dbReviews }: ProductReviewsProps) {
  // Helpful buttons state tracking
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>({});
  const [clickedHelpful, setClickedHelpful] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [activeModalReview, setActiveModalReview] = useState<{
    images: string[];
    name: string;
    rating: number;
    profilePicture?: string | null;
    currentIndex: number;
  } | null>(null);

  const handleHelpfulClick = (idx: number) => {
    if (clickedHelpful[idx]) return;
    setClickedHelpful(prev => ({ ...prev, [idx]: true }));
    setHelpfulCounts(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
  };

  const reviewsData = dbReviews || [];

  const visibleReviews = showAll ? reviewsData : reviewsData.slice(0, 5);

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

  // Slider navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeModalReview) return;
    setActiveModalReview(prev => {
      if (!prev) return null;
      const newIndex = prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1;
      return { ...prev, currentIndex: newIndex };
    });
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeModalReview) return;
    setActiveModalReview(prev => {
      if (!prev) return null;
      const newIndex = prev.currentIndex === prev.images.length - 1 ? 0 : prev.currentIndex + 1;
      return { ...prev, currentIndex: newIndex };
    });
  };

  return (
    <div className="w-full bg-white sm:rounded-2xl border-y sm:border border-zinc-100/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-4 sm:p-6 flex flex-col gap-6">
      {/* Rating breakdown */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start sm:items-center justify-between pb-6 border-b border-zinc-100/80">
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-5xl sm:text-6xl font-black text-zinc-900 tracking-tight">{product.rating}</span>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const map: Record<string, string> = {
                  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
                  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
                };
                const englishRatingStr = product.rating.replace(/[০-৯]/g, d => map[d] || d);
                const ratingNum = parseFloat(englishRatingStr) || 5;
                const fillPercent = Math.min(Math.max(ratingNum - i, 0), 1) * 100;
                return (
                  <div key={i} className="relative h-4.5 w-4.5 sm:h-5 sm:w-5 flex-shrink-0">
                    {/* Background star (empty) */}
                    <Star className="absolute inset-0 h-full w-full text-zinc-200" />
                    {/* Foreground star (filled, clipped) */}
                    <div 
                      className="absolute inset-0 overflow-hidden" 
                      style={{ width: `${fillPercent}%` }}
                    >
                      <Star className="h-full w-full fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-xs sm:text-sm text-zinc-500 font-bold">({product.reviews || reviewsData.length} টি কাস্টমার রিভিউ)</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full flex flex-col gap-2.5 max-w-md">
          {(() => {
            const totalReviewsCount = reviewsData.length;
            const starCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
            reviewsData.forEach((rev) => {
              const r = Math.round(rev.rating);
              if (r >= 1 && r <= 5) {
                starCounts[r - 1]++;
              }
            });

            return [5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars - 1];
              const percent = totalReviewsCount > 0 ? `${Math.round((count / totalReviewsCount) * 100)}%` : "0%";
              return { stars, percent };
            });
          })().map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="w-9 text-zinc-500 font-bold flex items-center gap-0.5 justify-end">
                {item.stars} <Star className="h-3 w-3 fill-zinc-400 text-zinc-400" />
              </span>
              <div className="flex-1 h-2 bg-zinc-100/80 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: item.percent }}></div>
              </div>
              <span className="w-8 text-zinc-400 text-right font-bold">{item.percent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary Block with Border-Following Comet */}
      {product.reviewSummary && (
        <div className="relative overflow-hidden rounded-xl p-[1px] shadow-sm bg-zinc-100 border border-zinc-200/50">
          {/* Single comet dot that follows the border path */}
          <div className="comet-glow" />
          {/* Inner container */}
          <div className="relative z-10 bg-white p-3.5 sm:p-5 rounded-[10px] flex flex-col gap-3.5 w-full h-full">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-zinc-100">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="h-5 w-5 text-violet-650 flex-shrink-0 animate-pulse" />
                <span className="font-extrabold text-violet-850 tracking-wide text-sm sm:text-base">
                  AI রিভিউ সারাংশ (AI Summary)
                </span>
              </div>
              {parsedSummary && parsedSummary.reviews_summary?.overall_sentiment && (
                <span className="bg-violet-50 text-violet-700 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full border border-violet-200 flex-shrink-0">
                  অনুভূতি: {parsedSummary.reviews_summary.overall_sentiment}
                </span>
              )}
            </div>
            
            {parsedSummary ? (
                <div className="flex flex-col gap-4 text-zinc-800 w-full">
                  {/* Summary Text */}
                  {parsedSummary.reviews_summary?.summary_text && (
                    <p className="text-zinc-800 leading-relaxed font-bold text-sm sm:text-base">
                      {parsedSummary.reviews_summary.summary_text}
                    </p>
                  )}

                  {/* Positive & Negative Points Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-0.5">
                    {/* Positive Points */}
                    {parsedSummary.reviews_summary?.positive_points && parsedSummary.reviews_summary.positive_points.length > 0 && (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-3 sm:p-4 rounded-xl flex flex-col gap-2">
                        <span className="font-extrabold text-emerald-850 flex items-center gap-1.5 text-xs sm:text-sm">
                          👍 ইতিবাচক দিক (Positive)
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {parsedSummary.reviews_summary.positive_points.map((pt: string, i: number) => (
                            <div key={i} className="flex items-start gap-1.5 text-zinc-800 font-bold text-xs sm:text-sm leading-relaxed">
                              <span className="text-emerald-500 flex-shrink-0 mt-0.5">•</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Negative Points */}
                    {parsedSummary.reviews_summary?.negative_points && parsedSummary.reviews_summary.negative_points.length > 0 && (
                      <div className="bg-rose-50/50 border border-rose-100 p-3 sm:p-4 rounded-xl flex flex-col gap-2">
                        <span className="font-extrabold text-rose-850 flex items-center gap-1.5 text-xs sm:text-sm">
                          👎 নেতিবাচক দিক (Negative)
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {parsedSummary.reviews_summary.negative_points.map((pt: string, i: number) => (
                            <div key={i} className="flex items-start gap-1.5 text-zinc-800 font-bold text-xs sm:text-sm leading-relaxed">
                              <span className="text-rose-500 flex-shrink-0 mt-0.5">•</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <p className="text-zinc-800 leading-relaxed font-bold text-sm sm:text-base">
                  {product.reviewSummary}
                </p>
              )}
            </div>
          </div>
      )}

      {/* Reviews list */}
      {visibleReviews.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 font-bold border-t border-zinc-100/80">
          এই পণ্যটির জন্য এখনো কোনো রিভিউ দেওয়া হয়নি।
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-100/80">
          {visibleReviews.map((review, idx) => (
            <ReviewItem
              key={idx}
              review={review}
              idx={idx}
              helpfulCounts={helpfulCounts}
              clickedHelpful={clickedHelpful}
              handleHelpfulClick={handleHelpfulClick}
              setActiveModalReview={setActiveModalReview}
            />
          ))}
        </div>
      )}

      {!showAll && reviewsData.length > 5 && (
        <div className="flex justify-center mt-4 pt-4 border-t border-zinc-100/80">
          <button 
            onClick={() => setShowAll(true)}
            className="bg-zinc-50/50 hover:bg-zinc-50 text-zinc-700 font-bold px-5 py-2 rounded-xl border border-zinc-200/60 cursor-pointer text-xs sm:text-sm transition-colors outline-none flex items-center justify-center gap-1.5"
          >
            আরও রিভিউ দেখুন
          </button>
        </div>
      )}

      {/* Review Image Card Slider Modal */}
      {activeModalReview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveModalReview(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setActiveModalReview(null);
            if (e.key === "ArrowLeft" && activeModalReview.images.length > 1) {
              setActiveModalReview(prev => {
                if (!prev) return null;
                const newIndex = prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1;
                return { ...prev, currentIndex: newIndex };
              });
            }
            if (e.key === "ArrowRight" && activeModalReview.images.length > 1) {
              setActiveModalReview(prev => {
                if (!prev) return null;
                const newIndex = prev.currentIndex === prev.images.length - 1 ? 0 : prev.currentIndex + 1;
                return { ...prev, currentIndex: newIndex };
              });
            }
          }}
          tabIndex={0}
          autoFocus
        >
          {/* Modal Card Box */}
          <div 
            className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 gap-4">
              <div className="flex gap-3 items-start min-w-0">
                {/* Profile Picture */}
                <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200 flex items-center justify-center mt-0.5">
                  {activeModalReview.profilePicture ? (
                    <img 
                      src={activeModalReview.profilePicture} 
                      alt={activeModalReview.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-zinc-500 font-bold text-sm">
                      {activeModalReview.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-bold text-zinc-800 text-sm sm:text-base leading-tight break-words">{activeModalReview.name}</span>
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3.5 w-3.5 ${i < activeModalReview.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveModalReview(null)}
                className="text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer transition-colors"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Main Image Viewport with Slide Arrows (Aspect Ratio Enforced) */}
            <div className="relative aspect-square md:max-h-[600px] w-full bg-zinc-950 flex items-center justify-center group overflow-hidden">
              {activeModalReview.images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    &#10094;
                  </button>
                  {/* Right Arrow */}
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    &#10095;
                  </button>
                </>
              )}
              
              <img
                src={activeModalReview.images[activeModalReview.currentIndex]}
                alt={`Review image zoomed ${activeModalReview.currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Slide Indicators Counter */}
              {activeModalReview.images.length > 1 && (
                <div className="absolute bottom-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                  {activeModalReview.currentIndex + 1} / {activeModalReview.images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
