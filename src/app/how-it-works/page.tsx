import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-maroon-700 uppercase tracking-wider">সহজ ও মার্জিত ধাপসমূহ</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-dark font-bengali">
          আমারবন্ধন কীভাবে কাজ করে
        </h1>
        <p className="text-sm text-dark-muted">
          একটি নিরাপদ ও মর্যাদাশীল ইসলামিক পারিবারিক পরিবেশ নিশ্চিত করে পাত্র-পাত্রী খুঁজে নেয়ার নিয়মাবলী
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-400/30 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-maroon-800 text-gold-400 font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            ১
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-dark font-bengali">১০০% বিনামূল্যে সম্পূর্ণ বায়োডাটা পূরণ করুন</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              নিজের জন্য অথবা পরিবারের কোনো সদস্যের (ছেলে, মেয়ে, ভাই, বোন) জন্য সম্পূর্ণ সঠিক তথ্য দিয়ে বায়োডাটা নিবন্ধন করুন। আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে একটি ইউনিক ট্র্যাকিং নম্বর (যেমন: AB-2026-1001) প্রদান করবে।
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-400/30 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-maroon-800 text-gold-400 font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            ২
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-dark font-bengali">পছন্দমতো ফিল্টার ব্যবহার করে পাত্র-পাত্রী অনুসন্ধান</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              বয়স, উচ্চতা, জেলা, শিক্ষাগত যোগ্যতা, ধর্মীয় জীবনধারা এবং পেশা অনুযায়ী নিখুঁত অনুসন্ধান ফিল্টার ব্যবহার করুন। ম্যাচিং স্কোর অ্যালগরিদম আপনাকে সবচেয়ে উপযুক্ত প্রার্থী খুঁজে পেতে সহায়তা করবে।
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-400/30 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-maroon-800 text-gold-400 font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            ৩
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-dark font-bengali">আগ্রহ প্রকাশ ও অভিভাবকের নম্বর আনলক</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              পছন্দসই বায়োডাটায় সরাসরি আগ্রহের অনুরোধ পাঠান। অন্য পক্ষ আগ্রহ গ্রহণ করলে প্ল্যাটফর্মের নিরাপদ চ্যাট বা অডিও-ভিডিও কলের মাধ্যমে আলোচনা এগিয়ে নিতে পারবেন অথবা অভিভাবকের সরাসরি ফোন নম্বর আনলক করতে পারবেন।
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-400/30 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-maroon-800 text-gold-400 font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            ৪
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-dark font-bengali">পারিবারিক আলাপচারিতা ও শুভ বিবাহ</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              উভয় পরিবারের অভিভাবকবৃন্দ সরাসরি যোগাযোগ করে পারিবারিকভাবে বিস্তারিত যাচাই করুন এবং সুন্দর পরিবেশে শুভ বিবাহের দিনক্ষণ চূড়ান্ত করুন।
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/register"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 font-bold px-8 py-3 rounded-xl shadow-lg"
        >
          <span>আজই বায়োডাটা তৈরি করুন</span>
          <ArrowRight className="w-4 h-4 text-maroon-950" />
        </Link>
      </div>
    </div>
  );
}
