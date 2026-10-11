import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function SuccessStoriesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-maroon-700 uppercase tracking-wider">পারিবারিক বন্ধনের আনন্দ</span>
        <h1 className="text-3xl font-bold text-dark font-bengali">সফলতার গল্প ও বিবাহ নিবন্ধন</h1>
        <p className="text-xs text-dark-muted">আমারবন্ধনে সম্পন্ন হওয়া পবিত্র দাম্পত্য জীবনের গল্পসমূহ</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4 text-xs text-dark-muted leading-relaxed">
        <h3 className="font-bold text-sm text-dark font-bengali">আপনার শুভ পরিণয়ের গল্প শেয়ার করুন</h3>
        <p>
          আমারবন্ধন প্ল্যাটফর্মের মাধ্যমে পরিচয় ও পারিবারিক সম্মতিক্রমে যাদের শুভ বিবাহ সম্পন্ন হয়েছে, তারা আমাদের সম্পাদকীয় টিমের কাছে নিজ বিবাহ সনদ বা কাবিননামার যাচাই সাপেক্ষে সফলতার অভিজ্ঞতা শেয়ার করতে পারেন।
        </p>
        <p>
          সকল গল্প এবং প্রশংসাপত্র কেবল উভয় পক্ষের লিখিত সম্মতি ও সত্যতা যাচাইয়ের পরেই সংরক্ষণ ও প্রকাশ করা হয়।
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-block bg-maroon-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            আমাদের কাছে আপনার অভিজ্ঞতা পাঠান
          </Link>
        </div>
      </div>
    </div>
  );
}
