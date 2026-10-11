import React from 'react';
import { Heart, ShieldCheck, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dark font-bengali">আমাদের সম্পর্কে (About AmarBondhon)</h1>
        <p className="text-xs text-dark-muted">বাংলাদেশের নির্ভরযোগ্য ও মর্যাদাপূর্ণ ম্যাট্রিমনি প্ল্যাটফর্ম</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4 text-xs text-dark-muted leading-relaxed">
        <p>
          আমারবন্ধন (AmarBondhon Matrimony) বাংলাদেশের বিবাহযোগ্য নাগরিক ও তাদের সম্মানিত পরিবারের জন্য একটি নিরাপদ, দ্বীনদার ও স্বচ্ছ প্ল্যাটফর্ম। আধুনিক প্রযুক্তির সাথে ঐতিহ্যবাহী পারিবারিক ও সামাজিক মূল্যবোধের মেলবন্ধন ঘটিয়ে আমরা উপযুক্ত জীবনসঙ্গী খোঁজার পথকে সহজ ও সম্মানিত করেছি।
        </p>
        <p>
          আমরা বিশ্বাস করি বিয়ে দুটি মানুষের কেবল মিল নয়, দুটি পরিবারের বন্ধন। তাই আমাদের প্রতিটি কার্যক্রমে সততা, জাতীয় পরিচয়পত্র যাচাইকরণ এবং তথ্যের গোপনীয়তা নিশ্চিত করা হয়।
        </p>
      </div>
    </div>
  );
}
