"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, LayoutGrid, Store, Baby, Info, BookOpen, ChevronRight, ChevronDown, Cpu } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import SearchAutocomplete from "./SearchAutocomplete";

const bookCategories = [
  {
    id: "author",
    label: "লেখক",
    hasSub: true,
    items: [
      "হুমায়ূন আহমেদ", "সমরেশ মজুমদার", "রবীন্দ্রনাথ ঠাকুর", "সুনীল গঙ্গোপাধ্যায়", "আনিসুল হক",
      "শীর্ষেন্দু মুখোপাধ্যায়", "সত্যজিৎ রায়", "আহমদ ছফা", "বিভূতিভূষণ বন্দ্যোপাধ্যায়", "সৈয়দ শামসুল হক",
      "সাদাত হোসাইন", "তামিম শাহরিয়ার সুবিন", "কাজী নজরুল ইসলাম", "হুমায়ুন আজাদ", "জহির রায়হান",
      "ড্যান ব্রাউন", "চেতন ভগত", "রকিব হাসান", "সৈয়দ মুজতবা আলী", "মানিক বন্দ্যোপাধ্যায়",
      "বঙ্কিমচন্দ্র চট্টোপাধ্যায়", "আখতারুজ্জামান ইলিয়াস", "ইমদাদুল হক মিলন", "সেলিনা হোসেন", "স্টিফেন কিং",
      "জে. কে. রাওলিং", "কাজী আনোয়ার হোসেন", "সুমন্ত আসলাম", "পাওলো কোয়েলহো", "শওকত ওসমান"
    ]
  },
  {
    id: "topic",
    label: "বিষয়",
    hasSub: true,
    items: [
      "অতিরিক্ত ছাড়", "বইমেলা ২০২৬", "ইসলামি বই", "উপন্যাস", "কম্পিউটার, ফ্রিল্যান্সিং ও প্রোগ্রামিং",
      "জীবনী, স্মৃতিচারণ ও সাক্ষাৎকার", "শিশু-কিশোর বই", "সায়েন্স ফিকশন", "ভর্তি, নিয়োগ ও প্রস্তুতি পরীক্ষা", "পশ্চিমবঙ্গের বই",
      "গল্প", "আত্ম-উন্নয়ন, মোটিভেশনাল ও মেডিটেশন", "অনুবাদ", "গণিত, বিজ্ঞান ও প্রযুক্তি", "রহস্য, গোয়েন্দা, ভৌতিক, থ্রিলার ও অ্যাডভেঞ্চার",
      "রাজনীতি", "ইতিহাস ও ঐতিহ্য", "ব্যবসা, বিনিয়োগ ও অর্থনীতি", "ভাষা ও অভিধান", "ভ্রমণ ও প্রবাস",
      "মুক্তিযুদ্ধ", "আইন ও বিচার", "ইংরেজি ভাষার বই", "ইউনিভার্সিটি", "ইঞ্জিনিয়ারিং",
      "কমিকস, নকশা ও ছবির গল্প", "কৃষি ও কৃষক", "গণমাধ্যম ও সাংবাদিকতা", "ছড়া, কবিতা ও আবৃত্তি", "ড্রয়িং, পেইন্টিং ডিজাইন ও ফটোগ্রাফি",
      "দর্শন", "নাটকের বই", "পরিবার ও শিশু বিষয়ক(প্যারেন্টিং)", "পুরস্কারপ্রাপ্ত বই", "প্রফেশনাল, জার্নাল ও রেফারেন্স",
      "প্রবন্ধ", "প্রি অর্ডার", "বাংলাদেশ", "মেডিকেল", "রকমারি কালেকশন",
      "রান্নাবান্না, খাদ্য ও পুষ্টি", "সংগীত, চলচ্চিত্র ও বিনোদন", "সমাজ, সভ্যতা ও সংস্কৃতি", "স্কুল, কলেজ ও মাদ্রাসার বই", "স্বাস্থ্য, পরিচর্যা ও রোগ নিরাময়"
    ]
  },
  {
    id: "publisher",
    label: "প্রকাশনী",
    hasSub: true,
    items: [
      "উদ্ভাস একাডেমিক এন্ড এডমিশন কেয়ার", "পাঞ্জেরী পাবলিকেশন্স লিঃ", "টেকনিক পাবলিকেশন", "জয়কলি পাবলিকেশন্স লিঃ", "সাইফুর’স",
      "এমপি থ্রি পাবলিকেশন্স", "অক্ষরপত্র প্রকাশনী", "দি রয়েল সায়েন্টিফিক পাবলিকেশন্স", "সেবা প্রকাশনী", "প্রথমা প্রকাশন",
      "বাংলা একাডেমি", "ঐতিহ্য", "ইসলামিক ফাউন্ডেশন", "বাতিঘর প্রকাশনী", "বিশ্বসাহিত্য কেন্দ্র",
      "অন্যপ্রকাশ", "आनন্দ পাবলিশার্স (ভারত)", "আদর্শ", "দি ইউনিভার্সিটি প্রেস লিমিটেড(ইউ পি এল)", "দে’জ পাবলিশিং (ভারত)",
      "সময় প্রকাশন", "তাম্রলিপি", "জ্ঞানকোষ প্রকাশনী", "আগামী প্রকাশনী", "পাঠক সমাবেশ",
      "বিসিএস প্রকাশন", "তাওহীদ পাবলিকেশন্স", "মিত্র ও ঘোষ পাবলিশার্স প্রাঃ লিঃ (ভারত)", "মাকতাবাতুল আযহার", "অনন্যা",
      "সিসটেক পাবলিকেশন্স", "সন্দেশ", "ঢাকা কমিক্স", "হারপারকলিন্স পাবলিশার্স", "এমদাদিয়া লাইব্রেরী",
      "পিয়ারসন", "লেকচার"
    ]
  },
  {
    id: "academic",
    label: "একাডেমিক বই",
    hasSub: false,
    href: "/category/412"
  },
  {
    id: "discount",
    label: "অতিরিক্ত ছাড়ের বই",
    hasSub: false,
    href: "/category/1983"
  },
  {
    id: "parallel",
    label: "প্যারালাল TEXT",
    hasSub: true,
    items: [
      { name: "ষষ্ঠ শ্রেণি", id: 1340 },
      { name: "সপ্তম শ্রেণি", id: 1341 },
      { name: "অষ্টম শ্রেণি", id: 1342 },
      { name: "নবম ও দশম (বিজ্ঞান): জীববিজ্ঞান পাঠ্য সহায়িকা", id: 6446 },
      { name: "নবম ও দশম (বিজ্ঞান): রসায়ন পাঠ্য সহায়িকা", id: 6445 },
      { name: "নবম ও দশম (বিজ্ঞান): গণিত পাঠ্য সহায়িকা", id: 6442 },
      { name: "নবম ও দশম (বিজ্ঞান): ইংরেজি পাঠ্য সহায়িকা", id: 6441 },
      { name: "নবম ও দশম (বিজ্ঞান): উচ্চতর গণিত পাঠ্য সহায়িকা", id: 6447 },
      { name: "নবম ও দশম (এসএসসি): আবশ্যিক বিষয়", id: 6476 },
      { name: "এসএসসি ২০২৫ পদার্থবিজ্ঞান প্রশ্নব্যাংক", href: "/product/ssc-2025-physics-question-bank" },
      { name: "এসএসসি ২০২৭ প্যারালাল টেক্সট নবম-দশম শ্রেণি - পদার্থবিজ্ঞান", href: "/product/ssc-2027-parallel-text-physics-class-09-10" },
      { name: "এইচএসসি ১ম বর্ষ: উচ্চতর গণিত", id: 6772 },
      { name: "এইচএসসি ১ম বর্ষ: জীববিজ্ঞান পাঠ্য সহায়িকা", id: 6774 },
      { name: "এইচএসসি ১ম বর্ষ: পদার্থবিজ্ঞান পাঠ্য সহায়িকা", id: 6768 },
      { name: "এইচএসসি ১ম বর্ষ: রসায়ন পাঠ্য সহায়িকা", id: 6770 },
      { name: "এইচএসসি: আবশ্যিক বিষয়", id: 2317 },
      { name: "এইচএসসি ICT প্যারালাল টেক্সট", id: 6807 },
      { name: "এইচএসসি ২য় বর্ষ: উচ্চতর গণিত", id: 6846 },
      { name: "এইচএসসি ২য় বর্ষ: পদার্থবিজ্ঞান পাঠ্য সহায়িকা", id: 6842 },
      { name: "এইচএসসি ২য় বর্ষ: জীববিজ্ঞান পাঠ্য সহায়িকা", id: 6848 },
      { name: "এইচএসসি ২য় বর্ষ: রসায়ন পাঠ্য সহায়িকা", id: 6844 },
      { name: "একাদশ-দ্বাদশ শ্রেণি সকল প্যারালাল টেক্সট", id: 1349 }
    ]
  },
  {
    id: "admission",
    label: "ভর্তি প্রস্তুতি",
    hasSub: true,
    items: [
      { name: "বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি", id: 923 },
      { name: "মেডিকেল ভর্তি প্রস্তুতি", id: 921 },
      { name: "ইঞ্জিনিয়ারিং ভর্তি প্রস্তুতি", id: 922 },
      { name: "কলেজ/একাদশ শ্রেণি ভর্তি প্রস্তুতি", id: 2324 }
    ]
  },
  {
    id: "islamic",
    label: "ইসলামি বই",
    hasSub: false,
    href: "/category/81"
  },
  {
    id: "english",
    label: "ইংরেজি ভাষার বই",
    hasSub: false,
    href: "/category/403"
  },
  {
    id: "westbengal",
    label: "পশ্চিমবঙ্গের বই",
    hasSub: false,
    href: "/category/406"
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("author");
  const [isBooksHovered, setIsBooksHovered] = useState(false);
  const [isElectronicsHovered, setIsElectronicsHovered] = useState(false);
  const [isMobileBooksOpen, setIsMobileBooksOpen] = useState(false);
  const [isMobileElectronicsOpen, setIsMobileElectronicsOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
  const [dbTopicItems, setDbTopicItems] = useState<{ id: number; name: string }[]>([]);
  const [dbAuthorItems, setDbAuthorItems] = useState<string[]>([]);
  const [dbPublisherItems, setDbPublisherItems] = useState<string[]>([]);
  const [electronicsCategories, setElectronicsCategories] = useState<{ id: number; name: string }[]>([]);

  const [hasLoadedBooks, setHasLoadedBooks] = useState(false);
  const [hasLoadedElectronics, setHasLoadedElectronics] = useState(false);

  const loadBooks = () => {
    if (hasLoadedBooks) return;
    setHasLoadedBooks(true);

    // Fetch categories
    fetch("/api/book-categories")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.categories)) {
          setDbTopicItems(data.categories);
        }
      })
      .catch(() => {
        setHasLoadedBooks(false);
      });

    // Fetch popular authors and publishers
    fetch("/api/navbar-data")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (Array.isArray(data.authors)) {
            setDbAuthorItems(data.authors);
          }
          if (Array.isArray(data.publishers)) {
            setDbPublisherItems(data.publishers);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load navbar dynamic data:", err);
      });
  };

  const loadElectronics = () => {
    if (hasLoadedElectronics) return;
    setHasLoadedElectronics(true);
    fetch("/api/electronics-categories")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.categories)) {
          setElectronicsCategories(data.categories);
        }
      })
      .catch(() => {
        setHasLoadedElectronics(false);
      });
  };

  const router = useRouter();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      trackEvent('search', searchTerm.trim());
      router.push(`/categories?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    // Mount-time fetches removed to prevent hydration main-thread blocking
  }, []);

  // Merge dynamic topic, author and publisher items into the bookCategories array at render time
  const resolvedBookCategories = bookCategories.map((cat) => {
    if (cat.id === "topic") {
      return { ...cat, items: dbTopicItems };
    }
    if (cat.id === "author" && dbAuthorItems.length > 0) {
      return { ...cat, items: dbAuthorItems };
    }
    if (cat.id === "publisher" && dbPublisherItems.length > 0) {
      return { ...cat, items: dbPublisherItems };
    }
    return cat;
  });

  const navItems = [
    { label: "বই", href: "#", icon: BookOpen, color: "text-red-500 bg-red-50 dark:bg-red-950/30", isDropdown: true },
    { label: "ইলেকট্রনিক্স", href: "#", icon: Cpu, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30", isElectronicsDropdown: true },
    { label: "সুপার স্টোর", href: "/category/100000", icon: Store, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "আমাদের সম্পর্কে", href: "/about", icon: Info, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white dark:border-zinc-800/50 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 gap-2 md:gap-4">

        {/* Logo Section */}
        <div className="flex flex-shrink-0 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Elakar Bazar Logo"
              width={140}
              height={36}
              priority
              unoptimized
              className="h-8 md:h-9 w-auto object-contain dark:invert"
            />
          </Link>
        </div>

        {/* Mobile Search Bar (Centered, visible on mobile/tablet below md) */}
        <div className="flex-1 md:hidden mx-2 sm:mx-4 relative">
          <SearchAutocomplete
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={(val) => {
              trackEvent('search', val);
              router.push(`/categories?query=${encodeURIComponent(val)}`);
            }}
            placeholder="Search deals..."
          />
        </div>

        {/* Center Nav Links (Desktop Only) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    setIsBooksHovered(true);
                    loadBooks();
                  }}
                  onMouseLeave={() => setIsBooksHovered(false)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer ${isBooksHovered ? 'bg-zinc-50' : ''}`}
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${item.color}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span>{item.label}</span>
                    <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${isBooksHovered ? "rotate-180 text-primary" : ""}`} />
                  </button>

                  {/* Books Dropdown panel */}
                  {isBooksHovered && (
                    <div className="absolute top-full left-0 pt-2 w-[700px] z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl flex overflow-hidden h-[450px] text-zinc-800">
                        {/* Left side categories */}
                        <div className="w-1/3 bg-zinc-50 border-r border-zinc-150 py-3 flex flex-col overflow-y-auto no-scrollbar">
                          {resolvedBookCategories.map((cat) => (
                            <div
                              key={cat.id}
                              onMouseEnter={() => cat.hasSub && setActiveCategory(cat.id)}
                              className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center justify-between cursor-pointer transition-colors ${
                                activeCategory === cat.id && cat.hasSub
                                  ? "bg-white text-primary border-l-4 border-primary"
                                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 border-l-4 border-transparent"
                              }`}
                            >
                              {cat.hasSub ? (
                                <>
                                  <span>{cat.label}</span>
                                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                                </>
                              ) : (
                                <Link href={(cat as any).href || "#"} className="w-full">
                                  {cat.label}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Right side sub items */}
                        <div className="w-2/3 p-6 overflow-y-auto max-h-full">
                          {resolvedBookCategories.find(c => c.id === activeCategory)?.hasSub && (
                            <div>
                              <h4 className="font-extrabold text-zinc-900 text-sm mb-4 border-b border-zinc-100 pb-2 flex items-center justify-between">
                                <span>{resolvedBookCategories.find(c => c.id === activeCategory)?.label} তালিকা</span>
                                <span className="text-xs font-semibold text-zinc-400">মোট {resolvedBookCategories.find(c => c.id === activeCategory)?.items?.length || 0} টি আইটেম</span>
                              </h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {activeCategory === "topic"
                                  ? dbTopicItems.map((item) => (
                                      <Link
                                        key={item.id}
                                        href={`/category/${item.id}`}
                                        className="text-xs sm:text-sm text-zinc-650 hover:text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-xl transition-all truncate font-semibold flex items-center gap-1.5"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                        <span className="truncate">{item.name}</span>
                                      </Link>
                                    ))
                                  : resolvedBookCategories.find(c => c.id === activeCategory)?.items?.map((subItem) => {
                                      const label = typeof subItem === "string" ? subItem : (subItem as any).name;
                                      const targetHref = typeof subItem === "string"
                                        ? `/categories?query=${encodeURIComponent(subItem)}`
                                        : (subItem as any).href || `/category/${(subItem as any).id}`;
                                      return (
                                        <Link
                                          key={label}
                                          href={targetHref}
                                          className="text-xs sm:text-sm text-zinc-650 hover:text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-xl transition-all truncate font-semibold flex items-center gap-1.5"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                          <span className="truncate">{label}</span>
                                        </Link>
                                      );
                                    })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            if ((item as any).isElectronicsDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    setIsElectronicsHovered(true);
                    loadElectronics();
                  }}
                  onMouseLeave={() => setIsElectronicsHovered(false)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer ${isElectronicsHovered ? 'bg-zinc-50' : ''}`}
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${item.color}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span>{item.label}</span>
                    <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${isElectronicsHovered ? "rotate-180 text-primary" : ""}`} />
                  </button>

                  {/* Electronics Dropdown panel */}
                  {isElectronicsHovered && (
                    <div className="absolute top-full left-0 pt-2 w-[380px] z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden text-zinc-800">
                        <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50">
                            <Icon className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="font-extrabold text-zinc-900 text-sm">Electronics</span>
                          <span className="ml-auto text-xs font-semibold text-zinc-400">{electronicsCategories.length} টি ক্যাটাগরি</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-x-3 gap-y-1.5 max-h-[400px] overflow-y-auto">
                          {electronicsCategories.length > 0 ? (
                            electronicsCategories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/category/${cat.id}`}
                                className="text-xs sm:text-sm text-zinc-650 hover:text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-xl transition-all truncate font-semibold flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0" />
                                <span className="truncate">{cat.name}</span>
                              </Link>
                            ))
                          ) : (
                            <p className="col-span-2 text-xs text-zinc-400 py-4 text-center">লোড হচ্ছে...</p>
                          )}
                        </div>
                        <div className="px-4 py-2.5 border-t border-zinc-100">
                          <Link
                            href="/category/2024"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            সব Electronics দেখুন <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }



            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${item.color}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section: Desktop Search & Avatar, Mobile Hamburger */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Desktop Search bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <SearchAutocomplete
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={(val) => {
                trackEvent('search', val);
                router.push(`/categories?query=${encodeURIComponent(val)}`);
              }}
              placeholder="Search deals..."
            />
          </div>

          {/* Book Request Button (Desktop only) */}
          <Link href="/request-book" className="hidden md:block">
            <button
              type="button"
              className="flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-extrabold px-5 py-2 rounded-full text-xs sm:text-sm transition-all cursor-pointer border-none outline-none shadow-sm shadow-primary/20 active:scale-95 h-[38px] whitespace-nowrap"
            >
              বইয়ের অনুরোধ
            </button>
          </Link>



          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              loadBooks();
              loadElectronics();
            }}
            className="flex md:hidden flex-col justify-center items-end gap-1.5 w-8 h-8 rounded-full focus:outline-none transition-all"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 bg-zinc-800 dark:bg-zinc-200 rounded-full transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-[4px]" : "w-6"}`}></span>
            <span className={`h-0.5 bg-zinc-800 dark:bg-zinc-200 rounded-full transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-[4px]" : "w-6"}`}></span>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.isDropdown) {
                return (
                  <div key={item.label} className="w-full flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileBooksOpen(!isMobileBooksOpen);
                        loadBooks();
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 w-full cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color}`}>
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isMobileBooksOpen ? "rotate-90" : ""}`} />
                    </button>

                    {isMobileBooksOpen && (
                      <div className="pl-6 pr-2 py-2 flex flex-col gap-1 border-l-2 border-zinc-100 ml-7 mt-1">
                        {resolvedBookCategories.map((cat) => (
                          <div key={cat.id} className="flex flex-col">
                            {cat.hasSub ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setActiveMobileCategory(activeMobileCategory === cat.id ? null : cat.id)}
                                  className="flex items-center justify-between py-2 text-xs font-bold text-zinc-650 hover:text-primary w-full text-left"
                                >
                                  <span>{cat.label}</span>
                                  <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${activeMobileCategory === cat.id ? "rotate-90" : ""}`} />
                                </button>
                                {activeMobileCategory === cat.id && (
                                  <div className="pl-4 py-1.5 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border-l border-zinc-150">
                                    {cat.id === "topic"
                                      ? dbTopicItems.map((item) => (
                                          <Link
                                            key={item.id}
                                            href={`/category/${item.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="text-xs text-zinc-600 hover:text-primary hover:underline truncate py-1"
                                          >
                                            {item.name}
                                          </Link>
                                        ))
                                      : cat.items?.map((subItem) => {
                                          const label = typeof subItem === "string" ? subItem : (subItem as any).name;
                                          const targetHref = typeof subItem === "string"
                                            ? `/categories?query=${encodeURIComponent(subItem)}`
                                            : (subItem as any).href || `/category/${(subItem as any).id}`;
                                          return (
                                            <Link
                                              key={label}
                                              href={targetHref}
                                              onClick={() => setIsOpen(false)}
                                              className="text-xs text-zinc-600 hover:text-primary hover:underline truncate py-1"
                                            >
                                              {label}
                                            </Link>
                                          );
                                        })}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={(cat as any).href || "#"}
                                onClick={() => setIsOpen(false)}
                                className="py-2 text-xs font-bold text-zinc-650 hover:text-primary block"
                              >
                                {cat.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if ((item as any).isElectronicsDropdown) {
                return (
                  <div key={item.label} className="w-full flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileElectronicsOpen(!isMobileElectronicsOpen);
                        loadElectronics();
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 w-full cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color}`}>
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isMobileElectronicsOpen ? "rotate-90" : ""}`} />
                    </button>

                    {isMobileElectronicsOpen && (
                      <div className="pl-6 pr-2 py-2 flex flex-col gap-1 border-l-2 border-zinc-100 ml-7 mt-1">
                        {electronicsCategories.length > 0 ? (
                          electronicsCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.id}`}
                              onClick={() => setIsOpen(false)}
                              className="py-2 text-xs font-bold text-zinc-650 hover:text-primary block"
                            >
                              {cat.name}
                            </Link>
                          ))
                        ) : (
                          <p className="py-2 text-xs text-zinc-400">লোড হচ্ছে...</p>
                        )}
                        <Link
                          href="/category/2024"
                          onClick={() => setIsOpen(false)}
                          className="py-2 text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          সব ইলেকট্রনিক্স দেখুন <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }



              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 w-full text-left cursor-pointer"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color}`}>
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Book Request and Login buttons */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Link href="/request-book" onClick={() => setIsOpen(false)}>
                <button type="button" className="w-full flex items-center justify-center bg-primary text-white font-bold py-2.5 rounded-xl text-sm border-none cursor-pointer outline-none shadow-sm active:scale-95">
                  বইয়ের অনুরোধ (Request Book)
                </button>
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
