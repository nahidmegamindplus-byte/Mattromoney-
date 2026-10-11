'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  User,
  Heart,
  CreditCard,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Unlock,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user, activeSubscription } = useAuth();
  const { lang, t } = useLanguage();
  const [biodata, setBiodata] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        const res = await fetch('/api/biodata');
        const data = await res.json();
        if (data.success) {
          setBiodata(data.biodata);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBiodata();
  }, []);

  const completionPercent = biodata?.completionPercentage || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-white rounded-3xl p-6 sm:p-8 border border-gold-400/40 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-gold-400 text-xs font-semibold uppercase tracking-wider block">
            স্বাগতম, {user?.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali mt-0.5">
            আপনার ম্যাট্রিমনি ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-ivory-200 mt-1">
            বায়োডাটার স্ট্যাটাস ও পছন্দসই পাত্র-পাত্রীর আপডেটসমূহ এখানে পর্যবেক্ষণ করুন
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/search"
            className="bg-gold-500 hover:bg-gold-600 text-maroon-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow transition-all"
          >
            <Search className="w-3.5 h-3.5 text-maroon-950" />
            <span>পাত্র-পাত্রী খুঁজুন</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row: Biodata Completion, Remaining Interests, Contact Unlocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Biodata Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-dark">
            <span className="font-bengali">বায়োডাটা সম্পূর্ণতা</span>
            <span className="text-maroon-800 font-extrabold">{completionPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gold-500 to-maroon-700 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] pt-1">
            <span className="text-dark-muted">
              {biodata ? `আইডি: ${biodata.biodataNumber}` : 'বায়োডাটা তৈরি করা হয়নি'}
            </span>
            <Link href="/dashboard/biodata" className="text-maroon-800 font-bold hover:underline">
              {biodata ? 'সম্পাদনা করুন →' : 'তৈরি করুন →'}
            </Link>
          </div>
        </div>

        {/* Interests Quota */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-dark">
            <span className="font-bengali">অবশিষ্ট আগ্রহ প্রকাশের সুযোগ</span>
            <Heart className="w-4 h-4 text-maroon-700" />
          </div>
          <p className="text-3xl font-extrabold text-maroon-800">
            {activeSubscription ? activeSubscription.interestsRemaining : 0}টি
          </p>
          <span className="text-[11px] text-dark-muted block">
            {activeSubscription ? `${activeSubscription.plan.nameBn}` : 'ফ্রি লিমিট শেষ হলে আপগ্রেড করুন'}
          </span>
        </div>

        {/* Contact Unlocks Quota */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-dark">
            <span className="font-bengali">অভিভাবকের নম্বর আনলক লিমিট</span>
            <Unlock className="w-4 h-4 text-gold-600" />
          </div>
          <p className="text-3xl font-extrabold text-maroon-800">
            {activeSubscription ? activeSubscription.biodataAccessRemaining : 0}টি
          </p>
          <span className="text-[11px] text-dark-muted block">
            সরাসরি অভিভাবকের সঙ্গে যোগাযোগের সুযোগ
          </span>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-dark font-bengali">
            আপনার পছন্দের জীবনসঙ্গীর মানদণ্ড অনুযায়ী খুঁজুন
          </h3>
          <p className="text-xs text-dark-muted">
            শিক্ষা, ধর্মীয় অনুশাসন এবং জেলা ফিল্টার করে কাঙ্ক্ষিত পাত্র-পাত্রীর বায়োডাটা অনুসন্ধান করুন।
          </p>
        </div>
        <Link
          href="/search"
          className="bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center space-x-1"
        >
          <span>অনুসন্ধান পেইজে যান</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
