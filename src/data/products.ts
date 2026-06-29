export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  slug?: string;
  category: string;
  author?: string;
  description: string;
  highlights?: string[];
  specifications?: Record<string, string>;
  reviewSummary?: string;
  affiliate_link?: string;
  categoryName?: string;
  categoryId?: number;
  stockStatus?: string;
  isPreorder?: boolean;
  variants?: {
    formats?: Array<{
      type: string;
      price: number | null;
      original_price: number | null;
      in_stock: boolean;
    }>;
    colors?: any[];
  };
}

export const allProducts: Product[] = [
  // Books
  {
    id: "paradoxical-sajid",
    title: "প্যারাডক্সিক্যাল সাজিদ (১ম ও ২য় খণ্ড একত্রে)",
    price: "৳ ২৪০",
    originalPrice: "৳ ৩০০",
    discount: "২০% ছাড়",
    rating: "৪.৯",
    reviews: "১২৫",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "আরিফ আজাদ",
    description: "প্যারাডক্সিক্যাল সাজিদ মূলত আরিফ আজাদ এর লেখা একটি অত্যন্ত জনপ্রিয় ইসলামিক প্রবন্ধ সংকলন। সাজিদ নামের একজন আধুনিক ও বিজ্ঞানমনস্ক তরুণ কীভাবে বৈজ্ঞানিক ও যৌক্তিক যুক্তির মাধ্যমে নাস্তিকতার প্রশ্নের উত্তর দিয়ে সত্যের আলো তুলে ধরে—তা এই বইটিতে চমৎকারভাবে তুলে ধরা হয়েছে। এটি বাংলা সাহিত্যে অন্যতম সেরা সর্বাধিক বিক্রিত বই।"
  },
  {
    id: "himur-moddhupur",
    title: "হিমুর মধ্যদুপুর - হুমায়ূন আহমেদ",
    price: "৳ ১৬০",
    originalPrice: "৳ ২০০",
    discount: "২০% ছাড়",
    rating: "৪.৮",
    reviews: "৯৪",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "হুমায়ূন আহমেদ",
    description: "হুমায়ূন আহমেদের কালজয়ী চরিত্র হিমু। হলুদ পাঞ্জাবি পরে খালি পায়ে হেঁটে চলা রহস্যময় এক যুবক হিমু, যার মধ্যদুপুরের রোদেও নিজের মতো করে পথচলা আর অদ্ভুত সব কান্ডকীর্তি নিয়ে এই উপন্যাসটি সাজানো হয়েছে।"
  },
  {
    id: "boloy-science-fiction",
    title: "বলয় (বৈজ্ঞানিক কল্পকাহিনী) - জাফর ইকবাল",
    price: "৳ ২০০",
    originalPrice: "৳ ২৫০",
    discount: "২০% ছাড়",
    rating: "৪.৭",
    reviews: "৮২",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "মুহম্মদ জাফর ইকবাল",
    description: "বলয় মুহম্মদ জাফর ইকবাল রচিত একটি চমৎকার বৈজ্ঞানিক কল্পকাহিনী। ভবিষ্যতের পৃথিবী, উন্নত প্রযুক্তি ও মানুষের অস্তিত্বের টানাপোড়েন নিয়ে রচিত এই বইটি সব বয়সী পাঠকের কল্পনাকে নাড়া দেবে।"
  },
  {
    id: "lal-neel-deepaboli",
    title: "লাল নীল দীপাবলী বা বাংলা সাহিত্যের জীবনী - হুমায়ুন আজাদ",
    price: "৳ ১৮০",
    originalPrice: "৳ ২২৫",
    discount: "২০% ছাড়",
    rating: "৪.৬",
    reviews: "৬০",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "হুমায়ুন আজাদ",
    description: "বাংলা সাহিত্যের সুবিশাল ইতিহাস ও তার উৎপত্তি নিয়ে হুমায়ুন আজাদের লেখা লাল নীল দীপাবলী অত্যন্ত জনপ্রিয় একটি বই। সহজ-সরল ভাষায় পুরো বাংলা সাহিত্যের ইতিহাসকে রঙিন ও উৎসবমুখর ভাবে উপস্থাপন করা হয়েছে এতে।"
  },
  {
    id: "kongkal-bhuter-golpo",
    title: "কঙ্কাল ও অন্যান্য ভূতের গল্প - রবীন্দ্রনাথ ঠাকুর",
    price: "৳ ১২০",
    originalPrice: "৳ ১৫০",
    discount: "২০% ছাড়",
    rating: "৪.৫",
    reviews: "৭৩",
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "রবীন্দ্রনাথ ঠাকুর",
    description: "বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের অতিপ্রাকৃত ও রোমাঞ্চকর সব ভূতের গল্পের সংকলন। গা শিউরে ওঠা রহস্য ও আবেগের এক অদ্ভুত মেলবন্ধন পাওয়া যাবে এই বইটিতে।"
  },
  {
    id: "pather-panchali",
    title: "পথের পাঁচালী - বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    price: "৳ ২০০",
    originalPrice: "৳ ২৫০",
    discount: "২০% ছাড়",
    rating: "৪.৯",
    reviews: "১৫০",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    description: "পথের পাঁচালী বাংলা সাহিত্যের অন্যতম সেরা ক্লাসিক উপন্যাস। অপুর শৈশব, গ্রামীণ বাংলার অপরূপ প্রকৃতি আর জীবন সংগ্রামের গল্প নিয়ে বিভূতিভূষণ বন্দ্যোপাধ্যায় এক কালজয়ী মহাকাব্য রচনা করেছেন।"
  },
  {
    id: "choritrohin-sorotchondro",
    title: "চরিত্রহীন - শরৎচন্দ্র চট্টোপাধ্যায়",
    price: "৳ ১৫০",
    originalPrice: "৳ ১৮০",
    discount: "১৭% ছাড়",
    rating: "৪.৭",
    reviews: "৪৫",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    description: "শরৎচন্দ্র চট্টোপাধ্যায়ের অন্যতম শ্রেষ্ঠ উপন্যাস চরিত্রহীন। তৎকালীন বাঙালি সমাজের রক্ষণশীল চিন্তা, নারীদের অবস্থা ও মানবিক সম্পর্কের নানা টানাপোড়েন এতে নিখুঁতভাবে ফুটিয়ে তোলা হয়েছে।"
  },
  {
    id: "devdas-sorotchondro",
    title: "দেবদাস - শরৎচন্দ্র চট্টোপাধ্যায়",
    price: "৳ ১২০",
    originalPrice: "৳ ১৫০",
    discount: "২০% ছাড়",
    rating: "৪.৮",
    reviews: "৯৫",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    description: "অমর প্রেমের ট্র্যাজেডি নিয়ে শরৎচন্দ্র চট্টোপাধ্যায়ের অনবদ্য সৃষ্টি দেবদাস। পার্বতী ও দেবদাসের প্রেম, অভিমান এবং করুণ সমাপ্তি যুগ যুগ ধরে মানুষকে আবেগাপ্লুত করেছে।"
  },
  {
    id: "sharlock-holmes-samagra",
    title: "শার্লক হোমস সমগ্র - স্যার আর্থার কোনান ডয়েল",
    price: "৳ ৩৫০",
    originalPrice: "৳ ৪৫০",
    discount: "২২% ছাড়",
    rating: "৪.৯",
    reviews: "১৮০",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "স্যার আর্থার কোনান ডয়েল",
    description: "বিশ্বের সর্বকালের সেরা গোয়েন্দা কাহিনী শার্লক হোমস সমগ্র। ড. ওয়াটসন ও শার্লক হোমসের বুদ্ধিদীপ্ত গোয়েন্দাগিরি ও রহস্য রোমাঞ্চে ভরা এই বইটি আপনাকে শেষ পাতা পর্যন্ত আটকে রাখবে।"
  },
  {
    id: "feluda-somogro-satyajit",
    title: "ফেলুদা সমগ্র (১ম খণ্ড) - সত্যজিৎ রায়",
    price: "৳ ২৮০",
    originalPrice: "৳ ৩৫০",
    discount: "২০% ছাড়",
    rating: "৪.৯",
    reviews: "২২৫",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
    category: "book",
    author: "সত্যজিৎ রায়",
    description: "সত্যজিৎ রায়ের জনপ্রিয় গোয়েন্দา চরিত্র প্রদোষ চন্দ্র মিত্র ওরফে ফেলুদা। লালমোহন বাবু (জটায়ু) এবং তোপসেকে সাথে নিয়ে ফেলুদার রহস্য উন্মোচনের অ্যাডভেঞ্চার নিয়ে সাজানো এই অনন্য সংকলন।"
  },

  // Calculators
  {
    id: "casio-fx-991ex",
    title: "Casio FX-991EX ClassWiz Calculator",
    price: "৳ ১,৪৫০",
    originalPrice: "৳ ১,৮০০",
    discount: "২৪% ছাড়",
    rating: "৪.৯",
    reviews: "১৫৬",
    image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "শিক্ষা ও পেশাগত কাজে ব্যবহারের জন্য বিশ্বখ্যাত Casio ClassWiz সিরিজ বৈজ্ঞানিক ক্যালকুলেটর। এটি ম্যাট্রিক্স, ভেক্টর, ইন্টিগ্রেশন ও সমীকরণ সমাধানের জন্য অত্যন্ত উপযোগী। দ্বিমুখী পাওয়ার (সোলার ও ব্যাটারি) চালিত।"
  },
  {
    id: "casio-fc-200v",
    title: "Casio FC-200V Financial Calculator",
    price: "৳ ২,৮০০",
    originalPrice: "৳ ৩,৫০০",
    discount: "২০% ছাড়",
    rating: "৪.৮",
    reviews: "৪২",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "ব্যাংকিং, ফিন্যান্স ও কমার্স স্টুডেন্টদের জন্য কাসিওর সেরা ফিন্যান্সিয়াল ক্যালকুলেটর। এতে অবচয়, লভ্যাংশ, চক্রবৃদ্ধি সুদ ও বন্ড হিসাবের বিশেষ শর্টকাট কী রয়েছে।"
  },
  {
    id: "citizen-ct-512",
    title: "Citizen CT-512 Desktop Calculator",
    price: "৳ ৩৫০",
    originalPrice: "৳ ৪৫০",
    discount: "২২% ছাড়",
    rating: "৪.৬",
    reviews: "২১০",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "দোকানপাট ও সাধারণ হিসাব-নিকাশের জন্য সিটিজেন ১২ ডিজিটের বড় ডিসপ্লেযুক্ত টেবিল ক্যালকুলেটর। টেকসই বাটন ও দীর্ঘস্থায়ী ব্যাটারি লাইফ।"
  },
  {
    id: "deli-scientific",
    title: "Deli Scientific Calculator",
    price: "৳ ৫৫০",
    originalPrice: "৳ ৭০০",
    discount: "২১% ছাড়",
    rating: "৪.৭",
    reviews: "৯৫",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "ডেলি ব্যান্ডের সাশ্রয়ী মূল্যের ২৪০টি ফাংশন সম্পন্ন বৈজ্ঞানিক ক্যালকুলেটর। স্টুডেন্টদের রেগুলার গণিত প্র্যাকটিসের জন্য আদর্শ।"
  },
  {
    id: "casio-fx-100ms",
    title: "Casio FX-100MS 2nd Edition",
    price: "৳ ৮৫০",
    originalPrice: "৳ ১,১০০",
    discount: "২২% ছাড়",
    rating: "৪.৮",
    reviews: "১২০",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "মাধ্যমিক ও উচ্চ মাধ্যমিক পর্যায়ের শিক্ষার্থীদের জন্য সর্বাধিক জনপ্রিয় ও বোর্ড অনুমোদিত কাসিও ১০০এমএস বৈজ্ঞানিক ক্যালকুলেটর।"
  },
  {
    id: "sharp-el-w531tg",
    title: "Sharp EL-W531TG WriteView Calculator",
    price: "৳ ১,১৫০",
    originalPrice: "৳ ১,৪০০",
    discount: "১৮% ছাড়",
    rating: "৪.৭",
    reviews: "৩৫",
    image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "শার্প ব্র্যান্ডের রাইটভিউ সায়েন্টিফিক ক্যালকুলেটর। এতে স্ক্রিনে গণিতের ভগ্নাংশ ও সূত্রগুলো হুবহু পাঠ্যবইয়ের মতো দেখা যায়।"
  },
  {
    id: "casio-hr-8r-printing",
    title: "Casio HR-8R-RC Portable Printing Calculator",
    price: "৳ ৩,২০০",
    originalPrice: "৳ ৩,৮০০",
    discount: "১৬% ছাড়",
    rating: "৪.৮",
    reviews: "১৮",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop",
    category: "calculator",
    description: "দোকানের হিসাব বা ব্যাংকিং কাজের জন্য বিল প্রিন্টিং সুবিধাযুক্ত কাসিও পোর্টেবল প্রিন্টিং ক্যালকুলেটর।"
  },

  // Fans
  {
    id: "jisulife-handheld-fan",
    title: "Jisulife Handheld Turbo Mini Fan - ৪০০০mAh রিচার্জেবল টাইপ-সি পোর্টেবল ফ্যান",
    price: "৳ ১,২০০",
    originalPrice: "৳ ১,৬০০",
    discount: "২৫% ছাড়",
    rating: "৪.৯",
    reviews: "১৮২",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=400&auto=format&fit=crop",
    category: "fan",
    description: "৪০০০mAh এর বিশাল রিচার্জেবল ব্যাটারি যুক্ত Jisulife মিনি ফ্যান। ৫ স্পিড মোড এবং দীর্ঘ সময় ধরে ব্যাকআপের জন্য অন্যতম সেরা পোর্টেবল সমাধান।"
  },
  {
    id: "portable-usb-mini-fan",
    title: "Portable USB Mini Fan - হ্যান্ডহেল্ড ফ্যান",
    price: "৳ ৪৫০",
    originalPrice: "৳ ৬০০",
    discount: "২৫% ছাড়",
    rating: "৪.৭",
    reviews: "৩০০",
    image: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?q=80&w=400&auto=format&fit=crop",
    category: "fan",
    description: "হালকা ও সহজে বহনযোগ্য মিনি হ্যান্ডহেল্ড ফ্যান। রিচার্জেবল ও ইউএসবি প্লাগ-ইন দুটো মোডেই চালানো যাবে।"
  },
  {
    id: "foldable-desktop-fan",
    title: "Foldable Desktop USB Fan - ফোল্ডিং ফ্যান",
    price: "৳ ৬৫০",
    originalPrice: "৳ ৮৫০",
    discount: "২৪% ছাড়",
    rating: "৪.৬",
    reviews: "১১৫",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=400&auto=format&fit=crop",
    category: "fan",
    description: "ভাঁজ করে যেকোনো কোণে সেট করা যায় এমন ডেক্সটপ ফ্যান। পড়ার টেবিল বা অফিসের জন্য দারুন রিচার্জেবল পণ্য।"
  },
  {
    id: "water-spray-fan",
    title: "Water Spray Cooling Fan - মিনি স্প্রে ফ্যান",
    price: "৳ ৩৫০",
    originalPrice: "৳ ৫০০",
    discount: "৩০% ছাড়",
    rating: "৪.৪",
    reviews: "১২৫",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=400&auto=format&fit=crop",
    category: "fan",
    description: "বাতাসের সাথে সাথে হালকা পানির কুয়াশা বা স্প্রে করার প্রযুক্তি সংবলিত কুলিং ফ্যান। তীব্র গরমে তাৎক্ষণিক প্রশান্তি এনে দেবে।"
  },
  {
    id: "rechargeable-neck-fan",
    title: "Rechargeable Lazy Neck Fan - মিনি নেক ফ্যান",
    price: "৳ ৭৫০",
    originalPrice: "৳ ৯৫০",
    discount: "২১% ছাড়",
    rating: "৪.৬",
    reviews: "১৪২",
    image: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?q=80&w=400&auto=format&fit=crop",
    category: "fan",
    description: "গলায় ঝুলিয়ে ব্যবহারযোগ্য হ্যান্ডস-ফ্রি লেজি নেক ফ্যান। রিচার্জেবল ৩টি স্পিড মোড এবং হাঁটার সময় বা জিম করার জন্য চমৎকার।"
  },
  {
    id: "solar-rechargeable-fan",
    title: "Solar Rechargeable Pedestal Fan - সোলার ফ্যান",
    price: "৳ ২,৫০০",
    originalPrice: "৳ ৩,২০০",
    discount: "২২% ছাড়",
    rating: "৪.৭",
    reviews: "৫৫",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=400&auto=format&fit=crop",
    category: "fan",
    description: "সোলার প্যানেলের সাহায্যে চার্জ করা যায় এমন রিচার্জেবল স্ট্যান্ড ফ্যান। লোডশেডিংয়ের সময়ে ও গ্রামে ব্যবহারের জন্য উপযুক্ত।"
  },

  // Watches
  {
    id: "xiaomi-mi-band-8",
    title: "Xiaomi Mi Band 8 Smart Band",
    price: "৳ ৩,২০০",
    originalPrice: "৳ ৩,৮০০",
    discount: "১৬% ছাড়",
    rating: "৪.৯",
    reviews: "২৯০",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=400&auto=format&fit=crop",
    category: "watch",
    description: "Xiaomi-র জনপ্রিয় Mi Band ৮। AMOLED ডিসপ্লে, স্পোর্টস ট্র্যাকিং, ওয়াটারপ্রুফ বডি এবং দীর্ঘ ১৫ দিনের ব্যাটারি লাইফ।"
  },
  {
    id: "t500-smartwatch",
    title: "T500 Smart Watch - সাশ্রয়ী ফিটনেস ওয়াচ",
    price: "৳ ৮৫০",
    originalPrice: "৳ ১,০০০",
    discount: "১৫% ছাড়",
    rating: "৪.৬",
    reviews: "৫৫০",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    category: "watch",
    description: "সাশ্রয়ী মূল্যের মধ্যে ব্লুটুথ কলিং, হার্ট রেট ট্র্যাকিং ও নোটিফিকেশন ফিচার সংবলিত ফিটনেস স্মার্ট ঘড়ি।"
  },
  {
    id: "casio-vintage-watch",
    title: "Casio Vintage Digital Watch - ক্লাসিক ঘড়ি",
    price: "৳ ১,৮০০",
    originalPrice: "৳ ২,৪০০",
    discount: "২৫% ছাড়",
    rating: "৪.৮",
    reviews: "৪১২",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop",
    category: "watch",
    description: "কাসিওর বিখ্যাত ভিন্টেজ ডিজাইনের মেটাল বেল্ট ডিজিটাল ঘড়ি। আধুনিক ও মার্জিত আউটলুক নিয়ে এটি সবার পছন্দের।"
  },
  {
    id: "wooden-led-clock",
    title: "Wooden LED Alarm Clock - ডিজিটাল এলার্ম ঘড়ি",
    price: "৳ ৫৫০",
    originalPrice: "৳ ৭৫০",
    discount: "২৭% ছাড়",
    rating: "৪.৫",
    reviews: "১৬০",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop",
    category: "watch",
    description: "টেবিলে সাজিয়ে রাখার মতো কাঠের ডিজাইনের এলইডি ঘড়ি। সময়, তারিখ ও ঘরের তাপমাত্রা প্রদর্শন করে।"
  },
  {
    id: "huawei-band-8",
    title: "Huawei Band 8 Fitness Tracker",
    price: "৳ ৩,৬০০",
    originalPrice: "৳ ৪,২০০",
    discount: "১৪% ছাড়",
    rating: "৪.৮",
    reviews: "১৪৫",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=400&auto=format&fit=crop",
    category: "watch",
    description: "হুয়াওয়ের লাইটওয়েট স্মার্ট ব্যান্ড ৮। বৈজ্ঞানিক ঘুম ট্র্যাকিং, SpO2 মনিটর এবং দীর্ঘ ১৪ দিনের ব্যাটারি লাইফ।"
  },
  {
    id: "fire-boltt-smartwatch",
    title: "Fire-Boltt Phoenix Smart Watch",
    price: "৳ ১,৯৫০",
    originalPrice: "৳ ২,৮০০",
    discount: "৩০% ছাড়",
    rating: "৪.৭",
    reviews: "৩১০",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    category: "watch",
    description: "মেটাল বডির রাউন্ড শেপ স্মার্ট ঘড়ি। ব্লুটুথ কলিং, ভয়েস অ্যাসিস্ট্যান্ট ও ১২োটির বেশি স্পোর্টস মোড সমর্থিত।"
  },

  // Headphones
  {
    id: "oraimo-boompop",
    title: "Oraimo Boompop Wireless Headphone",
    price: "৳ ১,৬৫০",
    originalPrice: "৳ ২,২০০",
    discount: "২৫% ছাড়",
    rating: "৪.৮",
    reviews: "১৮৫",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    category: "headphone",
    description: "ওরাইমোর চমৎকার বাসের Boompop ওয়্যারলেস হেডফোন। এক চার্জে দীর্ঘ সময় ব্যাকআপ এবং আরামদায়ক ইয়ারপ্যাড।"
  },
  {
    id: "sony-wh-ch520",
    title: "Sony WH-CH520 Wireless Headset",
    price: "৳ ৪,৫০০",
    originalPrice: "৳ ৫,৫০০",
    discount: "১৮% ছাড়",
    rating: "৪.৯",
    reviews: "১২০",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop",
    category: "headphone",
    description: "সনি ব্র্যান্ডের হাই-কোয়ালিটি সাউন্ড সম্পন্ন ব্লুটুথ ওভার-ইয়ার হেডসেট। অসাধারণ ক্লাইরিটি ও ডিটেইলড সাউন্ড সিগনেচার।"
  },
  {
    id: "jbl-tune-510bt",
    title: "JBL Tune 510BT Wireless - বেস হেডফোন",
    price: "৳ ৩,৮০০",
    originalPrice: "৳ ৪,৮০০",
    discount: "২১% ছাড়",
    rating: "৪.৭",
    reviews: "১৫২",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&auto=format&fit=crop",
    category: "headphone",
    description: "জেবিএল সিগনেচার পিউর বাস যুক্ত ওয়্যারলেস অন-ইয়ার হেডফোন। ইউএসবি টাইপ-সি ফাস্ট চার্জিং এর সুবিধাসহ।"
  },
  {
    id: "f9-5-tws",
    title: "F9-5 TWS Bluetooth Earbuds",
    price: "৳ ৩৫০",
    originalPrice: "৳ ৫০০",
    discount: "৩০% ছাড়",
    rating: "৪.৫",
    reviews: "৯৫০",
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=400&auto=format&fit=crop",
    category: "headphone",
    description: "সবচেয়ে জনপ্রিয় F9-5 ব্লুটুথ ৫.০ ইয়ারবাডস। এর চার্জিং কেসটি দিয়ে মোবাইল ফোনও জরুরি চার্জ করে নেওয়া যাবে।"
  },
  {
    id: "anker-soundcore-q20",
    title: "Anker Soundcore Life Q20 Hybrid ANC",
    price: "৳ ৫,২০০",
    originalPrice: "৳ ৬,৫০০",
    discount: "২০% ছাড়",
    rating: "৪.৯",
    reviews: "৩৫০",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    category: "headphone",
    description: "অ্যাঙ্কার ব্র্যান্ডের অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) ওয়্যারলেস হেডফোন। ৪০ ঘণ্টার ব্যাটারি লাইফ এবং হাই-রেস অডিও কোয়ালিটি।"
  },
  {
    id: "redmi-buds-5",
    title: "Redmi Buds 5 Wireless Earbuds",
    price: "৳ ২,৪০০",
    originalPrice: "৳ ৩,০০০",
    discount: "২০% ছাড়",
    rating: "৪.৮",
    reviews: "৪২০",
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=400&auto=format&fit=crop",
    category: "headphone",
    description: "৪৬dB পর্যন্ত অ্যাক্টিভ নয়েজ ক্যান্সেলেশন সম্পন্ন রেডমি বাডস ৫। টাইপ-সি ফাস্ট চার্জিং এবং হাইব্রিড বাস সাউন্ড কোয়ালিটি।"
  }
];
