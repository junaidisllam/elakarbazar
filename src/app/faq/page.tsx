import Link from "next/link";
import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "জিজ্ঞাসিত প্রশ্নাবলী (FAQ) | এলাকার বাজার",
  description: "এলাকার বাজার কীভাবে কাজ করে, অর্ডার ও রিফান্ড প্রক্রিয়া এবং অ্যাফিলিয়েট কমিশন সংক্রান্ত সাধারণ প্রশ্নের উত্তর এখানে পান।",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "এলাকার বাজার কী একটি ই-কমার্স প্রতিষ্ঠান?",
      a: "না, এলাকার বাজার সরাসরি কোনো পণ্য বিক্রি বা শিপমেন্ট করে না। আমরা মূলত রকমারি ডট কম-এর একটি অফিশিয়াল ও বিশ্বস্ত অ্যাফিলিয়েট পার্টনার। আমাদের কাজ হলো রকমারি-এর সেরা বই ও ইলেকট্রনিক্স পণ্যগুলো আকর্ষণীয় ডিসকাউন্ট কুপনসহ আপনার জন্য চমৎকারভাবে সাজানো ও উপস্থাপন করা।"
    },
    {
      q: "আমি কীভাবে কোনো পণ্য অর্ডার করব?",
      a: "আমাদের সাইটের যেকোনো পণ্যের পেজে গিয়ে \"রকমারি থেকে কিনুন\" বাটনে ক্লিক করলে আপনি সরাসরি রকমারি ডট কম-এর সেই প্রোডাক্ট পেজে চলে যাবেন। সেখানে সাধারণ নিয়মেই আপনার শপিং কার্ট ও পেমেন্ট সম্পন্ন করে অর্ডার প্লেস করবেন।"
    },
    {
      q: "আপনাদের ওয়েবসাইটের লিংকের মাধ্যমে কেনাকাটা করলে কি অতিরিক্ত মূল্য দিতে হবে?",
      a: "একেবারেই না! আমাদের সাইট ব্যবহারের জন্য আপনার কোনো অতিরিক্ত ফি বা চার্জ পরিশোধ করতে হয় না। সব পণ্য আপনি রকমারির নিজস্ব দামেই পাবেন। তবে আমাদের প্রমো কোড ব্যবহারের মাধ্যমে আপনি উল্টো আরও ছাড়ে কেনাকাটা করতে পারবেন।"
    },
    {
      q: "আমি যে পণ্য অর্ডার করেছি তা কত দিনে ও কীভাবে আমার ঠিকানায় পৌঁছাবে?",
      a: "পণ্যের প্যাকেজিং ও হোম ডেলিভারি রকমারি ডট কম-এর নিজস্ব ডেলিভারি টিম বা কুরিয়ার পার্টনার দ্বারা পরিচালিত হয়। সাধারণত ঢাকা সিটির ভেতর ১-৩ দিন এবং অন্যান্য জেলায় ৩-৭ দিনের মধ্যে ডেলিভারি পাওয়া যায়।"
    },
    {
      q: "অর্ডার সংক্রান্ত সমস্যা বা অভিযোগের জন্য কার সাথে যোগাযোগ করব?",
      a: "পণ্য ভাঙা পাওয়া, ডেলিভারি হতে দেরি হওয়া, বা রিফান্ড সংক্রান্ত যেকোনো সমস্যার জন্য সরাসরি রকমারির কাস্টমার কেয়ার নম্বর ১৬২৯৭ (সকাল ৯টা থেকে রাত ১০টা) অথবা ইমেইল support@rokomari.com এ যোগাযোগ করতে হবে।"
    },
    {
      q: "এলাকার বাজার তাহলে কীভাবে আয় করে?",
      a: "আপনি আমাদের ওয়েবসাইটের রেফারেল লিংকের মাধ্যমে রকমারি থেকে কোনো পণ্য কিনলে, রকমারি তার নিজস্ব লভ্যাংশ থেকে আমাদের একটি ক্ষুদ্র কমিশন (অ্যাফিলিয়েট কমিশন) প্রদান করে। এতে আপনার ক্রয়মূল্যে কোনো প্রভাব পড়ে না।"
    }
  ];

  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans antialiased">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="text-center py-6 border-b border-zinc-100">
          <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 text-primary rounded-2xl mb-3">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-1.5">জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">এলাকার বাজার ব্যবহার ও প্রোডাক্ট পারচেজ নিয়ে আপনার সাধারণ প্রশ্নগুলোর উত্তর</p>
        </div>

        {/* FAQs List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.015)] transition-all duration-200 hover:border-zinc-300"
            >
              <h3 className="text-sm sm:text-base font-black text-zinc-900 flex items-start gap-2.5 leading-relaxed">
                <span className="text-primary text-lg font-black leading-none">?</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed font-medium pl-5 border-l-2 border-zinc-100 ml-1.5 py-1">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Still Have Questions? */}
        <div className="bg-white border border-zinc-200/85 rounded-3xl p-6 text-center flex flex-col items-center gap-3 mt-4">
          <h4 className="text-base font-black text-zinc-900">আপনার কি আরও কিছু জানার আছে?</h4>
          <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed">
            যদি আপনার কোনো কনফিউশন থাকে যা উপরে উত্তর দেওয়া হয়নি, তাহলে নির্দ্বিধায় আমাদের ইমেইল পাঠিয়ে জানান।
          </p>
          <Link href="/contact" className="mt-1">
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs border-none outline-none cursor-pointer transition-all active:scale-95">
              আমাদের সরাসরি লিখুন
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
