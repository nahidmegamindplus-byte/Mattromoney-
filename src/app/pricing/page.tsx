import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function PricingPage() {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-maroon-100 text-maroon-800 text-xs font-bold px-3 py-1 rounded-full border border-maroon-200">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>স্বচ্ছ ও নিরাপদ মেম্বারশিপ প্যাকেজ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-dark font-bengali">
          আপনার প্রয়োজন অনুযায়ী সঠিক প্যাকেজ বেছে নিন
        </h1>
        <p className="text-sm text-dark-muted leading-relaxed">
          বিকাশ, নগদ ও রকেটের মাধ্যমে সরাসরি সেন্ড মানি করে দ্রুত প্রিমিয়াম সুবিধা উপভোগ করুন।
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 ${
                plan.isPopular
                  ? 'border-2 border-gold-500 shadow-xl relative scale-105 bg-gradient-to-b from-white to-ivory-100'
                  : 'border-gold-400/30 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                  সর্বাধিক জনপ্রিয়
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-dark font-bengali">{plan.nameBn}</h3>
                  <p className="text-xs text-dark-muted font-medium mt-1">{plan.nameEn} • {plan.durationDays} দিন মেয়াদ</p>
                </div>

                <div className="mb-6 border-b pb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-maroon-800">৳{plan.priceBdt}</span>
                    {plan.originalPriceBdt > plan.priceBdt && (
                      <span className="text-sm text-dark-muted line-through">৳{plan.originalPriceBdt}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-dark-muted mt-1">এককালীন পেমেন্ট, কোনো স্বয়ংক্রিয় নবায়ন নেই</p>
                </div>

                <div className="space-y-3 text-xs text-dark mb-8">
                  <p className="font-bold text-maroon-900 uppercase tracking-wider text-[11px]">প্যাকেজের প্রধান সুবিধাসমূহ:</p>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{plan.interestLimit}টি আগ্রহ প্রকাশের সুযোগ</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{plan.biodataAccessLimit}টি অভিভাবকের নম্বর আনলক</span>
                  </div>
                  {plan.directChatAllowed && (
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">সরাসরি নিরাপদ চ্যাট সুবিধা</span>
                    </div>
                  )}
                  {plan.directCallAllowed && (
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">অডিও ও ভিডিও কল সুবিধা</span>
                    </div>
                  )}
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start space-x-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href={plan.priceBdt === 0 ? '/register' : `/checkout?planId=${plan.id}`}
                  className={`w-full py-3 rounded-xl font-bold text-center text-xs transition-all flex items-center justify-center space-x-1 ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-maroon-950 shadow-md'
                      : 'bg-maroon-800 hover:bg-maroon-900 text-white'
                  }`}
                >
                  <span>{plan.priceBdt === 0 ? 'বিনামূল্যে শুরু করুন' : 'প্যাকেজটি সক্রিয় করুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Instructions notice */}
      <div className="bg-ivory-200 border border-gold-400/40 rounded-2xl p-6 text-xs text-dark-muted space-y-2 max-w-4xl mx-auto">
        <h4 className="font-bold text-sm text-dark font-bengali">পেমেন্ট সংক্রান্ত বিশেষ তথ্যাবলী:</h4>
        <p>• প্রিমিয়াম মেম্বারশিপের মূল্য বিকাশ, নগদ বা রকেটের মাধ্যমে সরাসরি সেন্ড মানি করে পরিশোধযোগ্য।</p>
        <p>• প্রতিটি লেনদেনের ট্রানজেকশন আইডি (TrxID) আমাদের সুরক্ষিত যাচাইকরণ ফর্মে প্রদান করার পর দ্রুত যাচাই সম্পন্ন করা হয়।</p>
        <p>• মেম্বারশিপের মেয়াদ শেষ হলেও আপনার বায়োডাটা বা প্রোফাইল মুছে যাবে না, সাধারণ ফ্রি প্যাকেজে রূপান্তর হবে।</p>
      </div>
    </div>
  );
}
