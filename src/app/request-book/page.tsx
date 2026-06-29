"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  Upload, 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  ThumbsUp,
  FileImage
} from "lucide-react";

export default function RequestBookPage() {
  const [bookName, setBookName] = useState("");
  const [userName, setUserName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [bookLink, setBookLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<{ bookName?: string; contactInfo?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors: { bookName?: string; contactInfo?: string } = {};
    if (!bookName.trim()) {
      newErrors.bookName = "বইয়ের নাম লেখা আবশ্যিক";
    }
    if (!contactInfo.trim()) {
      newErrors.contactInfo = "ফোন নম্বর অথবা ইমেল দেওয়া আবশ্যিক";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      let coverImagePath = "N/A";
      
      // 1. Upload Cover Image if selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.success) {
            coverImagePath = uploadData.path;
          }
        }
      }

      // 2. Submit Request payload to Laravel API
      const trackingUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8000/api/analytics/track';
      const baseApiUrl = trackingUrl.replace('/api/analytics/track', '');
      
      const res = await fetch(`${baseApiUrl}/api/book-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_name: bookName,
          author_name: "N/A", // Not provided by this frontend form
          phone_number: contactInfo,
          requester_name: userName || "Anonymous",
          book_link: bookLink || null,
          cover_image: coverImagePath !== 'N/A' ? coverImagePath : null,
          additional_info: `অনুরোধকারী: ${userName || "Anonymous"} | বইয়ের লিংক: ${bookLink || "N/A"} | Cover Image: ${coverImagePath}`,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("অনুরোধ পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err) {
      console.error("Error submitting book request:", err);
      alert("সার্ভার ত্রুটি। দয়া করে পরে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-zinc-50/70 px-4 sm:px-6 py-12 font-sans">
        <div className="max-w-lg w-full bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
          {/* Decorative colored top bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-rose-500 to-rose-400"></div>

          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mt-2 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-pulse" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-955 tracking-tight">অনুরোধটি সফলভাবে পাঠানো হয়েছে!</h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-md mx-auto">
              আপনার কাঙ্ক্ষিত বইটি আমাদের সংগ্রহে যুক্ত করতে আমরা দ্রুত ব্যবস্থা নিচ্ছি। বইটি পাওয়া মাত্রই আপনার সাথে যোগাযোগ করা হবে।
            </p>
          </div>

          <div className="w-full border-t border-dashed border-zinc-200 pt-6 flex flex-col gap-3 mt-2">
            <div className="bg-zinc-50/80 rounded-2xl p-5 text-left flex flex-col gap-3 border border-zinc-150 relative">
              {/* Ticket cutout decoration */}
              <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-50/70 rounded-full border-r border-zinc-200"></div>
              <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-50/70 rounded-full border-l border-zinc-200"></div>

              <div className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest">অনুরোধের রসিদ (REQUEST RECEIPT)</div>
              
              <div className="flex gap-4 items-start">
                {imagePreview ? (
                  <div className="relative h-20 w-14 bg-white rounded-md border border-zinc-200 shadow-sm overflow-hidden flex-shrink-0">
                    <img src={imagePreview} alt="Requested Cover" className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="h-20 w-14 bg-zinc-100 rounded-md border border-zinc-200 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-7 w-7 text-zinc-300" />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <div className="text-sm font-black text-zinc-800 leading-snug truncate">
                    {bookName}
                  </div>
                  {userName && (
                    <div className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="truncate">অনুরোধকারী: {userName}</span>
                    </div>
                  )}
                  <div className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">যোগাযোগ: {contactInfo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <button
              onClick={() => {
                setBookName("");
                setUserName("");
                setContactInfo("");
                setBookLink("");
                removeImage();
                setIsSubmitted(false);
              }}
              className="flex-1 border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 font-bold py-3.5 rounded-xl text-sm cursor-pointer transition-all active:scale-95 bg-white outline-none"
            >
              আরেকটি অনুরোধ করুন
            </button>
            <Link href="/" className="flex-1">
              <button className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl text-sm cursor-pointer transition-all active:scale-95 border-none outline-none shadow-md shadow-primary/20 flex items-center justify-center gap-1.5">
                <span>হোম পেজে ফিরে যান</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-zinc-500 hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        {/* 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Info and Steps (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-24">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-primary uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full w-fit">Request Service</span>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight leading-none">
                আপনার পছন্দের বইটি <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">অনুরোধ করুন</span>
              </h1>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed mt-1">
                রকমারি বা লাইব্রেরিতে কাঙ্ক্ষিত বইটি খুঁজে না পেলে আমাদের জানান। আমরা দ্রুততম সময়ে সেটি আপনার দরজায় পৌঁছে দেওয়ার ব্যবস্থা করব।
              </p>
            </div>

            {/* Timeline Steps */}
            <div className="flex flex-col gap-6 bg-zinc-50/50 p-6 rounded-2xl border border-zinc-200/60">
              <h3 className="text-sm font-extrabold text-zinc-800">অনুরোধের ধাপসমূহ</h3>
              <div className="flex flex-col gap-6 relative pl-3">
                {/* Visual Line connector */}
                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-zinc-200"></div>

                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs flex items-center justify-center flex-shrink-0 z-10">1</div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-zinc-850">ফরম পূরণ করুন</h4>
                    <p className="text-xs text-zinc-500 font-medium">বইয়ের নাম ও আপনার যোগাযোগের তথ্য দিয়ে ফরমটি সাবমিট করুন।</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs flex items-center justify-center flex-shrink-0 z-10">2</div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-zinc-850">আমরা বইটি সংগ্রহ করব</h4>
                    <p className="text-xs text-zinc-500 font-medium">আমাদের টিম প্রকাশকদের সাথে যোগাযোগ করে বইটি সংগ্রহ করার সর্বোচ্চ চেষ্টা করবে।</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs flex items-center justify-center flex-shrink-0 z-10">3</div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-zinc-850">পেমেন্ট ও ডেলিভারি</h4>
                    <p className="text-xs text-zinc-500 font-medium">বইটি প্রস্তুত হলে আপনাকে ফোন বা ইমেলে জানিয়ে কনফার্ম করা হবে।</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges / Small Trust Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-zinc-150 p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-xs">
                <Clock className="h-5 w-5 text-rose-500" />
                <span className="text-[10px] text-zinc-400 font-extrabold">সাপোর্ট টাইম</span>
                <span className="text-xs font-black text-zinc-700">২৪/৭ সাপোর্ট</span>
              </div>
              <div className="bg-white border border-zinc-150 p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-xs">
                <ThumbsUp className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] text-zinc-400 font-extrabold">সফলতার হার</span>
                <span className="text-xs font-black text-zinc-700">৯৫% এর বেশি</span>
              </div>
              <div className="bg-white border border-zinc-150 p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-xs">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                <span className="text-[10px] text-zinc-400 font-extrabold">নিরাপত্তা</span>
                <span className="text-xs font-black text-zinc-700">১০০% ভেরিফাইড</span>
              </div>
            </div>
          </div>

          {/* Column 2: The Request Form Card (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-zinc-100/55 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-rose-500/70 to-rose-400/50"></div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Form Heading Header */}
              <div className="pb-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-zinc-800">অনুরোধের বিবরণ পূরণ করুন</h2>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">* চিহ্নিত ঘরগুলো পূরণ করা আবশ্যিক</p>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Book Name (Required) */}
              <div className="flex flex-col gap-1.5 group">
                <label htmlFor="bookName" className="text-xs sm:text-sm font-bold text-zinc-700 flex items-center gap-1">
                  <span>কাঙ্ক্ষিত বইয়ের নাম</span>
                  <span className="text-primary font-black">*</span>
                </label>
                <div className="relative flex items-center">
                  <BookOpen className="absolute left-3.5 h-4.5 w-4.5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <input
                    id="bookName"
                    type="text"
                    placeholder="যেমন: প্যারাডক্সিক্যাল সাজিদ অথবা আদর্শ হিন্দু হোটেল"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/10 focus:border-primary ${
                      errors.bookName ? "border-red-400 focus:ring-red-100 focus:border-red-400" : "border-zinc-200"
                    }`}
                  />
                </div>
                {errors.bookName && (
                  <span className="text-xs text-red-500 font-extrabold flex items-center gap-1 mt-0.5 animate-in slide-in-from-top-1">
                    ⚠️ {errors.bookName}
                  </span>
                )}
              </div>

              {/* Grid for Name & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* User Name (Optional) */}
                <div className="flex flex-col gap-1.5 group">
                  <label htmlFor="userName" className="text-xs sm:text-sm font-bold text-zinc-700 flex items-center gap-1">
                    <span>আপনার নাম</span>
                    <span className="text-zinc-400 font-medium">(ঐচ্ছিক)</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 h-4.5 w-4.5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="userName"
                      type="text"
                      placeholder="যেমন: আহসান হাবিব"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 py-3.5 pl-11 pr-4 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/10 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Contact Info (Required) */}
                <div className="flex flex-col gap-1.5 group">
                  <label htmlFor="contactInfo" className="text-xs sm:text-sm font-bold text-zinc-700 flex items-center gap-1">
                    <span>ফোন নম্বর অথবা ইমেল</span>
                    <span className="text-primary font-black">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4.5 w-4.5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="contactInfo"
                      type="text"
                      placeholder="যেমন: 017XXXXXXXX বা info@mail.com"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/10 focus:border-primary ${
                        errors.contactInfo ? "border-red-400 focus:ring-red-100 focus:border-red-400" : "border-zinc-200"
                      }`}
                    />
                  </div>
                  {errors.contactInfo && (
                    <span className="text-xs text-red-500 font-extrabold flex items-center gap-1 mt-0.5 animate-in slide-in-from-top-1">
                      ⚠️ {errors.contactInfo}
                    </span>
                  )}
                </div>

              </div>

              {/* Book Link (Optional) */}
              <div className="flex flex-col gap-1.5 group">
                <label htmlFor="bookLink" className="text-xs sm:text-sm font-bold text-zinc-700 flex items-center gap-1">
                  <span>বইয়ের কোনো লিঙ্ক বা রকমারি লিঙ্ক</span>
                  <span className="text-zinc-400 font-medium">(ঐচ্ছিক)</span>
                </label>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-3.5 h-4.5 w-4.5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <input
                    id="bookLink"
                    type="url"
                    placeholder="যেমন: https://www.rokomari.com/book/..."
                    value={bookLink}
                    onChange={(e) => setBookLink(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 py-3.5 pl-11 pr-4 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/10 focus:border-primary"
                  />
                </div>
              </div>

              {/* Book Image Cover (Optional) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-bold text-zinc-700 flex items-center gap-1">
                  <span>বইয়ের প্রচ্ছদ/ছবি আপলোড করুন</span>
                  <span className="text-zinc-400 font-medium">(ঐচ্ছিক)</span>
                </label>

                {/* Upload Box */}
                {!imagePreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-200 hover:border-primary/50 bg-zinc-50/40 hover:bg-rose-50/10 rounded-2xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="p-3.5 bg-white rounded-2xl shadow-xs border border-zinc-150 group-hover:scale-105 transition-transform duration-300">
                      <Upload className="h-5.5 w-5.5 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <span className="text-xs sm:text-sm font-extrabold text-zinc-700">ক্লিক করে ছবি আপলোড করুন</span>
                      <span className="text-[10px] text-zinc-400 font-semibold">PNG, JPG বা JPEG ফরম্যাট (সর্বোচ্চ ৫ মেগাবাইট)</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  /* Premium Image Preview Mode styled as a realistic book cover card */
                  <div className="relative border border-zinc-200/80 bg-zinc-50 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in duration-300">
                    <div className="relative h-24 w-18 bg-white rounded-lg border border-zinc-200 shadow-md overflow-hidden flex items-center justify-center flex-shrink-0 transition-transform duration-350 hover:scale-102">
                      {/* Realistic book shadow overlay */}
                      <div className="absolute inset-y-0 left-0 w-1 bg-black/10 z-10 shadow-r"></div>
                      <img src={imagePreview} alt="Book cover preview" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                        <FileImage className="h-3 w-3" />
                        <span>প্রচ্ছদ নির্বাচন করা হয়েছে</span>
                      </div>
                      <div className="text-sm font-black text-zinc-800 truncate">{imageFile?.name}</div>
                      <div className="text-[10px] text-zinc-450 font-bold">{(imageFile!.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 hover:bg-zinc-200/70 rounded-full cursor-pointer transition-colors border-none outline-none flex items-center justify-center flex-shrink-0"
                      aria-label="Remove image"
                    >
                      <X className="h-5 w-5 text-zinc-500 hover:text-zinc-800" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 h-auto text-sm sm:text-base shadow-lg shadow-primary/20 cursor-pointer border-none outline-none active:scale-[0.99] mt-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-white"></div>
                    <span>অনুরোধ পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <span>অনুরোধ পাঠান (Submit Request)</span>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
