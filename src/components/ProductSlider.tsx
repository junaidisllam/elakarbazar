"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  products: any[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollLimits = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Only run scroll check listeners on desktop where scroll arrows are actually visible
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (!isDesktop) return;

    // Run initially
    checkScrollLimits();

    container.addEventListener("scroll", checkScrollLimits, { passive: true });
    window.addEventListener("resize", checkScrollLimits, { passive: true });

    return () => {
      container.removeEventListener("scroll", checkScrollLimits);
      window.removeEventListener("resize", checkScrollLimits);
    };
  }, [products]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 180;
    const gap = 12; // 0.75rem gap in pixels
    
    // Scroll 2 items at a time on desktop, 1 on mobile
    const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 768 : true;
    const scrollAmount = (cardWidth + gap) * (isDesktop ? 2 : 1);

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full group">
      
      {/* Left Arrow Button (Desktop only, visible on hover) */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll("left")}
          type="button"
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center h-10 w-10 rounded-full bg-white/95 shadow-md text-zinc-700 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:scale-105 active:scale-95 dark:bg-zinc-950/95 dark:text-zinc-300 cursor-pointer outline-none border-none"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Slider Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="native-scroll scroll-smooth"
      >
        {products.map((item, index) => (
          <div
            key={index}
            className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.5625rem)] lg:w-[calc(16.666%-0.625rem)]"
          >
            <ProductCard {...item} />
          </div>
        ))}
      </div>

      {/* Right Arrow Button (Desktop only, visible on hover) */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          type="button"
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center h-10 w-10 rounded-full bg-white/95 shadow-md text-zinc-700 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:scale-105 active:scale-95 dark:bg-zinc-950/95 dark:text-zinc-300 cursor-pointer outline-none border-none"
          aria-label="Next products"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

    </div>
  );
}
