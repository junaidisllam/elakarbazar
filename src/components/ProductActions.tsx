"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Gift,
  Truck,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
  Percent
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const iconMap: Record<string, any> = {
  Gift,
  Truck,
  Tag,
  Percent
};

interface FormatVariant {
  type: string;
  price: number | null;
  original_price: number | null;
  in_stock: boolean;
}

interface ProductActionsProps {
  productId?: string;
  productTitle?: string;
  productCategory?: string;
  url?: string;
  variants?: {
    formats?: FormatVariant[];
    colors?: any[];
  };
  defaultPrice: string;
  defaultOriginalPrice: string;
  defaultDiscount: string;
  defaultStockLabel: string;
  defaultStockColor: string;
  isPreorder?: boolean;
}

export default function ProductActions({
  productId = "",
  productTitle = "",
  productCategory = "all",
  url,
  variants,
  defaultPrice,
  defaultOriginalPrice,
  defaultDiscount,
  defaultStockLabel,
  defaultStockColor,
  isPreorder
}: ProductActionsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Default to first variant if present, or null
  const hasFormats = variants?.formats && variants.formats.length > 0;
  const [selectedFormatIdx, setSelectedFormatIdx] = useState<number | null>(
    hasFormats ? 0 : null
  );

  const [promoCodes, setPromoCodes] = useState<Array<{ code: string; description: string; desc?: string; icon: string }> | null>(null);
  const [loadingCoupons, setLoadingCoupons] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoadingCoupons(true);
      try {
        const trackingUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8000/api/analytics/track';
        const baseApiUrl = trackingUrl.replace('/api/analytics/track', '');
        const res = await fetch(`${baseApiUrl}/api/coupons?product_type=${productCategory}`);
        if (res.ok) {
          const data = await res.json();
          setPromoCodes(data);
        }
      } catch (err) {
        console.error('Error fetching coupons:', err);
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchCoupons();
  }, [productCategory]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    trackEvent('copy_coupon', `Coupon: ${code} | Product ID: ${productId} | Title: ${productTitle}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Determine current display values based on selected variant
  let displayPrice = defaultPrice;
  let displayOriginalPrice = defaultOriginalPrice;
  let displayDiscount = defaultDiscount;
  let displayStockLabel = defaultStockLabel;
  let displayStockColor = defaultStockColor;
  let StockIcon = CheckCircle2;

  if (selectedFormatIdx !== null && variants?.formats) {
    const format = variants.formats[selectedFormatIdx];
    if (format) {
      displayPrice = format.price ? `৳ ${Math.round(format.price)}` : "N/A";
      displayOriginalPrice = format.original_price ? `৳ ${Math.round(format.original_price)}` : "";

      const disc = format.original_price && format.price
        ? Math.round(((format.original_price - format.price) / format.original_price) * 100)
        : 0;
      displayDiscount = disc > 0 ? `${disc}% ছাড়` : "";

      if (isPreorder) {
        displayStockLabel = "প্রি-অর্ডার (Pre-order)";
        displayStockColor = "text-blue-600";
        StockIcon = Clock;
      } else if (!format.in_stock) {
        displayStockLabel = "স্টক আউট (Stock Out)";
        displayStockColor = "text-rose-600";
        StockIcon = XCircle;
      } else {
        displayStockLabel = "স্টকে আছে";
        displayStockColor = "text-emerald-600";
        StockIcon = CheckCircle2;
      }
    }
  } else {
    // Determine default icon
    if (isPreorder) {
      StockIcon = Clock;
    } else if (defaultStockLabel.includes("স্টক আউট") || defaultStockLabel.includes("Out of Stock")) {
      StockIcon = XCircle;
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-2">

      {/* Pricing & Stock Section */}
      <div className="flex items-baseline justify-between border-t border-b border-zinc-100 py-4 flex-wrap gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-none transition-all">
            {displayPrice}
          </span>
          {displayOriginalPrice && (
            <span className="text-sm sm:text-base text-zinc-400 line-through font-semibold transition-all">
              {displayOriginalPrice}
            </span>
          )}
          {displayDiscount && (
            <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md transition-all">
              {displayDiscount}
            </span>
          )}
        </div>
        <div className={`text-xs sm:text-sm font-extrabold flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 ${displayStockColor}`}>
          <StockIcon className="h-3.5 w-3.5" />
          <span>{displayStockLabel}</span>
        </div>
      </div>

      {/* Format / Variant Selection UI */}
      {hasFormats && (
        <div className="flex flex-col gap-2.5 my-1">
          <div className="text-sm font-bold text-zinc-800">ফরম্যাট / সংস্করণ নির্বাচন করুন:</div>
          <div className="flex flex-wrap gap-2">
            {variants.formats!.map((format, idx) => {
              const isSelected = selectedFormatIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFormatIdx(idx)}
                  className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-left cursor-pointer transition-all active:scale-95 outline-none ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider">{format.type}</span>
                  <span className={`text-sm font-extrabold mt-0.5 ${isSelected ? "text-primary" : "text-zinc-600"}`}>
                    {format.price ? `৳ ${Math.round(format.price)}` : "N/A"}
                  </span>
                  {!format.in_stock && (
                    <span className="text-[9px] font-bold text-rose-500 mt-0.5">স্টক আউট</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loadingCoupons ? (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-bold text-zinc-700">উপলব্ধ প্রোমো কোডসমূহ:</div>
          <div className="flex flex-col gap-3">
            <div className="h-[74px] bg-zinc-100 animate-pulse rounded-2xl w-full"></div>
            <div className="h-[74px] bg-zinc-100 animate-pulse rounded-2xl w-full"></div>
          </div>
        </div>
      ) : promoCodes && promoCodes.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-bold text-zinc-700">উপলব্ধ প্রোমো কোডসমূহ:</div>
          <div className="flex flex-col gap-3">
            {promoCodes.map((promo, idx) => {
              const IconComponent = iconMap[promo.icon] || Gift;
              const isCopied = copiedCode === promo.code;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-dashed border-zinc-300 bg-zinc-50/50 rounded-2xl p-4 gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0 mt-0.5">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-zinc-800 tracking-wide">{promo.code}</span>
                      <span className="text-xs sm:text-sm text-zinc-500 font-medium">{promo.description || promo.desc}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="flex items-center gap-1.5 bg-white border border-zinc-200 hover:border-primary text-zinc-700 hover:text-primary font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 outline-none flex-shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Buy from Rokomari Button */}
      <div className="mt-2">
        <a
          href={url || "https://www.rokomari.com"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent('click_rokomari', `Product ID: ${productId} | Title: ${productTitle} | URL: ${url || 'https://www.rokomari.com'}`);
          }}
          className="w-full bg-primary hover:bg-primary/95 text-white font-black py-3.5 sm:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 h-auto text-sm sm:text-base shadow-lg shadow-primary/20 cursor-pointer border-none outline-none active:scale-95 text-center decoration-transparent no-underline"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>রকমারি থেকে কিনুন</span>
        </a>
      </div>
    </div>
  );
}
