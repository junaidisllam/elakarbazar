"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PromoSliderProps {
  images: string[];
}

export default function PromoSlider({ images }: PromoSliderProps) {
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

    // Run initially
    checkScrollLimits();

    container.addEventListener("scroll", checkScrollLimits);
    window.addEventListener("resize", checkScrollLimits);

    return () => {
      container.removeEventListener("scroll", checkScrollLimits);
      window.removeEventListener("resize", checkScrollLimits);
    };
  }, [images]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 200;
    const gap = 12; // 0.75rem gap in pixels
    
    // Scroll 3 items at a time on desktop for a smoother transition, 1 on mobile
    const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 768 : true;
    const scrollAmount = (cardWidth + gap) * (isDesktop ? 3 : 1);

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
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center h-10 w-10 rounded-full bg-white/90 shadow-md text-zinc-700 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:scale-105 active:scale-95 dark:bg-zinc-950/90 dark:text-zinc-300 cursor-pointer outline-none border-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Slider Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="native-scroll scroll-smooth"
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="w-[calc(70%-0.5rem)] sm:w-[calc(25%-0.5625rem)] md:w-[calc(20%-0.6rem)] lg:w-[calc(16.666%-0.625rem)]"
          >
            <PromoSlide src={src} index={index} />
          </div>
        ))}
      </div>

      {/* Right Arrow Button (Desktop only, visible on hover) */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          type="button"
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center h-10 w-10 rounded-full bg-white/90 shadow-md text-zinc-700 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:scale-105 active:scale-95 dark:bg-zinc-950/90 dark:text-zinc-300 cursor-pointer outline-none border-none"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

    </div>
   );
}

function PromoSlide({ src, index }: { src: string; index: number }) {
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-100">
      <img
        src={src}
        alt={`Deal Slide ${index + 1}`}
        loading={index === 0 ? "eager" : "lazy"}
        className="object-cover w-full h-full md:transition-transform md:duration-300 md:hover:scale-105"
      />
    </div>
  );
}
