"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 font-sans mt-auto">
      {/* Top Section: Links columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">জনপ্রিয় ক্যাটাগরি</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-650 dark:text-zinc-400">
              <li>
                <Link href="/category/412" className="hover:text-primary transition-colors">একাডেমিক বই</Link>
              </li>
              <li>
                <Link href="/category/81" className="hover:text-primary transition-colors">ইসলামি বই</Link>
              </li>
              <li>
                <Link href="/category/403" className="hover:text-primary transition-colors">ইংরেজি ভাষার বই</Link>
              </li>
              <li>
                <Link href="/category/406" className="hover:text-primary transition-colors">পশ্চিমবঙ্গের বই</Link>
              </li>
              <li>
                <Link href="/category/1983" className="hover:text-primary transition-colors">অতিরিক্ত ছাড়ের বই</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">জনপ্রিয় বিষয়</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-650 dark:text-zinc-400">
              <li>
                <Link href="/category/364" className="hover:text-primary transition-colors">উপন্যাস কালেকশন</Link>
              </li>
              <li>
                <Link href="/category/363" className="hover:text-primary transition-colors">গল্প ও কমিকস</Link>
              </li>
              <li>
                <Link href="/category/410" className="hover:text-primary transition-colors">সায়েন্স ফিকশন</Link>
              </li>
              <li>
                <Link href="/category/558" className="hover:text-primary transition-colors">কম্পিউটার ও প্রোগ্রামিং</Link>
              </li>
              <li>
                <Link href="/category/408" className="hover:text-primary transition-colors">রহস্য ও থ্রিলার</Link>
              </li>
              <li>
                <Link href="/category/32" className="hover:text-primary transition-colors">আত্ম-উন্নয়ন ও মোটিভেশনাল</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">ইলেকট্রনিক্স ও গ্যাজেট</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-650 dark:text-zinc-400">
              <li>
                <Link href="/category/2643" className="hover:text-primary transition-colors">স্মার্ট ওয়াচ</Link>
              </li>
              <li>
                <Link href="/category/2061" className="hover:text-primary transition-colors">হেডফোন ও অডিও</Link>
              </li>
              <li>
                <Link href="/category/2236" className="hover:text-primary transition-colors">ক্যালকুলেটর</Link>
              </li>
              <li>
                <Link href="/category/3971" className="hover:text-primary transition-colors">মিনি ফ্যান</Link>
              </li>
              <li>
                <Link href="/category/100000" className="hover:text-primary transition-colors">সুপার স্টোর</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">কোম্পানি ও আইনি তথ্য</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-650 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">আমাদের সম্পর্কে</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">যোগাযোগ</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">গোপনীয়তা নীতি</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">ব্যবহারের শর্তাবলী</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">অ্যাফিলিয়েট ডিসক্লোজার</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-8 dark:border-zinc-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Logo & Description */}
            <div className="flex flex-col gap-3 max-w-md">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Elakar Bazar Logo"
                  width={140}
                  height={36}
                  unoptimized
                  className="h-9 w-auto object-contain dark:invert"
                />
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-600">
                আপনার পছন্দের প্রোডাক্টগুলোর সেরা ডিল, প্রোমো কোড এবং শপিং ভাউচারের নির্ভরযোগ্য ঠিকানা। আমরা আপনার সময় ও অর্থ দুটোই বাঁচাতে সাহায্য করি।
              </p>
            </div>
            {/* Copyright */}
            <div className="text-sm text-zinc-600 dark:text-zinc-600 md:self-end">
              © {new Date().getFullYear()} Elakar Bazar. Built with passion.
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Card */}
        <div className="mt-8 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            AFFILIATE DISCLOSURE (অ্যাফিলিয়েট ডিসক্লোজার)
          </h4>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-600 leading-relaxed">
            এই ওয়েবসাইটটি সম্পূর্ণভাবে <span className="font-semibold text-red-600 dark:text-red-400">রকমারি (rokomari.com)</span>-এর একটি অনুমোদিত অ্যাফিলিয়েট প্ল্যাটফর্ম হিসেবে কাজ করে। আমরা এখানে প্রদর্শিত রকমারি-এর প্রোডাক্টগুলোর রেফারেল লিংকের মাধ্যমে কেনাকাটা করার জন্য একটি নির্দিষ্ট কমিশন অর্জন করে থাকি, যা কোনো অতিরিক্ত খরচ ছাড়াই আমাদের এই সেবাটি সচল রাখতে সাহায্য করে। রকমারি অ্যাফিলিয়েট প্রোগ্রামের অংশ হিসেবে আমরা আমাদের পাঠকদের সেরা অভিজ্ঞতা ও নির্ভরযোগ্য অফার পৌঁছে দিতে সচেষ্ট।
          </p>
        </div>
      </div>
    </footer>
  );
}
