import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | এলাকার বাজার",
  description: "এলাকার বাজার-এর গোপনীয়তা নীতি। আমরা কীভাবে আমাদের ব্যবহারকারীদের গোপনীয় তথ্য ও কুকিজ পরিচালনা করি তা বিস্তারিত জেনে নিন।",
};

export default function PrivacyPage() {
  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans antialiased text-zinc-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="text-center py-6 border-b border-zinc-100">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">গোপনীয়তা নীতি (Privacy Policy)</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">সর্বশেষ আপডেট: ২৭ জুন, ২০২৬</p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-zinc-650 font-medium">
          
          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">১. ভূমিকা</h2>
            <p>
              এলাকার বাজার (elakarbazar.com)-এ আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান অগ্রাধিকার। আপনি যখন আমাদের সাইট ব্যবহার করেন, তখন আমরা কীভাবে আপনার তথ্য সংগ্রহ, সংরক্ষণ ও ব্যবহার করি—তা স্পষ্ট বোঝাতে এই গোপনীয়তা নীতি তৈরি করা হয়েছে।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">২. তথ্য সংগ্রহ</h2>
            <p>
              আমরা সরাসরি আপনার কোনো ব্যাংকিং কার্ড নম্বর, পাসওয়ার্ড বা স্পর্শকাতর ব্যক্তিগত তথ্য সংগ্রহ বা সংরক্ষণ করি না। তবে সাধারণ ব্রাউজিং অভিজ্ঞতার উন্নতির জন্য আমরা কিছু নন-পার্সোনাল ডেমোগ্রাফিক তথ্য সংগ্রহ করতে পারি:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1.5">
              <li>ডিভাইসের ধরন এবং ব্যবহৃত ব্রাউজার।</li>
              <li>আইপি অ্যাড্রেস এবং আপনার দেশের সাধারণ ভৌগোলিক তথ্য।</li>
              <li>আমাদের সাইটের কোনো পণ্য বা লিংকে ক্লিক করার ইতিহাস।</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৩. কুকিজ (Cookies)</h2>
            <p>
              এলাকার বাজার ব্যবহারকারীর ব্রাউজিং পছন্দ বুঝতে এবং রিডাইরেক্ট ট্র্যাকিংয়ের জন্য কুকিজ ব্যবহার করে। এছাড়া অ্যাফিলিয়েশন ট্র্যাকিংয়ের উদ্দেশ্যে আমরা রকমারি (rokomari.com) এর ট্র্যাকিং কুকি ব্যবহার করতে পারি। এটি করার মূল উদ্দেশ্য হলো আপনি যখন আমাদের রেফারেল লিংকের মাধ্যমে রকমারি থেকে কোনো জিনিস কিনবেন, তা যাতে কমিশন হিসেবে সঠিকভাবে চিহ্নিত হতে পারে।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৪. তৃতীয় পক্ষের ওয়েবসাইট লিংক</h2>
            <p>
              আমাদের প্ল্যাটফর্মে রকমারি ডট কম সহ বিভিন্ন তৃতীয় পক্ষের ওয়েবসাইটের লিংক রয়েছে। আপনি যখন আমাদের সাইটের কোনো লিংক ব্যবহার করে অন্য কোনো ওয়েবসাইটে প্রবেশ করবেন, তখন সেই ওয়েবসাইটটির নিজস্ব গোপনীয়তা নীতি ও ব্যবহারের শর্তাবলী প্রযোজ্য হবে। তৃতীয় পক্ষের কোনো কর্মকাণ্ডের জন্য এলাকার বাজার দায়বদ্ধ থাকবে না।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৫. নিরাপত্তা নীতি</h2>
            <p>
              আমরা আমাদের ওয়েবসাইটে নিরাপদ যোগাযোগ (HTTPS) প্রোটোকল ব্যবহার করি। আমাদের ব্যবহারকারীদের ব্রাউজিং ডেটা সুরক্ষিত রাখতে আধুনিক নিরাপত্তা ব্যবস্থা জোরদার করা হয়েছে।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৬. গোপনীয়তা নীতির পরিবর্তন</h2>
            <p>
              এলাকার বাজার যেকোনো সময়ে এই গোপনীয়তা নীতি পরিবর্তন করার অধিকার সংরক্ষণ করে। যেকোনো পরিবর্তন এই পেজে আপডেটেড তারিখসহ প্রকাশ করা হবে। আমাদের গোপনীয়তা নীতি নিয়ে কোনো প্রশ্ন থাকলে অনুগ্রহ করে আমাদের <a href="/contact" className="text-primary font-bold hover:underline">যোগাযোগ পেজে</a> ইমেইল করুন।
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
