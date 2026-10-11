import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const faqs = [
    {
      q: 'আমারবন্ধনে বায়োডাটা তৈরি করতে কি ফি দিতে হবে?',
      a: 'না, সাধারণ বায়োডাটা তৈরি, প্রকাশ ও বেসিক ফিল্টারিং অনুসন্ধান সম্পূর্ণ বিনামূল্যে।',
    },
    {
      q: 'বিকাশ বা নগদ সেন্ড মানি কীভাবে কাজ করে?',
      a: 'চেকআউট পেইজে দেওয়া আমাদের নির্দিষ্ট পার্সোনাল/পিআরএ নম্বরে সঠিক টাকা সেন্ড মানি করে ট্রানজেকশন আইডি (TrxID) ফর্মে প্রদান করুন। ফাইন্যান্স টিম যাচাই করে মেম্বারশিপ দ্রুত চালু করে দেবে।',
    },
    {
      q: 'ছবি ও ব্যক্তিগত তথ্যের নিরাপত্তা কীভাবে নিশ্চিত হয়?',
      a: 'নারীদের ছবি আপনি চাইলে "অনুরোধ সাপেক্ষে দৃশ্যমান" রাখতে পারেন। এছাড়াও অভিভাবকের নম্বর শুধুমাত্র অনুমোদিত প্রিমিয়াম সদস্য ছাড়া সর্বসাধারণের কাছে লক থাকে।',
    },
    {
      q: 'প্যাকেজের মেয়াদ শেষ হলে কি বায়োডাটা মুছে যাবে?',
      a: 'না, আপনার বায়োডাটা বা একাউন্ট মোটেও ডিলিট হবে না। এটি স্বয়ংক্রিয়ভাবে ফ্রি স্টার্টার মোডে রূপান্তরিত হবে।',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dark font-bengali">সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</h1>
        <p className="text-xs text-dark-muted">আমারবন্ধন ব্যবহারের নিয়ম ও সাধারণ প্রশ্নের উত্তর</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gold-400/30 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-dark font-bengali flex items-center">
              <HelpCircle className="w-4 h-4 mr-2 text-maroon-700 flex-shrink-0" />
              {f.q}
            </h3>
            <p className="text-xs text-dark-muted leading-relaxed pl-6">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
