import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী (Terms of Use) | এলাকার বাজার",
  description: "এলাকার বাজার ওয়েবসাইটের ব্যবহারের শর্তাবলী ও নিয়মসমূহ বিস্তারিত জেনে নিন।",
};

export default function TermsPage() {
  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans antialiased text-zinc-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="text-center py-6 border-b border-zinc-100">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">ব্যবহারের শর্তাবলী (Terms of Use)</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">সর্বশেষ আপডেট: ২৭ জুন, ২০২৬</p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-zinc-650 font-medium">
          
          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">১. শর্তাবলী গ্রহণ</h2>
            <p>
              এলাকার বাজার (elakarbazar.com) ওয়েবসাইটে প্রবেশ বা এটি ব্যবহার করার মাধ্যমে আপনি আমাদের ব্যবহারের শর্তাবলী মেনে নিচ্ছেন বলে গণ্য হবে। আপনি যদি এই শর্তাবলীর কোনো একটিতে দ্বিমত পোষণ করেন, তবে অনুগ্রহ করে সাইটটি ব্যবহার করা থেকে বিরত থাকুন।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">২. সাইটের ব্যবহার ও সেবা</h2>
            <p>
              এলাকার বাজার রকমারি-এর অনুমোদিত সহযোগী হিসেবে বিভিন্ন পণ্যের প্রচার, কুপন কোড ও প্রমোশন সংক্রান্ত তথ্য প্রকাশ করে। এই ওয়েবসাইটের সমস্ত কন্টেন্ট কেবল সাধারণ তথ্য ও পণ্য ব্রাউজিং সুবিধার জন্য প্রদান করা হয়েছে। এলাকার বাজার কোনো পূর্ব নোটিশ ছাড়াই যেকোনো সময় সাইটের কন্টেন্ট বা সেবার পরিবর্তন করার অধিকার রাখে।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৩. বুদ্ধিবৃত্তিক সম্পদ (Intellectual Property)</h2>
            <p>
              আমাদের ওয়েবসাইটের লোগো, কোড, কন্টেন্ট এবং ডিজাইন এলাকার বাজার-এর নিজস্ব সম্পত্তি। অন্য কোনো পণ্য বা কোম্পানির ট্রেডমার্ক বা ইমেজ (যেমন রকমারি ডট কম-এর লোগো বা প্রচ্ছদ ছবি) তাদের নিজস্ব স্বত্বাধিকারীর সম্পদ। অনুমতি ছাড়া আমাদের নিজস্ব কন্টেন্ট বা ছবি কপি, ডাউনলোড বা কমার্শিয়াল কাজে ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৪. দায়মুক্তি ও সীমিত দায় (Disclaimer of Liability)</h2>
            <p>
              আমরা সর্বোচ্চ চেষ্টা করি যাতে আমাদের দেওয়া অফার ও কুপন কোডগুলো সঠিক ও কার্যকরী থাকে। তবে কুপন কাজ না করা, পণ্যের দামের পরিবর্তন বা রকমারির সার্ভারে স্টক আউট হওয়া আমাদের নিয়ন্ত্রণাধীন নয়। অর্ডারের পরে পণ্য ডেলিভারি, কোয়ালিটি বা রিফান্ড সংক্রান্ত কোনো আইনি ঝামেলার জন্য এলাকার বাজার কোনোভাবেই দায়ী থাকবে না।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৫. প্রযোজ্য আইন</h2>
            <p>
              এই ব্যবহারের শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের আইন অনুযায়ী পরিচালিত ও নিয়ন্ত্রিত হবে। সাইট ব্যবহার সংক্রান্ত যেকোনো বিরোধ বা জটিলতা আইনি প্রক্রিয়ার মাধ্যমে সমাধান করা হবে।
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
