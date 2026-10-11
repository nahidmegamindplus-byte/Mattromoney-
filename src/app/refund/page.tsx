import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-xs text-dark leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-dark">রিফান্ড নীতিমালা (Refund Policy)</h1>
      <p className="text-dark-muted">কার্যকর: ২০২৬</p>

      <div className="bg-white p-8 rounded-3xl border border-gold-400/30 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-maroon-800">১. রিফান্ড পাওয়ার ক্ষেত্রসমূহ</h3>
        <p>
          যদি প্রযুক্তিগত ত্রুটির কারণে গ্রাহকের হিসাব থেকে অতিরিক্ত টাকা কেটে নেওয়া হয় অথবা একই অর্ডারের বিপরীতে দুইবার পেমেন্ট গৃহীত হয়, তবে প্রয়োজনীয় প্রমাণ সাপেক্ষে ৭ কার্যদিবসের মধ্যে টাকা ফেরত দেওয়া হবে।
        </p>

        <h3 className="font-bold text-sm text-maroon-800">২. যেক্ষেত্রে রিফান্ড প্রযোজ্য নয়</h3>
        <p>
          প্রিমিয়াম মেম্বারশিপ সক্রিয় হওয়ার পর কোনো প্রার্থীর যোগাযোগ নম্বর দেখা বা সেবা আংশিক ব্যবহৃত হয়ে গেলে রিফান্ড প্রযোজ্য হবে না।
        </p>
      </div>
    </div>
  );
}
