"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, X, ZoomIn, ZoomOut } from "lucide-react";

function LazyBookPage({ pageUrl, pageNum, zoomScale }: { pageUrl: string, pageNum: number, zoomScale: number }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "250px 0px", // Load page when it is 250px away from viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className="relative w-full bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-800/30 flex flex-col items-center flex-shrink-0 transition-all duration-200"
      style={{ 
        maxWidth: `${Math.round(768 * zoomScale)}px`,
        minHeight: isIntersecting ? "auto" : "400px" // Placeholder height before entering screen
      }}
    >
      {isIntersecting ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-500 border-t-white"></div>
            </div>
          )}
          <img
            src={pageUrl}
            alt={`Book page ${pageNum}`}
            className={`w-full h-auto object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
          />
        </>
      ) : (
        // Pulsing placeholder skeleton
        <div className="w-full h-[400px] flex flex-col items-center justify-center bg-zinc-900/50 animate-pulse gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-700 border-t-zinc-500"></div>
          <div className="text-zinc-500 text-xs font-bold">পৃষ্ঠা {pageNum} লোড হচ্ছে...</div>
        </div>
      )}
      <div className="w-full bg-zinc-900 border-t border-zinc-800 text-center py-2.5 text-xs text-zinc-400 font-bold">
        পৃষ্ঠা {pageNum}
      </div>
    </div>
  );
}

interface ProductImageGalleryProps {
  primaryImage: string;
  title: string;
  category: string;
  discount: string;
  galleryImages?: string[];
  isPreorder?: boolean;
}

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

export default function ProductImageGallery({ primaryImage, title, category, discount, galleryImages, isPreorder }: ProductImageGalleryProps) {
  const discountPercent = getDiscountNumber(discount);

  const getImageKey = (url: string): string => {
    if (!url) return "";
    const parts = url.split("?")[0].split("/");
    return parts[parts.length - 1] || url;
  };

  // Generate a list of gallery images (main image + variations)
  const getGalleryImages = (): string[] => {
    const allUrls = galleryImages && galleryImages.length > 0 ? galleryImages : [primaryImage];
    const seen = new Set<string>();
    const uniqueImages: string[] = [];
    
    for (const url of allUrls) {
      const key = getImageKey(url);
      if (key && !seen.has(key)) {
        seen.add(key);
        uniqueImages.push(url);
      }
    }
    
    const primaryKey = getImageKey(primaryImage);
    if (primaryKey && !seen.has(primaryKey)) {
      uniqueImages.unshift(primaryImage);
    }
    
    return uniqueImages;
  };

  const images = getGalleryImages();
  
  const getInitialActiveImage = (): string => {
    const primaryKey = getImageKey(primaryImage);
    const match = images.find(img => getImageKey(img) === primaryKey);
    return match || primaryImage;
  };

  const [activeImage, setActiveImage] = useState(getInitialActiveImage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.0);
  
  const [showZoomPanel, setShowZoomPanel] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / clientWidth);
    
    // Only trigger updates if the active index actually changed
    if (newIndex !== mobileActiveIndex) {
      setMobileActiveIndex(newIndex);
      if (images[newIndex]) {
        setActiveImage(images[newIndex]);
      }
    }
  };

  const handleThumbnailClick = (imgUrl: string, idx: number) => {
    setActiveImage(imgUrl);
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTo({
        left: mobileScrollRef.current.clientWidth * idx,
        behavior: 'smooth'
      });
    }
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    if (!isBookModalOpen) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          // Scroll Up -> Zoom In
          setZoomScale(prev => Math.min(prev + 0.05, 2.0));
        } else {
          // Scroll Down -> Zoom Out
          setZoomScale(prev => Math.max(prev - 0.05, 0.5));
        }
      }
    };

    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          setZoomScale(prev => Math.min(prev + 0.1, 2.0));
        } else if (e.key === "-") {
          e.preventDefault();
          setZoomScale(prev => Math.max(prev - 0.1, 0.5));
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDownGlobal);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, [isBookModalOpen]);

  // Handle ESC key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
      setIsBookModalOpen(false);
    }
  };

  const isBook = category === "book";
  const bookPages = images.filter(img => img !== primaryImage);
  const showBookPreviewBtn = isBook && bookPages.length > 0;

  return (
    <div className="flex flex-col gap-3 w-full relative">
      {/* Mobile Image Section */}
      {isBook ? (
        <div className="md:hidden w-full overflow-hidden relative flex items-center justify-center bg-white rounded-2xl border border-zinc-100/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] aspect-square">
          <img
            src={primaryImage.replace(/\/\d+X\d+\//, "/260X372/")}
            alt={title}
            className="object-contain w-auto h-full mx-auto"
          />
        </div>
      ) : (
        <div className="md:hidden w-full overflow-hidden relative">
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth w-full aspect-square bg-white rounded-2xl border border-zinc-100/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="w-full h-full flex-shrink-0 flex items-center justify-center snap-start p-4"
              >
                <img
                  src={imgUrl.replace(/\/\d+X\d+\//, "/260X372/")}
                  alt={`${title} Slide ${idx + 1}`}
                  className="object-contain w-auto h-full mx-auto"
                  onClick={() => {
                    if (isBook && showBookPreviewBtn) {
                      setIsBookModalOpen(true);
                    } else {
                      setActiveImage(imgUrl);
                      setIsModalOpen(true);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Pre-order Badge for Mobile */}
      {isPreorder && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10 select-none md:hidden">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
          <span>প্রি-অর্ডার</span>
        </div>
      )}


      {/* Main Image Viewer (Desktop) */}
      <div 
        ref={containerRef}
        onMouseEnter={() => !isBook && setShowZoomPanel(true)}
        onMouseLeave={() => setShowZoomPanel(false)}
        onMouseMove={handleMouseMove}
        onClick={() => {
          if (isBook && showBookPreviewBtn) {
            setIsBookModalOpen(true);
          } else {
            setIsModalOpen(true);
          }
        }}
        className={`hidden md:flex relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-zinc-100/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] items-center justify-center group ${isBook && showBookPreviewBtn ? 'cursor-pointer' : 'cursor-zoom-in'}`}
      >
        <img
          src={(isBook ? primaryImage : activeImage).replace(/\/\d+X\d+\//, "/260X372/")}
          alt={title}
          className="object-contain w-auto h-full mx-auto transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
        />
        {/* Starburst Discount Badge */}
        {discountPercent > 0 && (
          <div 
            style={{ clipPath: "polygon(50% 0%, 61% 15%, 78% 7%, 80% 27%, 96% 28%, 88% 46%, 98% 62%, 83% 70%, 85% 88%, 67% 85%, 58% 99%, 47% 86%, 33% 96%, 30% 78%, 13% 80%, 17% 62%, 4% 53%, 17% 41%, 11% 23%, 29% 22%, 31% 4%, 45% 15%)" }}
            className={`absolute top-3 left-3 sm:top-4 sm:left-4 rounded-none flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 z-10 ${
              discountPercent >= 50 
                ? "bg-red-600 scale-105" 
                : discountPercent >= 30 
                  ? "bg-amber-500" 
                  : "bg-primary"
            }`}
          >
            <span className="text-[11px] sm:text-[13px] font-black leading-none">{discountPercent}%</span>
            <span className="text-[7px] sm:text-[9px] font-bold leading-none mt-0.5 sm:mt-1">ছাড়</span>
          </div>
        )}
        {/* Pre-order Badge */}
        {isPreorder && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-blue-600 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>প্রি-অর্ডার (Pre-order)</span>
          </div>
        )}
        {/* Tap hint — mobile only */}
        <div className="absolute bottom-3 right-3 sm:hidden bg-black/40 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 opacity-60">
          {isBook && showBookPreviewBtn ? (
            <>
              <BookOpen className="h-3 w-3" />
              একটু পড়ে দেখুন
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
              ট্যাপ করুন
            </>
          )}
        </div>
      </div>

      {/* Conditional Layout for Books vs Other Products */}
      {isBook ? (
        showBookPreviewBtn && (
          <div className="w-full">
            <button
              onClick={() => {
                setIsBookModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-zinc-800 font-bold py-3 px-5 rounded-xl cursor-pointer border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all text-sm sm:text-base outline-none group"
            >
              <BookOpen className="h-[18px] w-[18px] text-primary group-hover:scale-110 transition-transform" />
              <span>একটু পড়ে দেখুন</span>
              <span className="ml-1 text-[10px] sm:text-xs bg-zinc-100 text-zinc-500 font-bold px-2 py-0.5 rounded-full border border-zinc-200/60">{bookPages.length} পৃষ্ঠা</span>
            </button>
          </div>
        )
      ) : (
        /* Thumbnail Gallery List */
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:gap-2 sm:overflow-visible sm:pb-0 no-scrollbar">
          {images.map((imgUrl, idx) => {
            const isActive = imgUrl === activeImage;
            return (
              <button
                key={idx}
                onMouseEnter={() => handleThumbnailClick(imgUrl, idx)}
                onClick={() => handleThumbnailClick(imgUrl, idx)}
                className={`relative aspect-square w-14 sm:w-auto flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 bg-zinc-50 flex items-center justify-center cursor-pointer transition-all duration-200 p-0 outline-none ${
                  isActive ? "border-primary shadow-[0_0_0_1px_rgba(217,0,72,0.15)] scale-[1.02]" : "border-zinc-200/80 hover:border-zinc-300"
                }`}
              >
                <img
                  src={imgUrl.replace(/\/\d+X\d+\//, "/45X64/")}
                  alt={`${title} Preview ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Zoom Panel on Hover */}
      {showZoomPanel && !isBook && (
        <div 
          className="absolute top-0 left-[calc(100%+16px)] w-full aspect-square bg-white border border-zinc-200/80 shadow-2xl rounded-2xl overflow-hidden z-30 pointer-events-none hidden md:block"
        >
          <img
            src={(isBook ? primaryImage : activeImage).replace(/\/\d+X\d+\//, "/1104X1581/")}
            alt="Zoom view"
            className="absolute max-w-none w-[300%] h-[300%] object-contain"
            style={{
              left: `-${zoomPos.x * 2}%`,
              top: `-${zoomPos.y * 2}%`
            }}
          />
        </div>
      )}

      {/* Lightweight Zoom Modal */}
      {isModalOpen && !isBookModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          {/* Close button */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-zinc-300 text-3xl font-bold bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center border-none cursor-pointer z-50 transition-colors"
            aria-label="Close modal"
          >
            &times;
          </button>
          
          {/* Modal Content */}
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container
          >
            <img
              src={isBook ? primaryImage : activeImage}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-200"
            />
          </div>
        </div>
      )}

      {/* Book Pages Preview Modal */}
      {isBookModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-zinc-100 select-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsBookModalOpen(false);
          }}
          tabIndex={0}
          autoFocus
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-10">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-bold text-sm sm:text-base leading-tight text-white">বইয়ের কিছু অংশ পড়ুন</span>
              <span className="text-xs text-zinc-400 font-semibold truncate max-w-[180px] sm:max-w-xl">{title}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/50">
                <button 
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 0.5}
                  className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer border-none transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-zinc-300 min-w-[36px] text-center select-none">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button 
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 2.0}
                  className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer border-none transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <span className="hidden sm:inline-block text-xs sm:text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-bold whitespace-nowrap">
                মোট পৃষ্ঠা: {bookPages.length}
              </span>
              <button 
                onClick={() => setIsBookModalOpen(false)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full w-9 h-9 flex items-center justify-center border-none cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* PDF View - Scrollable list of stacked pages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-10 bg-zinc-900/50 flex flex-col items-center gap-6 sm:gap-8 scroll-smooth">
            {bookPages.map((pageUrl, idx) => (
              <LazyBookPage 
                key={idx}
                pageUrl={pageUrl}
                pageNum={idx + 1}
                zoomScale={zoomScale}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
