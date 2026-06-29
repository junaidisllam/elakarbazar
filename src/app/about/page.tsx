import Link from "next/link";
import { 
  ShoppingBag, 
  Handshake, 
  Percent, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Users, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে | এলাকার বাজার",
  description: "এলাকার বাজার কীভাবে কাজ করে এবং রকমারি অ্যাফিলিয়েশনের মাধ্যমে আমরা কীভাবে আপনাকে সেরা সেবা দিই তা জানুন।",
};

export default function AboutPage() {
  const steps = [
    {
      icon: ShoppingBag,
      title: "১. পছন্দের পণ্যটি নির্বাচন করুন",
      description: "রকমারির সেরা সব বই, গ্যাজেট, ঘড়ি, এবং লাইফস্টাইল পণ্য আমাদের ক্যাটালগ থেকে সহজে ব্রাউজ করে খুঁজে নিন।",
      color: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
      border: "border-red-100"
    },
    {
      icon: Handshake,
      title: "২. রকমারি ডট কম-এ যান",
      description: "পছন্দের পণ্যের পেজে গিয়ে \"রকমারি থেকে কিনুন\" বাটনে ক্লিক করলে আপনি সরাসরি রকমারির নিরাপদ পেমেন্ট ও চেকআউট পেজে চলে যাবেন।",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
      border: "border-blue-100"
    },
    {
      icon: Percent,
      title: "৩. ডিসকাউন্টসহ অর্ডার সম্পন্ন করুন",
      description: "আমাদের শেয়ার করা প্রোমো কোডগুলো ব্যবহার করে আকর্ষণীয় ছাড় পান। প্রতিটি সঠিক কেনাকাটার জন্য আমরা রকমারি থেকে ক্ষুদ্র কমিশন পাই।",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
      border: "border-emerald-100"
    }
  ];

  const faqs = [
    {
      q: "আমাদের সাইটের মাধ্যমে কিনলে পণ্যের দাম কি বেশি নেওয়া হয়?",
      a: "একদমই না! পণ্যের দাম রকমারির অফিশিয়াল দামের সমান থাকে। বরং আমাদের এক্সক্লুসিভ প্রোমো কোড ব্যবহার করে আপনি অনেক ক্ষেত্রে আসল দামের চেয়েও কমে পণ্য কিনতে পারবেন।"
    },
    {
      q: "পণ্য ডেলিভারি ও প্যাকেজিং কে করে থাকে?",
      a: "অর্ডারটি রকমারির মূল সাইটে সম্পন্ন হয়। তাই পণ্যের প্যাকেজিং, গুণগত মান এবং হোম ডেলিভারি সরাসরি রকমারির ডেলিভারি টিম বা কুরিয়ার পার্টনার দ্বারা নিশ্চিত করা হয়।"
    },
    {
      q: "কোনো পণ্য পছন্দ না হলে বা নষ্ট থাকলে কীভাবে ফেরত দেবো?",
      a: "রকমারির অফিশিয়াল ৭ দিনের রিটার্ন পলিসি প্রতিটি পণ্যের ওপর প্রযোজ্য। পণ্য ফেরত বা পরিবর্তন করতে সরাসরি রকমারির হেল্পলাইন নম্বরে যোগাযোগ করলেই তারা পণ্য পরিবর্তন করে দেবে।"
    },
    {
      q: "অ্যাফিলিয়েট কমিশন কী এবং এটি কেন প্রয়োজনীয়?",
      a: "রকমারির প্রতিটি সফল অর্ডারের জন্য রকমারি আমাদের তাদের নিজস্ব তহবিল থেকে একটি বিজ্ঞাপন কমিশন দেয়। এটি আপনার অ্যাকাউন্ট থেকে কাটা হয় না। এই ক্ষুদ্র লভ্যাংশ দিয়েই আমরা আমাদের ডোমেন, হোস্টিং ও টিম খরচ চালাই।"
    }
  ];

  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-10 sm:py-16 font-sans antialiased overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-12 sm:gap-16">
        
        {/* Banner with Flat SVG Graphics for Scroll Performance */}
        <div className="relative overflow-hidden bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Decorative Vector Shapes (Lightweight SVG instead of CSS blurs for performance) */}
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="50" r="100" fill="var(--color-primary, #d90048)" />
            </svg>
          </div>
          <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-50" y="50" width="150" height="150" rx="30" transform="rotate(45 -50 50)" fill="#10b981" />
            </svg>
          </div>

          <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 text-primary rounded-2xl mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 leading-tight mb-3">
            এলাকার বাজার সম্পর্কে জানুন
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            আমরা রকমারি ডট কম-এর একটি অফিশিয়াল ও বিশ্বস্ত অ্যাফিলিয়েট পার্টনার। আমাদের প্ল্যাটফর্মে আপনি খুব সহজেই সেরা অফার, ডিসকাউন্ট কুপন ও প্রমো কোড ব্যবহারের মাধ্যমে সাশ্রয়ী মূল্যে পণ্য কিনতে পারেন।
          </p>
        </div>

        {/* Process Vector Illustration Block */}
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mb-1.5">
              অর্ডার প্রক্রিয়া কীভাবে সম্পন্ন হয়?
            </h2>
            <p className="text-zinc-500 text-xs font-semibold">
              আমাদের সাইট থেকে অর্ডার নেওয়ার সহজ পদ্ধতি
            </p>
          </div>

          {/* Graphical Flow Vector */}
          <div className="hidden md:flex justify-between items-center px-8 py-2 relative">
            {/* SVG Connecting Line */}
            <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-zinc-200 -z-10" />
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-extrabold flex items-center justify-center text-sm shadow-sm">১</div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center text-sm shadow-sm">২</div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-extrabold flex items-center justify-center text-sm shadow-sm">৩</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className={`bg-white border ${step.border} rounded-2xl p-5 flex flex-col gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-transform duration-200 hover:translate-y-[-2px]`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm sm:text-base font-black text-zinc-800 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Affiliate Commission Concept Detailed Graph Card */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-50 border border-zinc-150 text-emerald-600 rounded-xl flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-black text-zinc-900">
                অ্যাফিলিয়েশন এবং আয়ের মডেল
              </h3>
              <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-medium">
                রকমারির সাইটে লক্ষাধিক প্রোডাক্ট থাকায় আমরা একটি কন্টেন্ট শেয়ারিং ও ডিসকাউন্ট সার্ভিস হিসেবে কাজ করছি। আমাদের পাঠানো ট্রাফিকের মাধ্যমে অর্জিত প্রতিটি বিক্রয়ের রয়্যালটি কমিশন সরাসরি রকমারি ডট কম আমাদের দেয়। এর ফলে <strong>গ্রাহকদের কাছ থেকে কোনো বাড়তি টাকা নেওয়া হয় না</strong>। বরং, আপনি আমাদের সাথে থাকলে বিশেষ অফার বা প্রোমো কোডের মাধ্যমে আরও সাশ্রয়ী মূল্যে পণ্য কিনতে পারেন।
              </p>
            </div>
          </div>

          {/* Mini Flow Chart representation (Visual Graphic Element) */}
          <div className="border-t border-zinc-100 pt-5 mt-2">
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs font-bold text-zinc-500">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-primary font-black">১. ক্রেতার সুবিধা</span>
                <span className="font-semibold text-zinc-600">১০০% রিয়েল ও অফিশিয়াল প্রাইজ</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-emerald-600 font-black">২. প্রোমো কোড</span>
                <span className="font-semibold text-zinc-600">অতিরিক্ত ক্যাশব্যাক ও ডিসকাউন্ট</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-blue-600 font-black">৩. উইন-উইন মডেল</span>
                <span className="font-semibold text-zinc-600">রকমারি আমাদের কমিশন দেয়</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Order via Us Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white border border-zinc-150 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-zinc-800">শতভাগ অরিজিনাল</span>
              <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">সব পণ্য সরাসরি রকমারি ডট কম থেকে আসে।</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border border-zinc-150 rounded-2xl">
            <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-zinc-800">সহজ কুরিয়ার ও ট্র্যাকিং</span>
              <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">রকমারির নিজস্ব ফাস্ট ডেলিভারি টিম।</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white border border-zinc-150 rounded-2xl">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-zinc-800">৭ দিনের সহজ রিটার্ন</span>
              <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">যেকোনো ত্রুটিতে রয়েছে এক্সচেঞ্জ গ্যারান্টি।</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mb-1">
              সাধারণ জিজ্ঞাসা (FAQ)
            </h2>
            <p className="text-zinc-500 text-xs font-semibold">
              এলাকার বাজার ব্যবহার নিয়ে প্রচলিত কিছু প্রশ্ন ও উত্তর
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                <h4 className="text-xs sm:text-sm font-black text-zinc-900 flex items-start gap-2 leading-relaxed">
                  <span className="text-primary text-base font-black leading-none">?</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-zinc-600 text-[11px] sm:text-xs leading-relaxed font-semibold pl-4">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center text-center gap-4 pt-4 border-t border-zinc-100">
          <h3 className="text-lg sm:text-xl font-black text-zinc-900">
            তাহলে আজই কেনাকাটা শুরু করুন!
          </h3>
          <Link href="/">
            <button className="bg-primary hover:bg-primary/95 text-white font-black px-7 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20 border-none outline-none active:scale-95 text-xs sm:text-sm flex items-center gap-2">
              <span>পণ্য দেখতে হোম পেজে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
