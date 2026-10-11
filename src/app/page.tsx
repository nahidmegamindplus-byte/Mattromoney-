import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HomeHeroSearch from '@/components/home/HomeHeroSearch';
import CategoryBrowseSection from '@/components/home/CategoryBrowseSection';
import IslamicValuesSection from '@/components/home/IslamicValuesSection';
import ProfileCard from '@/components/ui/ProfileCard';
import {
  ShieldCheck,
  Heart,
  Users,
  Search,
  Lock,
  Sparkles,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

export const revalidate = 60; // ISR cache for fast page loads

export default async function HomePage() {
  // Fetch verified profiles from Supabase database (dynamic count)
  const featuredProfiles = await prisma.biodata.findMany({
    where: { status: 'APPROVED' },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  const groomCount = await prisma.biodata.count({
    where: { gender: 'MALE', status: 'APPROVED' },
  });

  const brideCount = await prisma.biodata.count({
    where: { gender: 'FEMALE', status: 'APPROVED' },
  });

  // Fetch active membership plans
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. DeenPuron Hero Section (Professional Light Theme) */}
      <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE6] text-slate-800 pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
        {/* Subtle patterned background decoration */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C8A45D_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-rose-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200/80 text-[#7A1735] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#7A1735]" />
              <span>দ্বীনদার পাত্র-পাত্রী খোঁজার বিশ্বস্ত ইসলামিক ম্যাট্রিমনি</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-bengali leading-snug sm:leading-tight text-slate-900">
              দ্বীনদার জীবনসঙ্গী খুঁজে নিন{' '}
              <span className="text-[#7A1735]">
                সুন্নাহ সম্মত উপায়ে
              </span>
            </h1>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              অভিভাবকদের প্রত্যক্ষ তত্ত্বাবধানে, নারীদের পূর্ণ পর্দা ও তথ্যের সর্বোচ্চ গোপনীয়তা বজায় রেখে উপযুক্ত জীবনসঙ্গীর সন্ধান।
            </p>

            {/* Quick Action CTA buttons on Hero */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="bg-[#7A1735] hover:bg-[#601027] text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
              >
                <span>বিনামূল্যে বায়োডাটা তৈরি করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/how-it-works"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xs transition-all"
              >
                <span>কীভাবে কাজ করে</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Hero Search Component */}
          <div className="mt-8 sm:mt-12">
            <HomeHeroSearch />
          </div>

          {/* DeenPuron-style Statistics Counter Strip */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-center border-t border-slate-200/90 pt-6 sm:pt-8">
            <div className="p-3.5 bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-xs">
              <p className="text-xl sm:text-3xl font-extrabold text-[#7A1735] font-bengali">
                {groomCount > 0 ? `${groomCount}+` : '১০০%'}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">পাত্রের বায়োডাটা</p>
            </div>
            <div className="p-3.5 bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-xs">
              <p className="text-xl sm:text-3xl font-extrabold text-[#7A1735] font-bengali">
                {brideCount > 0 ? `${brideCount}+` : '১০০%'}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">পাত্রীর বায়োডাটা</p>
            </div>
            <div className="p-3.5 bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-xs">
              <p className="text-xl sm:text-3xl font-extrabold text-[#7A1735] font-bengali">৬৪ জেলা</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">উপজেলা ভিত্তিক নেটওয়ার্ক</p>
            </div>
            <div className="p-3.5 bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-xs">
              <p className="text-xl sm:text-3xl font-extrabold text-[#7A1735] font-bengali">১০০% ফ্রি</p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">বায়োডাটা তৈরি ও প্রকাশ</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DeenPuron Signature Category Browse Grid */}
      <CategoryBrowseSection />

      {/* 3. Featured Verified Profiles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 space-y-3 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-1.5 text-maroon-800 font-semibold text-xs tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4 text-maroon-700" />
              <span>সম্প্রতি অনুমোদিত ও যাচাইকৃত বায়োডাটা</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-dark font-bengali">
              কাঙ্ক্ষিত জীবনসঙ্গীর সন্ধান
            </h2>
          </div>

          <Link
            href="/search"
            className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-maroon-800 hover:text-maroon-900 border-b-2 border-gold-500 pb-0.5 transition-colors"
          >
            <span>সকল বায়োডাটা দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Profiles Grid or Clean Zero Demo Profile Empty State */}
        {featuredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredProfiles.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-gold-400/30 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-ivory-200 border border-gold-400/30 flex items-center justify-center mx-auto text-maroon-800">
              <Sparkles className="w-7 h-7 text-gold-600" />
            </div>
            <h3 className="text-xl font-bold text-dark font-bengali">
              নতুন ও পবিত্র যাত্রা শুরু করুন
            </h3>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              প্ল্যাটফর্মে কোনো ডেমো বা কৃত্রিম প্রোফাইল রাখা হয়নি। প্রথম সদস্য হিসেবে আপনার বা আপনার প্রিয়জনের সম্পূর্ণ নিরাপদ ও ভেরিফাইড বায়োডাটা বিনামূল্যে তৈরি করুন।
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 bg-maroon-800 hover:bg-maroon-900 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                <span>বিনামূল্যে বায়োডাটা তৈরি করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. DeenPuron-Style Islamic Values & Shariah Commitment Section */}
      <IslamicValuesSection />

      {/* 5. How It Works (সহজ ৪ ধাপের সুন্নাহ সম্মত বিবাহ প্রক্রিয়া) */}
      <section className="bg-ivory-300/60 py-12 sm:py-16 border-y border-gold-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <span className="text-xs font-bold text-maroon-800 tracking-wider uppercase">
              সহজ ও শরীয়াহ সম্মত প্রক্রিয়া
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-dark font-bengali">
              আমারবন্ধন যেভাবে কাজ করে
            </h2>
            <p className="text-xs sm:text-sm text-dark-muted">
              মাত্র ৪টি সুন্নাহ সম্মত ধাপে সম্পন্ন করুন আপনার কাঙ্ক্ষিত জীবনসঙ্গী নির্বাচনের প্রক্রিয়া
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm relative hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-maroon-50 border border-maroon-200 flex items-center justify-center text-maroon-800 font-bold text-lg mb-4">
                ১
              </div>
              <h3 className="font-bold text-dark text-base mb-2 font-bengali">১. বায়োডাটা তৈরি করুন</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                সম্পূর্ণ বিনামূল্যে নিজের বা পরিবারের সদস্যের বিস্তারিত শিক্ষাগত, পারিবারিক ও দ্বীনি তথ্য দিয়ে বায়োডাটা নিবন্ধন করুন।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm relative hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-maroon-50 border border-maroon-200 flex items-center justify-center text-maroon-800 font-bold text-lg mb-4">
                ২
              </div>
              <h3 className="font-bold text-dark text-base mb-2 font-bengali">২. যাচাই ও অনুমোদন</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                ভুয়া তথ্য প্রতিরোধে আমাদের অ্যাডমিন টিম বায়োডাটা কঠোরভাবে পর্যালোচনা করে অনুমোদন প্রদান করে।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm relative hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-maroon-50 border border-maroon-200 flex items-center justify-center text-maroon-800 font-bold text-lg mb-4">
                ৩
              </div>
              <h3 className="font-bold text-dark text-base mb-2 font-bengali">৩. ফিল্টার করে খুঁজুন</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                বয়স, জেলা, পেশা ও ধর্মীয় জীবনধারার ফিল্টার ব্যবহার করে আপনার উপযুক্ত পাত্র বা পাত্রীর বায়োডাটা খুঁজে বের করুন।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm relative hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-maroon-50 border border-maroon-200 flex items-center justify-center text-maroon-800 font-bold text-lg mb-4">
                ৪
              </div>
              <h3 className="font-bold text-dark text-base mb-2 font-bengali">৪. অভিভাবকের সাথে আলাপ</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                উভয় পরিবারের অভিভাবকবৃন্দের উপস্থিতিতে মর্যাদা ও সম্মানের সাথে সরাসরি কথা বলে চূড়ান্ত শুভ পরিণয় সম্পন্ন করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Membership Plans Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
          <span className="text-xs font-bold text-maroon-800 tracking-wider uppercase">
            সাশ্রয়ী ও স্বচ্ছ মেম্বারশিপ
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-dark font-bengali">
            প্যাকেজসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted">
            বিকাশ, নগদ ও রকেটের মাধ্যমে সরাসরি সেন্ড মানি করে দ্রুত অ্যাক্টিভেশন নিশ্চিত করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {plans.map((plan) => {
            let features: string[] = [];
            try {
              features = JSON.parse(plan.featuresJson);
            } catch {
              features = [];
            }

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-6 flex flex-col justify-between border transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-2 border-gold-500 shadow-xl relative scale-100 lg:scale-105'
                    : 'border-gold-400/30 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md font-bengali">
                    সবচেয়ে জনপ্রিয়
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-dark font-bengali">{plan.nameBn}</h3>
                    <p className="text-xs text-dark-muted">{plan.durationDays} দিন মেয়াদ</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-maroon-800">৳{plan.priceBdt}</span>
                      {plan.originalPriceBdt > plan.priceBdt && (
                        <span className="text-sm text-dark-muted line-through">৳{plan.originalPriceBdt}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-dark mb-6">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{plan.interestLimit}টি আগ্রহ প্রকাশের সুযোগ</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{plan.biodataAccessLimit}টি অভিভাবকের নম্বর আনলক</span>
                    </li>
                    {plan.directChatAllowed && (
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>সরাসরি চ্যাট মেসেজিং সুবিধা</span>
                      </li>
                    )}
                    {plan.directCallAllowed && (
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>অডিও ও ভিডিও কল সুবিধা</span>
                      </li>
                    )}
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.priceBdt === 0 ? '/register' : `/checkout?planId=${plan.id}`}
                  className={`w-full py-2.5 rounded-xl font-bold text-center text-xs transition-all active:scale-95 ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 shadow-md hover:from-gold-600 hover:to-gold-700'
                      : 'bg-maroon-800 hover:bg-maroon-900 text-white'
                  }`}
                >
                  {plan.priceBdt === 0 ? 'বিনামূল্যে শুরু করুন' : 'প্যাকেজটি বেছে নিন'}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. DeenPuron-Style FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-maroon-800 bg-gold-100 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
            <span>সাধারণ জিজ্ঞাসা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gold-400/30 shadow-sm">
            <h4 className="font-bold text-sm sm:text-base text-dark font-bengali mb-1.5">
              বায়োডাটা তৈরি করতে কি কোনো ফি দিতে হয়?
            </h4>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              না, আমাদের প্ল্যাটফর্মে বায়োডাটা তৈরি করা ও প্রকাশ করা শতভাগ বিনামূল্যে। আপনি নিজের বা পরিবারের যে কারও জন্য ফ্রিতে বায়োডাটা তৈরি করতে পারবেন।
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gold-400/30 shadow-sm">
            <h4 className="font-bold text-sm sm:text-base text-dark font-bengali mb-1.5">
              নারীদের ছবি কি সাধারণ মানুষের কাছে দৃশ্যমান থাকে?
            </h4>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              না। ইসলামের পূর্ণ পর্দা রক্ষার স্বার্থে নারীদের ছবি সাধারণ কোনো ব্যবহারকারী দেখতে পারবেন না। অভিভাবকের অনুমতি সাপেক্ষে যাচাইকৃত প্রস্তাবের পরই কেবলমাত্র সীমিত আকারে প্রদর্শন করা হয়।
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gold-400/30 shadow-sm">
            <h4 className="font-bold text-sm sm:text-base text-dark font-bengali mb-1.5">
              অভিভাবকের সরাসরি যোগাযোগ কীভাবে হয়?
            </h4>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              পছন্দসই বায়োডাটা পাওয়ার পর অনুরোধ পাঠালে উভয় পরিবারের অভিভাবকের সম্মতি নেওয়া হয় এবং অভিভাবকের নম্বরের মাধ্যমেই শুভ পরিণয়ের আলোচনা এগিয়ে নেওয়া হয়।
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gold-400/30 shadow-sm">
            <h4 className="font-bold text-sm sm:text-base text-dark font-bengali mb-1.5">
              বিকাশ বা নগদ সেন্ড মানি পেমেন্ট কীভাবে সক্রিয় হয়?
            </h4>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              প্রদত্ত ব্যক্তিগত বিকাশ বা নগদ নম্বরে সেন্ড মানি সম্পন্ন করে ট্রানজেকশন আইডি (TrxID) সাবমিট করলেই আমাদের ফাইন্যান্স টিম যাচাই করে দ্রুত সাবস্ক্রিপশন চালু করে দেয়।
            </p>
          </div>
        </div>
      </section>

      {/* 8. Bottom Islamic Call To Action (Professional Light Theme) */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] text-slate-900 py-16 sm:py-24 text-center px-4 border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[#7A1735] font-bold text-xs uppercase tracking-widest font-bengali">
            সুন্নাহ সম্মত দাম্পত্য জীবন
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-bengali leading-snug text-slate-900">
            দেরি না করে আজই যুক্ত হোন আমাদের ইসলামিক ম্যাট্রিমনিত
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            পবিত্র দাম্পত্য শুরু করতে সম্পূর্ণ বিনামূল্যে আপনার বায়োডাটা তৈরি করুন এবং মনের মতো দ্বীনদার জীবনসঙ্গী খুঁজে নিন।
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-[#7A1735] hover:bg-[#601027] text-white font-bold px-7 sm:px-9 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs sm:text-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>বিনামূল্যে বায়োডাটা তৈরি করুন</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
