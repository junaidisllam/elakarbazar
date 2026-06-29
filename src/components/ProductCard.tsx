"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import BlurImage from "./BlurImage";

interface ProductCardProps {
  id: string;
  slug?: string;
  title: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  onClick?: () => void;
  isPreorder?: boolean;
  stockStatus?: string;
  priority?: boolean;
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const getDiscountNumber = (discountStr: string): number => {
  if (!discountStr) return 0;
  const banglaToEnglish: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  let cleanStr = discountStr;
  for (const [bn, en] of Object.entries(banglaToEnglish)) {
    cleanStr = cleanStr.replace(new RegExp(bn, 'g'), en);
  }
  const match = cleanStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

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

export default function ProductCard({
  id,
  slug,
  title,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  image,
  onClick,
  isPreorder,
  stockStatus,
  priority,
}: ProductCardProps) {
  const productSlug = slug || id;
  const isStockOut = 
    stockStatus && 
    (stockStatus.toLowerCase().includes("out of stock") || 
     stockStatus.toLowerCase().includes("stock out") || 
     stockStatus.toLowerCase().includes("out of print") ||
     stockStatus.toLowerCase().includes("অফ স্টক") ||
     stockStatus.toLowerCase().includes("স্টক আউট"));

  const discountPercent = getDiscountNumber(discount);
  const ratingVal = getRatingNumber(rating);
  const ratingColor = ratingVal >= 4.5 
    ? { star: "fill-emerald-500 text-emerald-500", text: "text-emerald-700" }
    : ratingVal >= 4.0
      ? { star: "fill-amber-400 text-amber-400", text: "text-amber-700" }
      : { star: "fill-rose-500 text-rose-500", text: "text-rose-700" };

  return (
    <div
      className="w-full text-left flex flex-col bg-white rounded-xl sm:rounded-2xl border border-zinc-200 overflow-hidden group md:hover:shadow-md md:hover:-translate-y-1 md:transition-[transform,box-shadow] md:duration-300 mx-0.5 my-1 cursor-pointer block content-visibility-lazy gpu-layer"
    >
      <Link href={`/product/${productSlug}`} className="block w-full">
        <div className="relative aspect-square w-full overflow-hidden bg-white p-3 sm:p-4">
          <BlurImage
            src={image ? image.replace("/260X372/", "/130X186/") : ""}
            alt={title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            className="object-contain w-auto h-full mx-auto md:transition-transform md:duration-500 md:group-hover:scale-105"
          />
          {/* Modern Premium Rounded Discount Badge (Zero clip-path performance lag) */}
          {discountPercent > 0 && (
            <div 
              className={`absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col items-center justify-center text-white shadow-sm font-extrabold text-[9px] sm:text-[11px] rounded-lg px-1.5 py-0.5 sm:px-2.5 sm:py-1 ${
                discountPercent >= 50 
                  ? "bg-red-600 font-black scale-105" 
                  : discountPercent >= 30 
                    ? "bg-amber-500" 
                    : "bg-primary"
              }`}
            >
              <span>{discountPercent}% ছাড়</span>
            </div>
          )}
          {/* Stock Out Badge */}
          {isStockOut && (
            <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-rose-600 text-white text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
              স্টক আউট
            </div>
          )}
          {/* Pre-order Badge */}
          {isPreorder && !isStockOut && (
            <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-blue-600 text-white text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
              প্রি-অর্ডার
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-col p-2.5 sm:p-3.5 gap-2 sm:gap-2.5 flex-1 justify-between w-full">
        <Link href={`/product/${productSlug}`} className="block no-underline text-inherit">
          <h3 className="font-bold text-zinc-800 text-xs sm:text-sm line-clamp-2 md:group-hover:text-primary md:transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-1.5 w-full mt-0.5">
          <div className="flex items-baseline gap-1 whitespace-nowrap flex-shrink-0">
            <span className="font-extrabold text-primary text-[14px] sm:text-[17px]">{price}</span>
            <span className="text-[10px] sm:text-[12px] text-zinc-450 line-through font-medium">{originalPrice}</span>
          </div>
          <div className="flex items-center gap-0.5 whitespace-nowrap flex-shrink-0">
            <StarIcon className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${ratingColor.star}`} />
            <span className={`text-[9px] sm:text-[10px] ${ratingColor.text}`}>{rating}</span>
            <span className="text-[8px] sm:text-[9px] text-zinc-650 font-medium">({reviews})</span>
          </div>
        </div>
        <Link
          href={`/product/${productSlug}`}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          }}
          className="w-full bg-primary text-white font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl py-0.5 sm:py-1 hover:bg-primary/95 min-h-7 h-7 sm:min-h-8 sm:h-8 flex items-center justify-center gap-1 min-w-0 cursor-pointer border-none outline-none no-underline text-center"
        >
          <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.8} />
          <span>কিনুন</span>
        </Link>
      </div>
    </div>
  );
}
