import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অ্যাফিলিয়েট ডিসক্লোজার ও ডিসক্লেইমার | এলাকার বাজার",
  description: "এলাকার বাজার-এর অফিসিয়াল ডিসক্লোজার ও ডিসক্লেইমার। রকমারি অ্যাফিলিয়েশন ও আমাদের আয়ের মডেলের স্বচ্ছ ঘোষণা জানুন।",
};

export default function DisclaimerPage() {
  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans antialiased text-zinc-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="text-center py-6 border-b border-zinc-100">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">অফিসিয়াল ডিসক্লোজার ও ডিসক্লেইমার</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">সর্বশেষ আপডেট: ২৭ জুন, ২০২৬</p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-zinc-650 font-medium">
          
          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">১. অ্যাফিলিয়েট সম্পর্ক ঘোষণা (Affiliate Disclosure)</h2>
            <p>
              এলাকার বাজার (elakarbazar.com) একটি পার্টনার অ্যাসোসিয়েট ও প্রমোশন ভিত্তিক ওয়েবসাইট। আমরা অত্যন্ত সততার সাথে ঘোষণা করছি যে, এই ওয়েবসাইটে প্রদর্শিত প্রায় সকল পণ্যের লিংকের সাথে আমাদের রকমারি (rokomari.com) অ্যাফিলিয়েট পার্টনার আইডি যুক্ত রয়েছে। আপনি যখন আমাদের সাইটের কোনো রেফারেল লিংকে ক্লিক করে রকমারি থেকে সফলভাবে কোনো জিনিস কেনেন, তখন আমরা সেখান থেকে ক্ষুদ্র পরিমাণ একটি কমিশন অর্জন করি।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">২. আপনার ক্রয়ে কোনো অতিরিক্ত চার্জ নেই</h2>
            <p>
              আমাদের অ্যাফিলিয়েট পার্টনারশিপের কারণে আপনার পকেট থেকে <strong>কোনো অতিরিক্ত টাকা বা হিডেন ফি চার্জ করা হয় না</strong>। আপনি রকমারির মূল দামেই পণ্য কিনছেন। বরং অনেক ক্ষেত্রে আমাদের দেওয়া কুপন কোডগুলো ব্যবহারের মাধ্যমে আপনি আসল মূল্যের চেয়ে আরও কমে পণ্য কেনার সুযোগ পান। রকমারি আমাদের তাদের নিজস্ব অর্জিত মুনাফা থেকে বিজ্ঞাপন পারিশ্রমিক হিসেবে কমিশন প্রদান করে।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৩. পণ্যের তথ্য ও সঠিকতার ডিসক্লেইমার</h2>
            <p>
              আমরা এই ওয়েবসাইটে পণ্যের বিবরণ, ছবি, দাম, কাস্টমার রিভিউ এবং অফার কোডগুলো রকমারির অফিশিয়াল সোর্স থেকে সংগ্রহ করি। তবে দাম পরিবর্তন বা স্টকের প্রাপ্যতা যেকোনো সময় পরিবর্তনশীল হতে পারে। যেকোনো পণ্য কেনার আগে অনুগ্রহ করে রকমারি ডট কম-এর অফিশিয়াল প্রোডাক্ট পেজে দাম ও কন্ডিশন যাচাই করে নেওয়ার অনুরোধ রইল। তথ্যের যেকোনো অমিল বা অসঙ্গতির জন্য এলাকার বাজার কোনো আইনি দায়ভার বহন করবে না।
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900">৪. অর্ডার ও ডেলিভারি দায়বদ্ধতা</h2>
            <p>
              এলাকার বাজার নিজস্ব উদ্যোগে কোনো কাস্টমার পেমেন্ট গ্রহণ করে না, অর্ডার প্যাকেজিং বা শিপমেন্ট করে না। ডেলিভারি সংক্রান্ত যেকোনো জটিলতা, পণ্য পরিবর্তন বা রিফান্ডের জন্য আপনাকে সরাসরি রকমারি ডট কম-এর কাস্টমার কেয়ার টিমের সাথে যোগাযোগ করতে হবে। রকমারি-এর নিজস্ব শর্তাবলী ও পলিসি এ ক্ষেত্রে চূড়ান্ত বলে গণ্য হবে।
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
