"use client";

import { useState } from "react";
import { Send, HelpCircle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const trackingUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8000/api/analytics/track';
      const baseApiUrl = trackingUrl.replace('/api/analytics/track', '');
      
      const payloadSubject = `[${reason || "General"}] ${subject}` + (phone ? ` (Phone: ${phone})` : '');

      const res = await fetch(`${baseApiUrl}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject: payloadSubject,
          message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setReason("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg("বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setErrorMsg("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। দয়া করে ইন্টারনেট কানেকশন চেক করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-50/50 min-h-screen pt-4 pb-16 font-sans antialiased">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">যোগাযোগ করুন</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">যেকোনো মতামত, পরামর্শ বা ব্যবসায়িক প্রস্তাবনার জন্য ফর্মটি পূরণ করুন</p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 flex flex-col gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          
          {/* Informational Guidance Block inside the form card */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex gap-3 text-emerald-800">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black">গুরুত্বপূর্ণ নির্দেশনাবলী:</span>
              <p className="text-[11px] leading-relaxed font-semibold">
                এলাকার বাজার রকমারির একটি অনুমোদিত সহযোগী প্ল্যাটফর্ম। অর্ডার ট্র্যাকিং, ডেলিভারি বিলম্ব বা পণ্য পরিবর্তনের মতো বিষয়ের জন্য সরাসরি রকমারি ডট কম-এর মূল কাস্টমার কেয়ারে যোগাযোগ করুন। ওয়েবসাইট সম্পর্কিত যেকোনো কারিগরি সমস্যা, পার্টনারশিপ বা ব্যবসায়িক প্রসঙ্গের জন্য নিচের ফর্মটি ব্যবহার করুন।
              </p>
            </div>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs font-bold">
                আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-xs font-bold">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-black text-zinc-700">আপনার নাম *</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="নাম লিখুন"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 outline-none focus:border-primary transition-colors bg-zinc-50/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-black text-zinc-700">ইমেইল ঠিকানা *</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ইমেইল লিখুন"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 outline-none focus:border-primary transition-colors bg-zinc-50/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-black text-zinc-700">মোবাইল নম্বর (ঐচ্ছিক)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="মোবাইল নম্বর লিখুন"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 outline-none focus:border-primary transition-colors bg-zinc-50/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reason" className="text-xs font-black text-zinc-700">যোগাযোগের প্রধান কারণ *</label>
                <select 
                  id="reason" 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 outline-none focus:border-primary transition-colors bg-zinc-50/30 cursor-pointer"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="ব্যবসায়িক পার্টনারশিপ">ব্যবসায়িক পার্টনারশিপ বা বিজ্ঞাপন</option>
                  <option value="সাইটের মতামত">সাইট সংক্রান্ত মতামত ও পরামর্শ</option>
                  <option value="নতুন কুপন/ডিল">নতুন কুপন বা ডিল সংক্রান্ত তথ্য</option>
                  <option value="প্রযুক্তিগত সমস্যা">কোনো প্রযুক্তিগত সমস্যা বা রিপোর্ট</option>
                  <option value="অন্যান্য জিজ্ঞাসা">অন্যান্য সাধারণ জিজ্ঞাসা</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-black text-zinc-700">বিষয় *</label>
              <input 
                type="text" 
                id="subject" 
                required 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="সংক্ষেপে বিষয়ের নাম লিখুন"
                className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 outline-none focus:border-primary transition-colors bg-zinc-50/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-black text-zinc-700">বিস্তারিত বার্তা *</label>
              <textarea 
                id="message" 
                rows={5} 
                required 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার বার্তাটি এখানে বিস্তারিত লিখুন..."
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none focus:border-primary transition-colors bg-zinc-50/30 resize-none leading-relaxed"
              />
            </div>

            {/* Helper warning card inside form */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 flex gap-3 text-zinc-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-zinc-500" />
              <p className="text-[11px] leading-relaxed font-semibold">
                সাধারণত আমরা ইমেইল পাওয়ার ২৪-৪৮ ঘণ্টার মধ্যে উত্তর দেওয়ার চেষ্টা করি। আপনার সঠিক ইমেইল ও প্রয়োজনীয় তথ্য দিলে আমাদের যোগাযোগ করতে সুবিধা হবে।
              </p>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-primary hover:bg-primary/95 text-white font-black py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/10 border-none outline-none active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 w-full mt-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান (Send Message)"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
