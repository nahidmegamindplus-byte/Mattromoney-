'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Heart,
  BookOpen,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Plane,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  {
    titleBn: 'সকল পাত্রের বায়োডাটা',
    subBn: 'দ্বীনদার পাত্রদের তালিকা',
    icon: '👳‍♂️',
    href: '/search?gender=MALE',
    color: 'from-blue-50 to-indigo-50 border-indigo-200 text-indigo-950',
    badge: 'জনপ্রিয়',
  },
  {
    titleBn: 'সকল পাত্রীর বায়োডাটা',
    subBn: 'পর্দানশীন পাত্রীদের তালিকা',
    icon: '🧕',
    href: '/search?gender=FEMALE',
    color: 'from-rose-50 to-pink-50 border-pink-200 text-pink-950',
    badge: 'শীর্ষ অনুসন্ধান',
  },
  {
    titleBn: 'আলেম / হাফেজ পাত্র',
    subBn: 'দ্বীনি শিক্ষায় শিক্ষিত পাত্র',
    icon: '📖',
    href: '/search?gender=MALE&searchTerm=হাফেজ',
    color: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950',
  },
  {
    titleBn: 'আলিমা / হাফেজা পাত্রী',
    subBn: 'কওমী ও দ্বীনি পাত্রী',
    icon: '🌸',
    href: '/search?gender=FEMALE&searchTerm=আলিমা',
    color: 'from-amber-50 to-yellow-50 border-amber-200 text-amber-950',
  },
  {
    titleBn: 'ডাক্তার পাত্র ও পাত্রী',
    subBn: 'এমবিবিএস ও ডেন্টাল প্রফেশনাল',
    icon: '🩺',
    href: '/search?occupationCategory=DOCTOR',
    color: 'from-cyan-50 to-sky-50 border-cyan-200 text-cyan-950',
  },
  {
    titleBn: 'ইঞ্জিনিয়ার ও আইটি',
    subBn: 'প্রকৌশলী ও প্রযুক্তি পেশাজীবী',
    icon: '💻',
    href: '/search?occupationCategory=ENGINEER',
    color: 'from-purple-50 to-violet-50 border-purple-200 text-purple-950',
  },
  {
    titleBn: 'প্রবাসী পাত্র-পাত্রী (NRB)',
    subBn: 'বিদেশে কর্মরত বা স্থায়ী',
    icon: '✈️',
    href: '/search?searchTerm=প্রবাসী',
    color: 'from-orange-50 to-amber-50 border-orange-200 text-orange-950',
  },
  {
    titleBn: 'ডিভোর্সড / পুনর্বিবাহ',
    subBn: 'সুন্নাহ সম্মত দ্বিতীয় সূচনা',
    icon: '🕊️',
    href: '/search?maritalStatus=DIVORCED',
    color: 'from-stone-50 to-slate-50 border-stone-200 text-stone-950',
  },
];

export default function CategoryBrowseSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-maroon-800 bg-gold-100/80 px-3.5 py-1 rounded-full border border-gold-400/40">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>ক্যাটাগরি ভিত্তিক বায়োডাটা</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-dark font-bengali">
          পছন্দসই ক্যাটাগরিতে জীবনসঙ্গী খুঁজুন
        </h2>
        <p className="text-xs sm:text-sm text-dark-muted">
          আপনার পছন্দ অনুযায়ী নির্দিষ্ট ক্যাটাগরি নির্বাচন করে দ্রুত বায়োডাটা ফিল্টার করুন
        </p>
      </div>

      {/* Grid on Desktop & 2-column or smooth touch carousel on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {CATEGORIES.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className={`group bg-gradient-to-br ${cat.color} p-4 sm:p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between`}
          >
            {cat.badge && (
              <span className="absolute top-2.5 right-2.5 bg-maroon-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-bengali">
                {cat.badge}
              </span>
            )}

            <div>
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-bold text-dark text-sm sm:text-base font-bengali mb-1 leading-snug">
                {cat.titleBn}
              </h3>
              <p className="text-[11px] sm:text-xs text-dark-muted line-clamp-1">
                {cat.subBn}
              </p>
            </div>

            <div className="mt-4 flex items-center space-x-1 text-xs font-bold text-maroon-800 group-hover:text-maroon-900 font-bengali">
              <span>বায়োডাটা দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
