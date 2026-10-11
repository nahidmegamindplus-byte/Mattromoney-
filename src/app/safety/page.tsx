import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Lock, Users, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function SafetyCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-maroon-700 uppercase tracking-wider">সতর্কতা ও নিরাপত্তা নির্দেশিকা</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-dark font-bengali">
          আমারবন্ধন নিরাপত্তা কেন্দ্র (Safety Center)
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          বিবাহের মতো গুরুত্বপূর্ণ সিদ্ধান্তে আপনার সুরক্ষা ও পরিবারের গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-rose-50 border border-rose-300 p-6 rounded-2xl space-y-2 text-rose-900">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
            <span>জরুরি আর্থিক সতর্কতা:</span>
          </div>
          <p className="text-xs leading-relaxed">
            কোনো পাত্র, পাত্রী বা তাদের আত্মীয় পরিচয় দিয়ে যদি বিয়ের আলোচনার অজুহাতে ব্যক্তিগতভাবে টাকা, বিকাশ পিন বা ব্যাংকিং ওটিপি (OTP) দাবি করে, সাথে সাথে প্ল্যাটফর্মে রিপোর্ট করুন। আমারবন্ধন কখনোই গ্রাহকদের কাছে তাদের ব্যক্তিগত মোবাইল ওয়ালেট পিন চায় না।
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-dark font-bengali flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-emerald-700" />
            নিরাপদ পাত্র-পাত্রী নির্বাচনের নিয়মাবলী
          </h3>
          <ul className="space-y-3 text-xs text-dark-muted leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>অভিভাবকদের সম্পৃক্ত রাখুন:</strong> যোগাযোগের প্রথম ধাপ থেকেই সম্মানিত অভিভাবক বা পরিবারের প্রবীণ সদস্যদের আলোচনায় রাখুন।</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>শিক্ষাগত ও চাকুরীর তথ্য যাচাই:</strong> চূড়ান্ত সিদ্ধান্তের পূর্বে প্রার্থীর প্রাতিষ্ঠানিক সনদ ও কর্মক্ষেত্রের সত্যতা নিজ দায়িত্বে নিশ্চিত করুন।</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>প্রথম সাক্ষাতের স্থান:</strong> পারিবারিক পরিবেশ অথবা প্রকাশ্যে প্রকাশ্য স্থানে উভয় পরিবারের উপস্থিতিতে সাক্ষাৎ করুন।</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
