'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  EyeOff,
  UserCheck,
  HeartHandshake,
  FileCheck2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function IslamicValuesSection() {
  const points = [
    {
      icon: EyeOff,
      title: 'নারীদের পূর্ণ পর্দা ও ছবির নিরাপত্তা',
      desc: 'কোনো নারীর ছবি সরাসরি উন্মুক্ত নয়। শুধুমাত্র অভিভাবকের অনুমতি ও পাত্রের যাচাইকৃত অনুরোধ সাপেক্ষে গোপনীয়ভাবে প্রদর্শন করা হয়।',
    },
    {
      icon: UserCheck,
      title: 'অভিভাবকের সরাসরি সম্পৃক্ততা',
      desc: 'যোগাযোগের শুরু থেকেই পাত্র ও পাত্রী উভয় পক্ষের সম্মানিত অভিভাবকের সক্রিয় অংশগ্রহণ ও মতামত নিশ্চিত করা হয়।',
    },
    {
      icon: HeartHandshake,
      title: '০% চ্যাটিং বা ডেটিং অপসংস্কৃতি',
      desc: 'এটি কোনো বিনোদন বা ডেটিং প্ল্যাটফর্ম নয়; শুধুমাত্র গম্ভীর ও দায়িত্বশীল বিয়ের আলোচনার জন্য নির্ধারিত শরীয়াহ সম্মত মাধ্যম।',
    },
    {
      icon: FileCheck2,
      title: 'কঠোর তথ্য ও এনআইডি যাচাই',
      desc: 'ভুয়া প্রোফাইল প্রতিরোধে নিয়মিত অডিট এবং প্রাতিষ্ঠানিক ও জাতীয় পরিচয়পত্র যাচাইয়ের মাধ্যমে নির্ভুল তথ্য সংরক্ষণ করা হয়।',
    },
  ];

  return (
    <section className="bg-[#FAF8F5] text-slate-800 py-14 sm:py-20 border-y border-slate-200/90 relative overflow-hidden">
      {/* Subtle Islamic pattern background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A45D_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#7A1735] bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#7A1735]" />
            <span>দ্বীনপূরণ দর্শন ও শরীয়াহ প্রতিশ্রুতি</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-bengali leading-tight text-slate-900">
            সুন্নাহ সম্মত পবিত্র দাম্পত্য গঠনে{' '}
            <span className="text-[#7A1735]">
              আমাদের অবিচল অঙ্গীকার
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            রাসূলুল্লাহ (সা.) বলেছেন: &quot;যখন কোনো ব্যক্তি বিবাহ করল, সে যেন তার দ্বীনের অর্ধেক পূর্ণ করল।&quot; (বায়হাকী)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-300 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#7A1735] mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-bengali mb-2">
                    {pt.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Callout Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-base sm:text-lg text-slate-900 font-bengali flex items-center justify-center sm:justify-start">
              <Lock className="w-4 h-4 mr-2 text-[#7A1735]" />
              আপনার পরিবারের আত্মমর্যাদা ও নিরাপত্তার নিশ্চয়তা
            </h4>
            <p className="text-xs text-slate-600">
              অভিভাবকদের অনুমতি ব্যতিরেকে কোনো ব্যক্তিগত তথ্য তৃতীয় কোনো পক্ষের কাছে উন্মুক্ত করা হয় না।
            </p>
          </div>

          <Link
            href="/safety"
            className="flex-shrink-0 inline-flex items-center space-x-1.5 bg-[#7A1735] hover:bg-[#601027] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <span>নিরাপত্তা নীতিমালা</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
